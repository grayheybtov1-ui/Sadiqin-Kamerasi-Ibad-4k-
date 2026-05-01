'use client';
// Force refresh 1.0


import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ParkSceneProps {
  onIncident: (type: string, data: any) => void;
  isAlertActive: boolean;
}

// --- STATIC COMPONENTS ---

const Flower = ({ position, isPicked }: { position: [number, number, number], isPicked: boolean }) => {
  if (isPicked) return null;
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ff4d4d" />
      </mesh>
      <mesh position={[0, 0.45, 0.1]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
};

const Tree = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.3, 3]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    <mesh position={[0, 3.5, 0]} castShadow>
      <sphereGeometry args={[1.2, 16, 16]} />
      <meshStandardMaterial color="#1b5e20" />
    </mesh>
  </group>
);

const Bench = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 0.1, 0.8]} />
      <meshStandardMaterial color="#795548" />
    </mesh>
    <mesh position={[0, 0.9, -0.35]} rotation={[0.2, 0, 0]} castShadow>
      <boxGeometry args={[2, 0.6, 0.1]} />
      <meshStandardMaterial color="#795548" />
    </mesh>
    {[[-0.8, 0.25, 0.3], [0.8, 0.25, 0.3], [-0.8, 0.25, -0.3], [0.8, 0.25, -0.3]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    ))}
  </group>
);

const LampPost = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 2, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.1, 4]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[0, 4, 0]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
    </mesh>
    <pointLight position={[0, 4, 0]} intensity={0.5} color="#ffd700" distance={10} />
  </group>
);

const Sidewalk = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[4, 100]} />
      <meshStandardMaterial color="#444" />
    </mesh>
    <mesh position={[-2, 0.05, 0]} receiveShadow>
      <boxGeometry args={[0.2, 0.1, 100]} />
      <meshStandardMaterial color="#666" />
    </mesh>
    <mesh position={[2, 0.05, 0]} receiveShadow>
      <boxGeometry args={[0.2, 0.1, 100]} />
      <meshStandardMaterial color="#666" />
    </mesh>
  </group>
);

const Bush = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.3, 0]} castShadow>
      <sphereGeometry args={[0.5, 12, 12]} />
      <meshStandardMaterial color="#2e7d32" />
    </mesh>
    <mesh position={[0.3, 0.2, 0.2]} castShadow>
      <sphereGeometry args={[0.4, 12, 12]} />
      <meshStandardMaterial color="#1b5e20" />
    </mesh>
  </group>
);

const Pond = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[4, 32]} />
      <meshStandardMaterial color="#0077be" transparent opacity={0.8} roughness={0.1} metalness={0.5} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <circleGeometry args={[4.5, 32]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  </group>
);

const Rock = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => (
  <mesh position={position} scale={scale} castShadow receiveShadow>
    <dodecahedronGeometry args={[0.5, 0]} />
    <meshStandardMaterial color="#757575" roughness={0.9} />
  </mesh>
);

const FlowerBed = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[1.5, 16]} />
      <meshStandardMaterial color="#3e2723" />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <group key={i} position={[Math.cos(i * 1.04) * 0.8, 0, Math.sin(i * 1.04) * 0.8]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.3]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#ffeb3b" : "#e91e63"} />
        </mesh>
      </group>
    ))}
  </group>
);

const TrashCan = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, 0.8, 0]}>
      <sphereGeometry args={[0.16, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  </group>
);

const Fence = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    {[0, 0.5, 1, 1.5, 2].map((x) => (
      <mesh key={x} position={[x - 1, 0.4, 0]} castShadow>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color="#4e342e" />
      </mesh>
    ))}
    <mesh position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[2.1, 0.05, 0.05]} />
      <meshStandardMaterial color="#4e342e" />
    </mesh>
  </group>
);

const Cloud = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x += Math.sin(state.clock.elapsedTime * 0.2 + position[0]) * 0.005;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.8, -0.2, 0.3]} castShadow>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.7, -0.1, -0.2]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const Slide = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 1, 0]} castShadow>
      <boxGeometry args={[0.1, 2, 0.1]} />
      <meshStandardMaterial color="#ff5722" />
    </mesh>
    <mesh position={[0.5, 2, 0]} castShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color="#ffc107" />
    </mesh>
    <mesh position={[1.5, 1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
      <boxGeometry args={[3, 0.1, 0.8]} />
      <meshStandardMaterial color="#03a9f4" />
    </mesh>
  </group>
);

const Fountain = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh receiveShadow castShadow>
      <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
      <meshStandardMaterial color="#999" />
    </mesh>
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[0.8, 1, 0.2, 32]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    <mesh position={[0, 1.5, 0]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#4fc3f7" transparent opacity={0.8} />
    </mesh>
  </group>
);

const Swings = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[-1, 1.5, 0]} castShadow>
      <boxGeometry args={[0.1, 3, 0.1]} />
      <meshStandardMaterial color="#555" />
    </mesh>
    <mesh position={[1, 1.5, 0]} castShadow>
      <boxGeometry args={[0.1, 3, 0.1]} />
      <meshStandardMaterial color="#555" />
    </mesh>
    <mesh position={[0, 3, 0]} castShadow>
      <boxGeometry args={[2.2, 0.1, 0.1]} />
      <meshStandardMaterial color="#555" />
    </mesh>
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.6, 0.05, 0.3]} />
      <meshStandardMaterial color="#ff9800" />
    </mesh>
    <mesh position={[-0.25, 1.75, 0]}>
      <boxGeometry args={[0.02, 2.5, 0.02]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    <mesh position={[0.25, 1.75, 0]}>
      <boxGeometry args={[0.02, 2.5, 0.02]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  </group>
);

const Gazebo = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh receiveShadow castShadow>
      <cylinderGeometry args={[2.5, 2.5, 0.2, 8]} />
      <meshStandardMaterial color="#ddd" />
    </mesh>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <mesh key={i} position={[2.2 * Math.cos(i * Math.PI / 4), 1.25, 2.2 * Math.sin(i * Math.PI / 4)]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    ))}
    <mesh position={[0, 3, 0]} castShadow>
      <coneGeometry args={[3, 1.5, 8]} />
      <meshStandardMaterial color="#4e342e" />
    </mesh>
  </group>
);

const Sun = () => (
  <group position={[30, 40, -40]}>
    <mesh>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial color="#fffde7" />
    </mesh>
    <mesh scale={1.2}>
      <sphereGeometry args={[4.2, 32, 32]} />
      <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
    </mesh>
    <pointLight intensity={5} distance={100} color="#fffde7" />
  </group>
);

const BicycleRack = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    {[0, 0.4, 0.8, 1.2, 1.6].map((x) => (
      <mesh key={x} position={[x - 0.8, 0.3, 0]} castShadow>
        <torusGeometry args={[0.3, 0.03, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#777" />
      </mesh>
    ))}
  </group>
);

const RegulationSign = ({ position, rotation = [0, 0, 0], type = "grass" }: { position: [number, number, number], rotation?: [number, number, number], type?: "grass" | "smoking" }) => (
  <group position={position} rotation={rotation}>
    {/* Post */}
    <mesh position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[0.05, 1.2, 0.05]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    {/* Board */}
    <group position={[0, 1.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.45, 0.03, 0.01]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {type === "grass" ? (
        <Text position={[0, -0.15, 0.03]} fontSize={0.06} color="black" fontWeight="bold">
          OTA BASMA!
        </Text>
      ) : (
        <Text position={[0, -0.15, 0.03]} fontSize={0.06} color="black" fontWeight="bold">
          SİQARET QADAĞANDIR
        </Text>
      )}
      {/* Icon simplified */}
      {type === "smoking" && (
        <mesh position={[-0.05, 0.05, 0.03]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.15, 0.03, 0.01]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}
    </group>
  </group>
);

const Swing = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => {
  const seatRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (seatRef.current) {
      // Harmonic motion for swing: oscillate on X-axis rotation
      const angle = Math.sin(state.clock.elapsedTime * 1.5) * 0.4;
      seatRef.current.rotation.x = angle;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Frame: Two vertical legs and one top bar */}
      <mesh position={[-1, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[1, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Swinging Assembly: Pivots from the top bar */}
      <group position={[0, 3, 0]} ref={seatRef}>
        {/* Chains */}
        <mesh position={[-0.4, -1, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 2]} />
          <meshStandardMaterial color="#999" metalness={1} />
        </mesh>
        <mesh position={[0.4, -1, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 2]} />
          <meshStandardMaterial color="#999" metalness={1} />
        </mesh>

        {/* Seat & Person */}
        <group position={[0, -2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1, 0.05, 0.4]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>

          {/* Simplified Person Model sitting on the seat */}
          <group position={[0, 0.1, 0]}>
            {/* Torso */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <sphereGeometry args={[0.12]} />
              <meshStandardMaterial color="#ffdbac" />
            </mesh>
            {/* Legs (bent for sitting) */}
            <mesh position={[-0.1, -0.1, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
              <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
            <mesh position={[0.1, -0.1, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
              <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

const YellowZone = ({ position }: { position: [number, number, number] }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
    <planeGeometry args={[6, 6]} />
    <meshStandardMaterial color="#ffd600" transparent opacity={0.4} />
  </mesh>
);

const Trash = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* Detection Box for Trash */}
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#ff0000" wireframe transparent opacity={0.3} />
    </mesh>
    <Text position={[0, 0.5, 0]} fontSize={0.12} color="#ff0000" fontWeight="bold">
      ZİBİL
    </Text>
  </group>
);

const StonePath = ({ start, end, count = 10 }: { start: [number, number], end: [number, number], count?: number }) => {
  const stones = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const jitterX = (Math.random() - 0.5) * 1.2;
      const jitterZ = (Math.random() - 0.5) * 1.2;
      arr.push({
        x: start[0] + (end[0] - start[0]) * t + jitterX,
        z: start[1] + (end[1] - start[1]) * t + jitterZ,
        rotation: Math.random() * Math.PI,
        size: 0.3 + Math.random() * 0.2
      });
    }
    return arr;
  }, [start, end, count]);

  return (
    <group>
      {stones.map((s, i) => (
        <mesh key={i} position={[s.x, 0.02, s.z]} rotation={[-Math.PI / 2, 0, s.rotation]}>
          <circleGeometry args={[s.size, 8]} />
          <meshStandardMaterial color="#555" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

const SecurityCameraModel = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => (
  <group position={position} rotation={rotation}>
    <mesh castShadow>
      <boxGeometry args={[0.4, 0.4, 0.8]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, -0.4, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.8]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  </group>
);

// --- CHARACTER COMPONENTS ---

const PassivePerson = ({
  position,
  rotation = [0, 0, 0],
  color = "#3b82f6",
  type = "standing",
  speed = 0.02,
  onThrowTrash,
  isSmoking = false,
  onSmokingDetected
}: {
  position: [number, number, number],
  rotation?: [number, number, number],
  color?: string,
  type?: "standing" | "walking" | "sitting",
  speed?: number,
  onThrowTrash?: (pos: [number, number, number]) => void,
  isSmoking?: boolean,
  onSmokingDetected?: () => void
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const smokingFiredRef = useRef(false);
  const smokeRef = useRef<THREE.Mesh>(null);
  const direction = useRef(position[2] > 0 ? -1 : 1);
  const [hasThrown, setHasThrown] = useState(false);
  const [isViolated, setIsViolated] = useState(false);
  const humanId = React.useMemo(() => Math.floor(Math.random() * 900) + 100, []);

  useFrame((state) => {
    if (smokeRef.current && isSmoking) {
      const mat = smokeRef.current.material as THREE.MeshStandardMaterial;
      smokeRef.current.position.y += 0.015;
      smokeRef.current.position.z += Math.sin(state.clock.elapsedTime * 4) * 0.005;
      smokeRef.current.scale.multiplyScalar(1.03);
      mat.opacity *= 0.97;
      if (mat.opacity < 0.01) {
        smokeRef.current.position.y = 0.05;
        smokeRef.current.position.z = 0.15;
        smokeRef.current.scale.set(1, 1, 1);
        mat.opacity = 0.7;
      }
    }

    if (type === "walking" && meshRef.current) {
      const time = state.clock.elapsedTime * 5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(time) * 0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time) * 0.4;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(time) * 0.5;

      meshRef.current.position.z += direction.current * speed;

      if (isSmoking && onSmokingDetected && !smokingFiredRef.current && Math.abs(meshRef.current.position.z) < 5) {
        smokingFiredRef.current = true;
        onSmokingDetected();
        setIsViolated(true);
      }

      if (onThrowTrash && !hasThrown && Math.abs(meshRef.current.position.z - 10) < 0.5) {
        setHasThrown(true);
        onThrowTrash([meshRef.current.position.x, 0.1, meshRef.current.position.z]);
        setIsViolated(true);
      }

      if (Math.abs(meshRef.current.position.z) > 50) {
        meshRef.current.position.z = -direction.current * 50;
        setHasThrown(false);
        setIsViolated(false);
        smokingFiredRef.current = false;
      }
      meshRef.current.rotation.y = direction.current > 0 ? 0 : Math.PI;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Detection Box */}
      <mesh position={[0, type === "sitting" ? 0.7 : 1.0, 0]}>
        <boxGeometry args={[1.0, type === "sitting" ? 1.5 : 2.1, 1.0]} />
        <meshStandardMaterial color={isViolated ? "#ff0000" : "#00ff00"} wireframe transparent opacity={isViolated ? 0.4 : 0.15} />
      </mesh>
      <Text position={[0, type === "sitting" ? 1.6 : 2.2, 0]} fontSize={0.18} color={isViolated ? "#ff0000" : "#00ff00"} fontWeight="bold">
        {isViolated ? "QAYDA POZUNTUSU" : `HUMAN_ID_${humanId}`}
      </Text>

      {/* Torso */}
      <mesh position={[0, type === "sitting" ? 0.8 : 1.2, type === "sitting" ? -0.1 : 0]} castShadow>
        <boxGeometry args={[0.45, 0.7, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <group position={[0, type === "sitting" ? 1.35 : 1.75, type === "sitting" ? -0.1 : 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        <mesh position={[-0.07, 0.04, 0.16]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.07, 0.04, 0.16]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        {isSmoking && (
          <group position={[0.08, -0.05, 0.15]} rotation={[0.2, 0.4, 0]}>
            {/* Cigarette Body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.15]} />
              <meshStandardMaterial color="white" />
            </mesh>
            {/* Filter */}
            <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.05]} />
              <meshStandardMaterial color="#ffa000" />
            </mesh>
            {/* Glowing Ember Tip */}
            <mesh position={[0, 0, 0.075]}>
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshStandardMaterial color="#ff3300" emissive="#ff0000" emissiveIntensity={5} />
              <pointLight color="#ff3300" intensity={0.2} distance={0.5} />
            </mesh>
            {/* Enhanced Smoke Particle */}
            <mesh ref={smokeRef} position={[0, 0.05, 0.15]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} depthWrite={false} />
            </mesh>
          </group>
        )}
      </group>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.3, type === "sitting" ? 0.9 : 1.3, type === "sitting" ? -0.1 : 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.3, type === "sitting" ? 0.9 : 1.3, type === "sitting" ? -0.1 : 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef}
        position={[-0.12, type === "sitting" ? 0.55 : 0.4, type === "sitting" ? 0.3 : 0]}
        rotation={type === "sitting" ? [-Math.PI / 2.2, 0, 0] : [0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.7, 4, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh ref={rightLegRef}
        position={[0.12, type === "sitting" ? 0.55 : 0.4, type === "sitting" ? 0.3 : 0]}
        rotation={type === "sitting" ? [-Math.PI / 2.2, 0, 0] : [0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.7, 4, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
};

interface PersonProps {
  position: [number, number, number];
  target: [number, number, number];
  onReachTarget: (reason?: string) => void;
  isBending: boolean;
  hasFlower: boolean;
  isViolated?: boolean;
}

const Person = ({ position, target, onReachTarget, isBending, hasFlower, isViolated }: PersonProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const [reached, setReached] = useState(false);
  const reachedRef = useRef(false);

  useEffect(() => {
    setReached(false);
    reachedRef.current = false;
  }, [target]);

  useFrame((state, delta) => {
    if (!meshRef.current || reachedRef.current) return;

    if (isBending) {
      meshRef.current.position.y = 0;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      return;
    }

    const currentPos = meshRef.current.position;
    const targetVector = new THREE.Vector3(target[0], 0, target[2]);
    const distance = currentPos.distanceTo(targetVector);

    if (distance > 0.1) {
      const direction = targetVector.clone().sub(currentPos).normalize();
      currentPos.x += direction.x * delta * 2.2;
      currentPos.z += direction.z * delta * 2.2;
      meshRef.current.rotation.set(0, Math.atan2(direction.x, direction.z), 0);

      if (Math.abs(currentPos.x) > 2) onReachTarget('grass');

      const time = state.clock.elapsedTime * 8;
      meshRef.current.position.y = Math.abs(Math.sin(time)) * 0.15;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(time) * 0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(time) * 0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time) * 0.4;

    } else if (!reachedRef.current && target[0] !== 0) {
      reachedRef.current = true;
      setReached(true);
      onReachTarget('target');
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.2, 2.4, 1.2]} />
        <meshStandardMaterial color={isViolated ? "#ff0000" : "#00ff00"} wireframe transparent opacity={0.4} />
      </mesh>
      <Text position={[0, 2.5, 0]} fontSize={0.2} color={isViolated ? "#ff0000" : "#00ff00"} fontWeight="bold">
        {isViolated ? "QAYDA POZUNTUSU" : "MÜŞAHİDƏ: HUMAN_042"}
      </Text>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.7, 0.25]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <group position={[0, 1.75, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        <mesh position={[-0.07, 0.04, 0.16]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.07, 0.04, 0.16]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
      <mesh ref={leftArmRef} position={[-0.3, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh ref={rightArmRef} position={[0.3, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#3b82f6" />
        {hasFlower && (
          <group position={[0, -0.25, 0.1]} rotation={[0.5, 0, 0]}>
            <mesh castShadow><cylinderGeometry args={[0.01, 0.01, 0.3]} /><meshStandardMaterial color="#2d5a27" /></mesh>
            <mesh position={[0, 0.15, 0]} castShadow><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color="#ff4d4d" /></mesh>
          </group>
        )}
      </mesh>
      <mesh ref={leftLegRef} position={[-0.12, 0.4, 0]} castShadow><capsuleGeometry args={[0.08, 0.7, 4, 8]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh ref={rightLegRef} position={[0.12, 0.4, 0]} castShadow><capsuleGeometry args={[0.08, 0.7, 4, 8]} /><meshStandardMaterial color="#222" /></mesh>
    </group>
  );
};

// --- MAIN COMPONENTS ---

function SceneContent({
  onIncident, isAlertActive, personTarget, setPersonTarget,
  isFlowerPicked, setIsFlowerPicked, isBending, setIsBending,
  hasEnteredGrass, setHasEnteredGrass, trashItems, setTrashItems
}: any) {
  const { gl } = useThree();
  const grassFiredRef = useRef(false);

  const vegetation = React.useMemo(() => {
    const treesL = [...Array(20)].map((_, i) => ({
      pos: [-15 - Math.random() * 20, 0, (i - 10) * 5 + (Math.random() - 0.5) * 5] as [number, number, number],
      scale: 1 + Math.random() * 0.5
    }));
    const treesR = [...Array(20)].map((_, i) => ({
      pos: [15 + Math.random() * 20, 0, (i - 10) * 5 + (Math.random() - 0.5) * 5] as [number, number, number],
      scale: 1 + Math.random() * 0.5
    }));
    const bushesL = [...Array(15)].map((_, i) => ({
      pos: [-10 - Math.random() * 5, 0, (i - 7) * 6] as [number, number, number]
    }));
    const bushesR = [...Array(15)].map((_, i) => ({
      pos: [10 + Math.random() * 5, 0, (i - 7) * 6] as [number, number, number]
    }));
    const rocks = [
      { pos: [-12, 0, -5] as [number, number, number], scale: 1.5 },
      { pos: [14, 0, 8] as [number, number, number], scale: 1.2 },
      { pos: [-18, 0, 15] as [number, number, number], scale: 2 }
    ];
    const flowerBeds = [
      { pos: [-8, 0, -15] as [number, number, number] },
      { pos: [12, 0, -18] as [number, number, number] },
      { pos: [-15, 0, 20] as [number, number, number] }
    ];
    const scatteredFlowers = [...Array(50)].map((_, i) => {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (5 + Math.random() * 20);
      return {
        pos: [x, 0, (Math.random() - 0.5) * 90] as [number, number, number],
        color: i % 3 === 0 ? "#ff4d4d" : i % 3 === 1 ? "#ffeb3b" : "#e91e63"
      };
    });
    const paths = [
      { start: [-2.8, -12] as [number, number], end: [-25, -12] as [number, number], count: 12 },
      { start: [2.8, 18] as [number, number], end: [20, 18] as [number, number], count: 12 },
      { start: [2.8, -18] as [number, number], end: [18, -18] as [number, number], count: 10 },
      { start: [-2.8, 8] as [number, number], end: [-20, 8] as [number, number], count: 10 }
    ];
    return { treesL, treesR, bushesL, bushesR, rocks, flowerBeds, paths, scatteredFlowers };
  }, []);

  const takeScreenshot = () => {
    return gl.domElement.toDataURL('image/png');
  };

  const handleLittering = (pos: [number, number, number]) => {
    const randomOffset: [number, number, number] = [
      (Math.random() - 0.5) * 2,
      0,
      (Math.random() - 0.5) * 2
    ];
    const newPos: [number, number, number] = [
      pos[0] + randomOffset[0],
      pos[1],
      pos[2] + randomOffset[2]
    ];

    setTrashItems((prev: any) => [...prev, { id: Date.now(), pos: newPos }]);

    const screenshot = takeScreenshot();
    onIncident('ZİBİL ATMA (LITTERING)', {
      timestamp: new Date().toLocaleTimeString(),
      location: 'Sektor C - Piyada Yolu',
      confidence: 0.98,
      image: screenshot
    });
  };

  const flowerFiredRef = useRef(false);

  const handleReachFlower = () => {
    if (flowerFiredRef.current) return;
    flowerFiredRef.current = true;

    setIsBending(true);
    const screenshot = takeScreenshot();
    setTimeout(() => {
      setIsFlowerPicked(true);
      setIsBending(false);
      onIncident('BİTKİ ZONASINA ZİYAN VURMA', {
        timestamp: new Date().toLocaleTimeString(),
        location: 'Sektor B - Mərkəzi Gül Ləki',
        confidence: 0.99,
        image: screenshot
      });
      setTimeout(() => { setPersonTarget([0, 0, 25]); }, 1000);
    }, 1500);
  };

  const handleGrassEntry = () => {
    if (!hasEnteredGrass && !grassFiredRef.current) {
      grassFiredRef.current = true;
      setHasEnteredGrass(true);
      const screenshot = takeScreenshot();
      onIncident('QADAĞAN OLUNMUŞ ÇƏMƏNLİYƏ GİRİŞ', {
        timestamp: new Date().toLocaleTimeString(),
        location: 'Sektor B - Yaşıl Zona',
        confidence: 0.95,
        image: screenshot
      });
    }
  };

  const handleSmoking = () => {
    const screenshot = takeScreenshot();
    onIncident('QADAĞAN OLUNMUŞ YERDƏ SİQARET', {
      timestamp: new Date().toLocaleTimeString(),
      location: 'Sektor B - Piyada Yolu',
      confidence: 0.94,
      image: screenshot
    });
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[12, 12, 12]} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <directionalLight position={[-15, 18, -15]} intensity={1.0} />
      <directionalLight position={[20, 15, -10]} intensity={0.8} />
      <hemisphereLight args={['#b0d8ff', '#1a2e1a', 0.8]} />
      <Environment preset="park" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#1a2e1a" /></mesh>
      <Sidewalk />
      <Sun />

      <Cloud position={[-15, 15, -10]} /><Cloud position={[10, 18, -20]} /><Cloud position={[20, 14, 5]} /><Cloud position={[-5, 16, 15]} />

      {vegetation.treesL.map((t, i) => <Tree key={`tl-${i}`} position={t.pos} scale={t.scale} />)}
      {vegetation.treesR.map((t, i) => <Tree key={`tr-${i}`} position={t.pos} scale={t.scale} />)}
      {vegetation.bushesL.map((b, i) => <Bush key={`bl-${i}`} position={b.pos} />)}
      {vegetation.bushesR.map((b, i) => <Bush key={`br-${i}`} position={b.pos} />)}

      {vegetation.rocks.map((r, i) => <Rock key={`rk-${i}`} position={r.pos} scale={r.scale} />)}
      {vegetation.flowerBeds.map((f, i) => <FlowerBed key={`fb-${i}`} position={f.pos} />)}
      {vegetation.scatteredFlowers.map((f, i) => (
        <group key={`sf-${i}`} position={f.pos}>
          <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.2]} /><meshStandardMaterial color="#2d5a27" /></mesh>
          <mesh position={[0, 0.2, 0]} castShadow><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={f.color} /></mesh>
        </group>
      ))}

      {/* Regulation Signs - Positioned along the road (x = ±2.2) */}
      <RegulationSign position={[-2.2, 0, -7.5]} rotation={[0, Math.PI / 2, 0]} type="grass" />
      <RegulationSign position={[2.2, 0, 8]} rotation={[0, -Math.PI / 2, 0]} type="grass" />
      <RegulationSign position={[2.2, 0, -2]} rotation={[0, -Math.PI / 2, 0]} type="smoking" />
      <RegulationSign position={[-2.2, 0, 15]} rotation={[0, Math.PI / 2, 0]} type="smoking" />



      {/* Furniture */}
      <Bench position={[-3, 0, 5]} rotation={[0, Math.PI / 2, 0]} /><TrashCan position={[-2.5, 0, 6.5]} />
      <Bench position={[-3, 0, -5]} rotation={[0, Math.PI / 2, 0]} /><TrashCan position={[-2.5, 0, -3.5]} />
      <Bench position={[-3, 0, 15]} rotation={[0, Math.PI / 2, 0]} /><TrashCan position={[-2.5, 0, 16.5]} />
      <BicycleRack position={[-2.5, 0, -15]} rotation={[0, Math.PI / 2, 0]} />
      <LampPost position={[-2.5, 0, 0]} /><LampPost position={[-2.5, 0, 10]} /><LampPost position={[-2.5, 0, -10]} /><LampPost position={[-2.5, 0, 20]} /><LampPost position={[-2.5, 0, -20]} />

      {/* Stone Paths */}
      {vegetation.paths.map((p, i) => (
        <StonePath key={`path-${i}`} start={p.start} end={p.end} count={p.count} />
      ))}

      {/* Architectural Details */}
      <Gazebo position={[-25, 0, -12]} /><Fountain position={[20, 0, 15]} /><Pond position={[18, 0, -15]} /><Slide position={[-20, 0, 5]} rotation={[0, Math.PI / 4, 0]} /><Swing position={[-22, 0, 8]} rotation={[0, Math.PI / 2, 0]} />

      {/* Special Zones */}
      {trashItems.map((item: any) => (
        <Trash key={item.id} position={item.pos} />
      ))}

      {/* NPCs */}
      <PassivePerson position={[-2.8, 0.55, 5]} rotation={[0, Math.PI / 2, 0]} color="#e91e63" type="sitting" />
      <PassivePerson position={[-1, 0, -30]} color="#9c27b0" type="walking" speed={0.03} onThrowTrash={handleLittering} isSmoking={false} onSmokingDetected={handleSmoking} />
      <PassivePerson position={[1, 0, 40]} color="#4caf50" type="walking" speed={0.025} />
      <PassivePerson position={[-1.2, 0, 20]} color="#ff9800" type="walking" speed={0.02} isSmoking={true} onSmokingDetected={handleSmoking} />
      <PassivePerson position={[1.1, 0, -45]} color="#03a9f4" type="walking" speed={0.035} />
      <PassivePerson position={[-1.3, 0, 35]} color="#f44336" type="walking" speed={0.022} />

      {/* Main Target */}
      <Person position={[0, 0, -15]} target={personTarget} onReachTarget={(r) => { if (r === 'grass') handleGrassEntry(); if (r === 'target') handleReachFlower(); }} isBending={isBending} hasFlower={isFlowerPicked} isViolated={isBending || hasEnteredGrass} />
      <Flower position={[3.5, 0, 2]} isPicked={isFlowerPicked} />

      <gridHelper args={[100, 50, 0x333333, 0x111111]} />
    </>
  );
}

export default function ParkScene({ onIncident, isAlertActive }: ParkSceneProps) {
  const [isFlowerPicked, setIsFlowerPicked] = useState(false);
  const [isBending, setIsBending] = useState(false);
  const [personTarget, setPersonTarget] = useState<[number, number, number]>([0, 0, -15]);
  const [hasEnteredGrass, setHasEnteredGrass] = useState(false);
  const [trashItems, setTrashItems] = useState<{ id: number, pos: [number, number, number] }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => { setPersonTarget([3.5, 0, 2]); }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#050505]">
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <SceneContent
          onIncident={onIncident} isAlertActive={isAlertActive}
          personTarget={personTarget} setPersonTarget={setPersonTarget}
          isFlowerPicked={isFlowerPicked} setIsFlowerPicked={setIsFlowerPicked}
          isBending={isBending} setIsBending={setIsBending}
          hasEnteredGrass={hasEnteredGrass} setHasEnteredGrass={setHasEnteredGrass}
          trashItems={trashItems} setTrashItems={setTrashItems}
        />
      </Canvas>
    </div>
  );
}
