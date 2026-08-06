"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw, activeAccent, useSceneValue } from "@/lib/store";
import { formFor, LAYER_FOR_TECH, type Layer } from "@/lib/forms";
import { technologies } from "@/data/products";
import { resolveWorld } from "@/lib/worlds";
import type { Tier } from "@/lib/perf";
import { slab, tread } from "./geometry";

/** How far each layer separates when the lab explodes the shoe. */
const LIFT: Record<Layer, number> = {
  outsole: -0.34,
  midsole: 0,
  lining: 0.3,
  upper: 0.62,
  collar: 0.95,
  all: 0,
};

export function Shoe({ tier }: { tier: Tier }) {
  const formId = useSceneValue((s) => s.formId);
  const phase = useSceneValue((s) => s.phase);
  const techIdx = useSceneValue((s) => s.tech);

  const detail = tier === "high";
  const fm = useMemo(() => formFor(formId), [formId]);

  const root = useRef<THREE.Group>(null);
  const layers = useRef<Record<string, THREE.Group | null>>({});
  const treadRef = useRef<THREE.InstancedMesh>(null);

  const tint = useRef(new THREE.Color("#A9C6D8"));
  const goal = useRef(new THREE.Color("#A9C6D8"));
  const punch = useRef(0);

  /* One material per layer, so the lab can fade layers independently. */
  const mats = useMemo(
    () => ({
      outsole: new THREE.MeshPhysicalMaterial({ color: "#0E1214", roughness: 0.92, metalness: 0.06 }),
      midsole: new THREE.MeshPhysicalMaterial({ color: "#C7CED4", roughness: 0.78, metalness: 0.02 }),
      lining: new THREE.MeshStandardMaterial({ color: "#1B2125", roughness: 0.95 }),
      upper: new THREE.MeshPhysicalMaterial({
        color: "#A9C6D8", roughness: 0.46, metalness: 0.18,
        clearcoat: detail ? 0.55 : 0, clearcoatRoughness: 0.4,
      }),
      collar: new THREE.MeshPhysicalMaterial({ color: "#8FA9BA", roughness: 0.62, metalness: 0.14 }),
    }),
    [detail]
  );

  const matFor: Record<string, THREE.Material & { opacity: number; transparent: boolean; depthWrite: boolean }> =
    mats as unknown as Record<string, THREE.Material & { opacity: number; transparent: boolean; depthWrite: boolean }>;

  useLayoutEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);


  /* ── Geometry, rebuilt only when the silhouette actually changes ──────── */
  const geo = useMemo(() => {
    const outsole = slab(fm, fm.sole * 0.45, 0, detail);
    const midsole = slab(fm, fm.sole * 0.6, 0.02, detail);
    const lining = fm.slide ? null : slab(fm, Math.max(0.05, fm.upper * 0.3), 0.07, detail);
    const upper = fm.slide || fm.upper <= 0 ? null : slab(fm, fm.upper * 0.72, 0.045, detail);
    return { outsole, midsole, lining, upper };
  }, [fm, detail]);

  const treadSpec = useMemo(() => tread(fm, fm.tread, detail), [fm, detail]);

  const toeGeo = useMemo(() => new THREE.SphereGeometry(1, detail ? 22 : 10, detail ? 16 : 8), [detail]);
  const collarGeo = useMemo(
    () => new THREE.TorusGeometry(1, 0.16, detail ? 12 : 6, detail ? 26 : 12),
    [detail]
  );

  // Dispose the previous silhouette's buffers when it is replaced.
  useLayoutEffect(() => {
    const made = [geo.outsole, geo.midsole, geo.lining, geo.upper];
    return () => made.forEach((g) => g?.dispose());
  }, [geo]);

  // Seat the tread instances.
  useLayoutEffect(() => {
    const im = treadRef.current;
    if (!im || !treadSpec) return;
    treadSpec.placements.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
    im.count = treadSpec.placements.length;
  }, [treadSpec]);

  // A short scale punch whenever the shoe changes, so the swap reads.
  useLayoutEffect(() => {
    punch.current = 1;
  }, [formId]);


  const activeLayer: Layer = LAYER_FOR_TECH[technologies[techIdx]?.id] ?? "all";
  const exploding = phase === "lab";

  useFrame((st, dt) => {
    const g = root.current;
    if (!g) return;
    const t = st.clock.elapsedTime;
    const world = resolveWorld(raw.world);
    const k = Math.min(1, dt * 3);

    /* Colour follows the shoe, or the tuner if the visitor chose one. */
    goal.current.set(activeAccent());
    tint.current.lerp(goal.current, Math.min(1, dt * 2.6));
    // A slide has no upper, so its foam carries the colour instead.
    (fm.slide ? mats.midsole : mats.upper).color.copy(tint.current);
    mats.collar.color.copy(tint.current).multiplyScalar(0.68);

    /* Three-quarter presentation. Spin speed is a property of the world:
       a night turf pitch is nervous, an archive is nearly still. */
    const spin = world.spin;
    g.rotation.y = -0.62 + Math.sin(t * 0.16 * spin) * 0.42 + raw.progress * Math.PI * 0.7;
    g.rotation.z = -0.06 + Math.sin(t * 0.28 * spin) * 0.04;
    g.rotation.x = 0.2 + Math.sin(t * 0.21 * spin) * 0.03;
    g.position.y = Math.sin(t * 0.5 * spin) * 0.05;

    punch.current += (0 - punch.current) * Math.min(1, dt * 4);
    g.scale.setScalar(1 + punch.current * 0.09);

    /* Explode in the lab, close up everywhere else. Anything that is not the
       selected platform's layer fades back so the reader's eye lands right. */
    (["outsole", "midsole", "lining", "upper", "collar"] as Layer[]).forEach((name) => {
      const node = layers.current[name];
      const mat = matFor[name];
      if (node) {
        const targetY = exploding ? LIFT[name] : 0;
        node.position.y += (targetY - node.position.y) * k;
      }
      if (mat) {
        const dimmed = exploding && activeLayer !== "all" && activeLayer !== name;
        const want = dimmed ? 0.14 : 1;
        mat.opacity += (want - mat.opacity) * k;
        mat.transparent = mat.opacity < 0.985;
        mat.depthWrite = !mat.transparent;
      }
    });
  });


  const L = fm.len / 2;
  const soleTop = fm.sole * 0.45;
  const midTop = soleTop + fm.sole * 0.6;

  return (
    <group ref={root}>
      {/* Outsole and its tread */}
      <group ref={(n) => { layers.current.outsole = n; }}>
        <mesh geometry={geo.outsole} material={mats.outsole} />
        {treadSpec && (
          <instancedMesh
            ref={treadRef}
            args={[treadSpec.geo, mats.outsole, treadSpec.placements.length]}
          />
        )}
      </group>

      {/* Midsole — the foam */}
      <group ref={(n) => { layers.current.midsole = n; }} position={[0, soleTop, 0]}>
        <mesh geometry={geo.midsole} material={mats.midsole} />
      </group>

      {/* Lining */}
      {geo.lining && (
        <group ref={(n) => { layers.current.lining = n; }} position={[0, midTop, 0]}>
          <mesh geometry={geo.lining} material={mats.lining} />
        </group>
      )}


      {/* Upper: slab plus a toe box and heel counter so it reads as volume */}
      {geo.upper && (
        <group ref={(n) => { layers.current.upper = n; }} position={[0, midTop, 0]}>
          <mesh geometry={geo.upper} material={mats.upper} />
          <mesh
            geometry={toeGeo}
            material={mats.upper}
            position={[L * 0.52, fm.upper * 0.3, 0]}
            scale={[fm.len * 0.19 * fm.toe, fm.upper * 0.44, fm.width * 0.94]}
          />
          <mesh
            geometry={toeGeo}
            material={mats.upper}
            position={[-L * 0.62, fm.upper * 0.34, 0]}
            scale={[fm.len * 0.13, fm.upper * 0.5, fm.heel * 0.98]}
          />
        </group>
      )}

      {/* Collar — only where the shoe actually has one */}
      {fm.collar > 0.06 && (
        <group
          ref={(n) => { layers.current.collar = n; }}
          position={[-L * 0.34, midTop + fm.upper * (0.42 + fm.collar * 0.75), 0]}
        >
          <mesh
            geometry={collarGeo}
            material={mats.collar}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[fm.width * 0.82, fm.width * 0.82, 1]}
          />
        </group>
      )}

      {/* A slide has one strap across the forefoot and nothing else */}
      {fm.slide && (
        <mesh
          geometry={collarGeo}
          material={mats.upper}
          position={[L * 0.3, midTop + 0.02, 0]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[fm.width * 0.96, fm.width * 0.96, 1.6]}
        />
      )}
    </group>
  );
}
