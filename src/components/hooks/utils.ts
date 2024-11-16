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

export const useFileUploader = (sendAudioToBackend: (formData: FormData) => Promise<void>) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {inputText, activeContent} = useAppContext()

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    console.log(activeContent, " in handleSubmit")
    if (selectedFile && activeContent  === 0) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      await SendAudioToBackend22(formData);
      setSelectedFile(null);
    } else if(selectedFile && activeContent ===1){
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      await SendAudioToBackend44(formData, inputText);
      setSelectedFile(null);
    }
  };

  return { selectedFile, handleFileSelection, handleSubmit };
};

