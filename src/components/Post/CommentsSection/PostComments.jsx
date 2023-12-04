import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../Firebase/firebaseConfig";
import {
  Box,
  Flex,
  Stack,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import CommentsInput from "./CommentsInput";
import Comments from "../CommentsSection/Comments";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { poststate } from "../../AuthModalAtom/AuthmodalAtom";

const PostComments = ({ User, selectedPost }) => {
  const [user] = useAuthState(auth);
  const { communityId } = useParams();
  const [commentsText, setCommentsText] = useState("");
  const [comment, setComment] = useState([]);
  const [fetchLoadings, SetfetchLoadings] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState("");
  const setPostStateValue = useSetRecoilState(poststate);

  const onCreateComments = async (commentText) => {
    try {
      setCreateLoading(true);
      const batch = writeBatch(firestore);

      const commentsDocRef = doc(collection(firestore, "comments"));
      const newComment = {
        id: commentsDocRef.id,
        creatorId: user?.uid,
        creatorDisplayText: user.email?.split("@")[0],
        communityId,
        postId: selectedPost?.id,
        postTitle: selectedPost?.title,
        commenttext: commentText,
        createdAt: serverTimestamp(),
      };

      batch.set(commentsDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 };

      //update the post documnets +1
      const postDocRef = doc(firestore, "posts", selectedPost?.id);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // Update the local state to include the new comment
      setCommentsText("");
      setComment((prevComments) => [newComment, ...prevComments]);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments + 1,
        },
      }));

      getPostComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const onDeleteComments = async (comment) => {
    setLoadingDelete(comment.id);
    try {
      const batch = writeBatch(firestore);

      //delete comments
      const commentsDocDelete = doc(firestore, "comments", comment.id);
      batch.delete(commentsDocDelete);

      //update comments
      const postDocRef = doc(firestore, "posts", selectedPost?.id);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments - 1,
        },
      }));

      setComment((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("error delete comment:", error);
    } finally {
      setLoadingDelete("");
    }
  };

  const getPostComments = async () => {
    try {
      setCreateLoading(true);
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComment(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setCreateLoading(false);
  };

  useEffect(() => {
    if (selectedPost) {
      getPostComments();
    }
  }, [selectedPost]);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={2}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoadings && (
          <CommentsInput
            commentsText={commentsText}
            setCommentsText={setCommentsText}
            createLoading={createLoading}
            onCreateComments={onCreateComments}
            user={user}
          />
        )}
      </Flex>
      <Stack spacing={6}>
        {fetchLoadings ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comment.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comment &&
                  comment.map((commentItem) => {
                    return (
                      <Comments
                        key={commentItem.id}
                        comment={commentItem}
                        onDeleteComments={onDeleteComments}
                        loadingDelete={loadingDelete === comment.id}
                        userId={User.uid}
                      />
                    );
                  })}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default PostComments;
