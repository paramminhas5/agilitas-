"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { campaigns, shoes, type Campaign } from "@/data/products";
import { Split } from "@/components/ui/split";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";
import { AssetFilm } from "@/components/ui/asset";
import { posterFor, filmFor, wantFilm } from "@/lib/assets";

/** Each campaign gets its own light. Cold palette throughout. */
const WASH: Record<string, CSSProperties> = {
  "the-trial": {
    background:
      "radial-gradient(90% 60% at 50% 0%, rgba(125,249,232,0.07), transparent 70%), repeating-linear-gradient(90deg, transparent 0 78px, rgba(237,235,230,0.028) 78px 79px)",
  },
  "midnight-galli": {
    background:
      "radial-gradient(30% 45% at 18% 32%, rgba(138,124,255,0.16), transparent 72%), radial-gradient(26% 40% at 78% 68%, rgba(95,184,255,0.12), transparent 74%)",
  },
  "take-them-off": {
    background:
      "linear-gradient(100deg, transparent 42%, rgba(237,235,230,0.05) 50%, transparent 58%), radial-gradient(60% 70% at 88% 50%, rgba(169,198,216,0.09), transparent 72%)",
  },
  "10pm-league": {
    background:
      "radial-gradient(22% 34% at 12% 14%, rgba(169,198,216,0.16), transparent 70%), radial-gradient(22% 34% at 88% 14%, rgba(169,198,216,0.14), transparent 70%), linear-gradient(to bottom, rgba(138,124,255,0.05), transparent 55%)",
  },
  "beta-sessions": {
    background:
      "radial-gradient(70% 55% at 50% 60%, rgba(111,227,196,0.09), transparent 74%), linear-gradient(to top, rgba(237,235,230,0.035), transparent 45%)",
  },
  "sunday-session": {
    background:
      "linear-gradient(170deg, rgba(185,168,255,0.10), transparent 46%), radial-gradient(60% 40% at 30% 90%, rgba(237,235,230,0.04), transparent 72%)",
  },
  "dry-by-morning": {
    background:
      "linear-gradient(to bottom, rgba(79,216,232,0.09), transparent 40%), repeating-linear-gradient(78deg, transparent 0 15px, rgba(169,198,216,0.05) 15px 16px)",
  },
  "the-rain-locked-drop": {
    background: "radial-gradient(80% 60% at 50% 20%, rgba(95,184,255,0.10), transparent 72%)",
  },
  "rain-locked-drop": {
    background:
      "radial-gradient(70% 50% at 26% 24%, rgba(95,184,255,0.13), transparent 72%), linear-gradient(to bottom, transparent 60%, rgba(138,124,255,0.07))",
  },
  "thousand-riders": {
    background:
      "radial-gradient(16% 24% at 22% 72%, rgba(111,227,196,0.14), transparent 70%), radial-gradient(16% 24% at 52% 40%, rgba(216,207,168,0.10), transparent 70%), radial-gradient(16% 24% at 80% 66%, rgba(169,198,216,0.12), transparent 70%)",
  },
  "ball-maker-capsule": {
    background:
      "radial-gradient(65% 55% at 72% 44%, rgba(216,207,168,0.11), transparent 74%), linear-gradient(to bottom, rgba(237,235,230,0.03), transparent 40%)",
  },
};


/** Campaigns name their shoe in prose; map that back to a silhouette. */
function formForCampaign(label: string) {
  const hit = shoes.find((s) => label.toLowerCase().includes(s.name.toLowerCase()));
  return hit?.id ?? "alleys";
}

function Scene({ c, n }: { c: Campaign; n: number }) {
  const ref = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  // Take over the world and the object as this scene claims the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        claimStage(slot.current);
        set({ world: `camp:${c.id}`, formId: formForCampaign(c.shoe) });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [c.id, c.shoe]);

  // Parallax the wash a little against the scroll for depth.
  useEffect(() => {
    const el = ref.current;
    const wash = el?.querySelector<HTMLElement>(".scene__wash");
    if (!el || !wash) return;
    let frame = 0;
    const run = () => {
      const r = el.getBoundingClientRect();
      const mid = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      wash.style.transform = `translate3d(0, ${(-mid * 7).toFixed(2)}%, 0) scale(1.1)`;
      frame = 0;
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
    <section className="scene vent" id={`camp-${c.id}`} ref={ref}>
      <div className="scene__wash" style={WASH[c.id] ?? {}} />
      <div className="scene__inner">
        <div>
          <div className="scene__no">
            Campaign {String(n).padStart(2, "0")} / {campaigns.length}
          </div>
          <button className="scene__shoe" data-cur="Go" onClick={() => goTo("journey")}>
            {c.shoe}
          </button>
          <h3 className="scene__name">
            <Split text={c.name} stagger={30} />
          </h3>
          <p className="scene__line">{c.tagline}</p>
          <p className="body-lg scene__body rise rise-d1">{c.description}</p>

          {/* The treatment itself. Silent loop; falls back to a poster, then
              to a labelled frame stating exactly what to drop in. */}
          <div className="scene__film rise rise-d2">
            <AssetFilm
              src={filmFor(c.id)}
              poster={posterFor(c.id)}
              want={wantFilm(c.id)}
              alt={`${c.name} — treatment film`}
              ratio="16 / 9"
            />
            <div className="scene__film-cap">
              Treatment — {c.name.toLowerCase()}
            </div>
          </div>
        </div>

        <div className="dossier rise rise-d2">
          <div className="dossier__cell">
            <div className="dossier__k dossier__k--film">The film</div>
            <div className="dossier__v">{c.film}</div>
          </div>
          <div className="dossier__cell">
            <div className="dossier__k dossier__k--gtm">Go to market</div>
            <div className="dossier__v">{c.gtm}</div>
          </div>
        </div>
      </div>

      {/* Reserved box for the object in this scene */}
      <div className="slot scene__stage" ref={slot} aria-hidden />
    </section>
  );
}


export function Scenes() {
  return (
    <div id="scenes">
      <div className="wrap bay--tight">
        <div className="eyebrow rise">Campaigns — ten activations</div>
        <h2 className="h-lg" style={{ maxWidth: "16ch" }}>
          <Split text="Do things." stagger={28} />
          <Split text="Don't just" stagger={28} delay={170} />
          <Split text="say things." className="chrome" stagger={28} delay={340} />
        </h2>
        <p className="body-lg rise rise-d2" style={{ maxWidth: "54ch", marginTop: "1.4rem" }}>
          Each one starts from a reality, belongs to a single shoe, and leaves
          something real behind. No hero. No celebrity.
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
                {String(i + 1).padStart(2, "0")} — {c.shoe}
              </span>
              <span className="index-cell__name">{c.name}</span>
              <span className="index-cell__line">{c.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      {campaigns.map((c, i) => (
        <Scene key={c.id} c={c} n={i + 1} />
      ))}
    </div>
  );
}
