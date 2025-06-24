'use client'

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

// 高専データの型定義
type KosenLocation = {
  id: string;
  name: string;
  position: [number, number, number];
  prefecture: string;
  established: number;
};

const JapanMap3D = () => {
  const [selectedKosen, setSelectedKosen] = useState<KosenLocation | null>(null);
  
  // 高専位置データ（例）
  const kosenLocations: KosenLocation[] = [
    { id: '1', name: '東京高専', position: [139.7, 35.7, 0], prefecture: '東京都', established: 1965 },
    // 他の高専データを追加...
  ];

  // 3Dピンコンポーネント
  const Pin = ({ kosen }: { kosen: KosenLocation }) => {
    const ref = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.y += 0.01;
      }
    });

    return (
      <mesh
        ref={ref}
        position={kosen.position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={() => setSelectedKosen(kosen)}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 32]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'red'} />
        {hovered && (
          <Html distanceFactor={10}>
            <div className="bg-white p-2 rounded shadow-lg">
              {kosen.name}
            </div>
          </Html>
        )}
      </mesh>
    );
  };

  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {kosenLocations.map((kosen) => (
          <Pin key={kosen.id} kosen={kosen} />
        ))}
        <OrbitControls />
      </Canvas>
      
      {selectedKosen && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold">{selectedKosen.name}</h3>
          <p>所在地: {selectedKosen.prefecture}</p>
          <p>設立年: {selectedKosen.established}年</p>
        </div>
      )}
    </div>
  );
};

export default JapanMap3D; 