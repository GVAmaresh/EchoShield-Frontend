import { useState, useEffect } from "react";
import DeepfakeDetection from "../DeepFakeDetection/DeepFakeDetection";
import DeepfakeAudio from "../DeepFakeAudio/DeepFakeAudio";
import { useAppContext } from "../../App"; // Context import
import OutputAudio from "../AudioRecorder/Audio";
import Docs from "../Docs/docs";
import NavComp from "../others/NavComp";
import { FaKey } from "react-icons/fa";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { BsFillMicFill } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";

interface IOutput {
  audio: File | undefined;
  prediction?: string;
  entropy?: string;
  text?: string;
}

export default function MainBody() {
  const { output, activeContent, setActiveContent } = useAppContext(); 

  const [audioProps, setAudioProps] = useState<IOutput>({
    audio: undefined, 
    prediction: "",
    entropy: "",
    text: ""
  });

  useEffect(() => {
    setAudioProps({
      audio: output.audio, 
      prediction: output.prediction || "",
      entropy: output.entropy || "",
      text: output.text || ""
    });
    console.log(activeContent);
    if (output.audio) {
      setActiveContent(20);
    }
  }, [output, setActiveContent]);

  const handleSetActiveContent = (idx: number) => {
    setActiveContent(idx);
  };

  useEffect(() => {
    if (activeContent === 1) {
      window.location.href = "https://e4ca69141080319122.gradio.live";
    }
    if (activeContent === 2) {
      window.location.href = "https://a0ceb0a6fede18ccc0.gradio.live";
    }
  }, [activeContent]);

  return (
    <div style={{backgroundColor:""}}>
      <div className="flex justify-center" >
      
        {activeContent!=20 && activeContent!=10 && <div className=" flex gap-9 mt-4">
        <div className=""><NavComp logo={ <FaHeadphonesSimple size={30}/>} str="Detect Deepfake Voice"/></div>
        <div className=""><NavComp logo={<BsFillMicFill  size={30}/> } str="Create Deepfake Audio"/></div>
        <div className=""><NavComp logo={<BsRobot size={30}/> } str="Other Models to Detect Deepfake"/></div>
        </div>}
        {/* <nav className="flex items-center space-x-4">
          {activeContent != 20 &&
            activeContent != 3 &&
            ["Deepfake Detection", "Create Deepfake", "Others"].map(
              (item, idx) => (
                <button
                  key={idx}
                  className={`text-sm md:text-xl ${
                    activeContent === idx ? "font-extrabold" : "font-medium"
                  }`}
                  onClick={() => handleSetActiveContent(idx)}
                >
                  {item}
                </button>
              )
            )}
        </nav> */}
      </div>

      <div>
        {(activeContent === 0 || activeContent === 1 || activeContent === 2)
&& <DeepfakeDetection />}

        {activeContent === 10 && <Docs />}
        {activeContent === 20 && (
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
