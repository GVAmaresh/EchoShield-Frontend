import React, { useRef, useState, useEffect } from "react";
import Wave from "react-wavify";
import { SiAnimalplanet } from "react-icons/si";
import { FaFolder } from "react-icons/fa";
import { TiMediaRecord } from "react-icons/ti";
import { FaPause } from "react-icons/fa6";
import { MdOutlineReplay } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const RecorderTemplate: React.FC = () => {
  const [recordedUrl, setRecordedUrl] = useState<string>("");
  const [amplitude, setAmplitude] = useState<number>(20);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "playing" | "stopped" | "paused"
  >("idle");
  const [timer, setTimer] = useState<number>(0);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const isRecording = useRef<boolean>(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyserNode = useRef<AnalyserNode | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const defaultShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
  const activeShadow =
    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset";

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, []);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        setRecordedUrl(URL.createObjectURL(recordedBlob));
        chunks.current = [];
        setRecordingStatus("stopped");
      };
      mediaRecorder.current.start();
      isRecording.current = true;
      setRecordingStatus("recording");
      startTimer();

      if (!audioContext.current || audioContext.current.state === "closed") {
        audioContext.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const sourceNode = audioContext.current.createMediaStreamSource(stream);
      analyserNode.current = audioContext.current.createAnalyser();
      analyserNode.current.fftSize = 256;
      sourceNode.connect(analyserNode.current);
      updateAmplitude();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      isRecording.current = false;
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContext.current && audioContext.current.state === "running") {
      audioContext.current.close().then(() => {
      });
    }
    setRecordingStatus("stopped");
    stopTimer();
  };

  const updateAmplitude = () => {
    const analyser = analyserNode.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const getAmplitude = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAmplitude(average);
      if (isRecording.current) {
        requestAnimationFrame(getAmplitude);
      }
    };
    getAmplitude();
  };

  const handlePlayRecording = () => {
    const audio = new Audio(recordedUrl);
    audio.play();
    setRecordingStatus("playing");
    audio.onended = () => setRecordingStatus("stopped");
  };

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    setTimer(0);
    stopTimer();
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

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
                    activeButton === "animalplanet"
                      ? activeShadow
                      : defaultShadow
                }}
                onClick={() => handleClick("animalplanet")}
              >
                <SiAnimalplanet size={20} />
              </div>
              <div
                className="rounded-full p-4"
                style={{
                  boxShadow:
                    activeButton === "record" ? activeShadow : defaultShadow
                }}
                onClick={() => {
                  handleClick("record");
                  startRecording();
                }}
              >
                <TiMediaRecord size={20} />
              </div>
              <div
                className="rounded-full p-4"
                style={{
                  boxShadow:
                    activeButton === "folder" ? activeShadow : defaultShadow
                }}
                onClick={() => handleClick("folder")}
              >
                <FaFolder size={20} />
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
                onClick={() => {
                  handleClick("pause");
                  stopRecording();
                }}
              >
                <FaPause size={20}/>
              </div>
            </div>
          )}

          {recordingStatus === "stopped" && (
            <div className="flex  z-40 gap-4">
              <div
                className="rounded-full p-4"
                style={{
                  boxShadow:
                    activeButton === "replay" ? activeShadow : defaultShadow
                }}
                onClick={() => {
                  handleClick("replay");
                  stopRecording(); 
                  resetTimer(); 
                  setRecordingStatus("idle"); 
                  setRecordedUrl("");
                }}
              >
                <MdOutlineReplay size={20}/>
              </div>
              <div
                className="rounded-full p-4"
                style={{
                  boxShadow:
                    activeButton === "recordAlt" ? activeShadow : defaultShadow
                }}
                onClick={() => {
                  handleClick("recordAlt");
                  startRecording();
                }}
              >
                <TiMediaRecord size={20}/>
              </div>
              <div
                className="rounded-full p-4"
                style={{
                  boxShadow:
                    activeButton === "send" ? activeShadow : defaultShadow
                }}
                onClick={() => handleClick("send")}
              >
                <IoMdSend size={20}/>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default RecorderTemplate;
