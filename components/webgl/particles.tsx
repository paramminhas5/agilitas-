"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw } from "@/lib/store";
import { resolveWorld, type Air } from "@/lib/worlds";

/** Per-mode behaviour: fall speed, lateral drift, size, opacity, tint. */
/* Rain is handled by its own streak layer, so this field stands down for it
   and only contributes a faint spray. */
const BEHAVIOUR: Record<Air, {
  fall: number; drift: number; size: number; alpha: number; tint: string;
}> = {
  none:  { fall: 0,     drift: 0,    size: 0.02,  alpha: 0,    tint: "#CBD8E0" },
  dust:  { fall: 0.06,  drift: 0.05, size: 0.02,  alpha: 0.34, tint: "#CBD8E0" },
  rain:  { fall: 1.1,   drift: 0.1,  size: 0.016, alpha: 0.16, tint: "#BFE2F2" },
  mist:  { fall: 0.14,  drift: 0.1,  size: 0.05,  alpha: 0.2,  tint: "#C6D6E4" },
  chalk: { fall: -0.18, drift: 0.08, size: 0.03,  alpha: 0.3,  tint: "#E8F2EC" },
  motes: { fall: 0.02,  drift: 0.02, size: 0.022, alpha: 0.26, tint: "#EADFC8" },
  grit:  { fall: 0.3,   drift: 0.5,  size: 0.018, alpha: 0.32, tint: "#D2CFC6" },
};

const AIR_LIGHT = new THREE.Color("#63625B");

export function Particles({ count }: { count: number }) {
  const pts = useRef<THREE.Points>(null);
  const size = useRef(0.02);
  const alpha = useRef(0);
  const tint = useRef(new THREE.Color("#CBD8E0"));
  const goal = useRef(new THREE.Color("#CBD8E0"));

  const { geo, seed } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 17;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 13;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 11 - 2;
      seed[i * 3] = Math.random() - 0.5;
      seed[i * 3 + 1] = Math.random() - 0.5;
      seed[i * 3 + 2] = 0.4 + Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo, seed };
  }, [count]);


  useFrame((st, dt) => {
    const p = pts.current;
    if (!p) return;
    const world = resolveWorld(raw.world);
    const b = BEHAVIOUR[world.air];
    const k = Math.min(1, dt * 1.6);

    // How much of this world's air is actually switched on.
    const live = Math.round(count * world.density);

    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const a = attr.array as Float32Array;
    const t = st.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      if (i >= live) {
        // Park the surplus far behind the camera rather than paying to move it.
        a[ix + 1] = 999;
        continue;
      }
      if (a[ix + 1] > 900) a[ix + 1] = (Math.random() - 0.5) * 13;

      const speed = seed[ix + 2];
      a[ix + 1] -= b.fall * speed * dt;
      a[ix] += (b.drift * seed[ix] + Math.sin(t * 0.3 + i) * 0.01) * dt;
      a[ix + 2] += b.drift * seed[ix + 1] * dt * 0.5;

      if (a[ix + 1] < -6.6) a[ix + 1] = 6.6;
      if (a[ix + 1] > 6.7) a[ix + 1] = -6.5;
      if (a[ix] > 8.6) a[ix] = -8.6;
      if (a[ix] < -8.6) a[ix] = 8.6;
    }
    attr.needsUpdate = true;

    // Ease the look so a world change is a shift in weather, not a cut.
    // Pale particulate vanishes on paper, so the air darkens as the page does.
    const L = raw.light;
    size.current += (b.size - size.current) * k;
    alpha.current += (b.alpha * (1 - L * 0.28) - alpha.current) * k;
    goal.current.set(b.tint).lerp(AIR_LIGHT, L);
    tint.current.lerp(goal.current, k);

    const mat = p.material as THREE.PointsMaterial;
    mat.size = size.current;
    mat.opacity = alpha.current;
    mat.color.copy(tint.current);
    mat.visible = alpha.current > 0.01;

    p.rotation.y = world.air === "rain" ? 0 : t * 0.01;
  });

  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial size={0.02} sizeAttenuation transparent opacity={0} depthWrite={false} />
    </points>
  );
}
