// CommunityId.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommunityNotFound from "../CommunityNotFound/CommunityNotFound";
import CommunityHeader from "./CommunityHeader";
import HomePageLayout from "../../components/MainLayout/HomePageLayout";
import CreatePostLink from "./CreatePostLink";
import GetPosts from "../../components/Post/GetPosts";
import { Spinner, Flex } from "@chakra-ui/react";
import AboutCommunity from "./AboutCommunity";
import { useSetRecoilState } from "recoil";
import { communityState } from "../../components/AuthModalAtom/AuthmodalAtom";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from "../../Firebase/firebaseConfig";
import safeJsonStringify from "safe-json-stringify";


const CommunityId = () => {
  const { communityId } = useParams();
  const [loading, setLoading] = useState(true);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const [communityData, setCommunityData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const communityDocRef = doc(firestore, 'community', communityId);
      const communityDoc = await getDoc(communityDocRef);

      if (communityDoc.exists()) {
        const parsedData = JSON.parse(
          safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
        );
        setCommunityData(parsedData);
      } else {
        setCommunityData('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [communityId]);  

  useEffect(() => {
      if (communityData) {
        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: communityData,
        }));
        console.log(communityData);
    };

  }, [communityData, setCommunityStateValue]);

  if (!CommunityId) {
    return <CommunityNotFound />;
  }

  return (
    <>
      {loading ? (
        <Flex direction="column" align="center" justify="center" height="100vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) :  (
        <>
          <CommunityHeader communityData={communityData}  />
          <HomePageLayout>
            <>
              <CreatePostLink communityData={communityData} />
              <GetPosts communityData={communityData} />
            </>
            <>
             <AboutCommunity comunityData={communityData} />
            </>
          </HomePageLayout>
        </>
      )}
    </>
  );
};

export default CommunityId;


 