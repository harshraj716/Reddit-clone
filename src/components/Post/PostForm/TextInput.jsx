import { Button, Stack, Textarea, Flex, Input } from "@chakra-ui/react";
import React from "react";

const TextInput = ({ textInputs, onChange, handleCreatePost, loading }) => {
  return (
    <Stack spacing={3} width="100%" pl={3} pr={3} mt={6} mb={5}>
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Textarea
        onChange={onChange}
        value={textInputs.body}
        name="body"
        fontSize="10pt"
        height="100px"
        borderRadius={4}
        placeholder="Text (Optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex justify="flex-end">
        <Button
          height="40px"
          padding="0px 30px"
          onClick={handleCreatePost}
          disabled={!textInputs.title}
          isLoading={loading}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInput;
