import Wave from "react-wavify";

export default function WavStyle(amplitude:number){
    return <div className="">
        <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, rgba(18, 119, 176, 0) 0%, rgba(18, 119, 176, 0.4) 40%, rgba(18, 119, 176, 0) 100%)', // Starts transparent, then light blue, then transparent again, // Top 20% transparent, the rest stays blue
        }}
      >
        <Wave
          fill="#1277b0"
          mask="url(#mask)"
          options={{
            amplitude: amplitude,  
          }}
        >
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
    </div>
}