import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { PiShareFatBold } from "react-icons/pi";
import { IoBookmarkOutline } from "react-icons/io5";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from "react-icons/io5";
import {
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Skeleton,
  useToast,
  Spinner,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { IoChatboxOutline } from "react-icons/io5";
import showToast from "../../CharkaUI/toastUtils";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const GetPostsData = ({
  post,
  userIsCreator,
  getSelectPost,
  userVote,
  getVotes,
  deletePost,
}) => {
  // Function to format the timestamp to a human-readable string
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadingdeletepost, setLoadingDeletePost] = useState(false);
  const toast = useToast();
  const SinglePostPage = !getSelectPost;
  const navigate = useNavigate();

  const formatTimestamp = (timestamp) => {
    const distance = formatDistanceToNow(timestamp.toDate(), {
      addSuffix: true,
    });
    return distance.replace("about ", "");
  };

  const handledelete = async (event) => {
    try {
      event.stopPropagation();
      setLoadingDeletePost(true);

      const successdelete = await deletePost(post);
      if (!successdelete) {
        throw new showToast(toast, "Could not delete");
      }

      showToast(toast, "Post deleted successfully");
    } catch (error) {
      setError(error.message);
    }
    setLoadingDeletePost(false);
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={SinglePostPage ? "white" : "gray.300"}
      borderRadius={SinglePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: SinglePostPage ? "none" : "gray.500" }}
      cursor={SinglePostPage ? "unset" : "pointer"}
      onClick={() => getSelectPost(post)}
     
    >
      <Flex
        direction="column"
        align="center"
        p={3}
        width="44px"
        borderRadius={4}
        bg="gray.100"
      >
        {/* Upvote and Downvote icons */}
        <Icon
          as={userVote === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={userVote === 1 ? "orange.600" : "gray.400"}
          fontSize="16pt"
          onClick={(event) => getVotes(event, post, 1, post.communityId)}
          cursor="pointer"
        />
        <Text fontSize="10pt">{post.voteStatus}</Text>
        <Icon
          as={
            userVote === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline
          }
          color={userVote === -1 ? "blue.400" : "gray.400"}
          fontSize="16pt"
          onClick={(event) => getVotes(event, post, -1, post.communityId)}
          cursor="pointer"
        />
      </Flex>

      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error" mt={4} mb={2}>
            <AlertIcon />
            <AlertTitle>Error Deleting Post!</AlertTitle>
          </Alert>
        )}
        <Stack  p="10px" spacing={2}>
          {/* Post information */}
          {post.userDisplayText && (
            <Stack direction="row" spacing={1} align="center">
              <Text fontWeight={600} fontSize="10pt">
                r/{post.userDisplayText}
              </Text>

              <ChakraLink
              direction={{base:'column', md:'row'}} 
                as="a"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigate(`/r/${post.communityId}`);
                }}
              >
                <Text fontSize="9pt">Posted by u/{post.communityId}</Text>
              </ChakraLink>

              <Text color="gray.400" fontSize="9pt">
                {formatTimestamp(post.createdAt)}
              </Text>
            </Stack>
          )}
          <Text color="gray.800" fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text color="gray.800" fontSize="10pt">
            {post.body}
          </Text>

          {/* Display link */}
          {post.link && (
            <Link
              href={post.link}
              color="blue.500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.link}
            </Link>
          )}

          {/* Display post image */}
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {imageLoading && (
                <Skeleton
                  height="220px"
                  width="100%"
                  borderRadius={4}
                ></Skeleton>
              )}
              <Image
                src={post.imageURL}
                maxHeight="480px"
                alt="PostImage"
                display={imageLoading ? "none" : "unset"}
                onLoad={() => setImageLoading(false)}
              />
            </Flex>
          )}
        </Stack>
        {/* Post actions */}

        <Flex color="gray.500" ml={2} mb={1} fontWeight={600}>
          {/* Comment icon */}
          <Link to={`/r/${post.communityId}/comments/${post.id}`}>
            <Flex
              align="center"
              p="10px 12px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer "
            
            >
              
              <Icon  as={IoChatboxOutline} mr={2} fontSize={24} />
              <Text fontSize="10pt" mr={1}>
                {post.numberOfComments}
                
              </Text>
              <Text   display={{ base: "none", md: "flex" }} fontSize="10pt"> Comments </Text>
             
            </Flex>
          </Link>
          {/* Share icon */}
          <Flex
            align="center"
            p="10px 12px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer "
          >
            <Icon as={PiShareFatBold} mr={2} fontSize={24} />
            <Text   display={{ base: "none", md: "flex" }} fontSize="10pt"> Share </Text>
          </Flex>
          {/* Save icon */}
          <Flex
            align="center"
            p="10px 12px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer "
          >
            <Icon as={IoBookmarkOutline} mr={2} fontSize={24} />
            <Text   display={{ base: "none", md: "flex" }} fontSize="10pt"> Save </Text>
          </Flex>
          {/* Delete icon (visible only to post creator) */}
          {userIsCreator && (
            <Flex
              align="center"
              p="10px 12px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer "
              onClick={handledelete}
            >
              {loadingdeletepost ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                />
              ) : (
                <>
                  <Icon as={MdOutlineDelete} mr={2} fontSize={24} />
                  <Text   display={{ base: "none", md: "flex" }} fontSize="10pt"> Delete </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GetPostsData;
