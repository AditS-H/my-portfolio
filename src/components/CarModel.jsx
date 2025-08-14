import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CarModel({ scrollProgress }) {
  const { scene, nodes, materials } = useGLTF('/new_car1.glb');
  const groupRef = useRef();
  const carParts = useRef({});
  const originalTransforms = useRef({});
  
  // Constants
  const BACKGROUND_COLOR = '#0d0d0d';
  const FIXED_SCALE = 1.5;
  const FIXED_POSITION_Y = -0.5;
  const OFF_SCREEN_DISTANCE = 25;

  // Animation configuration for different part types
  const animationConfig = useMemo(() => ({
    tire: { startProgress: 0.1, duration: 0.2 },
    alloy: { startProgress: 0.15, duration: 0.2 },
    glass: { startProgress: 0.3, duration: 0.2 },
    chrome: { startProgress: 0.4, duration: 0.2 },
    lights: { startProgress: 0.5, duration: 0.2 },
    license: { startProgress: 0.6, duration: 0.2 },
    stickers: { startProgress: 0.7, duration: 0.2 },
    body: { startProgress: 0.8, duration: 0.3 }, // Body parts disappear last
    other: { startProgress: 0.75, duration: 0.2 }
  }), []);

  // Body parts that should never move
  const bodyParts = useMemo(() => new Set([
    // Remove this - we want body parts to animate now
  ]), []);

  // Utility functions
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const hashCode = (str) => str.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  // Initialize car parts and store original transforms
  useEffect(() => {
    console.log('=== CAR MODEL INITIALIZATION ===');
    console.log('Available nodes:', Object.keys(nodes));
    console.log('Scene children count:', scene.children.length);
    
    // Clear previous references
    carParts.current = {};
    originalTransforms.current = {};
    
    // Traverse scene and categorize parts
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name;
        const lowerName = name.toLowerCase();
        
        console.log(`Processing mesh: "${name}"`);
        
        // Store mesh reference
        carParts.current[name] = child;
        
        // Store original transforms
        originalTransforms.current[name] = {
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone()
        };
        
        // Set up background elements
        if (lowerName.includes('plane') || lowerName.includes('floor') || lowerName.includes('shadow')) {
          if (child.material && child.material.color) {
            child.material = child.material.clone();
            child.material.color.set(BACKGROUND_COLOR);
            console.log('✅ Updated background mesh color:', child.name);
          }
        }
        
        // Ensure part is visible initially
        child.visible = true;
      }
    });
    
    console.log('Total parts initialized:', Object.keys(carParts.current).length);
    console.log('=== INITIALIZATION COMPLETE ===');
  }, [scene, nodes, BACKGROUND_COLOR]);

  // Get animation config for a part based on its name
  const getPartConfig = (name) => {
    const lowerName = name.toLowerCase();
    
    // Body parts animate last
    if (lowerName.includes('plane041') || 
        lowerName.includes('plane045') || 
        lowerName.includes('plane050') || 
        lowerName.includes('plane049') || 
        lowerName.includes('cube001') ||
        lowerName.includes('body') ||
        lowerName.includes('chassis') ||
        lowerName.includes('frame') ||
        (name.includes('Plane') && !lowerName.includes('glass') && !lowerName.includes('chrome') && !lowerName.includes('license'))) {
      return animationConfig.body; // Body parts animate last
    }
    
    if (lowerName.includes('cylinder') && lowerName.includes('tire')) {
      return animationConfig.tire;
    } else if (lowerName.includes('cylinder') && lowerName.includes('alloy')) {
      return animationConfig.alloy;
    } else if (lowerName.includes('glass')) {
      return animationConfig.glass;
    } else if (lowerName.includes('chrome')) {
      return animationConfig.chrome;
    } else if (lowerName.includes('headlights') || lowerName.includes('orange_glass') || lowerName.includes('red_glass')) {
      return animationConfig.lights;
    } else if (lowerName.includes('license')) {
      return animationConfig.license;
    } else if (lowerName.includes('stickers')) {
      return animationConfig.stickers;
    } else {
      return animationConfig.other;
    }
  };

  // Calculate new position for animated parts
  const calculateNewPosition = (name, originalPos, easedProgress) => {
    const lowerName = name.toLowerCase();
    const newPos = originalPos.clone();
    
    // Check if this is a body part
    const isBodyPart = lowerName.includes('plane041') || 
                      lowerName.includes('plane045') || 
                      lowerName.includes('plane050') || 
                      lowerName.includes('plane049') || 
                      lowerName.includes('cube001') ||
                      lowerName.includes('body') ||
                      lowerName.includes('chassis') ||
                      lowerName.includes('frame') ||
                      (name.includes('Plane') && !lowerName.includes('glass') && !lowerName.includes('chrome') && !lowerName.includes('license'));
    
    if (isBodyPart) {
      // Body parts fade out in place
      newPos.y -= easedProgress * 2; // Slight downward movement
      return { position: newPos, rotation: 0 };
    }
    
    if (lowerName.includes('tire') || lowerName.includes('alloy')) {
      // Wheels roll in different directions
      const wheelIndex = parseInt(name.match(/\d+/)?.[0]) || 0;
      const direction = wheelIndex % 2 === 0 ? -1 : 1;
      newPos.x += easedProgress * OFF_SCREEN_DISTANCE * direction;
      newPos.y -= easedProgress * 8;
      return { position: newPos, rotation: easedProgress * Math.PI * 6 * direction };
    } 
    else if (lowerName.includes('glass')) {
      // Glass parts fly upward
      newPos.y += easedProgress * OFF_SCREEN_DISTANCE * 1.5;
      newPos.z += easedProgress * OFF_SCREEN_DISTANCE * 0.5;
    }
    else if (lowerName.includes('chrome')) {
      // Chrome parts fly outward
      const hash = hashCode(name);
      const direction = hash % 2 === 0 ? -1 : 1;
      newPos.x += easedProgress * OFF_SCREEN_DISTANCE * direction;
      newPos.y += easedProgress * OFF_SCREEN_DISTANCE * 0.8;
    }
    else if (lowerName.includes('headlights') || lowerName.includes('orange_glass') || lowerName.includes('red_glass')) {
      // Lights fly forward/backward
      const direction = lowerName.includes('plane039') || lowerName.includes('plane053') ? 1 : -1;
      newPos.z += easedProgress * OFF_SCREEN_DISTANCE * direction;
      newPos.y += easedProgress * OFF_SCREEN_DISTANCE * 0.5;
    }
    else {
      // Other parts fly in pseudo-random directions
      const hash = hashCode(name);
      const xDir = (hash % 200) / 100 - 1;
      const yDir = Math.abs((hash * 7) % 100) / 100 + 0.5;
      const zDir = ((hash * 13) % 200) / 100 - 1;
      
      newPos.x += xDir * easedProgress * OFF_SCREEN_DISTANCE;
      newPos.y += yDir * easedProgress * OFF_SCREEN_DISTANCE;
      newPos.z += zDir * easedProgress * OFF_SCREEN_DISTANCE;
    }
    
    return { position: newPos, rotation: 0 };
  };

  // Main animation function
  const animateCarDisassembly = (progress) => {
    const clampedProgress = clamp(progress, 0, 1);
    
    Object.entries(carParts.current).forEach(([name, part]) => {
      if (!part || !originalTransforms.current[name]) return;
      
      const originalTransform = originalTransforms.current[name];
      
      // Get animation configuration for this part
      const config = getPartConfig(name);
      const partProgress = clamp((clampedProgress - config.startProgress) / config.duration, 0, 1);
      
      if (clampedProgress >= config.startProgress && partProgress > 0) {
        const easedProgress = easeOutCubic(partProgress);
        const newTransform = calculateNewPosition(name, originalTransform.position, easedProgress);
        
        // Apply new position
        part.position.copy(newTransform.position);
        
        // Apply rotation if specified (for wheels)
        if (newTransform.rotation !== 0) {
          part.rotation.z = originalTransform.rotation.z + newTransform.rotation;
        } else {
          part.rotation.copy(originalTransform.rotation);
        }
        
        // Hide parts when they're far enough away
        part.visible = easedProgress <= 0.9;
      } else {
        // Reset to original position
        part.position.copy(originalTransform.position);
        part.rotation.copy(originalTransform.rotation);
        part.scale.copy(originalTransform.scale);
        part.visible = true;
      }
    });
  };

  // Animation frame loop
  useFrame(() => {
    if (!groupRef.current || !scene) return;
    
    // Only lock the Y position and scale, preserve user rotation
    groupRef.current.position.y = FIXED_POSITION_Y;
    groupRef.current.scale.set(FIXED_SCALE, FIXED_SCALE, FIXED_SCALE);
    
    // Animate based on scroll progress
    animateCarDisassembly(scrollProgress);
  });

  return (
    <group ref={groupRef} scale={FIXED_SCALE} position={[0, FIXED_POSITION_Y, 0]}>
      <primitive 
        object={scene} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
        scale={[1, 1, 1]}
      />
    </group>
  );
}

export default CarModel;