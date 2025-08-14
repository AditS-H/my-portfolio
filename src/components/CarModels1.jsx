// CarModels.jsx
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Stage } from '@react-three/drei';
import { useScrollPosition } from './ScrollController';
import CarModel from './CarModel';
import './CarModels1.css'; // Assuming you have a CSS file for styles

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
  const { scrollProgress } = useScrollPosition();
  
  useEffect(() => {
    const audio = new Audio('car_bg.mp3');
    audio.loop = true;
    audio.volume = 0.5;

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

  const [trigger, setTrigger] = useState(false);
  const threshold = 3550; // Set your desired scroll threshold in pixels
  const handleScroll = () => {
    console.log('Scroll position:', window.scrollY);
    if (window.scrollY > threshold) {
      setTrigger(true);
    } else {
      setTrigger(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  let displayvalue = trigger ? "none" : "initial";

  return (
    <div>
      <div
        className="car-canvas-container"
        style={{
          height: '100vh',
          maxHeight: '100vh',
          width: '100%',
          position: 'fixed', // Make the 3D car fixed as we scroll
          top: 0,
          left: 0,
          zIndex: 1,
          display: displayvalue, // Show or hide based on scroll
        }}
      >
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Suspense fallback={<Loader />}>
            <Stage environment="city" intensity={1} contactShadow={false}>
              <CarModel scrollProgress={scrollProgress} />
            </Stage>
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
      
      {/* Content sections that appear as you scroll */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* First section - empty space to show intact car */}
        <div style={{ height: '100vh' }}></div>
        
        {/* Body section */}
        <section className="car-section" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10%' }}>
          <div className="section-content" style={{ maxWidth: '500px', color: 'red' }}>
            <h2>I’m like the engine that powers a project</h2>
            <p> Provide the necessary drive and energy to keep things moving forward.</p>
            <p>My skills help ensure that progress is steady and tasks are completed with focus and dedication.</p>
          </div>
        </section>
        
        {/* Engine section */}
        <section className="car-section" style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10%' }}>
          <div className="section-content" style={{ maxWidth: '500px', color: 'red' }}>
               <h2>Like a brake, I know when to pause and reflect.  </h2>
              <p> This allows time to reassess and make sure we’re heading in the right direction.</p>
              <p>Taking a step back helps me make thoughtful decisions, ensuring progress </p>
          </div>
        </section>
        
        {/* More sections for other car parts */}
    
        
        <section className="car-section"   style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10%' }}>
          <div className="section-content" style={{ maxWidth: '500px', color: 'red' }}>
            <h2>My workflow is like a dual-clutch gearbox.</h2>
            <p> Swift transitions between tasks. Zero lag. Maximum efficiency.</p>
          </div>
        </section>

    <section className="car-section" 
     style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10%' }}>
          <div className="section-content">
  <div className="terminal-text">SYSTEM BOOT - OK</div>
  <div className="terminal-text">DRIVER ID - ADIT SHARMA</div>
  <div className="terminal-text">STATUS - RACE-READY</div>
  <p>Drive. Momentum. Precision.</p>
</div>

        </section>


      </div>
    </div>
  );
}