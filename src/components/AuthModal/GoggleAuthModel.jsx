import React, { useEffect } from "react";
import { Flex, Image, Button, Text, useToast } from "@chakra-ui/react";
import googleImg from "../../images/google.png";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../Firebase/firebaseConfig";
import showToast from "../../CharkaUI/toastUtils";
import { setDoc, doc } from "firebase/firestore";
import useCommunityHook from "../../CustomHooks/useCommunityHook";

const GoogleAuthModel = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);
  const toast = useToast();
  const { joinOrLeaveCommunity } = useCommunityHook();

  const createUser = async (user) => {
    if (user && user.uid) {
      const { uid } = user;
      console.log(uid);
      const userDocRef = doc(firestore, "users", uid);
      await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
    }
  };

  useEffect(() => {
    if (userCred) {
      createUser(userCred.user);
    }
  }, [userCred]);

  const [authUser] = useAuthState(auth);

  useEffect(() => {
    if (authUser) {
      joinOrLeaveCommunity(null, false);
    }
  }, [authUser, joinOrLeaveCommunity]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast(toast, "Logged in with Google successfully", "", "success");
    } catch (error) {
      showToast(toast, "Error logging in with Google", error.message, "error");
    }
  };

  return (
    <Flex direction="column">
      <Button
        width="sm"
        mb={3}
        variant="googleauth"
        fontSize="1rem"
        isLoading={loading}
        onClick={handleGoogleSignIn}
      >
        <Image src={googleImg} alt="googleauth" height="20px" mr={4} />
        Continue With Google
      </Button>

      <Button width="sm" variant="googleauth" fontSize="1rem">
        Some Other Provider
      </Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};

export default GoogleAuthModel;
