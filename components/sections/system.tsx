"use client";

import { Split } from "@/components/ui/split";
import { Chapter } from "@/components/ui/chapter";
import { BrandMark } from "@/components/ui/brand-mark";
import { goTo } from "@/lib/scroll";
import { claimStage, set } from "@/lib/store";
import { SURFACES, DAY } from "@/lib/system-data";

/** One side of the architecture. Same shape, opposite surface. */
function Side({
  mode, brand, axis, who, lede, ledger, ledgerLabel, world,
}: {
  mode: "light" | "dark";
  brand: "LOTTO" | "ONE8";
  axis: string;
  who: string;
  lede: string;
  ledger: { k: string; v: string }[];
  ledgerLabel: string;
  world: string;
}) {
  return (
    <Chapter
      mode={mode}
      className="side"
      onEnter={() => { claimStage(null); set({ world }); }}
    >
      <div className="wrap side__inner">
        <div className="side__lead">
          <BrandMark brand={brand} mode={mode} size={34} className="side__mark" />
          <div className="side__who">{who}</div>
          <h3 className="side__axis">
            <Split text={axis} stagger={28} />
          </h3>
          <p className="body-lg side__lede rise rise-d1">{lede}</p>
        </div>

        <div className="side__ledger rise rise-d2">
          <div className="side__ledger-k">{ledgerLabel}</div>
          {ledger.map((row, i) => (
            <div className="ledger__row" key={row.k}>
              <span className="ledger__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ledger__k">{row.k}</span>
              <span className="ledger__v">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </Chapter>
  );
}


export function System() {
  return (
    <div id="system">
      <Side
        mode="light"
        brand="LOTTO"
        axis="Engineered by surface."
        who="Everyday — for everyone who plays"
        lede="Indian grounds are cement, matting, turf, mud and wet tile. Lotto is
              organised around them: every shoe starts from a surface somebody
              actually plays on, and is built backwards from it."
        ledger={SURFACES}
        ledgerLabel="The five grounds"
        world="shoe:alleys"
      />

      <Side
        mode="dark"
        brand="ONE8"
        axis="Engineered by day."
        who="Elite — for those who want to get better"
        lede="An athlete's day is not one moment. one8 is organised around the
              whole of it — the training nobody films, the game, the recovery
              that decides tomorrow, and the hours still spent on your feet."
        ledger={DAY}
        ledgerLabel="One day, five demands"
        world="shoe:train"
      />

      {/* ── The bridge ───────────────────────────────────────────────────── */}
      <Chapter mode="dark" className="bridge" onEnter={() => { claimStage(null); set({ world: "brands" }); }}>
        <div className="wrap bridge__inner">
          <div className="eyebrow rise">How they connect</div>
          <h3 className="bridge__h">
            <Split text="Learn with Lotto." stagger={26} />
            <Split text="Get better with one8." className="chrome" stagger={26} delay={220} />
          </h3>

          <div className="bridge__rail rise rise-d1" aria-hidden>
            <span className="bridge__node bridge__node--lotto">
              <BrandMark brand="LOTTO" mode="dark" size={20} />
            </span>
            <span className="bridge__line" />
            <span className="bridge__node bridge__node--one8">
              <BrandMark brand="ONE8" mode="dark" size={20} />
            </span>
          </div>

          <div className="bridge__grid">
            <p className="body-lg rise rise-d1">
              Lotto is where it starts: cement, an evening slot, one pair that
              has to do everything. It is the entry point, and it is designed to
              be outgrown.
            </p>
            <p className="body-lg rise rise-d2">
              one8 is where it goes when you start measuring yourself — when the
              training matters more than the match, and the shoe becomes
              equipment rather than clothing.
            </p>
          </div>

          <button className="act act--ghost bridge__cta" data-cur="Enter" onClick={() => goTo("icons")}>
            The three that lead
            <span className="act__arrow">→</span>
          </button>
        </div>
      </Chapter>
    </div>
  );
}
