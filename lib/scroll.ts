"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { raw, set } from "./store";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Smooth-scroll to an element id, accounting for the fixed nav. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 8;
  const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
  if (l) l.scrollTo(y, { duration: 1.5 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/**
 * Boots Lenis, wires it to ScrollTrigger, and pushes document progress into
 * the shared store every frame. Returns nothing; unmount tears it all down.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    let lenis: { destroy: () => void; raf: (t: number) => void; on: (e: string, f: () => void) => void } | null = null;
    let frame = 0;
    let cancelled = false;

    const tick = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      raw.progress = p;
      const bar = document.querySelector<HTMLElement>(".rail__fill");
      if (bar) bar.style.transform = `scaleX(${p})`;
    };


    if (!enabled) {
      // No smooth scroll (reduced motion): still track progress natively.
      window.addEventListener("scroll", tick, { passive: true });
      tick();
      return () => window.removeEventListener("scroll", tick);
    }

    import("lenis").then((mod) => {
      if (cancelled) return;
      const Lenis = mod.default;
      const inst = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenis = inst as unknown as typeof lenis;
      (window as unknown as { __lenis?: unknown }).__lenis = inst;

      const raf = (time: number) => {
        inst.raf(time);
        tick();
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      inst.on("scroll", ScrollTrigger.update);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", tick);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, [enabled]);
}

/** Register a ScrollTrigger that reports a macro phase into the store. */
export function markPhase(el: Element, phase: Parameters<typeof set>[0]["phase"]) {
  return ScrollTrigger.create({
    trigger: el,
    start: "top 55%",
    end: "bottom 45%",
    onToggle: (s) => { if (s.isActive) set({ phase }); },
  });
}

/**
 * Scrub a tall narrative track into discrete steps while preserving a smooth
 * continuous progress value for a lightweight progress indicator.
 */
export function trackSteps(
  el: Element,
  count: number,
  onStep: (index: number) => void,
  onProgress?: (progress: number) => void,
) {
  let shown = -1;
  return ScrollTrigger.create({
    trigger: el,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const progress = Math.min(1, Math.max(0, self.progress));
      const index = Math.min(count - 1, Math.floor(progress * count));
      onProgress?.(progress);
      if (index === shown) return;
      shown = index;
      onStep(index);
    },
  });
}
