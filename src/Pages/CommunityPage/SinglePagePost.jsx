import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import usePostsHook from "../../CustomHooks/usePostsHook";
import GetPostsData from "../../components/Post/GetPostsData";
import {auth, firestore} from '../../Firebase/firebaseConfig'
import HomePageLayout from "../../components/MainLayout/HomePageLayout";
import PostComments from '../../components/Post/CommentsSection/PostComments';
import { Button } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";


const SinglePostPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, getVotes, deletePost,getSelectPost } = usePostsHook();

  const {postId} = useParams()
   const fetchSinglePost = async(postId) =>{
        try {
           const singlePostDocRef = doc(firestore, 'posts',postId);
           const postDoc = await getDoc(singlePostDocRef);
           setPostStateValue(prev => ({
              ...prev,
              selectedPost: {id: postDoc.id, ...postDoc.data()},
           }))
        } catch (error) {
           console.log("fetching single post error", error);
        }
   }

   useEffect(() =>{
        if(postId && !postStateValue.selectedPost){
              fetchSinglePost(postId);
        }
   },[postId, postStateValue.selectedPost]); 

  const goBackToHomePage = () => {
    navigate('/');
  };

  return (
   <HomePageLayout>
    <>
    <Button width='50%' mb={4} onClick={goBackToHomePage}>Go Back</Button>
     
    { postStateValue.selectedPost &&   <GetPostsData
          key={postStateValue.selectedPost}
          post={postStateValue.selectedPost}
          getVotes={getVotes}
          deletePost={deletePost}
          getSelectPost={getSelectPost} 
          userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          userVote={
            postStateValue.postVotes.find((vote) => vote.postId === postStateValue.selectedPost?.id)?.voteValue
          }
        />}
       <PostComments  selectedPost={postStateValue.selectedPost} User={user} />
    </>
    <>

{/* {   communityData && ( <AboutCommunity communityData={communityData}/>)} */}
    </>
   </HomePageLayout>
  );
};

export default SinglePostPage;
