import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../Firebase/firebaseConfig'
import {Button,Text,Textarea,Flex} from '@chakra-ui/react'
import GoogleAuthModel from '../../AuthModal/GoggleAuthModel'


const CommentsInput = ({commentsText,setCommentsText,createLoading,onCreateComments}) => {

    const [user] = useAuthState(auth);
    
  return (
    <Flex direction="column" position="relative">
    {user ? (
      <>
        <Text mb={1}>
          Comment as{" "}
          <span style={{ color: "#3182CE" }}>
            {user?.email?.split("@")[0]}
          </span>
        </Text>
        <Textarea
          value={commentsText}
          onChange={(event) => setCommentsText(event.target.value)}
          placeholder="What are your thoughts?"
          fontSize="10pt"
          borderRadius={4}
          minHeight="160px"
          pb={10}
          _placeholder={{ color: "gray.500" }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid black",
          }}
        />
        <Flex
          position="absolute"
          left="1px"
          right={0.1}
          bottom="1px"
          justify="flex-end"
          bg="gray.100"
          p="6px 8px"
          borderRadius="0px 0px 4px 4px"
        >
          <Button
            height="30px"
            disabled={!commentsText.length}
            isLoading={createLoading}
            onClick={() => onCreateComments(commentsText)}
          >
            Comment
          </Button>
        </Flex>
      </>
    ) : (
      <Flex
        align="center"
        justify="space-between"
        borderRadius={2}
        border="1px solid"
        borderColor="gray.100"
        p={4}
      >
        <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
        <GoogleAuthModel/>
      </Flex>
    )}
  </Flex>
  )
}

export default CommentsInput