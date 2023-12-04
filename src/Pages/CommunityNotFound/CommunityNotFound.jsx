// CommunityNotFound.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Center,
  Heading,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import sorryImage from '../../images/404Notfound.jpg'

const CommunityNotFound = () => {
  return (
    <Center height="100vh">
      <Box textAlign="center">
        <Heading fontSize="2xl" mb="4">
          Oops! Community not found.
        </Heading>
        <Image src={sorryImage} height='400px'  alt="Sorry" mb="4" ml={8} borderRadius="md" />
        <Text mb="4">
          We're sorry, but the community you're looking for doesn't exist.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          colorScheme="blue"
          size="md"
          fontWeight="normal"
        >
          Go to Home
        </Button>
      </Box>
    </Center>
  );
};

export default CommunityNotFound;
