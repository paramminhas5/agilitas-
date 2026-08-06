"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { campaigns, shoes, type Campaign } from "@/data/products";
import { Split } from "@/components/ui/split";
import { Chapter } from "@/components/ui/chapter";
import { BrandMark } from "@/components/ui/brand-mark";
import { AssetFilm } from "@/components/ui/asset";
import { posterFor, filmFor, wantFilm } from "@/lib/assets";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";
import { modeForBrand } from "@/lib/theme";

/* ═══════════════════════════════════════════════════════════════════════════
   CAMPAIGNS
   ---------------------------------------------------------------------------
   Built as press-kit case studies rather than product panels. The film runs
   full width, the title overlaps its edge, and the argument sits underneath
   as a three-column dossier — deliberately nothing like the shoe berths,
   which are copy-left and object-right.

   Split by brand on the same rule as everything else: Lotto light, one8 dark.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Campaigns name their shoe in prose; resolve that to the shoe, then brand. */
function shoeFor(label: string) {
  return shoes.find((s) => label.toLowerCase().includes(s.name.toLowerCase()));
}
const brandFor = (c: Campaign) => shoeFor(c.shoe)?.brand ?? "LOTTO";
const formFor = (c: Campaign) => shoeFor(c.shoe)?.id ?? "alleys";

/** Each campaign gets its own light. */
const WASH: Record<string, CSSProperties> = {
  "the-trial": { background: "radial-gradient(90% 60% at 50% 0%, rgba(125,249,232,0.09), transparent 70%)" },
  "midnight-galli": { background: "radial-gradient(34% 48% at 18% 30%, rgba(138,124,255,0.2), transparent 72%), radial-gradient(28% 42% at 80% 70%, rgba(95,184,255,0.14), transparent 74%)" },
  "take-them-off": { background: "linear-gradient(100deg, transparent 40%, rgba(120,110,90,0.1) 50%, transparent 60%)" },
  "10pm-league": { background: "radial-gradient(24% 36% at 12% 12%, rgba(80,110,140,0.2), transparent 70%), radial-gradient(24% 36% at 88% 12%, rgba(80,110,140,0.18), transparent 70%)" },
  "beta-sessions": { background: "radial-gradient(72% 56% at 50% 62%, rgba(60,150,130,0.12), transparent 74%)" },
  "sunday-session": { background: "linear-gradient(170deg, rgba(120,100,170,0.12), transparent 46%)" },
  "dry-by-morning": { background: "linear-gradient(to bottom, rgba(60,150,175,0.14), transparent 42%), repeating-linear-gradient(78deg, transparent 0 15px, rgba(90,120,140,0.07) 15px 16px)" },
  "rain-locked-drop": { background: "radial-gradient(72% 52% at 26% 22%, rgba(70,140,200,0.16), transparent 72%)" },
  "thousand-riders": { background: "radial-gradient(18% 26% at 20% 70%, rgba(60,160,130,0.16), transparent 70%), radial-gradient(18% 26% at 52% 38%, rgba(150,130,70,0.13), transparent 70%), radial-gradient(18% 26% at 82% 66%, rgba(80,110,140,0.15), transparent 70%)" },
  "ball-maker-capsule": { background: "radial-gradient(66% 56% at 72% 44%, rgba(216,207,168,0.13), transparent 74%)" },
};


function Case({ c, n, total }: { c: Campaign; n: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const brand = brandFor(c);
  const mode = modeForBrand(brand);

  // Parallax the wash a little against the scroll for depth.
  useEffect(() => {
    const el = ref.current;
    const wash = el?.querySelector<HTMLElement>(".case__wash");
    if (!el || !wash) return;
    let frame = 0;
    const run = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const mid = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      wash.style.transform = `translate3d(0, ${(-mid * 6).toFixed(2)}%, 0) scale(1.08)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(run); };
    window.addEventListener("scroll", onScroll, { passive: true });
    run();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Chapter
      mode={mode}
      id={`camp-${c.id}`}
      className="case"
      elRef={ref}
      threshold={0.3}
      onEnter={() => {
        claimStage(null);
        set({ world: `camp:${c.id}`, formId: formFor(c) });
      }}
    >
      <div className="case__wash" style={WASH[c.id] ?? {}} />

      <div className="wrap case__inner">
        <div className="case__head">
          <span className="case__no">
            Campaign {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button className="case__shoe" data-cur="Go" onClick={() => goTo("journey")}>
            {c.shoe}
          </button>
        </div>


        {/* The film runs the full width of the measure. */}
        <div className="case__plate rise">
          <AssetFilm
            src={filmFor(c.id)}
            poster={posterFor(c.id)}
            want={wantFilm(c.id)}
            alt={`${c.name} — treatment film`}
            ratio="21 / 9"
          />
        </div>

        {/* Title overlaps the plate edge — editorial, not centred. */}
        <div className="case__title">
          <h3 className="case__name">
            <Split text={c.name} stagger={28} />
          </h3>
          <p className="case__tag">{c.tagline}</p>
        </div>

        <div className="case__dossier">
          <div className="case__col rise">
            <div className="case__k">The idea</div>
            <p className="case__v">{c.description}</p>
          </div>
          <div className="case__col rise rise-d1">
            <div className="case__k case__k--film">The film</div>
            <p className="case__v">{c.film}</p>
          </div>
          <div className="case__col rise rise-d2">
            <div className="case__k case__k--gtm">Go to market</div>
            <p className="case__v">{c.gtm}</p>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/** Hinge between the two brands' campaign runs. */
function CampaignBreak({ brand, count }: { brand: "LOTTO" | "ONE8"; count: number }) {
  const mode = modeForBrand(brand);
  return (
    <Chapter mode={mode} className="chapmark" threshold={0.5}>
      <div className="wrap chapmark__inner">
        <BrandMark brand={brand} mode={mode} size={40} />
        <div className="chapmark__meta">
          <span className="chapmark__count">{String(count).padStart(2, "0")} campaigns</span>
          <span className="chapmark__axis">
            {brand === "LOTTO" ? "Everyday, everywhere" : "For the serious"}
          </span>
        </div>
      </div>
    </Chapter>
  );
}


export function Scenes() {
  const lotto = campaigns.filter((c) => brandFor(c) === "LOTTO");
  const one8 = campaigns.filter((c) => brandFor(c) === "ONE8");

  return (
    <div id="scenes">
      <Chapter mode="dark" className="bay--tight">
        <div className="wrap">
          <div className="eyebrow rise">Campaigns — ten activations</div>
          <h2 className="h-lg" style={{ maxWidth: "16ch" }}>
            <Split text="Do things." stagger={28} />
            <Split text="Don't just" stagger={28} delay={170} />
            <Split text="say things." className="chrome" stagger={28} delay={340} />
          </h2>
          <p className="body-lg rise rise-d2" style={{ maxWidth: "54ch", marginTop: "1.4rem" }}>
            Each one starts from a reality, belongs to a single shoe, and leaves
            something real behind. Seven for Lotto, three for one8.
          </p>

          <div className="index-grid">
            {campaigns.map((c, i) => (
              <button
                key={c.id}
                className="index-cell"
                data-cur="Open"
                onClick={() => goTo(`camp-${c.id}`)}
              >
                <span className="index-cell__n">
                  {String(i + 1).padStart(2, "0")} — {brandFor(c) === "LOTTO" ? "Lotto" : "one8"}
                </span>
                <span className="index-cell__name">{c.name}</span>
                <span className="index-cell__line">{c.tagline}</span>
              </button>
            ))}
          </div>
        </div>
      </Chapter>

      <CampaignBreak brand="LOTTO" count={lotto.length} />
      {lotto.map((c, i) => (
        <Case key={c.id} c={c} n={i + 1} total={lotto.length} />
      ))}

      <CampaignBreak brand="ONE8" count={one8.length} />
      {one8.map((c, i) => (
        <Case key={c.id} c={c} n={i + 1} total={one8.length} />
      ))}
    </div>
  );
}
