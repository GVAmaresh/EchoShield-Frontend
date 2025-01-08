import { useAppContext } from "../../App";

const api_link = process.env.REACT_APP_ML_API;



export const sendAudioToBackend = async (formData: FormData) => {
    try {
      const response = await fetch(`${api_link}/upload`, {
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
export const SendAudioToBackend22 = async (formData: FormData,  setOutput: React.Dispatch<React.SetStateAction<any>>): Promise<void> => {
  const response = await fetch(`${api_link}/upload_audio`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload audio");

  const data = await response.json();

  const audioBase64 = data.audio;
  const fileName = "audioFile.wav"; 
  const audioBlob = base64ToBlob(audioBase64, 'audio/wav');

  const audioFile = new File([audioBlob], fileName, { type: 'audio/wav' });


  const prediction = data.prediction;
  const entropy = data.entropy as string;
  console.log("Running SendAudioToBackend22");

  setOutput({
    audio: audioFile,
    prediction: prediction.toString(),
    entropy: entropy.toString(),
    text: "",
  });

};


export const SendAudioToBackend44 = async (formData: FormData, text: string,  setOutput: React.Dispatch<React.SetStateAction<any>>): Promise<void> => {

  formData.append("text", text);

  const response = await fetch(`${api_link}/upload_deepfake`, {
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
