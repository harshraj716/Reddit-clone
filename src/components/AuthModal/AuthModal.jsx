import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  Center,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Image,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import login_img from "../../images/login_image.png";
import { useRecoilState } from "recoil";
import { authModalState } from "../AuthModalAtom/AuthmodalAtom";
import GoggleAuthModel from "./GoggleAuthModel";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebaseConfig";

const AuthModal = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if(user)
    handleClose();
  }, [user]);
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent mt="5rem">
          <Center mt={4}>
            <Image src={login_img} width="40%" />
          </Center>
          <ModalHeader textAlign="center">Login With Google</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={8}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              <GoggleAuthModel />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
