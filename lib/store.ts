"use client";

import { useSyncExternalStore } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Tiny shared store. Bridges DOM scroll state <-> WebGL scene without
   prop drilling or a heavy state library. Mutations are frame-cheap.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Phase = "hero" | "brands" | "lab" | "journey" | "scenes" | "foot";

export type SceneState = {
  /** 0..1 progress through the whole document */
  progress: number;
  /** which macro region the viewer is in */
  phase: Phase;
  /** true once the viewer has scrolled past the hero threshold */
  shattered: boolean;
  /** index of the shoe currently held by the camera, -1 when none */
  shoe: number;
  /** colour the hero object should morph toward */
  accent: string;
  /** user-chosen colourway override from the tuner, null = follow shoe */
  custom: string | null;
  /** which technology hotspot is selected in the lab */
  tech: number;
  /** normalised pointer, -1..1. Written per-move, read by the camera rig.
   *  Kept out of React updates on purpose — it changes far too often. */
  px: number;
  py: number;
};

const state: SceneState = {
  progress: 0,
  phase: "hero",
  shattered: false,
  shoe: -1,
  accent: "#A9C6D8",
  custom: null,
  tech: 0,
  px: 0,
  py: 0,
};

const subs = new Set<() => void>();
let snap: SceneState = { ...state };

function emit() {
  snap = { ...state };
  subs.forEach((f) => f());
}


/** Mutate without triggering React (per-frame values read by WebGL directly). */
export const raw = state;

/** Mutate and notify React subscribers. Skips no-op writes. */
export function set(patch: Partial<SceneState>) {
  let dirty = false;
  for (const k of Object.keys(patch) as (keyof SceneState)[]) {
    const v = patch[k];
    if (v !== undefined && state[k] !== v) {
      // @ts-expect-error indexed write across a union of value types
      state[k] = v;
      dirty = true;
    }
  }
  if (dirty) emit();
}

function subscribe(f: () => void) {
  subs.add(f);
  return () => subs.delete(f);
}

const getSnapshot = () => snap;
const getServerSnapshot = () => snap;

/** Subscribe a component to the whole scene state. */
export function useScene(): SceneState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Subscribe to one slice, avoiding re-render on unrelated changes. */
export function useSceneValue<T>(pick: (s: SceneState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => pick(snap),
    () => pick(snap)
  );
}

/** Colour the hero object should currently render. */
export const activeAccent = () => state.custom ?? state.accent;
