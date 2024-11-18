import React, { useRef, useState, useEffect } from "react";
import { sendAudioToBackend } from "../hooks/api";
import TextField from "@mui/material/TextField";

import Waves from "react-animated-waves";
import { useAudioRecorder } from "../AudioRecorder/AudioRecorder";
import { formatTime, useFileUploader } from "../hooks/utils";
import RecorderControls from "../others/RecorderControls";
import { useAppContext } from "../../App";

const DeepFakeAudio = () => {
  const [timer, setTimer] = useState<number>(0);
  const {
    recordedUrl,
    recordingStatus,
    amplitude,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder(true);
  // const { selectedFile, handleFileSelection, handleSubmit } =
  //   useFileUploader();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleStartRecording = () => {
    setTimer(0);
    startRecording(sendAudioToBackend);
  };
  const{setInputText} = useAppContext()
  

  useEffect(() => {
    if (recordingStatus === "recording") {
      intervalRef.current = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (recordingStatus === "stopped" || recordingStatus === "idle") {
      if(recordingStatus === "idle") {
        setTimer(0);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recordingStatus]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  return (
    <div className="mt-6" style={{ position: "relative", height: "100vh" }}>
      <div className="text-center font-bold" style={{ color: "#C0C0C0" }}>
        Sound Recorder
      </div>
      <div
        className="text-center font-bold text-5xl mt-14"
        style={{ color: "black" }}
      >
        {formatTime(timer)}
      </div>

      <div className="pt-24 absolute w-full">
        <Waves
          amplitude={amplitude - 32}
          colors={["#FF6AC6", "#436EDB", "#FF6AC6"]}
        />
      </div>

      <RecorderControls
        recordingStatus={recordingStatus}
        startRecording={handleStartRecording}
        stopRecording={stopRecording}
        // handleFileSelection={handleFileSelection}
        // handleSubmit={handleSubmit}
        resetRecording={resetRecording}
      />

      <div className=" flex justify-center mt-10">
        <TextField
          id="outlined-textarea"
          label="Enter Your Narrative"
          placeholder="Once upon a time, in a quaint village nestled between rolling hills..."
          className="w-5/6"
          multiline
          onChange={(e)=>{setInputText(e.target.value)}}
        />
      </div>
    </div>
  );
};

export default DeepFakeAudio;
