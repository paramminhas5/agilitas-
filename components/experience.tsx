"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { Cursor, RevealScope } from "@/components/ui/cursor";
import { Backdrop } from "@/components/ui/chapter";
import { Hero } from "@/components/sections/hero";
import { Vision } from "@/components/sections/vision";
import { System } from "@/components/sections/system";
import { Icons } from "@/components/sections/icons";
import { Lab } from "@/components/sections/lab";
import { Journey } from "@/components/sections/journey";
import { Scenes } from "@/components/sections/scenes";
import { Foot } from "@/components/sections/foot";

import { useTier } from "@/lib/perf";
import { useSmoothScroll, goTo, markPhase } from "@/lib/scroll";
import { usePdf } from "@/lib/pdf";
import { useSceneValue } from "@/lib/store";

/* WebGL never renders on the server, and never blocks first paint. */
const Stage = dynamic(() => import("@/components/webgl/stage"), { ssr: false });

const NAV = [
  { id: "system", label: "The Two" },
  { id: "icons", label: "The Icons" },
  { id: "lab", label: "Technology" },
  { id: "journey", label: "The Eleven" },
  { id: "scenes", label: "Campaigns" },
];

export function Experience() {
  const tier = useTier();
  const { gen, busy } = usePdf();
  const [ready, setReady] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const phase = useSceneValue((s) => s.phase);

  useSmoothScroll(tier !== "off");

  // Defer the canvas one paint so copy lands first.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);


  // Report which macro region owns the viewport, so the 3D rig knows where to sit.
  useEffect(() => {
    const map: [string, Parameters<typeof markPhase>[1]][] = [
      ["hero", "hero"],
      ["vision", "brands"],
      ["system", "brands"],
      ["icons", "icons"],
      ["lab", "lab"],
      ["journey", "journey"],
      ["scenes", "scenes"],
      ["foot", "foot"],
    ];
    const triggers = map
      .map(([id, p]) => {
        const el = document.getElementById(id);
        return el ? markPhase(el, p) : null;
      })
      .filter(Boolean) as { kill: () => void }[];
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="shell" ref={shell}>
      <Backdrop />
      {ready && <Stage tier={tier} />}

      <div className="grain" aria-hidden />
      <Cursor />
      <RevealScope />

      <div className="rail" aria-hidden>
        <div className="rail__fill" />
      </div>

      <nav className="nav">
        <button className="nav__mark" data-cur="Top" onClick={() => goTo("hero")}>
          Agilitas
        </button>
        <div className="nav__set">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav__item ${phase === n.id ? "is-on" : ""}`}
              data-cur="Go"
              onClick={() => goTo(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>
        <button className="nav__pdf" data-cur="Save" onClick={gen} disabled={busy}>
          {busy ? "Generating…" : "Download PDF"}
        </button>
      </nav>


      <main>
        <Hero />
        <Vision />
        <System />
        <Icons />
        <Lab />
        <div className="hair" />
        <Journey />
        <div className="hair" />
        <Scenes />
      </main>

      <Foot onPdf={gen} busy={busy} />

      <button className="dock" data-cur="Save" onClick={gen} disabled={busy}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        {busy ? "…" : "PDF"}
      </button>
    </div>
  );
}
