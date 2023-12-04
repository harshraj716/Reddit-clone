import React, { useState } from 'react';
import { Button, Stack, Flex, Input, Alert, AlertIcon } from "@chakra-ui/react";

const LinkPost = ({ setSelectedTab, linkInputs, onChange }) => {
  const [isValidUrl, setIsValidUrl] = useState(true);

  const isValidURL = (url) => {
    const pattern = new RegExp('(http(s)?)://(www\\.)?[a-zA-Z0-9@:%._+~#=]+');
    return pattern.test(url);
  };

  const handleBackToPost = () => {
    if (!isValidURL(linkInputs.link)) {
      setIsValidUrl(false);
    } else {
      setIsValidUrl(true);
      setSelectedTab("Post");
    }
  };

  return (
    <Stack spacing={3} width="100%" pl={3} pr={3} mt={6} mb={5}>
      <Input
        name="link"
        value={linkInputs.link}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        height='80px'
        placeholder="URL"
        borderColor={isValidUrl ? "black" : "red"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />

      {!isValidUrl && (
        <Alert status='error'>
          <AlertIcon />
          Please enter a valid URL.
        </Alert>
      )}

      <Flex justify="flex-end">
        <Button onClick={handleBackToPost}>Back To Our Post</Button>
      </Flex>
    </Stack>
  );
};

export default LinkPost;
