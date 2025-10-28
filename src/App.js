import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import CarModels from './components/CarModels';
import CarModels1 from './components/CarModels1';
import './App.css';
import Code from './components/Code';
import Contact from './components/Contact';

function App() {
  const [loading, setLoading] = useState(true);

  // Static background color
  const staticBackgroundColor = '#ffffffff';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

 
  return (
    <div className="App">
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          <Navbar />
          
          {/* Three.js Canvas Section - Fixed Height */}
          <div
            id="home"
            className="canvas-container"
            style={{
              backgroundColor: staticBackgroundColor,
              height: '100vh',
              width: '100%',
              margin: 0,
              padding: 0,
              position: 'relative',
            }}
          >
            <CarModels backgroundColor={staticBackgroundColor} />
          </div>
          
          {/* HTML Content Section - Separate from Canvas */}
          <div 
            className="content-section"
            style={{
              backgroundColor: '#1e1c1cff', // Different background to separate from canvas
              position: 'relative',
              zIndex: 2,
              minHeight: '100vh',
              width: '100%',
            }}
          >
            {/* Skills Section */}
            
            {/* Other Components */}
            
            <CarModels1 />
            
            <div id="skills">
              <Code/>
            </div>
    
            
            {/* Contact Section */}
            <div id="contact">
              <Contact />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;