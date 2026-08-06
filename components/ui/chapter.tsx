"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { raw, set } from "@/lib/store";
import type { Mode } from "@/lib/theme";

/* ═══════════════════════════════════════════════════════════════════════════
   CHAPTER
   ---------------------------------------------------------------------------
   A section that declares its surface mode. Sets data-mode so every token
   inside it inverts, and reports that mode upward as it takes the viewport so
   the backdrop and the 3D scene turn over with it.
   ═══════════════════════════════════════════════════════════════════════════ */

type Props = {
  mode: Mode;
  id?: string;
  className?: string;
  children: ReactNode;
  /** how much of the section must be showing before the page turns over */
  threshold?: number;
  onEnter?: () => void;
  style?: CSSProperties;
  /** exposes the section element, for callers that need to measure it */
  elRef?: React.RefObject<HTMLElement | null>;
  /** override backdrop surface reporting; false lets a child report a blend */
  surface?: Mode | false;
};

export function Chapter({
  mode, id, className = "", children, threshold = 0.35, onEnter, style, elRef, surface,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elRef) elRef.current = ref.current;
  }, [elRef]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        set({ mode });
        onEnter?.();
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
    // onEnter is intentionally not a dependency: callers pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, threshold]);

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      data-mode={mode}
      data-surface={surface === false ? undefined : (surface ?? mode)}
      style={style}
    >
      {children}
    </section>
  );
}

const DARK = [5, 6, 8];
const LIGHT = [244, 242, 237];

/**
 * The single plane the whole page sits on. Its colour is not switched — it is
 * measured, every frame, from how much of the viewport each surface currently
 * occupies. Crossing from Lotto to one8 is therefore a gradual wash with no
 * event and no line anywhere on the page.
 */
export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let shown = -1;

    const read = () => {
      const vh = window.innerHeight || 1;
      let lit = 0;
      document.querySelectorAll<HTMLElement>("[data-surface], [data-surface-light]").forEach((s) => {
        const r = s.getBoundingClientRect();
        const vis = Math.min(vh, r.bottom) - Math.max(0, r.top);
        if (vis <= 0) return;
        const declared = s.dataset.surfaceLight;
        const strength = declared === undefined
          ? (s.dataset.surface === "light" ? 1 : 0)
          : Math.min(1, Math.max(0, Number(declared) || 0));
        lit += vis * strength;
      });
      const f = Math.min(1, Math.max(0, lit / vh));
      raw.light = f;

      if (Math.abs(f - shown) > 0.004) {
        shown = f;
        const c = DARK.map((d, i) => Math.round(d + (LIGHT[i] - d) * f));
        el.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
      }
      frame = requestAnimationFrame(read);
    };

    frame = requestAnimationFrame(read);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div className="backdrop" ref={ref} aria-hidden />;
}
