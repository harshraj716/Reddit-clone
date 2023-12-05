import React from "react";
import { Flex, Box, Image, Text, Button,Icon } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import useCommunityHook from "../../CustomHooks/useCommunityHook";


const CommunityHeader = ({ communityData }) => {


  const { communityStateValue, joinOrLeaveCommunity, loading } = useCommunityHook();
  const isJoin = communityStateValue.mySnippets.find((item) => item.communityId === communityData.id);
  
  return (
    <Flex direction="column" width="100%" height="150px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="90%" maxW="900px">
         { communityStateValue.currentCommunity?.imageURL ? (<Image
            src={communityStateValue.currentCommunity?.imageURL}
            height="80px"
            borderRadius="50%"
            border="5px solid white"
            position="relative"
            top={-3}
          />):(
            <Icon
             as={FaReddit}
             fontSize={64}
             position="relative"
             top={-3}
             color='blue.500'
             border='4px solid white'
             borderRadius='full'

            />
          )
}
          <Flex padding="10px 14px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="15pt">
                {communityData.id}
              </Text>
              <Text fontWeight={500} fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoin ? "outline" : "solid"}
              height="40px"
              pr={7}
              pl={7}
              onClick={() =>joinOrLeaveCommunity(communityData,isJoin)}
              isLoading={loading}
            >
              {isJoin ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CommunityHeader;
