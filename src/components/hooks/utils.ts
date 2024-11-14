import { useState } from "react";
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

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      await sendAudioToBackend(formData);
      setSelectedFile(null);
    } else {
      console.error("No file selected");
    }
  };

  return { selectedFile, handleFileSelection, handleSubmit };
};

