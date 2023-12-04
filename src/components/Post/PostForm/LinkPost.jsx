// LinkPost.jsx
import React from 'react';
import { Button, Stack,Flex, Input } from "@chakra-ui/react";
const LinkPost = ({setSelectedTab,linkInputs,onChange }) => {
 

  
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
          _placeholder={{ color: "gray.500"  }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "black",
          }}
        />

        
        <Flex justify="flex-end">
        <Button onClick={() => setSelectedTab("Post")}>Back To Our Post</Button>
        </Flex>
      </Stack>
    );
  };
  
  export default LinkPost;