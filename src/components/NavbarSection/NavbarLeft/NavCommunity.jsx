import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  Icon,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import CommunitySection from "../../CommunitySection/CommunitySection";

const NavCommunity = () => {

  return (
    <Menu >
      <MenuButton
     
        cursor="pointer"
        padding="0px 4px"
        height='40px'
        mt={2}
        borderRadius={4}
        _hover={{
          outline: "1px solid ",
          outlineColor: "gray.300",
        }}
        ml={{ base: 0, md: 2 }}
      >
        <Flex align="center" justify="space-between" width={{base: "auto" , lg: '200px'}}>
          <Flex align="center">
            <Icon fontSize={22} mr={{ base: 1, md: 2 }} ml={1} as={FaHome} />
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon mr={1} />
        </Flex>
      </MenuButton>
      <MenuList>
        <CommunitySection/>
      </MenuList>
    </Menu>
  );
};

export default NavCommunity;
