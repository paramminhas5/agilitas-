"use client";

import { useEffect, useRef } from "react";

/**
 * Magnetic cursor. Any element carrying `data-cur` swells the ring and prints
 * that attribute's value as a label. Position is lerped for weight.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let frame = 0;
    let woken = false;

    const move = (e: PointerEvent) => {
      // Until the pointer actually moves we show nothing. Otherwise the ring
      // parks at viewport centre and sits on top of the headline.
      if (!woken) {
        woken = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
        el.classList.add("is-ready");
        document.documentElement.classList.add("has-cur");
      }
      target.x = e.clientX;
      target.y = e.clientY;
      const hot = (e.target as Element | null)?.closest?.("[data-cur]") as HTMLElement | null;
      if (hot) {
        el.classList.add("is-hot");
        if (label.current) label.current.textContent = hot.dataset.cur || "";
      } else {
        el.classList.remove("is-hot");
        if (label.current) label.current.textContent = "";
      }
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cur");
    };
  }, []);


  return (
    <div className="cur" ref={ref} aria-hidden>
      <span className="cur__ring" />
      <span className="cur__dot" />
      <span className="cur__label" ref={label} />
    </div>
  );
}

/** Observes every `.rise` / `.draw` in the tree and flips them on scroll-in. */
export function RevealScope() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".rise, .draw");
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return null;
}
