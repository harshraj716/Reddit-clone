import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../Firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState, communityState } from "../components/AuthModalAtom/AuthmodalAtom";

const useCommunityHook = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState =useSetRecoilState(authModalState)
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const joinOrLeaveCommunity = (communityData, isJoined) => {
    // if(!user){
    //  setAuthModalState({open: true,view: 'login'});
    //  return;
    // }

    setLoading(true);

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippet = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communityDoc`)
      );

      const snippets = snippetDocs.docs.map((doc) =>  ({...doc.data()}))
      console.log('here snippets',snippets)

      setCommunityStateValue(prev =>({
        ...prev,
        mySnippets: snippets,
      }));
    } catch (err) {
      console.error(err);
      setError("Error fetching community data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMySnippet();
  }, [user]);

  const joinCommunity = async (communityData) => {
    try {
      setLoading(true);

      // Check if communityData is defined and has the expected structure
      if (!communityData || typeof communityData.id === "undefined") {
        throw new Error("Invalid communityData");
      }

      const batch = writeBatch(firestore);

      const newSnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId,
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/communityDoc`, communityData.id),
        newSnippet
      );

      // update database state from snippet
      batch.update(doc(firestore, "community", communityData.id), {
        numberofMember: increment(1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    
    } catch (error) {
      console.error("error joining to community", error);
      setError("Error joining to community");
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      setLoading(true);
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communityDoc`, communityId)
      );

      // update database state from snippet
      batch.update(doc(firestore, "community", communityId), {
        numberofMember: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
   
    } catch (error) {
      console.error(error);
      setError("Failed to leave community");
    } finally {
      setLoading(false);
    }
  };

  return {
    communityStateValue,
    setCommunityStateValue,
    joinOrLeaveCommunity,
    loading,
    error,
  };
};

export default useCommunityHook;
