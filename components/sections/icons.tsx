"use client";

import { useEffect, useRef } from "react";
import { ICONS, type IconProduct } from "@/lib/icons";
import { shoes } from "@/data/products";
import { Split } from "@/components/ui/split";
import { AssetImage } from "@/components/ui/asset";
import { artFor, wantArt } from "@/lib/assets";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";

function Icon({ item, n }: { item: IconProduct; n: number }) {
  const ref = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const shoe = shoes.find((s) => s.id === item.shoeId);
  const art = artFor(item.shoeId);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        // Once real art exists it becomes the hero, so the 3D object steps
        // aside rather than sitting on top of the photograph.
        claimStage(art ? null : slot.current);
        set({ world: `shoe:${item.shoeId}`, formId: item.shoeId });
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [item.shoeId, art]);

  return (
    <section
      className="icon"
      id={`icon-${item.shoeId}`}
      ref={ref}
      style={{ ["--accent" as string]: shoe?.accent ?? "var(--signal)" }}
    >
      <div className="icon__inner">
        <div className="icon__lead">
          <div className="icon__index">
            {String(n).padStart(2, "0")} / 03 — {item.brand}
          </div>
          <div className="icon__formal">{item.formal}</div>
          <h2 className="icon__street">
            <Split text={item.street} stagger={34} />
          </h2>
          <p className="icon__line">{item.line}</p>


          <div className="icon__metric rise">
            <div className="icon__metric-n chrome">{item.metric}</div>
            <div className="icon__metric-l">{item.metricLabel}</div>
          </div>

          <button
            className="act act--ghost icon__cta"
            data-cur="Open"
            onClick={() => goTo(`shoe-${item.shoeId}`)}
          >
            The full story
            <span className="act__arrow">→</span>
          </button>
        </div>

        <div className="icon__stage slot" ref={slot}>
          <AssetImage
            src={art}
            want={wantArt(item.shoeId)}
            alt={`${item.formal} — ${shoe?.subtitle ?? ""}`}
            ratio="1"
            note="Hero product"
            priority={n === 1}
          />
        </div>
      </div>
    </section>
  );
}

export function Icons() {
  return (
    <div id="icons">
      <div className="wrap bay--tight">
        <div className="eyebrow rise">The icons — three that lead</div>
        <h2 className="h-lg" style={{ maxWidth: "20ch" }}>
          <Split text="Three shoes" stagger={26} />
          <Split text="carry the line." className="chrome" stagger={26} delay={180} />
        </h2>
        <p className="body-lg rise rise-d2" style={{ maxWidth: "52ch", marginTop: "1.4rem" }}>
          Every brand has a shoe people name themselves. These are ours — the
          flagship, the everyday, and the one that started on cement.
        </p>
      </div>

      {ICONS.map((item, i) => (
        <Icon key={item.shoeId} item={item} n={i + 1} />
      ))}
    </div>
  );
}
