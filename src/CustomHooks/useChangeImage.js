import {useState} from 'react'

const useChangeImage = () => {

  const [selectedFile, setSelectedFile] = useState();
  const onChangeImage = (event) => {
    const reader = new FileReader();
    const file = event.target.files?.[0];
  
    if (file) {
      reader.readAsDataURL(file);
  
      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
          setSelectedFile(readerEvent.target?.result);
        }
      };
    }
  };
  return {
     selectedFile,setSelectedFile,onChangeImage
  }
}

export default useChangeImage