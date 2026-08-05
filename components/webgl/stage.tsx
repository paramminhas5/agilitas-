"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw, activeAccent } from "@/lib/store";
import { budget, type Tier } from "@/lib/perf";
import { Form } from "./form";
import { Shards } from "./shards";
import { Grit } from "./grit";

/** Where the object should sit for each region of the page. */
const MARKS: Record<string, [number, number, number]> = {
  hero:    [ 0.00,  0.05, 0.0],
  brands:  [ 2.30, -0.20, -1.2],
  lab:     [ 2.05,  0.10, -0.6],
  journey: [ 1.95,  0.00, -0.2],
  scenes:  [-2.15, -0.10, -1.0],
  foot:    [ 0.00, -1.60, -2.4],
};

/** Moves the object between marks and breathes the camera with scroll. */
function Rig({ tier, shards }: { tier: Tier; shards: number }) {
  const holder = useRef<THREE.Group>(null);
  const key = useRef(new THREE.PointLight());
  const target = useRef(new THREE.Vector3(0, 0.05, 0));
  const lightCol = useRef(new THREE.Color("#A9C6D8"));

  // The canvas is pointer-events:none, so R3F's own pointer never updates.
  // Track it at the window instead.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      raw.px = (e.clientX / window.innerWidth) * 2 - 1;
      raw.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((st, dt) => {
    const h = holder.current;
    if (!h) return;

    const mark = MARKS[raw.phase] ?? MARKS.hero;
    target.current.set(mark[0], mark[1], mark[2]);
    h.position.lerp(target.current, Math.min(1, dt * 1.5));

    // Camera drifts a little with the pointer for parallax, and pulls back
    // slightly as the document advances.
    const cam = st.camera;
    cam.position.x += (raw.px * 0.35 - cam.position.x) * Math.min(1, dt * 1.1);
    cam.position.y += (raw.py * 0.22 + 0.1 - cam.position.y) * Math.min(1, dt * 1.1);
    cam.position.z += (5.4 + raw.progress * 1.1 - cam.position.z) * Math.min(1, dt * 0.9);
    cam.lookAt(h.position.x * 0.35, 0, 0);

    lightCol.current.set(activeAccent());
    key.current.color.lerp(lightCol.current, Math.min(1, dt * 2));
  });


  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight ref={key} position={[2.6, 2.4, 3.2]} intensity={26} distance={14} decay={2} />
      <pointLight position={[-3.2, -1.6, 2.2]} intensity={12} distance={12} decay={2} color="#8A7CFF" />
      <directionalLight position={[-1.5, 3, -2]} intensity={0.5} color="#CFE6F2" />

      <group ref={holder}>
        <Form tier={tier} />
        {shards > 0 && <Shards tier={tier} count={shards} />}
      </group>
    </>
  );
}

/** The persistent canvas that sits behind the entire document. */
export default function Stage({ tier }: { tier: Tier }) {
  const b = budget(tier);
  if (tier === "off") return null;

  return (
    <div className="stage" aria-hidden>
      <Canvas
        dpr={b.dpr}
        gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.1, 5.4], fov: 38, near: 0.1, far: 60 }}
        frameloop="always"
      >
        <Rig tier={tier} shards={b.shards} />
        {b.grit > 0 && <Grit count={b.grit} />}
        <fog attach="fog" args={["#050608", 7, 20]} />
      </Canvas>
    </div>
  );
}
