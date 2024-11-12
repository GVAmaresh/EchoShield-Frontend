import React, { useRef, useState } from 'react';

const AudioRecorder: React.FC = () => {
  const [recordedUrl, setRecordedUrl] = useState<string>('');
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]); 
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const isRecording = useRef<boolean>(false); // Track if recording is in progress

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
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(recordedBlob));
        chunks.current = [];

        const formData = new FormData();
        formData.append('file', recordedBlob, 'recording.webm');
        await sendAudioToBackend(formData);
        
        // Only restart the recorder if it's stopped and recording is not ongoing
        if (isRecording.current) {
          startNewRecording();
        }
      };

      // Start recording if it's not already ongoing
      if (mediaRecorder.current.state === 'inactive') {
        mediaRecorder.current.start();
        isRecording.current = true;
      }

      // Set interval to stop the recording every 5 seconds
      recordingInterval.current = setInterval(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop();
        }
      }, 5000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      isRecording.current = false;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }

    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
  };

  const sendAudioToBackend = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload audio');

      console.log('Audio uploaded successfully');
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const startNewRecording = () => {
    // Start a new recording after the stop
    if (mediaRecorder.current && mediaRecorder.current.state === 'inactive') {
      mediaRecorder.current.start();
      isRecording.current = true;
    }
  };

  return (
    <div>
      <audio controls src={recordedUrl} />
      <br />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default AudioRecorder;