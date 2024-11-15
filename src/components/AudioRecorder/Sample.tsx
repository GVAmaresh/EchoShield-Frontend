import React, { useState, useEffect, useRef } from "react";
import Waves from "react-animated-waves";

interface AudioProps {
  audioSrc: File | undefined;
  prediction?: string;
  entropy?: string;
  text?: string;
}

const OutputAudio = ({ audioSrc, prediction, entropy, text }: AudioProps) => {
  const [amplitude, setAmplitude] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (audioSrc) {
      const url = URL.createObjectURL(audioSrc);
      setAudioUrl(url);
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioSrc]);

  useEffect(() => {
    if (!audioUrl) return;

    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Cleanup any existing AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyserRef.current = analyser;

    try {
      // Ensure no prior source connection exists
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const updateAmplitude = () => {
        analyser.getByteTimeDomainData(dataArray);
        const sum = dataArray.reduce((acc, value) => acc + (value - 128) ** 2, 0);
        const rms = Math.sqrt(sum / dataArray.length);
        setAmplitude(rms);
        requestAnimationFrame(updateAmplitude);
      };

      audioElement.addEventListener("play", async () => {
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        updateAmplitude();
      });
    } catch (error) {
      console.error("Error connecting MediaElementSourceNode:", error);
    }

    return () => {
      // Disconnect audio nodes and close context on cleanup
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioUrl]);

  return (
    <div>
      {audioUrl && (
        <div>
          {/* Ensure each rendering uses a fresh audio element */}
          <audio
            key={audioUrl} // Important: Forces React to recreate the audio element
            ref={audioRef}
            controls
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
          {prediction && <p>Prediction: {prediction}</p>}
          {entropy && <p>Entropy: {entropy !== null ? entropy : "N/A"}</p>}
          {text && <p>Text: {text}</p>}

          <div className="pt-24 absolute w-full">
            <Waves
              amplitude={Math.max(amplitude - 32, 0)} // Avoid negative amplitude
              colors={["#FF6AC6", "#436EDB", "#FF6AC6"]}
            />
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              const link = document.createElement("a");
              link.href = audioUrl;
              link.download = "audio_file.wav";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download Audio
          </button>
        </div>
      )}
    </div>
  );
};

export default OutputAudio;