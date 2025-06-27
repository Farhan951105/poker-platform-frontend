
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const PokerChip = () => {
  const chipRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (chipRef.current) {
      chipRef.current.rotation.y += delta * 0.2;
      chipRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={chipRef}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[1, 1, 0.2, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.1} />
      </mesh>
      <Text
        position={[0, 0.11, 0]}
        rotation-x={-Math.PI / 2}
        fontSize={0.5}
        color="hsl(var(--primary))"
        anchorX="center"
        anchorY="middle"
      >
        ♠
      </Text>
      <Text
        position={[0, -0.11, 0]}
        rotation-x={Math.PI / 2}
        rotation-y={Math.PI}
        fontSize={0.5}
        color="hsl(var(--primary))"
        anchorX="center"
        anchorY="middle"
      >
        ♠
      </Text>
    </group>
  );
};

export default PokerChip;
