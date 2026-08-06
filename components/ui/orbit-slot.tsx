"use client";

import { useEffect, useRef } from "react";
import { raw } from "@/lib/store";

/* ═══════════════════════════════════════════════════════════════════════════
   ORBIT SLOT
   ---------------------------------------------------------------------------
   The reserved box for a real 3D product, and the surface you drag on. The
   canvas itself is pointer-events: none, so the gesture is captured here in
   the DOM and handed to the scene through the store. Flick-release carries a
   little inertia, then the slow drift resumes.
   ═══════════════════════════════════════════════════════════════════════════ */

export function OrbitSlot({
  className = "",
  label = "Drag to turn",
}: {
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let active = false;
    let lastX = 0;
    let lastY = 0;
    let vel = 0;
    let frame = 0;

    const glide = () => {
      if (!active && Math.abs(vel) > 0.0002) {
        raw.dragX += vel;
        vel *= 0.94;
        frame = requestAnimationFrame(glide);
      } else {
        vel = 0;
        frame = 0;
      }
    };

    const down = (e: PointerEvent) => {
      active = true;
      raw.dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      vel = 0;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-held");
    };

    const move = (e: PointerEvent) => {
      if (!active) return;
      const dx = (e.clientX - lastX) / 140;
      const dy = (e.clientY - lastY) / 320;
      raw.dragX += dx;
      raw.dragY = Math.max(-0.7, Math.min(0.8, raw.dragY + dy));
      vel = dx;
      lastX = e.clientX;
      lastY = e.clientY;
    };


    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      raw.dragging = false;
      el.classList.remove("is-held");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      if (!frame) frame = requestAnimationFrame(glide);
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      if (frame) cancelAnimationFrame(frame);
      raw.dragging = false;
    };
  }, []);

  return (
    <div className={`orbit ${className}`} ref={ref} data-cur="Drag">
      <span className="orbit__hint">{label}</span>
    </div>
  );
}
