"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { raw, stage as stageSlot } from "@/lib/store";
import { resolveWorld } from "@/lib/worlds";

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT MODEL
   ---------------------------------------------------------------------------
   A real .glb, when one exists for the shoe holding the viewport. Loaded
   through three's own GLTFLoader rather than by re-adding drei, which was
   removed as unused weight.

   The model is normalised on load — centred and scaled to a unit box — so an
   export does not have to match any convention to sit correctly in its slot.
   Materials are rendered exactly as authored; the accent lives in the
   lighting and the world, never painted onto somebody's product.
   ═══════════════════════════════════════════════════════════════════════════ */

export function Model({ path }: { path: string }) {
  const gltf = useLoader(GLTFLoader, path);
  const pivot = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  // Clone so the same GLB can appear in more than one place without the two
  // fighting over one transform.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);

  useLayoutEffect(() => {
    const g = inner.current;
    if (!g) return;
    g.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z) || 1;
    // Normalise to roughly 2.6 units on its longest edge, then sit it so the
    // pivot is the middle of the object rather than wherever the exporter
    // happened to leave the origin.
    const k = 2.6 / longest;
    g.scale.setScalar(k);
    g.position.set(-centre.x * k, -centre.y * k, -centre.z * k);
  }, [scene]);


  useFrame((st, dt) => {
    const p = pivot.current;
    if (!p) return;
    const world = resolveWorld(raw.world);

    // Only ever visible where a section has actually reserved a box for it,
    // so the product cannot drift into a campaign scene uninvited.
    p.visible = stageSlot.el !== null;
    if (!p.visible) return;

    // Slow turn, always. Hand-rotation is added on top and never fights it:
    // while you are dragging, the drift stops.
    if (!raw.dragging) {
      p.rotation.y += dt * 0.18 * world.spin;
    }
    p.rotation.y += (raw.dragX - (p.userData.appliedX ?? 0));
    p.userData.appliedX = raw.dragX;

    const pitch = THREE.MathUtils.clamp(0.1 + raw.dragY, -0.6, 0.7);
    p.rotation.x += (pitch - p.rotation.x) * Math.min(1, dt * 6);

    p.position.y = Math.sin(st.clock.elapsedTime * 0.5) * 0.04;
  });

  return (
    <group ref={pivot}>
      <group ref={inner}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
