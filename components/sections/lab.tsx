"use client";

import { useEffect, useRef, useState } from "react";
import { technologies, shoes } from "@/data/products";
import { Split } from "@/components/ui/split";
import { goTo } from "@/lib/scroll";
import { set, claimStage } from "@/lib/store";
import { isWetPlatform } from "@/lib/worlds";
import { AssetImage } from "@/components/ui/asset";
import { macroFor, schematicFor, wantMacro, wantSchematic } from "@/lib/assets";

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
  const [way, setWay] = useState<string | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    if (saved) {
      setWay(saved);
      set({ custom: saved });
    }
  }, []);

  /* Selection is driven by scroll position through the track, so the section
     reveals itself platform by platform as you move down it. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / span));
      const i = Math.min(technologies.length - 1, Math.floor(p * technologies.length));
      setSel((prev) => (prev === i ? prev : i));
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
  }, []);


  /* The lab owns the object while it is on screen, and the world turns wet
     when the selected platform's whole argument is water. */
  useEffect(() => {
    set({
      tech: sel,
      mode: "dark",
      world: isWetPlatform(technologies[sel].id) ? "lab:wet" : "lab",
    });
  }, [sel]);

  /* A macro photograph, once one exists, outranks the 3D stand-in. */
  const macro = macroFor(technologies[sel].id);
  const schematic = schematicFor(technologies[sel].id);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) claimStage(macro ? null : slot.current); },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [macro]);

  /** Clicking a platform scrolls to its position so scroll and state agree. */
  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const y = el.offsetTop + (span * (i + 0.5)) / technologies.length;
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (l) l.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
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
    <section className="vent lab" id="lab" data-mode="dark">
      <div className="wrap bay--tight">
        <div className="eyebrow rise">Technology — ten platforms</div>
        <h2 className="h-lg" style={{ maxWidth: "18ch" }}>
          <Split text="Named. Reusable." stagger={26} />
          <Split text="Real." className="chrome" stagger={26} delay={200} />
        </h2>
        <p className="body-lg rise rise-d2" style={{ maxWidth: "52ch", marginTop: "1.4rem" }}>
          Building blocks that live under many shoes and improve over years —
          honest about what is proven and what is still a target. Keep scrolling
          to move through them, or jump straight to one.
        </p>
      </div>

      <div className="lab__track" ref={track}>
        <div className="lab__sticky">
          <div className="wrap lab__grid">
            <div className="lab__index">
              {technologies.map((tech, i) => (
                <button
                  key={tech.id}
                  className={`lab__row ${i === sel ? "is-on" : ""}`}
                  onClick={() => jump(i)}
                  data-cur="Inspect"
                  aria-pressed={i === sel}
                >
                  <span className="lab__row-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="lab__row-name">{tech.name}</span>
                </button>
              ))}
              <div className="lab__meter" aria-hidden>
                <span style={{ transform: `scaleY(${(sel + 1) / technologies.length})` }} />
              </div>
            </div>


            <div className="lab__panel is-swap" key={sel}>
              <div className="lab__panel-tag">
                Platform {String(sel + 1).padStart(2, "0")} / {technologies.length}
                {isWetPlatform(t.id) && <span className="lab__wet">· wet</span>}
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
                    <button key={s.id} className="chip" data-cur="Go" onClick={() => goTo(`shoe-${s.id}`)}>
                      {s.name}
                    </button>
                  ))}
                </div>

                <div className="tuner">
                  <div className="tuner__head">
                    <span className="tuner__title">
                      Colourway — {way ? WAYS.find((x) => x.hex === way)?.name ?? "Custom" : "Follow shoe"}
                    </span>
                    <button className="tuner__reset" data-cur="Reset" onClick={() => chooseWay(null)}>
                      Reset
                    </button>
                  </div>
                  <div className="tuner__swatches">
                    {WAYS.map((x) => (
                      <button
                        key={x.id}
                        className={`sw ${way === x.hex ? "is-on" : ""}`}
                        style={{ background: x.hex }}
                        onClick={() => chooseWay(x.hex)}
                        aria-label={x.name}
                        data-cur={x.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Media column: the shoe explodes into layers here, or the macro
                photograph takes over once one has been shot. */}
            <div className="lab__media">
              <div className="slot lab__stage" ref={slot}>
                <AssetImage
                  src={macro}
                  want={wantMacro(t.id)}
                  alt={`${t.name} — macro detail`}
                  ratio="1"
                  note="Macro detail"
                />
              </div>
              <div className="lab__schematic">
                <AssetImage
                  src={schematic}
                  want={wantSchematic(t.id)}
                  alt={`${t.name} — schematic`}
                  ratio="16 / 9"
                  note="Mechanism schematic"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
