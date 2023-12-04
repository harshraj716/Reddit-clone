import { MenuItem, Flex, Image, Icon } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CommunityList = ({ displayName, icon, iconColor, imageURL, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={handleClick}
    >
      <Flex align='center'>
        {imageURL ? (
          <Image src={imageURL} borderRadius='full' boxSize='18px' mr={2}/>
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor}/>
        )}
        {displayName}
        
      </Flex>
    </MenuItem>
  );
};

export default CommunityList;
