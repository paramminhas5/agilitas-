"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw } from "@/lib/store";
import { resolveWorld } from "@/lib/worlds";

/* ═══════════════════════════════════════════════════════════════════════════
   RAIN
   ---------------------------------------------------------------------------
   Its own layer, because rain has to read as rain. Points were too small to
   register no matter how bright; these are elongated streaks with real
   length, speed and fall angle. Only ever active in the worlds where water
   is the argument: Traktor, the Dry System and Two-Ground Sole platforms,
   Dry By Morning, and The Rain-Locked Drop.
   ═══════════════════════════════════════════════════════════════════════════ */

type Drop = { x: number; y: number; z: number; speed: number; len: number };

export function Rain({ count }: { count: number }) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const on = useRef(0);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const at = useMemo(() => new THREE.Vector3(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);

  // A slight lean, so it never looks like a screensaver.
  const tilt = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.14)), []);

  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 13,
        z: (Math.random() - 0.5) * 8 - 1,
        speed: 7 + Math.random() * 9,
        len: 0.3 + Math.random() * 0.75,
      })),
    [count]
  );

  const geo = useMemo(() => new THREE.BoxGeometry(0.012, 1, 0.012), []);


  useFrame((_, dt) => {
    const im = inst.current;
    if (!im) return;
    const wet = resolveWorld(raw.world).air === "rain";
    on.current += ((wet ? 1 : 0) - on.current) * Math.min(1, dt * 2.4);

    const mat = im.material as THREE.MeshBasicMaterial;
    const light = raw.mode === "light";
    // Bright streaks disappear against paper; darken and firm them up.
    mat.color.set(light ? "#5E7686" : "#D8EEFA");
    mat.opacity = on.current * (light ? 0.42 : 0.5);
    im.visible = on.current > 0.02;
    if (!im.visible) return;

    q.copy(tilt);
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y -= d.speed * dt * on.current;
      d.x += d.speed * 0.13 * dt * on.current;
      if (d.y < -7) {
        d.y = 7;
        d.x = (Math.random() - 0.5) * 15;
      }
      if (d.x > 8) d.x = -8;

      at.set(d.x, d.y, d.z);
      sc.set(1, d.len * (0.4 + on.current * 0.6), 1);
      m4.compose(at, q, sc);
      im.setMatrixAt(i, m4);
    }
    im.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={inst} args={[geo, undefined, count]} frustumCulled={false}>
      <meshBasicMaterial color="#D8EEFA" transparent opacity={0} depthWrite={false} />
    </instancedMesh>
  );
}
