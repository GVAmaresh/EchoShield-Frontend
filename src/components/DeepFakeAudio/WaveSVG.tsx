import React, { useEffect, useState } from "react";

interface WaveSVGProps {
  amplitude: number;
}

const WaveSVG: React.FC<WaveSVGProps> = ({ amplitude }) => {
  const [path, setPath] = useState("");

  const generateSinWavePath = (time: number) => {
    const points = [];
    const frequency = 0.01; 
    const waveHeight = amplitude; 

    for (let x = 0; x <= 1440; x += 10) {
      const y = 160 + waveHeight * Math.sin(frequency * x + time);
      points.push(`${x},${y}`);
    }

    return `M${points.join("L")}L1440,320L0,320Z`;
  };

  useEffect(() => {
    let startTime = Date.now();

    const animateWave = () => {
      const time = (Date.now() - startTime) / 1000;
      setPath(generateSinWavePath(time));
      requestAnimationFrame(animateWave);
    };

    animateWave();
  }, [amplitude]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#0099ff" fillOpacity="1" d={path} />
    </svg>
  );
};

export default WaveSVG;
