import  { useState, useEffect, useRef } from "react";
import { sendAudioToBackend } from "../hooks/api";
import { formatTime } from "../hooks/utils";
import RecorderControls from "../others/RecorderControls";
import Waveform from "./WavStyle";
import { useAudioRecorder } from "../AudioRecorder/AudioRecorder";

const DeepfakeDetection = () => {
  const [timer, setTimer] = useState<number>(0);
  const {
    recordingStatus,
    amplitude,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleStartRecording = () => {
    setTimer(0);
    startRecording(sendAudioToBackend);
  };

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
    <div className="mt-6" style={{backgroundColor:"", position: "relative", height: "100vh" }}>
      <div className="text-center font-bold" style={{ color: "#A9A9A9" }}>
        Sound Recorder
      </div>
      <div
        className="text-center font-bold text-5xl mt-14"
        style={{ color: "black" }}
      >
        {formatTime(timer)}
      </div>
      <RecorderControls
        recordingStatus={recordingStatus}
        startRecording={handleStartRecording}
        stopRecording={stopRecording}
        // handleFileSelection={handleFileSelection}
        // handleSubmit={handleSubmit}
        resetRecording={resetRecording}
      />

      <Waveform amplitude={amplitude} />
    </div>
  );
};

export default DeepfakeDetection;
