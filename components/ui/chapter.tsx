"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { set, useSceneValue } from "@/lib/store";
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
};

export function Chapter({
  mode, id, className = "", children, threshold = 0.35, onEnter, style, elRef,
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
    <section ref={ref} id={id} className={className} data-mode={mode} style={style}>
      {children}
    </section>
  );
}

/** The single fixed plane the whole page sits on. */
export function Backdrop() {
  const mode = useSceneValue((s) => s.mode);
  return <div className={`backdrop ${mode === "light" ? "is-light" : ""}`} aria-hidden />;
}
