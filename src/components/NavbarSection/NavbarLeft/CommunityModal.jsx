import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  Divider,
  Text,
  Stack,
  Checkbox,
  Flex,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa6";
import { BsFillEyeFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import showToast from "../../../CharkaUI/toastUtils";
import { firestore } from "../../../Firebase/firebaseConfig";
import { getDoc, doc, serverTimestamp, runTransaction } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../../Firebase/firebaseConfig';
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { commentsState } from "../../AuthModalAtom/AuthmodalAtom";

const CommunityModal = ({ openModal, handleClose }) => {
  const setSnippetState= useSetRecoilState(commentsState);
  const toast = useToast();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [CommunityName, setCommunityName] = useState("");
  const [CharacterRemain, setCharacterRemain] = useState(21);
  const [Communitychecktype, setCommunityCheckType] = useState("public");
   const navigate = useNavigate();
  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length > 21) return;

    setCommunityName(inputValue);
    setCharacterRemain(21 - inputValue.length);
  };

  const onCommunityTypeChange = (event) => {
    setCommunityCheckType(event.target.name);
  };

  const handleCommunityContent = async () => {
    const validate = /^[a-zA-Z0-9_]+$/;

    try {
      if (!validate.test(CommunityName) || CommunityName.length < 3) {
        throw new Error(
          "Community name must be at least 3 characters and only contain letters, numbers, and underscores."
        );
      }

      setLoading(true);

      const communityDocumentsRef = doc(firestore, "community", CommunityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDocuments = await getDoc(communityDocumentsRef);
        if (communityDocuments.exists()) {
          throw new Error("Sorry, the name is already taken!");
        }

        transaction.set(communityDocumentsRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberofMember: 1,
          privacyType: Communitychecktype,
          Image: user?.photoURL
        });

        transaction.set(doc(firestore, `users/${user?.uid}/communityDoc`, CommunityName), {
          communityId: CommunityName,
          isModerator: true,
        });
      });

      showToast(toast, "Community created successfully!", "success");
      setSnippetState((prev) => ({
        ...prev,
        commentsState: [],
      }));
      handleClose();
      navigate(`r/${CommunityName}`)

    } catch (error) {
      showToast(toast, error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={openModal} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent mt='10rem'>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize="1rem"
            padding={4}
          >
            Create a Community
          </ModalHeader>

          <Box pl={4} pr={4}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="12px 1px">
              <Text fontSize={16} fontWeight={600}>
                Name
              </Text>
              <Text fontSize={12} color="gray.500">
                Community names, including capitalization, cannot be changed.
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.500"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={CommunityName}
                size="sm"
                pl="25px"
                onChange={handleChange}
              ></Input>
              <Text
                color={CharacterRemain === 0 ? "red.400" : "gray.400"}
                fontSize="10pt"
              >
                {CharacterRemain} Characters remaining
              </Text>

              <Box mb={4} mt={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>

                <Stack spacing={2} mt={2} onClick={onCommunityTypeChange}>
                  <Checkbox
                    name="public"
                    isChecked={Communitychecktype === "public"}
                    onChange={() =>
                      onCommunityTypeChange({ target: { name: "public" } })
                    }
                  >
                    <Flex align="center">
                      <Icon as={FaUsers} mr={2} color="gray.500" />
                      <Text fontSize="11pt" mr={2} fontWeight={600}>
                        Public
                      </Text>
                      <Text pt={1} fontSize="8pt" mb="2px" color="gray.400">
                        Anyone can view, post, and comment on this community.
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={Communitychecktype === "restricted"}
                    onChange={() =>
                      onCommunityTypeChange({ target: { name: "restricted" } })
                    }
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} mr={2} color="gray.500" />
                      <Text fontSize="11pt" mr={2} fontWeight={600}>
                        Restricted
                      </Text>
                      <Text pt={1} fontSize="8pt" mb="2px" color="gray.400">
                        Anyone can view this community, but only approved users
                        can post.
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={Communitychecktype === "private"}
                    onChange={() =>
                      onCommunityTypeChange({ target: { name: "private" } })
                    }
                  >
                    {" "}
                    <Flex align="center">
                      <Icon as={HiLockClosed} mr={2} color="gray.500" />
                      <Text fontSize="11pt" mr={2} fontWeight={600}>
                        Private
                      </Text>
                      <Text pt={1} fontSize="8pt" mb="2px" color="gray.400">
                        Only approved users can view and submit to this
                        community.
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.200" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              width="100px"
              height="35px"
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              colorScheme="blue"
              height="35px"
              onClick={handleCommunityContent}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommunityModal;
