"use client";

import { useSyncExternalStore } from "react";
import { accentFor } from "./theme";

/* ═══════════════════════════════════════════════════════════════════════════
   Tiny shared store. Bridges DOM scroll state <-> WebGL scene without
   prop drilling or a heavy state library. Mutations are frame-cheap.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Phase = "hero" | "icons" | "brands" | "lab" | "journey" | "scenes" | "foot";

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
  /** key into the WORLDS map, e.g. "shoe:traktor" or "camp:dry-by-morning" */
  world: string;
  /** which shoe silhouette the object should currently be */
  formId: string;
  /** surface mode of the section holding the viewport: Lotto light, one8 dark */
  mode: "light" | "dark";
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
  world: "hero",
  formId: "alleys",
  mode: "dark",
};

/**
 * The DOM box the 3D object should occupy right now. Sections hand over their
 * reserved slot as they take the viewport, and the rig projects the object
 * into it — which is what keeps the object out of the copy.
 * Deliberately outside React state: it is read every frame.
 */
export const stage: { el: HTMLElement | null } = { el: null };

export function claimStage(el: HTMLElement | null) {
  stage.el = el;
}

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

/**
 * Colour the object should currently render, corrected for the surface it is
 * sitting on. An accent picked for near-black needs darkening on paper.
 */
export const activeAccent = () =>
  accentFor(state.custom ?? state.accent, state.mode);
