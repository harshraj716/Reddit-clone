import React from "react";
import redditlogo from "../../images/redditlogo.svg";
import redditText from "../../images/redditText.svg";
import {
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import NavbarRightContent from "./NavbarRight/NavbarRightContent";
import NavCommunity from "./NavbarLeft/NavCommunity";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Flex
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.300"
      height="70px"
      padding="6px 12px"
      justifyContent={{base:"space-between", md: "space-between" }}
    >
      <Link to="/">
        <Flex align="center" width={{ base: "50px", md: "auto" }}>
          <Image src={redditlogo} height="30px" margin="12px" marginMd="25px" />
          <Image
            src={redditText}
            height="45px"
            mt={1}
            display={{ base: "none", md: "unset" }}
            ml={-2}
          />
        </Flex>
      </Link>

      <NavCommunity />
      {/* {left_content_nav} */}
      <Flex flexGrow={1} mr={2} mt={3} align="center" display={{base:'none',md:"block"}} justify="center">
        <InputGroup justifyContent="center" width="90%">
          <InputLeftElement
            justifyContent="center"
            alignItems="center"
            align="center"
           
            pointerEvents="none"
          >
            <SearchIcon justifyContent="center" color="gray.400" mb={1} />
          </InputLeftElement>
          <Input
            placeholder="Search Reddit"
            fontSize="10pt"
            borderRadius="2xl"
            width="100%"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            height="35px"
            bg="gray.50"
          />
        </InputGroup>
      </Flex>

      {/* {right_content_nav} */}
      <NavbarRightContent />
    </Flex>
  );
};

export default Navbar;
