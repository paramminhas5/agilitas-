"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw, activeAccent } from "@/lib/store";
import type { Tier } from "@/lib/perf";

/** Sole outline, drawn once and extruded. Reads as a shoe without needing art. */
function soleShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -1.62);
  s.bezierCurveTo(0.34, -1.62, 0.58, -1.34, 0.6, -0.92);
  s.bezierCurveTo(0.62, -0.4, 0.5, -0.02, 0.54, 0.42);
  s.bezierCurveTo(0.58, 0.92, 0.8, 1.18, 0.74, 1.48);
  s.bezierCurveTo(0.68, 1.74, 0.28, 1.86, -0.06, 1.78);
  s.bezierCurveTo(-0.42, 1.7, -0.6, 1.36, -0.58, 0.92);
  s.bezierCurveTo(-0.56, 0.38, -0.66, -0.1, -0.62, -0.66);
  s.bezierCurveTo(-0.6, -1.2, -0.42, -1.62, 0, -1.62);
  return s;
}

/** Lug positions across the tread — cheap detail that sells the material story. */
function lugs(count: number) {
  const out: [number, number][] = [];
  const rows = Math.round(count / 3);
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    const y = -1.4 + t * 3.05;
    const halfW = 0.4 + Math.sin(t * Math.PI) * 0.16;
    for (let c = -1; c <= 1; c++) out.push([c * halfW * 0.72, y]);
  }
  return out;
}

type Props = { tier: Tier };


/**
 * The hero object. One form that travels the whole page and morphs its colour
 * and material as the viewer moves between shoes. Swapped for a real GLB
 * automatically once one is dropped into /public/models.
 */
export function Form({ tier }: Props) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const lugRef = useRef<THREE.InstancedMesh>(null);
  const colour = useRef(new THREE.Color("#A9C6D8"));
  const goal = useRef(new THREE.Color("#A9C6D8"));

  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(soleShape(), {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.08,
      bevelSegments: tier === "high" ? 5 : 2,
      curveSegments: tier === "high" ? 26 : 10,
    });
    g.center();
    return g;
  }, [tier]);

  const lugGeo = useMemo(() => new THREE.BoxGeometry(0.13, 0.2, 0.07), []);
  const lugList = useMemo(() => (tier === "high" ? lugs(27) : []), [tier]);

  // Seat the lugs once the instanced mesh actually exists. This has to be a
  // layout effect — during render the ref is still null and every lug would
  // collapse onto the origin.
  useLayoutEffect(() => {
    const im = lugRef.current;
    if (!im || !lugList.length) return;
    const m = new THREE.Matrix4();
    lugList.forEach(([x, y], i) => {
      m.makeTranslation(x, y, -0.21);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
  }, [lugList]);


  useFrame((st, dt) => {
    const g = group.current;
    if (!g) return;
    const t = st.clock.elapsedTime;
    const p = raw.progress;

    // Ease toward the accent of whatever shoe currently owns the camera.
    goal.current.set(activeAccent());
    colour.current.lerp(goal.current, Math.min(1, dt * 2.4));
    const mat = body.current?.material as THREE.MeshPhysicalMaterial | undefined;
    if (mat) {
      mat.color.copy(colour.current);
      // Rubber in the journey, closer to glass while still in the hero.
      const glassy = raw.shattered ? 0 : 1;
      mat.roughness = THREE.MathUtils.lerp(0.52, 0.12, glassy);
      mat.metalness = THREE.MathUtils.lerp(0.15, 0.45, glassy);
    }

    // Idle motion: slow tumble that speeds slightly with scroll velocity.
    g.rotation.y = t * 0.18 + p * Math.PI * 2.2;
    g.rotation.z = Math.sin(t * 0.4) * 0.09;
    g.rotation.x = -0.36 + Math.sin(t * 0.31) * 0.06;
    g.position.y = Math.sin(t * 0.55) * 0.11;

    // Shrinks back a touch once the page is deep, so copy stays readable.
    const s = THREE.MathUtils.lerp(1.05, 0.82, Math.min(1, p * 1.4));
    g.scale.setScalar(s);
  });


  return (
    <group ref={group}>
      <mesh ref={body} geometry={geo} castShadow={false}>
        <meshPhysicalMaterial
          color="#A9C6D8"
          roughness={0.3}
          metalness={0.3}
          clearcoat={tier === "high" ? 0.7 : 0}
          clearcoatRoughness={0.35}
          reflectivity={0.6}
        />
      </mesh>

      {/* Tread lugs — only worth it on the high tier */}
      {lugList.length > 0 && (
        <instancedMesh ref={lugRef} args={[lugGeo, undefined, lugList.length]}>
          <meshStandardMaterial color="#0E1214" roughness={0.85} metalness={0.05} />
        </instancedMesh>
      )}

      {/* Hairline cage: reads as engineering measurement, not decoration */}
      <mesh geometry={geo} scale={1.035}>
        <meshBasicMaterial wireframe transparent opacity={0.055} color="#EDEBE6" />
      </mesh>
    </group>
  );
}
