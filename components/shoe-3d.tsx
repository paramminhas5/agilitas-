"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Procedural Shoe Mesh ────────────────────────────────────────────────────
// Creates a stylized, futuristic shoe shape using extruded geometry

function ShoeGeometry({ accent = "#FF6B35" }: { accent: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create shoe shape path
  const shoeShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Sole outline
    shape.moveTo(-1.8, 0);
    shape.bezierCurveTo(-1.8, 0.1, -1.7, 0.2, -1.5, 0.25);
    shape.bezierCurveTo(-1.0, 0.35, -0.3, 0.4, 0.5, 0.4);
    shape.bezierCurveTo(1.0, 0.4, 1.5, 0.35, 1.8, 0.25);
    shape.bezierCurveTo(2.0, 0.2, 2.1, 0.15, 2.1, 0.05);
    // Toe curve up
    shape.bezierCurveTo(2.1, -0.05, 2.0, -0.1, 1.8, -0.1);
    shape.bezierCurveTo(1.5, -0.1, 1.0, -0.08, 0.5, -0.08);
    shape.bezierCurveTo(-0.3, -0.08, -1.0, -0.1, -1.5, -0.1);
    shape.bezierCurveTo(-1.7, -0.1, -1.8, -0.05, -1.8, 0);
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.1,
      bevelSegments: 8,
      curveSegments: 32,
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05 - 0.1;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    if (glowRef.current) {
      const scale = 1.02 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });


  const accentColor = new THREE.Color(accent);

  return (
    <group>
      {/* Main shoe body */}
      <mesh ref={meshRef} castShadow position={[0, 0.3, 0]}>
        <extrudeGeometry args={[shoeShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Upper shell - the visible top */}
      <mesh position={[0, 0.65, 0.4]} castShadow>
        <capsuleGeometry args={[0.35, 2.8, 16, 32]} />
        <meshPhysicalMaterial
          color="#0d0d0d"
          metalness={0.5}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, 0.55, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.9, 0.04, 8, 64, Math.PI * 0.8]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Sole detail */}
      <mesh position={[0, 0.05, 0.4]}>
        <boxGeometry args={[3.6, 0.12, 0.9]} />
        <meshPhysicalMaterial
          color="#111"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Heel accent */}
      <mesh position={[-1.5, 0.4, 0.4]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Glow outline */}
      <mesh ref={glowRef} position={[0, 0.3, 0]}>
        <extrudeGeometry args={[shoeShape, { ...extrudeSettings, depth: 0.82 }]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}


// ─── Floating Particles ──────────────────────────────────────────────────────

function Particles({ count = 50, accent = "#FF6B35" }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={accent}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Ground Ring ─────────────────────────────────────────────────────────────

function GroundRing({ accent = "#FF6B35" }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <ringGeometry args={[1.8, 2.0, 64]} />
      <meshBasicMaterial
        color={accent}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}


// ─── Scene Composition ───────────────────────────────────────────────────────

function ShoeScene({ accent = "#FF6B35" }: { accent: string }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-3, 3, -3]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color={accent}
      />
      <pointLight position={[0, -2, 0]} intensity={0.3} color={accent} />

      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <ShoeGeometry accent={accent} />
      </Float>

      <Particles accent={accent} />
      <GroundRing accent={accent} />

      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.4}
        scale={5}
        blur={2.5}
        far={4}
        color={accent}
      />

      <Environment preset="city" environmentIntensity={0.4} />
    </>
  );
}

// ─── Exported Component ──────────────────────────────────────────────────────

interface Shoe3DProps {
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Shoe3D({
  accent = "#FF6B35",
  className = "",
  style,
}: Shoe3DProps) {
  return (
    <div className={`canvas-wrapper ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ShoeScene accent={accent} />
      </Canvas>
    </div>
  );
}

// ─── Mini version for cards ──────────────────────────────────────────────────

export function Shoe3DMini({
  accent = "#FF6B35",
  className = "",
}: {
  accent?: string;
  className?: string;
}) {
  return (
    <div className={`canvas-wrapper ${className}`} style={{ height: "240px" }}>
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <spotLight
          position={[3, 4, 3]}
          angle={0.4}
          penumbra={1}
          intensity={1.2}
        />
        <pointLight position={[-2, 1, -1]} intensity={0.4} color={accent} />
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.3}>
          <ShoeGeometry accent={accent} />
        </Float>
        <Environment preset="city" environmentIntensity={0.3} />
      </Canvas>
    </div>
  );
}
