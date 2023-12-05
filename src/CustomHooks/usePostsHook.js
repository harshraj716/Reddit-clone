import { useEffect } from "react";
import { deleteObject, ref } from "firebase/storage";
import {
  doc,
  writeBatch,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { appStorage, auth, firestore } from "../Firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  authModalState,
  poststate,
} from "../components/AuthModalAtom/AuthmodalAtom";

const usePostsHook = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [postStateValue, setPostStateValue] = useRecoilState(poststate);

  // Load user votes from local storage on component mount
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("userVotes"));
    if (storedVotes) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: storedVotes,
      }));
    }
  }, []);

  const saveVotesToLocalStorage = (votes) => {
    localStorage.setItem("userVotes", JSON.stringify(votes));
  };

  const getVotes = async (event, post, vote, communityId) => {
    event.stopPropagation();
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
    }
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes?.find(
        (vote) => vote.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostsVote = postStateValue.postVotes
        ? [...postStateValue.postVotes]
        : [];
      let voteChange = vote;

      // code for new vote
      if (!existingVote) {
        // creating a doc and store vote in firestore
        const postVoteRef = doc(
          firestore,
          `users/${user?.uid}/postVote`,
          post.id
        );

        // Check if the document exists before trying to update
        const postVoteDoc = await getDoc(postVoteRef);
        if (postVoteDoc.exists()) {
          // Document exists, update the vote value
          batch.update(postVoteRef, { voteValue: vote });
        } else {
          // Document doesn't exist, create a new document
          batch.set(postVoteRef, {
            postId: post.id,
            communityId,
            voteValue: vote,
          });
        }

        // adding or subtracting by 1 to post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostsVote = [
          ...updatedPostsVote,
          { postId: post.id, voteValue: vote },
        ];
      }
      // existingVote
      else {
        const postVoteRef = doc(
          firestore,
          `users/${user?.uid}/postVote`,
          existingVote.postId
        );

        // User Removing the vote (up or down)
        if (existingVote.voteValue === vote) {
          // adding or subtracting by 1 to post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostsVote = updatedPostsVote.filter(
            (vote) => vote.postId !== existingVote.postId
          );

          // Check if the document exists before trying to delete
          const postVoteDoc = await getDoc(postVoteRef);
          if (postVoteDoc.exists()) {
            // Document exists, delete the document
            batch.delete(postVoteRef);
          }

          voteChange *= -1;
        }

        // changing the vote (up or down)
        else {
          // adding or subtracting by 2 to post.voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndex = updatedPostsVote.findIndex(
            (vote) => vote.postId === existingVote.postId
          );

          updatedPostsVote[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };

          // update vote
          batch.update(postVoteRef, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }
      }

      // update our posts doc database
      const postsdata = doc(firestore, "posts", post.id);
      batch.update(postsdata, { voteStatus: voteStatus + voteChange });

      await batch.commit();

      // update state with current value for ui
      const postIndex = updatedPosts.findIndex((item) => item.id === post.id);
      updatedPosts[postIndex] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostsVote,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      // Save updated votes to local storage
      saveVotesToLocalStorage(updatedPostsVote);
    } catch (error) {
      console.error(error);
    }
  };
  const getSelectPost = (post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    navigate(`/r/${post.communityId}/comments/${post.id}`);
  };

 

  const deletePost = async (post) => {
    try {
      // Check if the post has an image and delete it
      if (post.imageURL) {
        const imageRef = ref(appStorage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // Delete the post in Firestore
      const postDeleteRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDeleteRef);

      // Update the state to remove the deleted post
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== post.id),
      }));

      // Remove the deleted post from local storage
      const updatedVotes = postStateValue.postVotes.filter(
        (vote) => vote.postId !== post.id
      );
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: updatedVotes,
      }));

      // Save updated votes to local storage
      saveVotesToLocalStorage(updatedVotes);

      console.log(postStateValue);

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  };

  return {
    postStateValue,
    setPostStateValue,
    getVotes,
    deletePost,
    getSelectPost,
  };
};

export default usePostsHook;
