"use client";

import { Split } from "@/components/ui/split";

const METRICS = [
  { n: "3.34M", l: "Tennis-ball matches a year" },
  { n: "11", l: "Shoes for Indian ground" },
  { n: "10", l: "Reusable tech platforms" },
  { n: "15", l: "Cities in the Combine" },
];

export function Brands() {
  return (
    <section className="vent" id="brands">
      <div className="wrap bay--tight">
        <div className="duo">
          <div className="duo__cell" data-cur="Lotto">
            <div className="duo__idx" style={{ color: "var(--lotto)" }}>
              01 — Lotto — Everyday
            </div>
            <h3 className="h-md duo__h">
              <Split text="The best-engineered shoe a normal person can actually afford." mode="word" stagger={26} />
            </h3>
            <p className="body duo__p">
              For the sports and streets they use every day. Italian sportswear
              heritage meeting the Indian street — bright, real, unpolished.
            </p>
          </div>

          <div className="duo__cell" data-cur="one8">
            <div className="duo__idx" style={{ color: "var(--one8)" }}>
              02 — one8 — Elite
            </div>
            <h3 className="h-md duo__h">
              <Split text="The high-performance brand, built on discipline." mode="word" stagger={26} />
            </h3>
            <p className="body duo__p">
              Founded by Virat Kohli, aimed at the serious athlete.
              Nobody&apos;s born ready.
            </p>
          </div>
        </div>
      </div>


      <div className="wrap">
        <div className="metrics">
          {METRICS.map((m, i) => (
            <div className="metric rise" style={{ transitionDelay: `${i * 90}ms` }} key={m.n + i}>
              <div className="metric__n chrome">{m.n}</div>
              <div className="metric__l">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
