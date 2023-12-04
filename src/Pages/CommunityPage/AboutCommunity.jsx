import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../Firebase/firebaseConfig";
import { useRef } from "react";
import useChangeImage from "../../CustomHooks/useChangeImage";
import { FaReddit } from "react-icons/fa";
import { useState } from "react";
import { getDownloadURL, getStorage, uploadString,ref } from "firebase/storage";
import { updateDoc ,doc} from "firebase/firestore";

const AboutCommunity = ({ comunityData, setCommunityStateValue }) => {
  const { communityId } = useParams();
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef();
  const { selectedFile, onChangeImage } = useChangeImage();
  const [uploadingImage, setUploadingImage] = useState(false);
  const handleuploadImage = async () => {
    setUploadingImage(true);
    
    if (!selectedFile) {
      console.log("No selected file");
      setUploadingImage(false);
      return;
    }
  
    try {
      const image = ref(getStorage(), `community/${comunityData.id}/image`);
      await uploadString(image, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(image);
  
      await updateDoc(doc(firestore, 'community', comunityData.id), {
        imageURL: downloadURL,
      });
  
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        },
      }));
  
    } catch (error) {
      console.log("Image uploading error", error);
    }
  
    setUploadingImage(false);
  };
  
  return (
    <Box position="sticky" top="15px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.700"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="12pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px ">
        <Stack>
          <Text fontSize="10pt" width="250px">
            For information that is technically true, but far from the expected
            answer.
          </Text>
          <Flex align="center">
            <Icon mr={3} as={BsFillCalendarDateFill} />
            {comunityData.createdAt && (
              <Text fontSize="11pt" color="gray.500">
                Created{" "}
                {moment(new Date(comunityData.createdAt.seconds * 1000)).format(
                  "MMMM DD YYYY"
                )}
              </Text>
            )}
          </Flex>

          <Divider />
          <Flex width="100%" p={2} fontSize="12pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{comunityData.numberofMember}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Link to={`/r/${communityId}/submit`}>
            <Button width="100%" mt={3} height="35px" bg="orange.500">
              Create Post
            </Button>
          </Link>

          {user?.uid === comunityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="11pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justifyContent="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {comunityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || comunityData.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="community_img"
                    />
                  ) : (
                    <Icon fontSize="29px" as={FaReddit} />
                  )}
                </Flex>
              </Stack>
              {selectedFile &&
                (uploadingImage ? (
                  <Spinner />
                ) : (
                  <Text cursor="pointer" onClick={handleuploadImage}>
                    Save Changes
                  </Text>
                ))}
              <input
                ref={selectedFileRef}
                type="file"
                hidden
                onChange={onChangeImage}
                accept="image/*, video/*, image/jpeg, image/gif, image/png"
              />
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default AboutCommunity;
