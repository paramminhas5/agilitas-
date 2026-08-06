"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { GroundMotion } from "@/components/ground-motion";
import { Backdrop } from "@/components/ui/chapter";
import { Cursor, RevealScope } from "@/components/ui/cursor";
import { usePdf } from "@/lib/pdf";
import { useTier } from "@/lib/perf";
import { goTo, markPhase, useSmoothScroll } from "@/lib/scroll";
import { useSceneValue, type Phase } from "@/lib/store";

const Stage = dynamic(() => import("@/components/webgl/stage"), { ssr: false });

const NAV: { id: string; phase: Phase; label: string }[] = [
  { id: "ground", phase: "hero", label: "Ground" },
  { id: "system", phase: "brands", label: "The Two" },
  { id: "icons", phase: "icons", label: "Icons" },
  { id: "terrain", phase: "lab", label: "Terrain" },
  { id: "culture", phase: "scenes", label: "Culture" },
];

export function Experience() {
  const tier = useTier();
  const { gen, busy } = usePdf();
  const [ready, setReady] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const phase = useSceneValue((state) => state.phase);
  const mode = useSceneValue((state) => state.mode);

  useSmoothScroll(tier !== "off");

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const map: [string, Phase][] = [
      ["ground", "hero"],
      ["system", "brands"],
      ["icons", "icons"],
      ["terrain", "lab"],
      ["atlas", "lab"],
      ["culture", "scenes"],
      ["foot", "foot"],
    ];
    const triggers = map
      .map(([id, region]) => {
        const element = document.getElementById(id);
        return element ? markPhase(element, region) : null;
      })
      .filter(Boolean) as { kill: () => void }[];
    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  return (
    <div className="shell" ref={shell} data-mode={mode}>
      <a className="skip-link" href="#main-content">Skip to the experience</a>
      <Backdrop />
      {ready && <Stage tier={tier} />}

      <div className="grain" aria-hidden />
      <div className="edge-vignette" aria-hidden />
      <Cursor />
      <RevealScope />

      <div className="rail" aria-hidden><div className="rail__fill" /></div>
      <div className="page-signal" aria-hidden><span /></div>

      <nav className="nav" aria-label="Experience chapters">
        <button className="nav__mark" data-cur="Top" onClick={() => goTo("ground")} aria-label="Return to the beginning">
          <span>AG</span>
          <span>Agilitas</span>
        </button>
        <div className="nav__set">
          {NAV.map((item, index) => (
            <button
              key={item.id}
              className={`nav__item ${phase === item.phase ? "is-on" : ""}`}
              data-cur="Go"
              onClick={() => goTo(item.id)}
              aria-current={phase === item.phase ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>
        <button className="nav__pdf" data-cur="Save" onClick={gen} disabled={busy}>
          {busy ? "Building…" : "Full pitch"}
        </button>
      </nav>

      <main id="main-content">
        <GroundMotion onPdf={gen} busy={busy} />
      </main>
    </div>
  );
}
