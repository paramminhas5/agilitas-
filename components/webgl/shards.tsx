"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw } from "@/lib/store";
import type { Tier } from "@/lib/perf";

type Shard = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  spin: THREE.Vector3;
  rot: THREE.Euler;
  scale: number;
};

/** Randomised every load, so the debris field is never twice the same. */
function seed(n: number): Shard[] {
  const out: Shard[] = [];
  for (let i = 0; i < n; i++) {
    const dir = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    out.push({
      pos: dir.clone().multiplyScalar(1.5 + Math.random() * 0.35),
      vel: dir.clone().multiplyScalar(0.1 + Math.random() * 0.3),
      spin: new THREE.Vector3(
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.7
      ),
      rot: new THREE.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28),
      scale: 0.05 + Math.random() * 0.14,
    });
  }
  return out;
}


/**
 * The glass encasement and its debris. The shell holds the form until the
 * first scroll, then breaks; the fragments never disappear — they drift with
 * the viewer for the rest of the page.
 */
export function Shards({ tier, count }: { tier: Tier; count: number }) {
  const shell = useRef<THREE.Mesh>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const shards = useMemo(() => seed(count), [count]);
  const broke = useRef(0); // 0..1 how far through the break we are
  /** Fragments belong to the hero and its exit only. Left running they end up
   *  orbiting a laboratory, where they read as dust on the screen. */
  const life = useRef(1);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const v3 = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const at = useMemo(() => new THREE.Vector3(), []);

  const shellGeo = useMemo(
    () => new THREE.IcosahedronGeometry(1.62, tier === "high" ? 2 : 1),
    [tier]
  );
  const shardGeo = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;

    // Break progress tracks the store flag but eases, so it never snaps.
    const want = raw.shattered ? 1 : 0;
    broke.current += (want - broke.current) * Math.min(1, dt * 1.9);
    const b = broke.current;

    // Alive through the hero, dying across the icons, gone after that.
    const target = raw.phase === "hero" ? 1 : raw.phase === "icons" ? 0.35 : 0;
    life.current += (target - life.current) * Math.min(1, dt * 1.4);
    const alive = life.current;

    if (shell.current) {
      const mat = shell.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - b) * alive * 0.14;
      shell.current.visible = mat.opacity > 0.004;
      shell.current.scale.setScalar(1 + b * 0.5);
      shell.current.rotation.y = t * 0.1;
      shell.current.rotation.x = t * 0.06;
    }


    const im = inst.current;
    if (!im) return;

    const shardMat = im.material as THREE.MeshPhysicalMaterial;
    shardMat.opacity = alive * 0.42;
    im.visible = alive > 0.02;
    if (!im.visible) return;

    for (let i = 0; i < shards.length; i++) {
      const s = shards[i];

      // Before the break the pieces sit tight on the shell. After, they push
      // out, then settle into a slow orbit that follows page progress.
      const spread = 1 + b * (1.4 + s.vel.length() * 2.6);
      const orbit = raw.progress * Math.PI * 1.3;

      const x = s.pos.x * spread + Math.sin(t * 0.3 + i) * 0.06 * b;
      const y = s.pos.y * spread + Math.cos(t * 0.26 + i) * 0.06 * b - raw.progress * 0.5;
      const z = s.pos.z * spread;

      // Rotate the whole field slowly around Y as the page advances.
      const cx = x * Math.cos(orbit) - z * Math.sin(orbit);
      const cz = x * Math.sin(orbit) + z * Math.cos(orbit);

      s.rot.x += s.spin.x * dt * (0.3 + b);
      s.rot.y += s.spin.y * dt * (0.3 + b);
      s.rot.z += s.spin.z * dt * (0.3 + b);

      q.setFromEuler(s.rot);
      v3.setScalar(s.scale * (0.35 + b * 0.65));
      at.set(cx, y, cz);
      m4.compose(at, q, v3);
      im.setMatrixAt(i, m4);
    }
    im.instanceMatrix.needsUpdate = true;
  });


  return (
    <group>
      {/* A thin cage rather than a filled sphere. The solid version read as a
          grey moon and flattened everything behind it. */}
      <mesh ref={shell} geometry={shellGeo}>
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.14}
          color="#CFE6F2"
          depthWrite={false}
        />
      </mesh>

      <instancedMesh ref={inst} args={[shardGeo, undefined, shards.length]}>
        <meshPhysicalMaterial
          color="#DCEAF2"
          roughness={0.1}
          metalness={0.15}
          transparent
          opacity={0.5}
          flatShading
        />
      </instancedMesh>
    </group>
  );
}
