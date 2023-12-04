import React, {useState} from 'react';
import {
    IoArrowDownCircleOutline,
    IoArrowUpCircleOutline,
  } from "react-icons/io5";
  import {
    Box,
    Flex,
    Icon,
    Spinner,
    Stack,
    Text,
    Input,
    Button
  } from "@chakra-ui/react";
  import { doc, updateDoc } from 'firebase/firestore';
import moment from "moment";
import { FaReddit } from "react-icons/fa";
import { firestore } from '../../../Firebase/firebaseConfig';
import { useSetRecoilState } from 'recoil';
import { poststate } from '../../AuthModalAtom/AuthmodalAtom';


const Comments = ({comment, onDeleteComments,loadingDelete,userId}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.commenttext);
  const setUpadtedComment = useSetRecoilState(poststate);

  const handleEdit = async () => {
    // Update the comment in the database
    const commentsDocRef = doc(firestore, 'comments', comment.id);
    await updateDoc(commentsDocRef, {
      commenttext: editedComment,
    });


    setUpadtedComment(prev =>({
        ...prev,
        selectedPost:{
          ...prev.selectedPost,
          comment: prev.selectedPost?.comment
        }
    }))

  
    // Exit edit mode after updating the comment
    setIsEditing(false);
  };
  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" spacing={2} fontSize="8pt">
          <Text
            fontWeight={700}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {comment.creatorDisplayText}
          </Text>
          {comment.createdAt?.seconds && (
            <Text color="gray.600">
              {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          )}
          {loadingDelete && <Spinner size="sm" />}
        </Stack>

        {isEditing ? (
          <Stack direction="row" align="center">
            <Input
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <Button size="md" width='80px' onClick={handleEdit} ml={2}>
              Save
            </Button>
          </Stack>
        ) : (
          <Text fontSize="10pt">{comment.commenttext}</Text>
        )}


        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.500"
        >
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === comment.creatorId && (
            <>
              <Text
                fontSize="9pt"
                _hover={{ color: 'blue.500' }}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteComments(comment)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  )
}

export default Comments