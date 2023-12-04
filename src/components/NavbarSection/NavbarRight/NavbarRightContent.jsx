import React from "react";
import AuthModal from "../../AuthModal/AuthModal";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../AuthModalAtom/AuthmodalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../Firebase/firebaseConfig";
import { Flex, Button } from "@chakra-ui/react";
import RightIcons from "./RightIcons";
import NavUserMenu from "./NavUserMenu";

const NavbarRightContent = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user, isLoading, error] = useAuthState(auth);

  return (
    <Flex justify="center" align="center">
      <AuthModal />
      {user ? (
        <RightIcons />
      ) : (
        <Button
          height="40px"
          display={{ sm: "flex" }}
          width={{ base: "70px", md: "100px" }}
          mr={2}
          onClick={() => setAuthModalState({ open: true, view: "login" })}
        >
          Log In
        </Button>
      )}
      <NavUserMenu user={user} />
    </Flex>
  );
};

export default NavbarRightContent;
