import { act, useState } from "react";
import { SendAudioToBackend22, SendAudioToBackend44 } from "./api";
import { useAppContext } from "../../App";
export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  export const submitFile = async (
    formData: FormData,
    inputText: string,
    activeContent: number,
    setOutput: React.Dispatch<React.SetStateAction<any>>
  ): Promise<void> => {
    try {
      if (activeContent === 0) {
        console.log("Check here 1")
        await SendAudioToBackend22(formData ,setOutput);
        console.log("Check here 2")
      } else if (activeContent === 1) {
        await SendAudioToBackend44(formData, inputText, setOutput);
      }
    } catch (error) {
      console.error("Error submitting file:", error);
      throw error; // Optional: rethrow the error for further handling
    }
  };
  
  
export const useFileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {inputText, activeContent, setOutput} = useAppContext()

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    console.log(activeContent, " in handleSubmit")
    if (selectedFile && activeContent  === 0) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      await SendAudioToBackend22(formData, setOutput);
      setSelectedFile(null);
    } else if(selectedFile && activeContent ===1){
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      await SendAudioToBackend44(formData, inputText, setOutput);
      setSelectedFile(null);
    }
  };

  return { selectedFile, handleFileSelection, handleSubmit };
};

