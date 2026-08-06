"use client";

import { useEffect, useRef } from "react";
import { Split } from "@/components/ui/split";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  // Breaking the glass is tied to leaving the hero, not to a timer.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        set({ shattered: e.intersectionRatio < 0.62 });
        if (e.intersectionRatio > 0.5) {
          claimStage(slot.current);
          set({ world: "hero", formId: "alleys" });
        }
      },
      { threshold: [0, 0.3, 0.62, 0.9, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="hero vent" id="hero" ref={ref}>
      <div className="hero__meta">
        <span className="hero__live" />
        Agilitas Sports — Lotto &amp; one8 — Portfolio 01
      </div>

      <h1 className="h-xl hero__title">
        <Split text="Designed" className="chrome" stagger={30} />
        <Split text="for this" stagger={30} delay={160} />
        <Split text="ground." className="chrome" stagger={30} delay={320} />
      </h1>

      <div className="hero__rule draw" />


      <div className="hero__foot">
        <p className="body-lg hero__claim rise rise-d1">
          For fifty years, sports shoes have been designed for how people live
          somewhere else. Eleven shoes, two brands, ten platforms — built for how{" "}
          <strong>India actually lives.</strong>
        </p>

        <div className="hero__acts rise rise-d2">
          <button className="act act--solid" data-cur="Enter" onClick={() => goTo("journey")}>
            The Eleven
            <span className="act__arrow">→</span>
          </button>
          <button className="act act--ghost" data-cur="Inspect" onClick={() => goTo("lab")}>
            Technology
            <span className="act__arrow">→</span>
          </button>
        </div>
      </div>

      {/* Reserved box for the 3D object */}
      <div className="slot hero__stage" ref={slot} aria-hidden />

      <div className="hero__hint">
        <span className="hero__hint-line" />
        Scroll to break
      </div>
    </section>
  );
}
