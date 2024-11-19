import React from "react";
import Wave from "react-wavify";

interface WaveformProps {
  amplitude: number;
}

const Waveform= ({ amplitude }:WaveformProps) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "60%",
      overflow: "hidden",
      background:
        "linear-gradient(to bottom, rgba(18, 119, 176, 0) 0%, rgba(18, 119, 176, 0.4) 40%, rgba(18, 119, 176, 0) 100%)"
    }}
  >
    <Wave fill="#84a7a1" mask="url(#mask)" options={{ amplitude }}>
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="0" stopColor="white" />
          <stop offset="0.5" stopColor="black" />
        </linearGradient>
        <mask id="mask">
          <rect x="0" y="0" width="2000" height="200" fill="url(#gradient)" />
        </mask>
      </defs>
    </Wave>
  </div>
);

export default Waveform;
