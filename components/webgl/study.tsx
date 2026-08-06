"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raw, activeAccent, useSceneValue } from "@/lib/store";
import { formFor, LAYER_FOR_TECH, type Layer } from "@/lib/forms";
import { technologies } from "@/data/products";
import { resolveWorld } from "@/lib/worlds";
import type { Tier } from "@/lib/perf";
import { plate, plateTread } from "./geometry";

/* ═══════════════════════════════════════════════════════════════════════════
   MATERIAL STUDY
   ---------------------------------------------------------------------------
   Deliberately not a shoe. A cross-section sample carrying the tread of
   whichever shoe owns the viewport — cement lugs, turf nubs, cricket studs,
   drainage channels. It changes as you scroll, it explodes usefully in the
   lab, and it never pretends to be a product. Real photography and .glb
   models take over the moment they land in /public.
   ═══════════════════════════════════════════════════════════════════════════ */

const W = 2.3;
const D = 1.45;

const T = { outsole: 0.1, midsole: 0.17, lining: 0.05 };

const LIFT: Record<Layer, number> = {
  outsole: -0.3,
  midsole: 0,
  lining: 0.28,
  upper: 0.28,
  collar: 0.5,
  all: 0,
};

export function Study({ tier }: { tier: Tier }) {
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
  const presence = useRef(1);


  const geo = useMemo(
    () => ({
      outsole: plate(W, D, T.outsole, detail),
      midsole: plate(W * 0.985, D * 0.978, T.midsole, detail),
      lining: plate(W * 0.95, D * 0.94, T.lining, detail),
    }),
    [detail]
  );

  const treadSpec = useMemo(() => plateTread(W, D, fm.tread, detail), [fm.tread, detail]);

  const mats = useMemo(
    () => ({
      outsole: new THREE.MeshPhysicalMaterial({ color: "#14181B", roughness: 0.9, metalness: 0.08 }),
      midsole: new THREE.MeshPhysicalMaterial({
        color: "#A9C6D8", roughness: 0.5, metalness: 0.16,
        clearcoat: detail ? 0.5 : 0, clearcoatRoughness: 0.45,
      }),
      lining: new THREE.MeshStandardMaterial({ color: "#1B2125", roughness: 0.96 }),
    }),
    [detail]
  );

  const matFor = mats as unknown as Record<
    string,
    THREE.Material & { opacity: number; transparent: boolean; depthWrite: boolean }
  >;

  useLayoutEffect(() => () => {
    Object.values(geo).forEach((g) => g.dispose());
  }, [geo]);
  useLayoutEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  useLayoutEffect(() => {
    const im = treadRef.current;
    if (!im || !treadSpec) return;
    treadSpec.placements.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
    im.count = treadSpec.placements.length;
  }, [treadSpec]);

  useLayoutEffect(() => { punch.current = 1; }, [formId]);

  const activeLayer: Layer = LAYER_FOR_TECH[technologies[techIdx]?.id] ?? "all";
  const exploding = phase === "lab";


  useFrame((st, dt) => {
    const g = root.current;
    if (!g) return;
    const t = st.clock.elapsedTime;
    const world = resolveWorld(raw.world);
    const k = Math.min(1, dt * 3);

    goal.current.set(activeAccent());
    tint.current.lerp(goal.current, Math.min(1, dt * 2.6));
    mats.midsole.color.copy(tint.current);

    /* Held at an angle, as though under inspection. Speed belongs to the
       world: a night turf pitch is nervous, an archive is nearly still. */
    const spin = world.spin;
    g.rotation.y = t * 0.14 * spin + raw.progress * Math.PI * 0.5;
    g.rotation.x = 0.42 + Math.sin(t * 0.22 * spin) * 0.05;
    g.rotation.z = Math.sin(t * 0.17 * spin) * 0.05;
    g.position.y = Math.sin(t * 0.45 * spin) * 0.03;

    /* The study only appears where it earns its place: the hero, where it is
       an abstract opening, and the lab, where the exploded cross-section is
       genuinely explanatory. In the icon section, the berths and the campaign
       scenes, photography is the hero — a stand-in sitting inside a labelled
       frame is worse than the frame alone. */
    const wanted = raw.phase === "hero" || raw.phase === "brands" || raw.phase === "lab";
    presence.current += ((wanted ? 1 : 0) - presence.current) * Math.min(1, dt * 2.6);
    g.visible = presence.current > 0.02;

    punch.current += (0 - punch.current) * Math.min(1, dt * 4);
    g.scale.setScalar(1 + punch.current * 0.07);

    (["outsole", "midsole", "lining"] as Layer[]).forEach((name) => {
      const node = layers.current[name];
      const mat = matFor[name];
      if (node) {
        const y = exploding ? LIFT[name] : 0;
        node.position.y += (y - node.position.y) * k;
      }
      if (mat) {
        const dim = exploding && activeLayer !== "all" && activeLayer !== name;
        const want = (dim ? 0.16 : 1) * presence.current;
        mat.opacity += (want - mat.opacity) * k;
        mat.transparent = mat.opacity < 0.985;
        mat.depthWrite = !mat.transparent;
      }
    });
  });


  return (
    <group ref={root}>
      {/* Outsole, with this shoe's actual tread on its underside */}
      <group ref={(n) => { layers.current.outsole = n; }}>
        <mesh geometry={geo.outsole} material={mats.outsole} />
        {treadSpec && (
          <instancedMesh
            ref={treadRef}
            args={[treadSpec.geo, mats.outsole, treadSpec.placements.length]}
            position={[0, -0.03, 0]}
          />
        )}
      </group>

      {/* Midsole foam — carries the colourway */}
      <group ref={(n) => { layers.current.midsole = n; }} position={[0, T.outsole, 0]}>
        <mesh geometry={geo.midsole} material={mats.midsole} />
      </group>

      {/* Lining */}
      <group
        ref={(n) => { layers.current.lining = n; }}
        position={[0, T.outsole + T.midsole, 0]}
      >
        <mesh geometry={geo.lining} material={mats.lining} />
      </group>

      {/* Measurement hairlines: this is a sample, not a product */}
      <mesh geometry={geo.outsole} scale={[1.05, 1, 1.07]} position={[0, T.outsole * 0.5, 0]}>
        <meshBasicMaterial wireframe transparent opacity={0.05} color="#EDEBE6" />
      </mesh>
    </group>
  );
}
