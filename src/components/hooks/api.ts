export const sendAudioToBackend = async (formData: FormData) => {
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to upload audio");
      console.log("Audio uploaded successfully");
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };
  

//   const sendAudioToBackend22 =async (formData: FormData)  => {
//     const response = await fetch("http://localhost:8000/upload", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) throw new Error("Failed to upload audio");
//     const data = await response.json();

//     const audioBlob = new Blob([Uint8Array.from(atob(data.audio_data), c => c.charCodeAt(0))], { type: data.content_type });
//     setAudioSrc(URL.createObjectURL(audioBlob));
    
//     console.log('Prediction:', data.prediction);
//     console.log('Entropy:', data.entropy);
// };
// {audioSrc && <audio controls src={audioSrc}>Your browser does not support the audio element.</audio>}
// const [audioSrc, setAudioSrc] = useState(null);