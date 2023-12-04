import React, { useState, useEffect } from "react";
import HomePageLayout from "./HomePageLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../Firebase/firebaseConfig";
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore";
import usePostsHook from "../../CustomHooks/usePostsHook";
import PostLoader from "../Post/PostLoader";
import { Stack,Icon,Flex } from "@chakra-ui/react";
import GetPostsData from "../Post/GetPostsData";
import CreatePostLink from "../../Pages/CommunityPage/CreatePostLink";
import TopCommunity from "./TopCommunity";
import { Paginator, Previous, PageGroup, Next } from "chakra-paginator";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
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
      const postget = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(postsPerPage)
      );

      const postDocuments = await getDocs(postget);
      const posts = postDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts,
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
            <Flex justify='center' mt={4}>
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
                marginTop: "1rem",
              }}
            >
              <Previous mr={2} mt={1}>
                <Icon as={IoArrowBackOutline} boxSize={6} bg="none" />
              </Previous>
              <PageGroup isInline align="center" justify="center" />
              <Next  mt={1} ml={2}>
                <Icon as={IoArrowForwardOutline} boxSize={6} />
              </Next>
            </Paginator>
            </Flex>
          </>
        )}
      </>
      <>
        <TopCommunity />
        <HomeCreatePostButton/>
      </>
    </HomePageLayout>
  );
};

export default HomePage;
