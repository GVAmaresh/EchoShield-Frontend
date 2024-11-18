// src/components/FileUpload.tsx

import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("music", file);

    setUploading(true);

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadResponse(`File uploaded successfully: ${response.data}`);
    } catch (error) {
      setUploadResponse("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Music File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadResponse && <p>{uploadResponse}</p>}
      {uploadResponse && !uploading && (
        <audio controls>
          <source src={`http://localhost:3000${uploadResponse}`} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default FileUpload;
