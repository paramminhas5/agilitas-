"use client";

import { Split } from "@/components/ui/split";
import { Chapter } from "@/components/ui/chapter";
import { claimStage, set } from "@/lib/store";

/* ═══════════════════════════════════════════════════════════════════════════
   VISION, AND THE TWO-BRAND SYSTEM
   ---------------------------------------------------------------------------
   The organising idea of the whole line: Lotto is engineered by surface, one8
   is engineered by day, and Lotto feeds into one8. Lotto is light, one8 is
   dark, and the section physically turns over between them.
   ═══════════════════════════════════════════════════════════════════════════ */




export function Vision() {
  return (
    <div id="vision">
      {/* ── The idea ─────────────────────────────────────────────────────── */}
      <Chapter mode="dark" className="creed" onEnter={() => { claimStage(null); set({ world: "brands" }); }}>
        <div className="wrap">
          <div className="eyebrow rise">The vision</div>
          <h2 className="creed__h">
            <Split text="Made here for" stagger={24} />
            <Split text="forty years." stagger={24} delay={150} />
            <Split text="Designed here" className="chrome" stagger={24} delay={320} />
            <Split text="from now." className="chrome" stagger={24} delay={470} />
          </h2>
          <div className="creed__foot">
            <p className="body-lg rise rise-d1">
              For fifty years, sports shoes sold in India were designed for how
              people live somewhere else — for sprung wooden floors, for dry
              summers, for feet shaped by another population.
            </p>
            <p className="body-lg rise rise-d2">
              Two brands, eleven shoes, ten platforms. One organised by the
              ground you play on. One organised by the day you spend. Together
              they cover a life in sport, not a moment in it.
            </p>
          </div>

          <div className="metrics" style={{ marginTop: "clamp(3rem, 8vh, 5rem)" }}>
            {[
              { n: "3.34M", l: "Tennis-ball matches a year" },
              { n: "11", l: "Shoes for Indian ground" },
              { n: "10", l: "Reusable tech platforms" },
              { n: "15", l: "Cities in the Combine" },
            ].map((m, i) => (
              <div className="metric rise" style={{ transitionDelay: `${i * 90}ms` }} key={m.n + i}>
                <div className="metric__n chrome">{m.n}</div>
                <div className="metric__l">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Chapter>
    </div>
  );
}
