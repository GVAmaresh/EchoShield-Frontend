import { useAppContext } from "../../App";

export const sendAudioToBackend = async (formData: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to upload audio");

    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };
  


export interface AudioResponse {
  audio: string;
  content_type: string;
  prediction?: string;
  entropy?: string;
  text?:string
}
export const SendAudioToBackend22 = async (formData: FormData): Promise<void> => {
  const { setOutput, setActiveContent } = useAppContext();

  const response = await fetch("http://localhost:8000/upload_audio", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload audio");

  const data = await response.json();

  const audioBase64 = data.audio;
  const fileName = "audioFile.wav"; 
  const audioBlob = base64ToBlob(audioBase64, 'audio/wav');

  const audioFile = new File([audioBlob], fileName, { type: 'audio/wav' });


  const prediction = data.prediction === "true";
  const entropy = data.entropy as string;
  console.log("Running SendAudioToBackend22");

  setOutput({
    audio: audioFile,
    prediction: prediction.toString(),
    entropy: entropy.toString(),
    text: "",
  });

};


export const SendAudioToBackend44 = async (formData: FormData, text: string): Promise<void> => {
  const { setOutput, setActiveContent } = useAppContext();

  // Append the additional text field to the FormData object
  formData.append("text", text);

  const response = await fetch("http://localhost:8000/upload_deepfake", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload audio and text");

  const data = await response.json();

  const audioBase64 = data.audio;
  const fileName = "audioFile.wav"; 
  const audioBlob = base64ToBlob(audioBase64, 'audio/wav');

  const audioFile = new File([audioBlob], fileName, { type: 'audio/wav' });

  console.log("Running SendAudioToBackend22");

  setOutput({
    audio: audioFile,
    prediction: "",
    entropy: "",
    text: text, 
  });

};


function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}
