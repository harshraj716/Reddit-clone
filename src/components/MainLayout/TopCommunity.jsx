import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaReddit } from "react-icons/fa";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { firestore } from "../../Firebase/firebaseConfig";
import { orderBy } from "lodash";
import recCommsArt from "../../images/recCommsArt.png";

const TopCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllCommunities, setShowAllCommunities] = useState(false);

  const getHomeCommunity = async () => {
    setLoading(true);
    try {
      // Query to get top 5 communities ordered by number of members
      const communityQuery = query(
        collection(firestore, "community"),
        orderBy("numberofMembers", "desc"),
        limit(10)
      );
      // Fetch communities from Firestore
      const communitySnapshot = await getDocs(communityQuery);
      // Map community data and set it in state
      const communities = communitySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch communities when the component mounts
  useEffect(() => {
    getHomeCommunity();
  }, []);

  return (
    <>
  
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
    >
      {/* Header with gradient background and text */}
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
          url(${recCommsArt})"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          // Skeleton loading UI when data is still loading
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          // Render communities when data is loaded
          <>
              {showAllCommunities
              ? communities.map((item, index) => (
                  <Link key={item.id} to={`/r/${item.id}`}>
                    <Flex
                      position="relative"
                      align="center"
                      fontSize="10pt"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      p="10px 12px"
                      fontWeight={600}
                    >
                      <Flex width="80%" align="center">
                        <Flex width="15%">
                          <Text mr={2}>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="80%">
                          {item.imageURL ? (
                            <Image
                              borderRadius="full"
                              boxSize="28px"
                              src={item.imageURL}
                              mr={2}
                            />
                          ) : (
                            <Icon
                              as={FaReddit}
                              fontSize={30}
                              color="brand.100"
                              mr={2}
                            />
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >{`r/${item.id}`}</span>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Link>
                ))
              : // Show a limited number of communities
                communities.slice(0, 3).map((item, index) => (
                  <Link key={item.id} to={`/r/${item.id}`}>
                    <Flex
                      position="relative"
                      align="center"
                      fontSize="10pt"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      p="10px 12px"
                      fontWeight={600}
                    >
                      <Flex width="80%" align="center">
                        <Flex width="15%">
                          <Text mr={2}>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="80%">
                          {item.imageURL ? (
                            <Image
                              borderRadius="full"
                              boxSize="28px"
                              src={item.imageURL}
                              mr={2}
                            />
                          ) : (
                            <Icon
                              as={FaReddit}
                              fontSize={30}
                              color="brand.100"
                              mr={2}
                            />
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >{`r/${item.id}`}</span>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Link>
                ))
            }
            {/* View All button */}
            <Box p="10px 20px">
              <Button
                height="30px"
                width="100%"
                onClick={() => setShowAllCommunities(!showAllCommunities)}
              >
                {showAllCommunities ? "Show Less" : "View All"}
              </Button>
            </Box>
            <Image src={recCommsArt} width='350px'></Image>
          </>
        )}
      </Flex>
    </Flex>
    </>
  );
};

export default TopCommunity;
