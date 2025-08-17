import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Stage } from '@react-three/drei';

function CarModel() {
  const { scene } = useGLTF('https://cors.io/?https://github.com/AditS-H/my-portfolio/releases/download/v1.0.0/new_car1.glb')
  const backgroundColor = '#0d0d0d'; // Static color for floor/plane/shadow parts

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (name.includes('plane') || name.includes('floor') || name.includes('shadow')) {
          if (child.material && child.material.color) {
            child.material = child.material.clone();
            child.material.color.set(backgroundColor);
            console.log('✅ Updated background mesh color:', child.name);
          }
        }
      }
    });
  }, [scene]);

  return (
    <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} />
  );
}

function Loader() {
  return (
    <Html center>
      <div style={{ 
        color: 'yellow',
        fontWeight: 'bolder',
        fontSize: '1.5rem',
        fontFamily: 'monospace',
        textShadow: '2px 2px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black' 
      }}>
        Loading car model...
      </div>
    </Html>
  );
}

export default function CarModels() {
 
  useEffect(() => {
    const audio = new Audio('car_bg.mp3'); // Make sure the file is in public/
    audio.loop = true;
    audio.volume = 0.5;

    // Try to play when user allows
    const playAudio = () => {
      audio.play();
      window.removeEventListener('click', playAudio);
    };

    window.addEventListener('click', playAudio);
    return () => {
      window.removeEventListener('click', playAudio);
      audio.pause();
    };
  }, []);


  return (
    <div>
      <div
        className="app-container"
        style={{
          height: '100vh',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Suspense fallback={<Loader />}>
            <Stage environment="city" intensity={1} contactShadow={false}>
              <CarModel />
            </Stage>
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>

      
    </div>
  );
}