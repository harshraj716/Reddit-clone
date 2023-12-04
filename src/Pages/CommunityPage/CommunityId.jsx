// CommunityId.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCommunityData from "../../CustomHooks/useCommunityData";
import CommunityNotFound from "../CommunityNotFound/CommunityNotFound";
import CommunityHeader from "./CommunityHeader";
import HomePageLayout from "../../components/MainLayout/HomePageLayout";
import CreatePostLink from "./CreatePostLink";
import GetPosts from "../../components/Post/GetPosts";
import { Spinner, Flex } from "@chakra-ui/react";
import AboutCommunity from "./AboutCommunity";

const CommunityId = () => {
  const { communityId } = useParams();
  const [loading, setLoading] = useState(true);
  const {communityData} = useCommunityData(communityId);
  const [communityStateValue, setCommunityStateValue] = useState({
    currentCommunity: null,
  });



  

  console.log(communityStateValue)
  useEffect(() => {
    if (communityData) {
      setLoading(false);
    }
  }, [communityData]);

  useEffect(() => {
    if (communityData) {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: communityData,
      }));
    }
  }, [communityData]);
  
  

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
      ) : communityData ? (
        <>
          <CommunityHeader communityData={communityData}  communityStateValue={communityStateValue}/>
          <HomePageLayout>
            <>
              <CreatePostLink communityData={communityData} />
              <GetPosts communityData={communityData} />
            </>
            <>
             <AboutCommunity comunityData={communityData} setCommunityStateValue={setCommunityStateValue}/>
            </>
          </HomePageLayout>
        </>
      ) : (
        <CommunityNotFound />
      )}
    </>
  );
};

export default CommunityId;
