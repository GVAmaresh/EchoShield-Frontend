import { useRef, useState } from "react";
import { useAppContext } from "../../App";
import { sendAudioToBackend, SendAudioToBackend22 } from "../hooks/api";

export const useAudioRecorder = (isCreateDeepfake: boolean = false) => {
  const [recordedUrl, setRecordedUrl] = useState<string>("");
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "stopped"
  >("idle");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const ttl_chunks = useRef<Blob[]>([]);
  const totalMediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const [mergedBlobSize, setMergedBlobSize] = useState<number>(0);
  const analyserNode = useRef<AnalyserNode | null>(null);
  const { totalChunks, setTotalChunks, submit, setSubmit } = useAppContext();

  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const [amplitude, setAmplitude] = useState<number>(20);

  const resetRecording = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      clearInterval(recordingInterval.current as NodeJS.Timeout);
    }
    setTotalChunks([]);
    chunks.current = [];
    ttl_chunks.current = [];
    setRecordingStatus("idle");
    setAmplitude(20);
    setRecordedUrl("");
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContext.current && audioContext.current.state === "running") {
      audioContext.current.close();
    }
    mediaStream.current = null;
    mediaRecorder.current = null;
    audioContext.current = null;
    analyserNode.current = null;
    totalMediaRecorder.current = null;
    recordingInterval.current = null;
  };

  const startRecording = async (
    sendAudioToBackend: (formData: FormData) => Promise<void>
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
          console.log(e.data, "eeeee");
          ttl_chunks.current.push(
            new Blob(ttl_chunks.current, { type: "audio/webm" })
          );
        }
      };
      if (!totalMediaRecorder.current) {
        totalMediaRecorder.current = new MediaRecorder(stream);
        totalMediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            ttl_chunks.current.push(e.data);
          }
        };
      }

      mediaRecorder.current.onstop = async () => {
        console.log(chunks.current);
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        setRecordedUrl(URL.createObjectURL(recordedBlob));

        if (!isCreateDeepfake) {
          const formData = new FormData();
          formData.append("file", recordedBlob, "recording.webm");
          await sendAudioToBackend(formData);
          chunks.current = [];
        }
      };
      totalMediaRecorder.current.start();
      mediaRecorder.current.start();

      recordingInterval.current = setInterval(() => {
        if (
          mediaRecorder.current &&
          mediaRecorder.current.state === "recording"
        ) {
          mediaRecorder.current.stop();
          setTimeout(() => {
            if (mediaRecorder.current && mediaStream.current?.active)
              mediaRecorder.current.start();
          }, 100);
        }
      }, 5000);
      setRecordingStatus("recording");
      setupAudioContext(stream);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    clearInterval(recordingInterval.current as NodeJS.Timeout);
    if (mediaRecorder.current && mediaRecorder.current.state === "recording")
      mediaRecorder.current.stop();
    if (mediaStream.current)
      mediaStream.current.getTracks().forEach((track) => track.stop());
    if (audioContext.current && audioContext.current.state === "running")
      audioContext.current.close();
    if (
      totalMediaRecorder.current &&
      totalMediaRecorder.current.state === "recording"
    ) {
      totalMediaRecorder.current.stop(); // Stop total recording
    }

    setRecordingStatus("stopped");
  };

  const setupAudioContext = (stream: MediaStream) => {
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    const sourceNode = audioContext.current.createMediaStreamSource(stream);
    analyserNode.current = audioContext.current.createAnalyser();
    analyserNode.current.fftSize = 256;
    sourceNode.connect(analyserNode.current);
    updateAmplitude();
  };

  const handleSubmitChunksToBackend = async () => {
    if (ttl_chunks.current.length > 0) {
      const recordedBlob = new Blob(ttl_chunks.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", recordedBlob, "total_recording.webm");

      const a = await SendAudioToBackend22(formData);
      console.log(a)
      setTotalChunks(ttl_chunks.current);
      ttl_chunks.current = [];
      console.log("It's time to Working");
    }
  };
  if (submit) {
    handleSubmitChunksToBackend();
    console.log("Submit working Successfully");
    setSubmit(false)
  }

  const updateAmplitude = () => {
    const analyser = analyserNode.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const getAmplitude = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAmplitude(average);
      requestAnimationFrame(getAmplitude);
    };
    getAmplitude();
  };

  return {
    recordedUrl,
    recordingStatus,
    amplitude,
    startRecording,
    stopRecording,

    resetRecording
  };
};