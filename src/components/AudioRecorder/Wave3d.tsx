import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";

interface PerlinNoiseShaderProps {
  amplitude: number;
}

const PerlinNoiseShader: React.FC<PerlinNoiseShaderProps> = ({ amplitude }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null); // To keep track of the material

  useEffect(() => {
    // Set up renderer, scene, and camera
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, -2, 14);
    camera.lookAt(0, 0, 0);

    // Check if WebGL context is available
    if (!renderer.capabilities.isWebGL2) {
      console.error("WebGL2 context not available, falling back to WebGL1.");
    }

    const params = {
      red: 1.0,
      green: 1.0,
      blue: 1.0,
      threshold: 0.5,
      strength: 0.5,
      radius: 0.8,
    };

    // Render passes for bloom effect
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      params.strength,
      params.radius,
      params.threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // Shader uniforms
    const uniforms = {
      u_time: { value: 0.0 },
      u_amplitude: { value: amplitude }, // Set initial amplitude value
      u_red: { value: 1.0 },
      u_green: { value: 1.0 },
      u_blue: { value: 1.0 },
    };

    const vertexShader = `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red color
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      transparent: true,
      fragmentShader,
    });
    materialRef.current = mat; // Save the material reference

    const geo = new THREE.IcosahedronGeometry(4, 30);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Wireframe mode
    mesh.material.wireframe = true;

    // GUI setup
    const gui = new GUI();
    const colorsFolder = gui.addFolder("Colors");
    colorsFolder
      .add(params, "red", 0, 1)
      .onChange((value: any) => (uniforms.u_red.value = value));
    colorsFolder
      .add(params, "green", 0, 1)
      .onChange((value: any) => (uniforms.u_green.value = value));
    colorsFolder
      .add(params, "blue", 0, 1)
      .onChange((value: any) => (uniforms.u_blue.value = value));

    const bloomFolder = gui.addFolder("Bloom");
    bloomFolder
      .add(params, "threshold", 0, 1)
      .onChange((value: any) => (bloomPass.threshold = value));
    bloomFolder
      .add(params, "strength", 0, 3)
      .onChange((value: any) => (bloomPass.strength = value));
    bloomFolder
      .add(params, "radius", 0, 1)
      .onChange((value: any) => (bloomPass.radius = value));

    // Handle mouse movement
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / 100;
      mouseY = (e.clientY - windowHalfY) / 100;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.5;
      camera.lookAt(scene.position);

      uniforms.u_time.value = clock.getElapsedTime();

      // Update the amplitude uniform if the materialRef is available
      if (materialRef.current) {
        materialRef.current.uniforms.u_amplitude.value = amplitude;
      }

      composer.render();
      requestAnimationFrame(animate);
    };
    animate();

    // Resize handling
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      gui.destroy();
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []); // Only set up the scene once, don't re-run on amplitude change

  // Update shader uniform when amplitude changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_amplitude.value = amplitude;
    }
  }, [amplitude]);

  return <div ref={mountRef} />;
};

export default PerlinNoiseShader;
