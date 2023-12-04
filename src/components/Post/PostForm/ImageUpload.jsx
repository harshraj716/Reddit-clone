import React, { useRef } from "react";
import { Button, Flex,Image, Stack } from "@chakra-ui/react";

const ImageUpload = ({
  selectedFile,
  setSelectedFile,
  setSelectedTab,
  handleSelectImage,
}) => {
  const selectedFilesRef = useRef();
  return (
    <Flex justify="center" direction='column' align="center" width="100%">
       { selectedFile ?(
        <>
        <Image  src={selectedFile} maxH='400px' maxW='400px' />
        <Stack direction='row' mt={6}>
             <Button onClick={() => setSelectedTab("Post")}>Back To Our Post</Button>
             <Button  variant='outline' onClick={() => setSelectedFile("")}>Remove This Image</Button>
        </Stack>
        </>
       ):(
        <Flex
        justify="center"
        align="center"
        p={20}
        border="1px dashed"
        borderColor="gray.200"
        width="100%"
        borderRadius={4}
      >
        <Button
          variant="outline"
          height="40px"
          onClick={() => selectedFilesRef.current?.click()}
        >
          Upload Image Or Video
        </Button>
        <input
          ref={selectedFilesRef}
          type="file"
          hidden
          onChange={handleSelectImage}
          accept="image/*, video/*, image/jpeg, image/gif, image/png"
        />
       
      </Flex>
       )
      }
    </Flex>
  );
};

export default ImageUpload;
