import React, { useState, useEffect } from "react";
import HomePageLayout from "./HomePageLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../Firebase/firebaseConfig";
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore";
import usePostsHook from "../../CustomHooks/usePostsHook";
import PostLoader from "../Post/PostLoader";
import { Stack, Icon, Flex,Button } from "@chakra-ui/react"; // You can remove Chakra UI imports if not needed
import GetPostsData from "../Post/GetPostsData";
import CreatePostLink from "../../Pages/CommunityPage/CreatePostLink";
import TopCommunity from "./TopCommunity";
import HomeCreatePostButton from "./HomeCreatePostButton";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [user, loadingUser] = useAuthState(auth);

  const {
    postStateValue,
    setPostStateValue,
    getVotes,
    deletePost,
    getSelectPost,
  } = usePostsHook();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const UserHomeFeed = async () => {
    setLoading(true);
    try {
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
  
      const postget = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(endIndex)
      );
  
      const postDocuments = await getDocs(postget);
      const allPosts = postDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const paginatedPosts = allPosts.slice(startIndex, endIndex);
  
      setPostStateValue((prev) => ({
        ...prev,
        allPosts: allPosts,
        posts: paginatedPosts,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    UserHomeFeed();
  }, [user, loadingUser, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(
      (postStateValue.allPosts?.length || 0) / postsPerPage
    );
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            margin: "0.25rem",
            padding: "0.5rem",
            width: '40px',
            backgroundColor: currentPage === i ? "blue" : "white",
            color: currentPage === i ? "white" : "gray",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <HomePageLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <>
            <Stack>
              {postStateValue.posts &&
                postStateValue.posts.map((post) => (
                  <GetPostsData
                    key={post.id}
                    post={post}
                    getVotes={getVotes}
                    deletePost={deletePost}
                    getSelectPost={getSelectPost}
                    userIsCreator={user?.uid === post.creatorId}
                    userVote={
                      postStateValue.postVotes.find(
                        (vote) => vote.postId === post.id
                      )?.voteValue
                    }
                  />
                ))}
            </Stack>
            <Flex justify="center" mt={5}>
              <Button mt={1} mr={1} onClick={() => handlePageChange(currentPage - 1)}>&lt;</Button>
              {renderPageNumbers()}
              <Button mt={1} ml={1} onClick={() => handlePageChange(currentPage + 1)}>&gt;</Button>
            </Flex>
          </>
        )}
      </>
      <>
        <TopCommunity />
        <HomeCreatePostButton />
      </>
    </HomePageLayout>
  );
};

export default HomePage;
