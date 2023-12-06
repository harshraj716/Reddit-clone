// PostForm.jsx
import React, { useState } from "react";
import {
  Flex,
  Text,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import TextInput from "./TextInput";
import ImageUpload from "./ImageUpload";
import LinkPost from "./LinkPost";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, appStorage } from "../../../Firebase/firebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useParams, useNavigate } from 'react-router-dom';
import useChangeImage from "../../../CustomHooks/useChangeImage";

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

const PostForm = ({ user }) => {
  const { communityId } = useParams();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const { selectedFile,setSelectedFile,onChangeImage} = useChangeImage()
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });

  const [linkInputs, setLinkInputs] = useState({
    link: "",
  });
  

  const navigate = useNavigate();
  const [postItems, setPostItems] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCreatePost = async () => {
    setLoading(true);

    if (!user || !user.uid) {
      console.error("User is undefined or does not have a UID");
      setLoading(false);
      return;
    }

    const { title, body } = textInputs;
    const {link} = linkInputs;

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId,
        creatorId: user.uid,
        userDisplayText: user.email.split("@")[0],
        title,
        body,
        link,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp(),
        editedAt: serverTimestamp(),
      });

      console.log("HERE IS NEW POST ID", postDocRef.id);

      if (selectedFile) {
        const imageRef = ref(appStorage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });

      }

      setPostItems((prev) => ({
        ...prev,
        postUpdateRequired: true,
      }));

      // Set success state to true
      setSuccess(true);
      navigate(`/r/${communityId}`);

    } catch (error) {
      console.error("createPost error", error);
      setError("Error creating post");
      setSuccess(false);
    }

    setLoading(false);
  };


  const onTextChange = ({ target: { name, value } }) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const onLinkInputChange = ({ target: { name, value } }) => {
    setLinkInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetStates = () => {
    setSuccess(false)
    setError("");
  };

  return (
    <Flex direction="column" borderRadius={4} bg="white" mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <Flex
            key={item.title}
            justify="center"
            align="center"
            flexGrow={1}
            p="14px 0px"
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
            onClick={() => setSelectedTab(item.title)}
            color={selectedTab === item.title ? "blue.500" : "gray.500"}
            borderWidth={
              selectedTab === item.title ? "0px 1px 2px 0px" : "0px 1px 1px 0px"
            }
            borderBottomColor={
              selectedTab === item.title ? "blue.500" : "gray.200"
            }
            borderRightColor="gray.200"
          >
            <Flex align="center" mr={2} height="22px">
              <Icon fontSize="22px" as={item.icon} />
            </Flex>
            <Text display={{base: 'none', md:'block'}} fontSize="10pt" fontWeight={700}>
              {item.title}
            </Text>
          </Flex>
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInput
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            handleSelectImage={onChangeImage}
          />
        )}
        {selectedTab === "Link" && (
          <LinkPost
          handleCreatePost={handleCreatePost} 
          linkInputs={linkInputs}
            loading={loading}
            onChange={onLinkInputChange}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>

      {success && (
        <Alert
          status="success"
          mt={4}
          mb={2}
          onClose={() => resetStates()}
        >
          <AlertIcon />
          Your Post Creating SuccessFully. Fire on!
        </Alert>
      )}

      {error && (
        <Alert status="error" mt={4} mb={2} onClose={() => resetStates()}>
          <AlertIcon />
          <AlertTitle>Error Creating Post!</AlertTitle>
          <AlertDescription>Re-Write Your Post Again.</AlertDescription>
        </Alert>
      )}
    </Flex>
  );
};

export default PostForm;
