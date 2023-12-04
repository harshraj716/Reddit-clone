import { Icon, MenuItem, Flex, Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import CommunityModal from "../NavbarSection/NavbarLeft/CommunityModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";
import useCommunityId from "../../CustomHooks/useCommunityId";
import CommunityList from "./CommunityList";
import { BsReddit } from "react-icons/bs";

const CommunitySection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [user] = useAuthState(auth);
  const communityIds = useCommunityId(user?.uid);


  return (
    <>
      <CommunityModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
      />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontWeight={500} fontSize="12pt" color="gray.500">
          MODERATING
        </Text>

        {/* Render or process the community IDs here */}
        {communityIds
          .map((community) => (
            <CommunityList
              key={community.id}
              icon={BsReddit}
              displayName={`r/${community.id}`}
              iconColor="orange.600"
              link={`/r/${community.id}`}
              imageURL={community.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontWeight={500} fontSize="12pt" color="gray.500">
          My Community
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          fontWeight="500"
          _hover={{ bg: "gray.200" }}
          onClick={() => setOpenModal(true)}
        >
          <Flex align="center">
            <Icon as={GrAdd} fontSize={18} mr={2} />
            Create Community
          </Flex>
        </MenuItem>
        
      </Box>
    </>
  );
};

export default CommunitySection;
