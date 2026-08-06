"use client";

import { ICONS, type IconProduct } from "@/lib/icons";
import { shoes } from "@/data/products";
import { Split } from "@/components/ui/split";
import { AssetImage } from "@/components/ui/asset";
import { Chapter } from "@/components/ui/chapter";
import { BrandMark } from "@/components/ui/brand-mark";
import { artFor, wantArt, modelFor } from "@/lib/assets";
import { OrbitSlot } from "@/components/ui/orbit-slot";
import { AmbienceLayer } from "@/components/ui/ambience";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";
import { accentFor, modeForBrand } from "@/lib/theme";
import { useRef } from "react";

function Icon({ item, n }: { item: IconProduct; n: number }) {
  const shoe = shoes.find((s) => s.id === item.shoeId);
  const art = artFor(item.shoeId);
  const model = modelFor(item.shoeId);
  const mode = modeForBrand(item.brand);
  const accent = accentFor(shoe?.accent ?? "#A9C6D8", mode);
  const slot = useRef<HTMLDivElement>(null);

  return (
    <Chapter
      mode={mode}
      id={`icon-${item.shoeId}`}
      className="icon"
      threshold={0.45}
      style={{ ["--accent" as string]: accent }}
      onEnter={() => {
        // Model, then photograph, then labelled frame.
        claimStage(model ? slot.current : null);
        set({ world: `shoe:${item.shoeId}`, formId: item.shoeId });
      }}
    >
      <AmbienceLayer world={`shoe:${item.shoeId}`} />

      <div className="icon__inner" style={{ ["--accent" as string]: accent }}>
        <div className="icon__lead">
          <div className="icon__index">
            {String(n).padStart(2, "0")} / 03
          </div>
          <BrandMark brand={item.brand} mode={mode} size={26} className="icon__mark" />
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

        <div className="icon__stage" ref={slot}>
          {model ? (
            <OrbitSlot label="Drag to turn" />
          ) : (
            <AssetImage
              src={art}
              want={wantArt(item.shoeId)}
              alt={`${item.formal} — ${shoe?.subtitle ?? ""}`}
              ratio="1"
              note="Hero product"
              priority={n === 1}
            />
          )}
        </div>
      </div>
    </Chapter>
  );
}

export function Icons() {
  return (
    <div id="icons">
      <Chapter mode="dark" className="bay--tight">
        <div className="wrap">
          <div className="eyebrow rise">The icons — three that lead</div>
          <h2 className="h-lg" style={{ maxWidth: "20ch" }}>
            <Split text="Three shoes" stagger={26} />
            <Split text="carry the line." className="chrome" stagger={26} delay={180} />
          </h2>
          <p className="body-lg rise rise-d2" style={{ maxWidth: "52ch", marginTop: "1.4rem" }}>
            Every brand has a shoe people name themselves. Two start on cement
            and in the rain. The third is where it gets serious.
          </p>
        </div>
      </Chapter>

      {ICONS.map((item, i) => (
        <Icon key={item.shoeId} item={item} n={i + 1} />
      ))}
    </div>
  );
}
