import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "../Firebase/firebaseConfig";

const useCommunityData = (userId) => {
  const [communityData, setCommunityData] = useState([]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const communityCollectionRef = collection(firestore, "community");
        const communitySnapshot = await getDocs(communityCollectionRef);

        const data = [];
        for (const communityDoc of communitySnapshot.docs) {
          const { imageURL } = communityDoc.data();

          // Check if the user is a moderator
          let isModerator = false;
          if (userId) {
            const userCommunityDocRef = doc(
              firestore,
              `community/${communityDoc.id}/moderators`,
              userId
            );
            const userCommunityDocSnap = await getDoc(userCommunityDocRef);
            isModerator = userCommunityDocSnap.exists;
          }

          data.push({ id: communityDoc.id, imageURL, isModerator });
        }

        setCommunityData(data);
      } catch (error) {
        console.error("Error fetching community data", error);
        setCommunityData([]);
      }
    };

    fetchCommunityData();
  }, [userId]);

  return communityData;
};

export default useCommunityData;
