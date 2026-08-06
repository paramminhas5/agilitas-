"use client";

import { useEffect, useRef, useState } from "react";
import { shoes, technologies, type Shoe } from "@/data/products";
import { Split } from "@/components/ui/split";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";
import { artFor, wantArt } from "@/lib/assets";
import { AssetImage } from "@/components/ui/asset";

function Berth({ shoe, i, onEnter }: { shoe: Shoe; i: number; onEnter: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const techs = technologies.filter((t) => shoe.technologies.includes(t.id));
  const art = artFor(shoe.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        onEnter(i);
        // The berth frame belongs to the photograph. Only the world changes.
        claimStage(null);
        set({ world: `shoe:${shoe.id}`, formId: shoe.id });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [i, onEnter, shoe.id, art]);

  return (
    <section
      className="berth vent"
      id={`shoe-${shoe.id}`}
      ref={ref}
      style={{ ["--accent" as string]: shoe.accent }}
    >
      <div className="berth__inner">
        <div className="berth__lead">
          <div className="berth__badge" style={{ color: shoe.accent, borderColor: `${shoe.accent}44` }}>
            {shoe.brand} — {String(shoe.order).padStart(2, "0")} / 11
          </div>

          <h2 className="berth__name" style={{ color: shoe.accent }}>
            <Split text={shoe.name} stagger={34} />
          </h2>
          <p className="berth__sub">{shoe.subtitle}</p>
          <p className="berth__why">{shoe.whyWeMadeIt}</p>

          {/* The single most important sentence on the page gets to behave
              like one, instead of being buried in a box. */}
          <p className="berth__value rise" style={{ ["--accent" as string]: shoe.accent }}>
            {shoe.value}
          </p>


          <div className="deck rise">
            <div className="deck__cell">
              <span className="deck__code deck__code--a">A</span>
              <div className="deck__label">{shoe.purposeA.label}</div>
              <div className="deck__text">{shoe.purposeA.description}</div>
            </div>
            <div className="deck__cell">
              <span className="deck__code deck__code--b">B</span>
              <div className="deck__label">{shoe.purposeB.label}</div>
              <div className="deck__text">{shoe.purposeB.description}</div>
            </div>
            <div className="deck__cell">
              <span className="deck__code deck__code--s">S</span>
              <div className="deck__label">{shoe.purposeS.label}</div>
              <div className="deck__text">{shoe.purposeS.description}</div>
            </div>
          </div>

          <div className="strip rise rise-d1">
            <div className="strip__cell">
              <div className="strip__title">Features &amp; specs</div>
              <div className="strip__text">{shoe.features}</div>
            </div>
            <div className="strip__cell">
              <div className="strip__title">Who it&apos;s for</div>
              <div className="strip__text">{shoe.whoItsFor}</div>
            </div>
          </div>

          <div className="berth__chips rise rise-d2">
            {techs.map((t) => (
              <button key={t.id} className="chip" data-cur="Inspect" onClick={() => goTo("lab")}>
                {t.name}
              </button>
            ))}
          </div>
        </div>


        {/* Reserved column. The 3D object is projected into this exact box,
            so it can never overlap the copy. Real art replaces it. */}
        <div className="berth__void slot" ref={slot}>
          <AssetImage
            src={art}
            want={wantArt(shoe.id)}
            alt={`${shoe.name} — ${shoe.subtitle}`}
            ratio="1"
            note={`${shoe.name} · product art`}
          />
        </div>
      </div>
    </section>
  );
}


export function Journey() {
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const [hud, setHud] = useState(false);

  const onEnter = (i: number) => {
    setActive(i);
    set({ shoe: i, accent: shoes[i].accent });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setHud(e.isIntersecting),
      { threshold: 0, rootMargin: "-18% 0px -18% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      set({ shoe: -1 });
    };
  }, []);

  return (
    <div className="journey" id="journey" ref={ref}>
      <div className="wrap bay--tight">
        <div className="eyebrow rise">The lineup — eleven shoes</div>
        <h2 className="h-lg" style={{ maxWidth: "20ch" }}>
          <Split text="Built backwards" stagger={26} />
          <Split text="from reality." className="chrome" stagger={26} delay={190} />
        </h2>
        <p className="body-lg rise rise-d2" style={{ maxWidth: "54ch", marginTop: "1.4rem" }}>
          A — the reason you buy it. B — the bonus. S — the surprise that seals
          it. One shoe, three uses, stated plainly every time.
        </p>
      </div>

      <div className={`hud ${hud ? "is-on" : ""}`}>
        {shoes.map((s, i) => (
          <button
            key={s.id}
            className={`hud__tick ${i === active ? "is-on" : ""}`}
            onClick={() => goTo(`shoe-${s.id}`)}
            data-cur={s.name}
          >
            <span className="hud__tick-bar" />
            {String(s.order).padStart(2, "0")}
          </button>
        ))}
      </div>

      {shoes.map((s, i) => (
        <Berth key={s.id} shoe={s} i={i} onEnter={onEnter} />
      ))}
    </div>
  );
}
