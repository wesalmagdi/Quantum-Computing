'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { getBlochCoordinates } from '@/lib/quantum';

function SphereContent({ theta, phi }: { theta: number; phi: number }) {
  const coords = useMemo(() => getBlochCoordinates(theta, phi), [theta, phi]);
  const vec = useMemo(() => new THREE.Vector3(coords.x, coords.y, coords.z), [coords]);

  const equatorPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(a), 0, Math.sin(a)]);
    }
    return pts;
  }, []);

  const meridianPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI;
      pts.push([0, Math.cos(a), Math.sin(a)]);
    }
    return pts;
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 4, 2]} intensity={0.5} />

      <mesh>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial wireframe color="#3b3b5c" transparent opacity={0.18} />
      </mesh>

      <Line points={equatorPoints} color="#3b3b5c" lineWidth={0.5} />
      <Line points={meridianPoints} color="#3b3b5c" lineWidth={0.5} />

      <Line points={[[-1.3, 0, 0], [1.3, 0, 0]]} color="#444" lineWidth={1} />
      <Line points={[[0, -1.3, 0], [0, 1.3, 0]]} color="#444" lineWidth={1} />
      <Line points={[[0, 0, -1.3], [0, 0, 1.3]]} color="#444" lineWidth={1} />

      <Html position={[1.35, 0, 0]} center>
        <span style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>X</span>
      </Html>
      <Html position={[0, 0, 1.35]} center>
        <span style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>Y</span>
      </Html>
      <Html position={[0, 1.35, 0]} center>
        <span style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>Z</span>
      </Html>

      <Html position={[0, 1.18, 0]} center>
        <span style={{ color: '#00d4ff', fontSize: '15px', fontWeight: 700, textShadow: '0 0 12px rgba(0,212,255,0.3)' }}>|0⟩</span>
      </Html>
      <Html position={[0, -1.18, 0]} center>
        <span style={{ color: '#ff00aa', fontSize: '15px', fontWeight: 700, textShadow: '0 0 12px rgba(255,0,170,0.3)' }}>|1⟩</span>
      </Html>

      <Line points={[[0, 0, 0], [coords.x, coords.y, coords.z]]} color="#ff6b35" lineWidth={2} />

      <mesh position={vec}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.5}
        />
      </mesh>

      <OrbitControls enablePan={false} minDistance={1.8} maxDistance={4.5} />
    </>
  );
}

export default function BlochSphere({ theta, phi }: { theta: number; phi: number }) {
  return (
    <div className="w-full h-[420px] md:h-[500px]">
      <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}>
        <SphereContent theta={theta} phi={phi} />
      </Canvas>
    </div>
  );
}
