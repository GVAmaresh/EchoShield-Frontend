import React, { useState } from "react";
import { SiAnimalplanet } from "react-icons/si";
import { FaFolder } from "react-icons/fa";
import { TiMediaRecord } from "react-icons/ti";
import { FaPause } from "react-icons/fa6";
import { MdOutlineReplay } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { useAppContext } from '../../App';
import { submitFile } from "../hooks/utils";

interface RecorderControlsProps {
  recordingStatus: "idle" | "recording" | "playing" | "stopped" | "paused";
  startRecording: () => void;
  stopRecording: () => void;
  // handleFileSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handleSubmit: (formData: FormData) => void;
  resetRecording: () => void;
}

const RecorderControls = ({
  recordingStatus,
  startRecording,
  stopRecording,
  // handleFileSelection,
  // handleSubmit,
  resetRecording
}: RecorderControlsProps) => {

  const { setSubmit, inputText, activeContent, setOutput } = useAppContext();
  // const { setChange } = useAudioRecorder()
  // const { setActiveContent } = useAppContext(); 
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("New Working 1")
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("New Working 2")
      stopRecording();
    }
    // handleFileSelection(e);
  };

  const handleReset = () => {
    setFile(null);
    resetRecording();
  };

  const handleClick = (buttonId: string, action: () => void) => {
    setActiveButton(buttonId);
    action();
    setTimeout(() => setActiveButton(null), 200);
  };

  const onSubmit = () => {
    console.log("Working 0")
    if (file) {
      console.log("Working 1")
      const formData = new FormData();
      formData.append("file", file, file.name);
      // handleSubmit(formData);
      submitFile(formData, inputText, activeContent, setOutput)
    } else {
      setSubmit(true)
    }
  };

  const defaultShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
  const activeShadow =
    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset";

  return (
    <div
      className="button-container"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div className="flex justify-center mt-60">
        {recordingStatus === "idle" && (
          <div className="flex z-40 gap-6">
            <div
              className="rounded-full p-4"
              style={{
                boxShadow:
                  activeButton === "animalplanet" ? activeShadow : defaultShadow
              }}
              onClick={() => handleClick("animalplanet", () => {})}
            >
              <SiAnimalplanet size={20} />
            </div>
            <div
              className="rounded-full p-4"
              style={{
                boxShadow:
                  activeButton === "record" ? activeShadow : defaultShadow
              }}
              onClick={() => handleClick("record", startRecording)}
            >
              <TiMediaRecord size={20} />
            </div>
            <div
              className="rounded-full p-4"
              style={{
                boxShadow:
                  activeButton === "folder" ? activeShadow : defaultShadow
              }}
            >
              <input
                type="file"
                accept=".mp3,.wav"
                style={{ display: "none" }}
                onChange={handleFileChange} 
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <FaFolder size={20} />
              </label>
            </div>
          </div>
        )}

        {recordingStatus === "recording" && (
          <div className="flex z-40">
            <div
              className="rounded-full p-4"
              style={{
                boxShadow:
                  activeButton === "pause" ? activeShadow : defaultShadow
              }}
              onClick={() => handleClick("pause", stopRecording)}
            >
              <FaPause size={20} />
            </div>
          </div>
        )}

        {recordingStatus === "stopped" && (
          <div className="flex z-40 gap-4">
            <div
              className="rounded-full p-4"
              style={{
                boxShadow:
                  activeButton === "replay" ? activeShadow : defaultShadow
              }}
              onClick={() => handleClick("replay", handleReset)}
            >
              <MdOutlineReplay size={20} />
            </div>
            <div
              className="rounded-full p-4"
              style={{
                boxShadow:
                  activeButton === "send" ? activeShadow : defaultShadow
              }}
              onClick={() => handleClick("send", onSubmit)}
            >
              <IoMdSend size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecorderControls;
