import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";

const Visualizer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const outRef = useRef<HTMLDivElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [amplitude, setAmplitude] = useState(0);

  const noise = new SimplexNoise();
  useEffect(() => {
    let animationFrameId: number;

    const vizInit = () => {
      const audio = audioRef.current;
      if (!audio) return;

      const play = () => {
        // const context = new (window.AudioContext || window.webkitAudioContext)();
        // const src = context.createMediaElementSource(audio);
        // const analyser = context.createAnalyser();
        if (!contextRef.current) {
          const context = new (window.AudioContext ||
            window.webkitAudioContext)();
          const src = context.createMediaElementSource(audio);

          srcRef.current = src;
          contextRef.current = context;

          const analyser = context.createAnalyser();
          src.connect(analyser);
          analyser.connect(context.destination);
          analyser.fftSize = 512;

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current = analyser;

          const scene = new THREE.Scene();
          const group = new THREE.Group();

          const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          camera.position.set(0, 0, 100);
          camera.lookAt(scene.position);
          scene.add(camera);

          const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
          });
          renderer.setSize(window.innerWidth, window.innerHeight);

          const planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
          const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x6904ce,
            side: THREE.DoubleSide,
            wireframe: true
          });

          const plane = new THREE.Mesh(planeGeometry, planeMaterial);
          plane.rotation.x = -0.5 * Math.PI;
          plane.position.set(0, 30, 0);
          group.add(plane);

          const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
          plane2.rotation.x = -0.5 * Math.PI;
          plane2.position.set(0, -30, 0);
          group.add(plane2);

          const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
          const lambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xff00ee,
            wireframe: true
          });

          const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
          ball.position.set(0, 0, 0);
          group.add(ball);

          const ambientLight = new THREE.AmbientLight(0xaaaaaa);
          scene.add(ambientLight);

          const spotLight = new THREE.SpotLight(0xffffff);
          spotLight.intensity = 0.9;
          spotLight.position.set(-10, 40, 20);
          spotLight.lookAt(ball.position);
          spotLight.castShadow = true;
          scene.add(spotLight);

          scene.add(group);

          if (outRef.current) {
            outRef.current.appendChild(renderer.domElement);
          }

          const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          };

          const updateAmplitude = () => {
            if (!analyserRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);

            const sum = dataArray.reduce((acc, value) => acc + value, 0);
            const average = sum / dataArray.length;

            setAmplitude(average);
            requestAnimationFrame(updateAmplitude);
          };

          const render = () => {
            analyser.getByteFrequencyData(dataArray);

            const lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
            const upperHalfArray = dataArray.slice(dataArray.length / 2 - 1);

            const lowerMaxFr = max(lowerHalfArray) / lowerHalfArray.length;
            const upperAvgFr = avg(upperHalfArray) / upperHalfArray.length;

            makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
            makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));

            makeRoughBall(
              ball,
              modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
              modulate(upperAvgFr, 0, 1, 0, 4)
            );

            group.rotation.y += 0.005;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(render);
          };

          window.addEventListener("resize", onWindowResize);
          render();
        }
      };

      play();
    };

    vizInit();

    return () => {
      if (srcRef.current) {
        srcRef.current.disconnect();
        srcRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
        audioRef.current.src = ""; 
        audioRef.current.load();
        // audioRef.current.close();
        audioRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    audio.src = URL.createObjectURL(file);
    audio.load();
    audio.play();
    console.log("Playing")
  };

  

  const avg = (arr: Uint8Array) => {
    const sum = arr.reduce((sum, value) => sum + value, 0);
    return sum / arr.length;
  };

  const max = (arr: Uint8Array) => {
    return Math.max(...Array.from(arr));
  };

  const modulate = (
    value: number,
    minVal: number,
    maxVal: number,
    outMin: number,
    outMax: number
  ) => {
    const fraction = (value - minVal) / (maxVal - minVal);
    return outMin + fraction * (outMax - outMin);
  };

  const makeRoughGround = (mesh: THREE.Mesh, distortionFr: number) => {
    const time = Date.now();
    const positionAttr = mesh.geometry.attributes
      .position as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;

    const amp = 2;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const distance =
        noise.noise2D(x + time * 0.0003, y + time * 0.0001) *
        distortionFr *
        amp;

      positions[i + 2] = distance;
    }

    positionAttr.needsUpdate = true;
  };

  const makeRoughBall = (mesh: THREE.Mesh, bassFr: number, treFr: number) => {
    const positionAttr = mesh.geometry.attributes
      .position as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;

    const offset = 10; // Example offset
    const amp = 7;
    const time = window.performance.now();
    const rf = 0.00001;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const distance =
        offset +
        bassFr +
        noise.noise3D(x + time * rf * 7, y + time * rf * 8, z + time * rf * 9) *
          amp *
          treFr;

      const factor = distance / Math.sqrt(x * x + y * y + z * z);
      positions[i] *= factor;
      positions[i + 1] *= factor;
      positions[i + 2] *= factor;
    }

    positionAttr.needsUpdate = true;
  };

  


  return (
    <div>
      <label htmlFor="thefile" className="file">
        Choose an audio file
      </label>
      <input
      id="thefile"
      type="file"
      accept="audio/*"
      // ref={fileInputRef}
      onChange={handleFileChange}
    />
      <audio id="audio" ref={audioRef} controls></audio>
      <div className="controls">



      </div>
      <div id="out" ref={outRef}></div>
    </div>
  );
};

export default Visualizer;
