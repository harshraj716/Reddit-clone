import React from "react";
import { Flex } from "@chakra-ui/react";

const HomePageLayout = ({ children }) => {
  return (
    <Flex
      justify="center"
      padding="16px 0px"
    >
      <Flex width="90%" maxW="1000px" justify="center">
        {/* Left Side Page Content */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children[0]}
        </Flex>
        {/* Right Side Page Content */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          mr={{ base: 0, md: 6 }}
          flexGrow={1}
        >
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HomePageLayout;
