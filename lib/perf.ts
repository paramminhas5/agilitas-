"use client";

import { useEffect, useState } from "react";

export type Tier = "high" | "low" | "off";

/** Detect WebGL support once, cheaply. */
function webglOk(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Rendering tier.
 *  high — desktop, full particle counts and post FX
 *  low  — touch / small viewport / weak device, reduced everything
 *  off  — no WebGL, or the visitor asked for reduced motion
 */
export function useTier(): Tier {
  const [tier, setTier] = useState<Tier>("off");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !webglOk()) {
      document.documentElement.classList.add("no-webgl");
      setTier("off");
      return;
    }
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 900;
    const cores = navigator.hardwareConcurrency ?? 4;
    setTier(coarse || small || cores <= 4 ? "low" : "high");
  }, []);

  return tier;
}

/** Particle / shard budgets per tier. */
export const budget = (t: Tier) => ({
  shards: t === "high" ? 34 : t === "low" ? 14 : 0,
  grit: t === "high" ? 900 : t === "low" ? 260 : 0,
  dpr: t === "high" ? ([1, 1.75] as [number, number]) : ([1, 1.25] as [number, number]),
});
