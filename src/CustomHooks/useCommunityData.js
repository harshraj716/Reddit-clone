// useCommunityData.js
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../Firebase/firebaseConfig";
import safeJsonStringify from "safe-json-stringify";

const useCommunityData = (communityId) => {
  const [communityData, setCommunityData] = useState(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // Ensure that communityId is defined before creating the document reference
        if (communityId) {
          const communityDocRef = doc(firestore, "community", communityId);
          const communityDoc = await getDoc(communityDocRef);

          if (communityDoc.exists()) {
            const parsedCommunityData = JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              })
            );
            setCommunityData(parsedCommunityData);
           
          } else {
            console.error("Community document does not exist for ID:", communityId);
            setCommunityData(null);
          }
        }
      } catch (error) {
        console.error("Error fetching community data", error);
        setCommunityData(null);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  return {communityData,setCommunityData};
};

export default useCommunityData;


