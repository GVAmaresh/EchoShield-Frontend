import { useState, useEffect } from "react";
import DeepfakeDetection from "../DeepFakeDetection/DeepFakeDetection";
import DeepfakeAudio from "../DeepFakeAudio/DeepFakeAudio";
import { useAppContext } from "../../App"; // Context import
import OutputAudio from "../AudioRecorder/Audio";

interface IOutput {
  audio: File | undefined;
  prediction?: string;
  entropy?: string;
  text?: string;
}

export default function MainBody() {
  const { output, activeContent, setActiveContent } = useAppContext(); // Consume context values

  const [audioProps, setAudioProps] = useState<IOutput>({
    audio: undefined, // Initialize with undefined or an actual File if available
    prediction: "",
    entropy: "",
    text: ""
  });

  useEffect(() => {
    setAudioProps({
      audio: output.audio, // Use 'audio' instead of 'audioSrc'
      prediction: output.prediction || "",
      entropy: output.entropy || "",
      text: output.text || ""
    });
    console.log(activeContent)
    if (output.audio) {
      setActiveContent(2);
    }
  }, [output, setActiveContent]);

  const handleSetActiveContent = (idx: number) => {
    setActiveContent(idx);
  };

  return (
    <div>
      <div className="flex justify-center">
        <nav className="flex items-center space-x-4">
          {activeContent!=2&&["Deepfake Detection", "Deepfake Audio"].map((item, idx) => (
            <button
              key={idx}
              className={`text-sm md:text-xl ${
                activeContent === idx ? "font-extrabold" : "font-medium"
              }`}
              onClick={() => handleSetActiveContent(idx)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeContent === 0 && <DeepfakeDetection />}
        {activeContent === 1 && <DeepfakeAudio />}
        {activeContent === 2 && (
          <OutputAudio
            audioSrc={audioProps.audio} 
            prediction={audioProps.prediction}
            entropy={audioProps.entropy}
            text={audioProps.text}
          />
        )}
      </div>
    </div>
  );
}
