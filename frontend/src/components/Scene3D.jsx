import React, { useRef, useMemo, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function FloatingShape({ position, geometry, color, speed, rotationSpeed }) {
  const meshRef = useRef();
  const elapsed = useRef(0);
  
  useFrame((_, delta) => {
    elapsed.current += delta;
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed * 0.01;
      meshRef.current.rotation.y += rotationSpeed * 0.015;
      meshRef.current.position.y = position[1] + Math.sin(elapsed.current * speed) * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.15}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const shapes = useMemo(() => [
    { position: [-6, 3, -10], geometry: <torusGeometry args={[1.5, 0.4, 8, 20]} />, color: '#00f0ff', speed: 1, rotationSpeed: 0.5 },
    { position: [7, -2, -12], geometry: <icosahedronGeometry args={[1.5, 0]} />, color: '#bf00ff', speed: 0.8, rotationSpeed: 0.7 },
    { position: [-4, -3, -8], geometry: <octahedronGeometry args={[1.2, 0]} />, color: '#ff0080', speed: 1.2, rotationSpeed: 0.6 },
    { position: [5, 4, -15], geometry: <torusKnotGeometry args={[1, 0.3, 50, 8]} />, color: '#00f0ff', speed: 0.6, rotationSpeed: 0.4 },
    { position: [0, -4, -10], geometry: <dodecahedronGeometry args={[1.3, 0]} />, color: '#bf00ff', speed: 0.9, rotationSpeed: 0.8 },
    { position: [-7, 0, -14], geometry: <boxGeometry args={[1.5, 1.5, 1.5]} />, color: '#ff0080', speed: 0.7, rotationSpeed: 0.5 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} color="#00f0ff" intensity={0.5} />
      <pointLight position={[-10, -10, 5]} color="#bf00ff" intensity={0.3} />
      <pointLight position={[0, 10, -5]} color="#ff0080" intensity={0.2} />
      
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <fog attach="fog" args={['#0a0a1a', 5, 25]} />
      
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
    </>
  );
}

export default function Scene3D() {
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    pointerEvents: 'none',
  };

  return (
    <ErrorBoundary>
      <div style={containerStyle}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}
