"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw } from "@/lib/store";

/**
 * Ambient particulate. Behaves as suspended cement dust for most of the page,
 * then falls as rain once the viewer reaches the campaign scenes — the same
 * buffer serving two jobs so we only pay for one draw call.
 */
export function Grit({ count }: { count: number }) {
  const pts = useRef<THREE.Points>(null);
  const rain = useRef(0);

  const { positions, drift } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const drift = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      drift[i * 3] = (Math.random() - 0.5) * 0.06;
      drift[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      drift[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return { positions, drift };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);


  useFrame((st, dt) => {
    const p = pts.current;
    if (!p) return;

    // Ease between "dust" and "rain" so the transition is never a hard cut.
    const want = raw.phase === "scenes" ? 1 : 0;
    rain.current += (want - rain.current) * Math.min(1, dt * 1.2);
    const r = rain.current;

    const arr = geo.getAttribute("position") as THREE.BufferAttribute;
    const a = arr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Dust wander
      a[ix] += drift[ix] * dt * (1 - r);
      a[ix + 1] += drift[ix + 1] * dt * (1 - r);
      a[ix + 2] += drift[ix + 2] * dt * (1 - r);
      // Rain fall, faster the more "rain" we are
      a[ix + 1] -= r * dt * (2.2 + (i % 7) * 0.35);

      // Wrap the volume so it never empties out
      if (a[ix + 1] < -6.5) a[ix + 1] = 6.5;
      if (a[ix + 1] > 6.6) a[ix + 1] = -6.4;
      if (a[ix] > 8.2) a[ix] = -8.2;
      if (a[ix] < -8.2) a[ix] = 8.2;
    }
    arr.needsUpdate = true;

    const mat = p.material as THREE.PointsMaterial;
    mat.size = THREE.MathUtils.lerp(0.019, 0.033, r);
    mat.opacity = THREE.MathUtils.lerp(0.32, 0.5, r);
    p.rotation.y = st.clock.elapsedTime * 0.012 * (1 - r);
  });

  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.32}
        color="#CBD8E0"
        depthWrite={false}
      />
    </points>
  );
}
