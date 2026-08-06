"use client";

import { useEffect, useRef, useState } from "react";
import { shoes, technologies, type Shoe } from "@/data/products";
import { Split } from "@/components/ui/split";
import { Chapter } from "@/components/ui/chapter";
import { BrandMark } from "@/components/ui/brand-mark";
import { AssetImage } from "@/components/ui/asset";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";
import { artFor, wantArt, modelFor } from "@/lib/assets";
import { OrbitSlot } from "@/components/ui/orbit-slot";
import { AmbienceLayer } from "@/components/ui/ambience";
import { accentFor, modeForBrand } from "@/lib/theme";

const LOTTO = shoes.filter((s) => s.brand === "LOTTO");
const ONE8 = shoes.filter((s) => s.brand === "ONE8");

/** A full-bleed break so the two brands never blur into one another. */
function BrandBreak({
  brand, count, axis,
}: {
  brand: "LOTTO" | "ONE8";
  count: number;
  axis: string;
}) {
  const mode = modeForBrand(brand);
  return (
    <Chapter mode={mode} className="chapmark" threshold={0.5}>
      <div className="wrap chapmark__inner">
        <BrandMark brand={brand} mode={mode} size={40} />
        <div className="chapmark__meta">
          <span className="chapmark__count">
            {String(count).padStart(2, "0")} {count === 1 ? "shoe" : "shoes"}
          </span>
          <span className="chapmark__axis">{axis}</span>
        </div>
      </div>
    </Chapter>
  );
}


/**
 * Scroll position inside a pinned berth, expressed as a reveal step. The berth
 * holds still while its own content assembles, then releases to the next shoe.
 * Pinning is skipped on narrow viewports, where scrubbing fights the browser —
 * there the whole panel is simply shown.
 */
function useBerthStep(track: React.RefObject<HTMLElement | null>, steps = 5) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      setStep(steps);
      return;
    }
    let frame = 0;
    const read = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return setStep(steps);
      const p = Math.min(1, Math.max(0, -r.top / span));
      // Complete by ~60% of the track, so the last stretch is release rather
      // than the reader still waiting for content.
      const next = Math.min(steps, Math.floor((p / 0.6) * steps));
      setStep((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    read();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [track, steps]);

  return step;
}

function Berth({ shoe, index, onEnter }: { shoe: Shoe; index: number; onEnter: (i: number) => void }) {
  const techs = technologies.filter((t) => shoe.technologies.includes(t.id));
  const art = artFor(shoe.id);
  const model = modelFor(shoe.id);
  const mode = modeForBrand(shoe.brand);
  const accent = accentFor(shoe.accent, mode);
  const slot = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  // 4 stages now: A, B, S, then the spec strip. Why and the value are always on.
  const step = useBerthStep(track, 4);
  const on = (n: number) => (step >= n ? "stg-in" : "");

  return (
    <Chapter
      mode={mode}
      id={`shoe-${shoe.id}`}
      className="berth"
      threshold={0.35}
      elRef={track}
      style={{ ["--accent" as string]: accent }}
      onEnter={() => {
        onEnter(index);
        // Model, then photograph, then labelled frame. Only a real model takes
        // the slot; where there is a photograph it owns the frame outright.
        claimStage(model ? slot.current : null);
        set({ world: `shoe:${shoe.id}`, formId: shoe.id });
      }}
    >
      <AmbienceLayer world={`shoe:${shoe.id}`} />

      <div className="berth__pin">
      <div className="berth__inner" style={{ ["--accent" as string]: accent }}>
        <div className="berth__lead">
          <div className="berth__badge" style={{ color: accent, borderColor: `${accent}55` }}>
            {shoe.brand} — {String(shoe.order).padStart(2, "0")} / 11
          </div>

          <h2 className="berth__name" style={{ color: accent }}>
            <Split text={shoe.name} stagger={34} />
          </h2>
          <p className="berth__sub">{shoe.subtitle}</p>
          {/* Present from the moment you arrive. Staging these behind a scrub
              meant landing on a shoe and being shown almost nothing. */}
          <p className="berth__why">{shoe.whyWeMadeIt}</p>

          <div className="berth__value">
            <span className="berth__value-k">The value</span>
            <p className="berth__value-v">{shoe.value}</p>
          </div>

          {/* A, then B, then S — each arrives on its own as you scroll the
              pinned berth, so the argument is made in order. */}
          <div className="deck">
            {([
              ["A", shoe.purposeA],
              ["B", shoe.purposeB],
              ["S", shoe.purposeS],
            ] as const).map(([code, p], i) => (
              <div className={`deck__cell stg ${on(1 + i)}`} key={code}>
                <span className={`deck__code deck__code--${code.toLowerCase()}`}>{code}</span>
                <div className="deck__label">{p.label}</div>
                <div className="deck__text">{p.description}</div>
              </div>
            ))}
          </div>

          <div className="strip">
            <div className={`strip__cell stg ${on(4)}`}>
              <div className="strip__title">Features &amp; specs</div>
              <div className="strip__text">{shoe.features}</div>
            </div>
            <div className={`strip__cell stg ${on(4)}`}>
              <div className="strip__title">Who it&apos;s for</div>
              <div className="strip__text">{shoe.whoItsFor}</div>
            </div>
          </div>

          <div className={`berth__chips stg ${on(4)}`}>
            {techs.map((t) => (
              <button key={t.id} className="chip" data-cur="Inspect" onClick={() => goTo("lab")}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="berth__void" ref={slot}>
          {model ? (
            <OrbitSlot />
          ) : (
            <AssetImage
              src={art}
              want={wantArt(shoe.id)}
              alt={`${shoe.name} — ${shoe.subtitle}`}
              ratio="1"
              note={`${shoe.name} · product art`}
            />
          )}
        </div>
      </div>
      </div>

      {/* Progress through this one shoe */}
      <div className="berth__meter" aria-hidden>
        <span style={{ transform: `scaleX(${step / 4})` }} />
      </div>
    </Chapter>
  );
}


export function Journey() {
  const [active, setActive] = useState(-1);
  const [hud, setHud] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onEnter = (i: number) => {
    setActive(i);
    set({ shoe: i, accent: shoes[i].accent });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHud(e.isIntersecting), {
      threshold: 0,
      rootMargin: "-18% 0px -18% 0px",
    });
    io.observe(el);
    return () => {
      io.disconnect();
      set({ shoe: -1 });
    };
  }, []);

  return (
    <div className="journey" id="journey" ref={ref}>
      <Chapter mode="dark" className="bay--tight">
        <div className="wrap">
          <div className="eyebrow rise">The lineup — eleven shoes</div>
          <h2 className="h-lg" style={{ maxWidth: "20ch" }}>
            <Split text="Built backwards" stagger={26} />
            <Split text="from reality." className="chrome" stagger={26} delay={190} />
          </h2>
          <p className="body-lg rise rise-d2" style={{ maxWidth: "54ch", marginTop: "1.4rem" }}>
            A — the reason you buy it. B — the bonus. S — the surprise that
            seals it. Eight organised by surface, three by the day.
          </p>
        </div>
      </Chapter>

      <div className={`hud ${hud ? "is-on" : ""}`}>
        {shoes.map((s, i) => (
          <button
            key={s.id}
            className={`hud__tick ${i === active ? "is-on" : ""} ${
              s.brand === "ONE8" ? "hud__tick--one8" : ""
            }`}
            onClick={() => goTo(`shoe-${s.id}`)}
            data-cur={s.name}
          >
            <span className="hud__tick-bar" />
            {String(s.order).padStart(2, "0")}
          </button>
        ))}
      </div>

      <BrandBreak brand="LOTTO" count={LOTTO.length} axis="Engineered by surface" />
      {LOTTO.map((s) => (
        <Berth key={s.id} shoe={s} index={shoes.indexOf(s)} onEnter={onEnter} />
      ))}

      <BrandBreak brand="ONE8" count={ONE8.length} axis="Engineered by day" />
      {ONE8.map((s) => (
        <Berth key={s.id} shoe={s} index={shoes.indexOf(s)} onEnter={onEnter} />
      ))}
    </div>
  );
}
