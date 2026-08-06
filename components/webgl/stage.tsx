"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { raw, stage as stageSlot, useSceneValue } from "@/lib/store";
import { resolveWorld } from "@/lib/worlds";
import { budget, type Tier } from "@/lib/perf";
import { modelFor } from "@/lib/assets";
import { Model } from "./model";
import { Study } from "./study";
import { Shards } from "./shards";
import { Particles } from "./particles";
import { Rain } from "./rain";
import { Ground } from "./ground";

/** The Lotto surface, as a colour the scene can be blended toward. */
const PAPER = new THREE.Color("#F4F2ED");

/** Fallback placement for regions that reserve no box of their own. */
const DRIFT: Record<string, [number, number]> = {
  brands: [0.66, -0.12],
  foot: [0.0, -0.4],
};

/**
 * A malformed or missing .glb must not take the canvas down with it. On
 * failure this quietly falls through to whatever is passed as the fallback.
 */
class ModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[stage] model failed to load, falling back", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Rig({ tier, shards }: { tier: Tier; shards: number }) {
  const holder = useRef<THREE.Group>(null);
  const content = useRef<THREE.Group>(null);
  const key = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const formId = useSceneValue((s) => s.formId);
  const modelPath = modelFor(formId);

  /* The object's true size, measured rather than assumed. A bounding sphere,
     not a width: the object rotates, so only a radius guarantees it stays
     inside its slot at every angle. Assuming a fixed length is what let it
     bleed off the right edge of the page. */
  const radius = useRef(1.5);
  const settle = useRef(0);
  const ticks = useRef(0);

  const measure = () => {
    const h = holder.current;
    const c = content.current;
    if (!h || !c) return;
    const keep = h.scale.clone();
    h.scale.set(1, 1, 1);
    h.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(c);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    if (sphere.radius > 0.01) radius.current = sphere.radius;
    h.scale.copy(keep);
    h.updateMatrixWorld(true);
  };

  // Models arrive asynchronously, so one measurement on change is not enough:
  // re-measure a few times while the object settles in.
  useEffect(() => {
    settle.current = 10;
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [formId, tier, modelPath]);

  const keyCol = useRef(new THREE.Color("#EDEBE6"));
  const fillCol = useRef(new THREE.Color("#8A7CFF"));
  const fogCol = useRef(new THREE.Color("#050608"));
  const tmp = useRef(new THREE.Color());
  const want = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const lightAt = useMemo(() => new THREE.Vector3(), []);
  const fitScale = useRef(1);

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
    const cam = st.camera as THREE.PerspectiveCamera;
    const world = resolveWorld(raw.world);
    const k = Math.min(1, dt * 2.2);

    ticks.current++;
    if (settle.current > 0 && ticks.current % 8 === 0) {
      settle.current--;
      measure();
    }

    /* Camera: fixed dolly with a little pointer parallax. */
    cam.position.x += (raw.px * 0.3 - cam.position.x) * Math.min(1, dt * 1.1);
    cam.position.y += (raw.py * 0.18 + 0.1 - cam.position.y) * Math.min(1, dt * 1.1);
    cam.position.z += (5.4 - cam.position.z) * Math.min(1, dt);
    cam.lookAt(0, 0, 0);

    /* Placement: project the section's reserved DOM box into the scene, so
       the object always lands inside its own slot and never over the copy. */
    const el = stageSlot.el;
    if (el) {
      const r = el.getBoundingClientRect();
      const ndcX = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
      const ndcY = -(((r.top + r.height / 2) / window.innerHeight) * 2 - 1);

      dir.set(ndcX, ndcY, 0.5).unproject(cam).sub(cam.position).normalize();
      const travel = -cam.position.z / dir.z; // intersect the z = 0 plane
      want.copy(cam.position).addScaledVector(dir, travel);

      // Contain the object inside the box, using the measured radius so it
      // cannot escape at any rotation. 0.86 leaves a little air.
      const visH = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
      const perPx = visH / window.innerHeight;
      const fitPx = Math.min(r.width, r.height);
      // 1.15 rather than 0.86: a bounding sphere is generous by definition, so
      // fitting strictly inside it left a hero product reading as a thumbnail.
      const target = THREE.MathUtils.clamp(
        (fitPx * perPx * 1.15) / (radius.current * 2),
        0.3,
        2.6
      );
      fitScale.current += (target - fitScale.current) * k;
    } else {
      const d = DRIFT[raw.world] ?? DRIFT[raw.phase] ?? [0.5, -0.1];
      const visH = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
      want.set(d[0] * visH * 0.9, d[1] * visH * 0.5, 0);
      fitScale.current += (0.6 - fitScale.current) * k;
    }

    h.position.lerp(want, Math.min(1, dt * 1.9));
    h.scale.setScalar(fitScale.current);


    /* Light rig and air are properties of the world, eased between. */
    if (key.current) {
      tmp.current.set(world.key);
      keyCol.current.lerp(tmp.current, k);
      key.current.color.copy(keyCol.current);
      key.current.intensity += (world.keyIntensity - key.current.intensity) * k;
      lightAt.set(world.keyPos[0], world.keyPos[1], world.keyPos[2]);
      key.current.position.lerp(lightAt, k);
    }
    if (fill.current) {
      tmp.current.set(world.fill);
      fillCol.current.lerp(tmp.current, k);
      fill.current.color.copy(fillCol.current);
      fill.current.intensity += (world.fillIntensity - fill.current.intensity) * k;
    }

    /* The scene inverts by the same continuous amount as the page, so objects
       recede into paper or into black without either ever snapping. */
    const L = raw.light;

    const fog = st.scene.fog as THREE.Fog | null;
    if (fog) {
      tmp.current.set(world.fog).lerp(PAPER, L);
      fogCol.current.lerp(tmp.current, k);
      fog.color.copy(fogCol.current);
      fog.near += (world.fogNear + L * 1.5 - fog.near) * k;
      fog.far += (world.fogFar + L * 6 - fog.far) * k;
    }

    if (amb.current) {
      amb.current.intensity += (0.42 + L * 1.15 - amb.current.intensity) * k;
    }
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.42} />
      <pointLight ref={key} position={[2.6, 2.4, 3.2]} intensity={24} distance={16} decay={2} />
      <pointLight ref={fill} position={[-3.2, -1.4, 2.2]} intensity={10} distance={13} decay={2} />
      <directionalLight position={[-1.5, 3, -2]} intensity={0.4} color="#CFE6F2" />

      <Ground />

      <group ref={holder}>
        <group ref={content}>
          {/* A real product model wins. Otherwise the material study, which
              only shows itself in the hero and the lab. */}
          {modelPath ? (
            <ModelBoundary key={modelPath} fallback={<Study tier={tier} />}>
              <Suspense fallback={null}>
                <Model path={modelPath} />
              </Suspense>
            </ModelBoundary>
          ) : (
            <Study tier={tier} />
          )}
        </group>
        {shards > 0 && <Shards tier={tier} count={shards} />}
      </group>
    </>
  );
}


/**
 * A neutral studio environment. Real PBR materials need something to reflect;
 * without it a metallic or clearcoated shoe renders flat and murky no matter
 * how many lights you point at it. Generated once, on the GPU.
 */
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const tex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = tex;
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
      room.dispose?.();
    };
  }, [gl, scene]);
  return null;
}

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
        <Environment />
        <Rig tier={tier} shards={b.shards} />
        {b.grit > 0 && <Particles count={b.grit} />}
        {b.rain > 0 && <Rain count={b.rain} />}
        <fog attach="fog" args={["#050608", 7, 20]} />
      </Canvas>
    </div>
  );
}
