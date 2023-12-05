import React from 'react'
import HomePageLayout from '../../components/MainLayout/HomePageLayout';
import { Box ,Text} from '@chakra-ui/react';
import PostForm from '../../components/Post/PostForm/PostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from '../../Firebase/firebaseConfig'
import { useRecoilValue } from 'recoil';
import { communityState } from '../../components/AuthModalAtom/AuthmodalAtom';

const Submit = () => {
    const [user] = useAuthState(auth)
    const communityStateValue = useRecoilValue(communityState);
    console.log("community vallue", communityStateValue)
  return (
    <HomePageLayout>
        {/* New Create and Post Form */}
        <>
        <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
            <Text fontWeight={600} >Create a Post</Text>
        </Box>
      { user && <PostForm user={user}/>}
        </>
        {/* About Community Part */}
        <></>
    </HomePageLayout>
  )
}

export default Submit