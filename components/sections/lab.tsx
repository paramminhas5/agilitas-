"use client";

import { useEffect, useRef, useState } from "react";
import { technologies, shoes } from "@/data/products";
import { Split } from "@/components/ui/split";
import { goTo } from "@/lib/scroll";
import { set } from "@/lib/store";

/** Cold colourways offered by the tuner. */
const WAYS = [
  { id: "signal", hex: "#7DF9E8", name: "Signal" },
  { id: "ice", hex: "#A9C6D8", name: "Ice" },
  { id: "ion", hex: "#8A7CFF", name: "Ion" },
  { id: "azure", hex: "#5FB8FF", name: "Azure" },
  { id: "pearl", hex: "#C3CBD1", name: "Pearl" },
  { id: "brass", hex: "#D8CFA8", name: "Brass" },
];

const KEY = "agilitas.way";

export function Lab() {
  const [sel, setSel] = useState(0);
  const [swap, setSwap] = useState(0);
  const [way, setWay] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Restore the visitor's colourway for the session.
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    if (saved) {
      setWay(saved);
      set({ custom: saved });
    }
  }, []);

  const pick = (i: number) => {
    setSel(i);
    setSwap((n) => n + 1);
    set({ tech: i });
  };

  const chooseWay = (hex: string | null) => {
    setWay(hex);
    set({ custom: hex });
    if (hex) sessionStorage.setItem(KEY, hex);
    else sessionStorage.removeItem(KEY);
  };

  const t = technologies[sel];
  const used = shoes.filter((s) => s.technologies.includes(t.id));


  return (
    <section className="vent lab" id="lab">
      <div className="wrap bay">
        <div className="eyebrow rise">Technology — ten platforms</div>
        <h2 className="h-lg" style={{ maxWidth: "18ch" }}>
          <Split text="Named. Reusable." stagger={26} />
          <Split text="Real." className="chrome" stagger={26} delay={200} />
        </h2>
        <p className="body-lg rise rise-d2" style={{ maxWidth: "52ch", marginTop: "1.4rem" }}>
          Building blocks that live under many shoes and improve over years —
          honest about what is proven and what is still a target. Select any
          platform to inspect it.
        </p>

        <div className="lab__grid" style={{ marginTop: "3.5rem" }}>
          <div className="lab__index">
            {technologies.map((tech, i) => (
              <button
                key={tech.id}
                className={`lab__row ${i === sel ? "is-on" : ""}`}
                onClick={() => pick(i)}
                data-cur="Inspect"
                aria-pressed={i === sel}
              >
                <span className="lab__row-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="lab__row-name">{tech.name}</span>
              </button>
            ))}
          </div>


          <div className="lab__panel is-swap" ref={panel} key={swap}>
            <div className="lab__panel-tag">
              Platform {String(sel + 1).padStart(2, "0")} / {technologies.length}
            </div>
            <h3 className="lab__panel-name chrome">{t.name}</h3>
            <p className="lab__panel-line">{t.tagline}</p>
            <p className="body lab__panel-body">{t.description}</p>
            <div className="lab__panel-detail">{t.detail}</div>

            <div className="lab__panel-foot">
              <div className="lab__used">
                Fitted to {used.length} {used.length === 1 ? "shoe" : "shoes"}
              </div>
              <div className="lab__chips">
                {used.map((s) => (
                  <button
                    key={s.id}
                    className="chip"
                    data-cur="Go"
                    onClick={() => goTo(`shoe-${s.id}`)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="tuner">
                <div className="tuner__head">
                  <span className="tuner__title">
                    Colourway — {way ? WAYS.find((w) => w.hex === way)?.name ?? "Custom" : "Follow shoe"}
                  </span>
                  <button className="tuner__reset" data-cur="Reset" onClick={() => chooseWay(null)}>
                    Reset
                  </button>
                </div>
                <div className="tuner__swatches">
                  {WAYS.map((w) => (
                    <button
                      key={w.id}
                      className={`sw ${way === w.hex ? "is-on" : ""}`}
                      style={{ background: w.hex }}
                      onClick={() => chooseWay(w.hex)}
                      aria-label={w.name}
                      data-cur={w.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
