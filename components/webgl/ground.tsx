"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw } from "@/lib/store";
import { resolveWorld } from "@/lib/worlds";

const FLOOR_LIGHT = new THREE.Color("#DCD7CD");

/** A measured grid, drawn once and reused. Reads as a court or a gym floor. */
function gridTexture() {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d");
  if (!x) return null;
  x.fillStyle = "#ffffff";
  x.globalAlpha = 0.09;
  x.fillRect(0, 0, s, s);
  x.globalAlpha = 0.5;
  x.strokeStyle = "#ffffff";
  x.lineWidth = 2;
  x.strokeRect(1, 1, s - 2, s - 2);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(11, 11);
  return t;
}

/** The floor the shoe is standing on. Every world has a different one. */
export function Ground() {
  const mesh = useRef<THREE.Mesh>(null);
  const grid = useMemo(() => (typeof document === "undefined" ? null : gridTexture()), []);
  const tint = useRef(new THREE.Color("#141719"));
  const goal = useRef(new THREE.Color("#141719"));
  const alpha = useRef(0);
  const rough = useRef(0.8);
  const metal = useRef(0.05);
  const gridFade = useRef(0);


  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const g = resolveWorld(raw.world).ground;
    const k = Math.min(1, dt * 1.5);

    // On paper the floor has to be a pale tone, or it reads as a black hole
    // punched through the middle of a Lotto section. Blended continuously.
    const L = raw.light;
    goal.current.set(g ? g.color : "#0A0C0F").lerp(FLOOR_LIGHT, L);
    tint.current.lerp(goal.current, k);
    alpha.current += ((g ? g.opacity * (1 - L * 0.32) : 0) - alpha.current) * k;
    rough.current += ((g ? g.rough : 0.8) - rough.current) * k;
    metal.current += ((g ? g.metal : 0.05) - metal.current) * k;
    gridFade.current += ((g && g.grid ? 1 : 0) - gridFade.current) * k;

    const mat = m.material as THREE.MeshPhysicalMaterial;
    mat.color.copy(tint.current);
    mat.opacity = alpha.current;
    mat.roughness = rough.current;
    mat.metalness = metal.current;
    mat.visible = alpha.current > 0.015;
    if (grid) {
      mat.map = gridFade.current > 0.04 ? grid : null;
      mat.alphaMap = null;
    }
    mat.needsUpdate = false;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, -1.4]}>
      <planeGeometry args={[46, 46]} />
      <meshPhysicalMaterial
        color="#141719"
        roughness={0.8}
        metalness={0.05}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}
