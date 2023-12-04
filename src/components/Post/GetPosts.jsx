// GetPosts.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth, firestore } from "../../Firebase/firebaseConfig";
import usePostsHook from "../../CustomHooks/usePostsHook";
import GetPostsData from "./GetPostsData";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack,Icon, Flex } from "@chakra-ui/react";
import PostLoader from "./PostLoader";
import {
  Paginator,
  Previous,
  PageGroup,
  Next,
} from "chakra-paginator";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const GetPosts = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    getVotes,
    deletePost,
    getSelectPost,
  } = usePostsHook();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const getPosts = async () => {
    try {
      setLoading(true);
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const getPostsResult = await getDocs(postQuery);
      const posts = getPostsResult.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        allPosts: posts,
      }));

      setCurrentPage((prev) =>
        Math.min(prev, Math.ceil(posts.length / postsPerPage))
      );
    } catch (error) {
      console.error("Error getting posts", error);
      setError("Error getting posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [communityData.id, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Ensure allPosts is an empty array if undefined
  const paginatedPosts =
    postStateValue.allPosts?.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    ) || [];

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {paginatedPosts.map((post) => (
            <GetPostsData
              key={post.id}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVote={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
              getVotes={getVotes}
              getSelectPost={getSelectPost}
              deletePost={deletePost}
            />
          ))}
        </Stack>
      )}
      <Flex justify='center' mt={4} align="center">
        <Paginator
          activeStyles={{
            bg: "blue.500",
            color: "white",
            borderRadius: "md",
            width: "2.5rem",
          }}
          normalStyles={{
            bg: "white",
            color: "gray.500",
            borderRadius: "md",
            margin: "0.25rem",
            width: "2.5rem",
          }}
          activePageStyles={{
            bg: "red.500",
            color: "white",
            borderRadius: "md",
          }}
          innerLimit={4}
          outerLimit={4}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pagesQuantity={Math.ceil(
            (postStateValue.allPosts?.length || 0) / postsPerPage
          )}
          containerStyles={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Previous mr={2}>
            <Icon  as={IoArrowBackOutline} boxSize={6} bg='none'/>
          </Previous>
          <PageGroup isInline align="center" justify="center" />
          <Next  ml={2}>
            <Icon as={IoArrowForwardOutline} boxSize={6} />
          </Next>
        </Paginator>
      </Flex>
    </>
  );
};

export default GetPosts;
