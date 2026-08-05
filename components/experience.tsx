"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shoes, technologies, campaigns } from "@/data/products";
import type { Shoe } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════
   SVG SHOE VISUAL — procedural, reliable, gorgeous with CSS 3D perspective
   ═══════════════════════════════════════════════════════════════════════════ */

function ShoeSVG({ accent, className = "" }: { accent: string; className?: string }) {
  return (
    <svg className={`showcase__shoe-svg ${className}`} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${accent.replace("#","")}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Sole */}
      <path d="M60 185 Q80 195 200 198 Q320 195 360 180 Q365 175 360 170 Q340 165 200 162 Q80 165 55 175 Q50 180 60 185Z" fill="#1a1a1a" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4" />
      {/* Midsole */}
      <path d="M65 175 Q85 182 200 185 Q320 182 355 170 Q358 165 355 160 Q335 155 200 152 Q85 155 62 165 Q58 170 65 175Z" fill="#111" stroke={accent} strokeWidth="0.3" strokeOpacity="0.3" />
      {/* Upper body */}
      <path d="M75 160 Q90 165 200 168 Q310 165 340 155 Q350 140 345 110 Q340 80 310 60 Q280 45 240 42 Q200 40 160 50 Q120 60 95 85 Q75 110 70 140 Q68 155 75 160Z" fill={`url(#grad-${accent.replace("#","")})`} fillOpacity="0.15" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Collar */}
      <path d="M95 85 Q130 60 175 52 Q200 50 220 52" fill="none" stroke={accent} strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Tongue */}
      <path d="M160 55 Q170 30 195 25 Q220 30 225 55" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.5" />
      {/* Toe cap */}
      <path d="M300 130 Q330 120 345 110 Q350 105 345 100 Q330 95 310 100" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      {/* Lace holes */}
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={155 + i * 18} cy={52 + i * 2} r="2.5" fill="none" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
      ))}
      {/* Accent swoosh */}
      <path d="M110 130 Q180 100 280 95 Q320 93 340 100" fill="none" stroke={accent} strokeWidth="2.5" strokeOpacity="0.8" strokeLinecap="round" filter="url(#glow)" />
      {/* Heel detail */}
      <path d="M80 130 Q75 145 78 155" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Outsole tread lines */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <line key={`t${i}`} x1={90 + i * 34} y1="190" x2={95 + i * 34} y2="195" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" />
      ))}
    </svg>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PDF GENERATION
   ═══════════════════════════════════════════════════════════════════════════ */

function usePdfDownload() {
  const [generating, setGenerating] = useState(false);
  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 15;
      const cw = 180;
      let y = margin;
      const addPage = () => { doc.addPage(); y = margin; };
      const check = (n: number) => { if (y + n > 280) addPage(); };

      // Cover
      doc.setFillColor(5, 5, 5); doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(240, 240, 240); doc.setFontSize(36); doc.setFont("helvetica", "bold");
      doc.text("LOTTO / ONE8", margin, 60);
      doc.setFontSize(12); doc.setFont("helvetica", "normal");
      doc.text("AGILITAS SPORTS \u2014 THE COMPLETE PORTFOLIO", margin, 75);
      doc.setFontSize(9); doc.setTextColor(150, 150, 150);
      doc.text("For fifty years, sports shoes have been designed for how people", margin, 100);
      doc.text("live somewhere else. We design for how India actually lives.", margin, 106);
      doc.setTextColor(0, 255, 136); doc.setFontSize(8);
      doc.text("Made here for forty years. Designed here from now.", margin, 130);
      doc.setTextColor(150, 150, 150); doc.setFontSize(7);
      doc.text("Prepared by Param Minhas, Creative Direction", margin, 280);

      // Tech
      addPage(); doc.setFillColor(5, 5, 5); doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(0, 255, 136); doc.setFontSize(8); doc.text("TECHNOLOGY PLATFORMS", margin, y); y += 10;
      doc.setTextColor(240, 240, 240); doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.text("Ten Platforms. Named. Reusable. Real.", margin, y); y += 14;
      technologies.forEach((t) => {
        check(22);
        doc.setTextColor(240, 240, 240); doc.setFontSize(10); doc.setFont("helvetica", "bold");
        doc.text(t.name, margin, y); y += 5;
        doc.setTextColor(0, 255, 136); doc.setFontSize(7); doc.setFont("helvetica", "normal");
        doc.text(t.tagline, margin, y); y += 4;
        doc.setTextColor(150, 150, 150); doc.setFontSize(8);
        const l = doc.splitTextToSize(t.description, cw); doc.text(l, margin, y); y += l.length * 4 + 6;
      });

      // Shoes
      shoes.forEach((s) => {
        addPage(); doc.setFillColor(5, 5, 5); doc.rect(0, 0, 210, 297, "F");
        doc.setTextColor(150, 150, 150); doc.setFontSize(7);
        doc.text(`${s.brand} \u2014 ${String(s.order).padStart(2, "0")} / 11`, margin, y); y += 8;
        doc.setTextColor(240, 240, 240); doc.setFontSize(24); doc.setFont("helvetica", "bold");
        doc.text(s.name, margin, y); y += 8;
        doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.text(s.subtitle, margin, y); y += 10;
        doc.setTextColor(150, 150, 150); doc.setFontSize(9);
        const w = doc.splitTextToSize(s.whyWeMadeIt, cw); doc.text(w, margin, y); y += w.length * 4.5 + 8;
        [{ code: "A", ...s.purposeA }, { code: "B", ...s.purposeB }, { code: "S", ...s.purposeS }].forEach((p) => {
          check(16);
          doc.setTextColor(0, 255, 136); doc.setFontSize(12); doc.setFont("helvetica", "bold");
          doc.text(p.code, margin, y);
          doc.setTextColor(240, 240, 240); doc.setFontSize(9); doc.text(p.label, margin + 10, y); y += 5;
          doc.setTextColor(150, 150, 150); doc.setFontSize(8); doc.setFont("helvetica", "normal");
          const d = doc.splitTextToSize(p.description, cw - 10); doc.text(d, margin + 10, y); y += d.length * 4 + 5;
        });
        check(12); doc.setTextColor(240, 240, 240); doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text("THE VALUE", margin, y); y += 4;
        doc.setFont("helvetica", "normal"); doc.setTextColor(150, 150, 150);
        const v = doc.splitTextToSize(s.value, cw); doc.text(v, margin, y); y += v.length * 4 + 4;
      });

      // Campaigns
      addPage(); doc.setFillColor(5, 5, 5); doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(0, 255, 136); doc.setFontSize(8); doc.text("CAMPAIGNS", margin, y); y += 10;
      doc.setTextColor(240, 240, 240); doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.text("Do Things, Don\u2019t Just Say Things.", margin, y); y += 14;
      campaigns.forEach((c) => {
        check(20);
        doc.setTextColor(240, 240, 240); doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text(c.name, margin, y);
        doc.setTextColor(150, 150, 150); doc.setFontSize(7); doc.setFont("helvetica", "normal");
        doc.text(`\u2014 ${c.shoe}`, margin + doc.getTextWidth(c.name + "  "), y); y += 5;
        doc.setTextColor(0, 255, 136); doc.setFontSize(8); doc.text(c.tagline, margin, y); y += 4;
        doc.setTextColor(150, 150, 150); const d = doc.splitTextToSize(c.description, cw); doc.text(d, margin, y); y += d.length * 4 + 6;
      });

      doc.save("Agilitas-LOTTO-ONE8-Portfolio.pdf");
    } catch (e) { console.error("PDF error:", e); } finally { setGenerating(false); }
  }, []);
  return { generate, generating };
}


/* ═══════════════════════════════════════════════════════════════════════════
   SHOE SHOWCASE — The centrepiece. Shoe in centre, features around it.
   ═══════════════════════════════════════════════════════════════════════════ */

function ShoeShowcase({ shoe }: { shoe: Shoe }) {
  const ref = useRef<HTMLElement>(null);
  const techs = technologies.filter((t) => shoe.technologies.includes(t.id));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none none" },
      });
      tl.from(ref.current!.querySelector(".showcase__header"), { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })
        .from(ref.current!.querySelector(".showcase__center"), { opacity: 0, scale: 0.85, duration: 1, ease: "power3.out" }, "-=0.4")
        .from(ref.current!.querySelectorAll(".feat"), { opacity: 0, x: (i) => (i < 2 ? -40 : 40), stagger: 0.12, duration: 0.7, ease: "power3.out" }, "-=0.6")
        .from(ref.current!.querySelectorAll(".pill"), { opacity: 0, y: 15, stagger: 0.05, duration: 0.4 }, "-=0.3");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="showcase" id={`shoe-${shoe.id}`} style={{ "--shoe-glow": `${shoe.accent}20` } as React.CSSProperties}>
      <div className="showcase__inner">
        {/* Header */}
        <div className="showcase__header">
          <div className="showcase__brand-tag" style={{ color: shoe.accent, borderColor: `${shoe.accent}60` }}>
            {shoe.brand} &mdash; {String(shoe.order).padStart(2, "0")} / 11
          </div>
          <h2 className="showcase__name" style={{ color: shoe.accent }}>{shoe.name}</h2>
          <p className="showcase__subtitle">{shoe.subtitle}</p>
          <p className="showcase__why">{shoe.whyWeMadeIt}</p>
        </div>

        {/* Left features (A) */}
        <div className="showcase__left">
          <div className="feat">
            <div className="feat__code feat__code--a">A</div>
            <div className="feat__label">{shoe.purposeA.label}</div>
            <div className="feat__desc">{shoe.purposeA.description}</div>
          </div>
          <div className="feat">
            <div className="feat__code feat__code--b">B</div>
            <div className="feat__label">{shoe.purposeB.label}</div>
            <div className="feat__desc">{shoe.purposeB.description}</div>
          </div>
        </div>

        {/* Centre: the shoe */}
        <div className="showcase__center">
          <div className="showcase__ring" />
          <div className="showcase__shoe-visual">
            <ShoeSVG accent={shoe.accent} />
          </div>
        </div>

        {/* Right features (S + value) */}
        <div className="showcase__right">
          <div className="feat">
            <div className="feat__code feat__code--s">S</div>
            <div className="feat__label">{shoe.purposeS.label}</div>
            <div className="feat__desc">{shoe.purposeS.description}</div>
          </div>
          <div className="feat" style={{ borderColor: `${shoe.accent}30` }}>
            <div className="feat__label" style={{ color: shoe.accent }}>THE VALUE</div>
            <div className="feat__desc">{shoe.value}</div>
          </div>
        </div>

        {/* Tech pills */}
        <div className="showcase__techs">
          {techs.map((t) => <span key={t.id} className="pill">{t.name}</span>)}
        </div>

        {/* Meta */}
        <div className="showcase__meta">
          <div className="showcase__meta-item">
            <div className="showcase__meta-label">Who It&apos;s For</div>
            <div className="showcase__meta-value">{shoe.whoItsFor}</div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPERIENCE — All sections composed
   ═══════════════════════════════════════════════════════════════════════════ */

export function Experience() {
  const { generate, generating } = usePdfDownload();
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeShoe, setActiveShoe] = useState(0);

  // Init smooth scroll & GSAP
  useEffect(() => {
    let lenis: any;
    import("lenis").then((mod) => {
      const Lenis = mod.default;
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    });
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  // Scroll progress
  useEffect(() => {
    const bar = document.querySelector(".scroll-bar") as HTMLElement;
    if (!bar) return;
    const update = () => { bar.style.transform = `scaleX(${window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)})`; };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // General gsap-hidden reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-hidden").forEach((el) => {
        gsap.to(el, { scrollTrigger: { trigger: el, start: "top 85%" }, opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div ref={mainRef}>
      <div className="noise" />
      <div className="scroll-bar" style={{ transform: "scaleX(0)" }} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav__logo">AGILITAS</div>
        <div className="nav__links">
          <span className="nav__link" onClick={() => scrollTo("hero")}>Home</span>
          <span className="nav__link" onClick={() => scrollTo("tech")}>Technology</span>
          <span className="nav__link" onClick={() => scrollTo("shoes")}>Shoes</span>
          <span className="nav__link" onClick={() => scrollTo("campaigns")}>Campaigns</span>
        </div>
        <button className="nav__cta" onClick={generate} disabled={generating}>
          {generating ? "Generating..." : "Download PDF"}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero__grid" />
        <div className="hero__tag"><span className="hero__dot" /> Agilitas Sports &mdash; Two Brands, One Vision</div>
        <h1 className="hero__h1">LOTTO<span className="hero__slash"> / </span>ONE8</h1>
        <p className="hero__sub">For fifty years, sports shoes have been designed for how people live somewhere else. We design for how <strong>India actually lives.</strong></p>
        <div className="hero__ctas">
          <button className="btn btn--fill" onClick={() => scrollTo("shoes")}>Explore the Lineup</button>
          <button className="btn btn--neon" onClick={() => scrollTo("tech")}>The Technology</button>
        </div>
        <div className="hero__scroll"><span>Scroll</span><div className="hero__scroll-line" /></div>
      </section>

      {/* BRANDS */}
      <div className="section gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>
        <div className="brands">
          <div className="brand-box">
            <div className="brand-box__label" style={{ color: "var(--lotto)" }}>LOTTO &mdash; EVERYDAY</div>
            <h3 className="brand-box__h">The best-engineered shoe a normal person can actually afford.</h3>
            <p className="brand-box__p">For the sports and streets they use every day. Italian sportswear heritage meeting the Indian street &mdash; bright, real, unpolished.</p>
          </div>
          <div className="brand-box">
            <div className="brand-box__label" style={{ color: "var(--one8)" }}>ONE8 &mdash; ELITE</div>
            <h3 className="brand-box__h">The high-performance brand, built on discipline.</h3>
            <p className="brand-box__p">Founded by Virat Kohli, aimed at the serious athlete. Nobody&apos;s born ready.</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="section gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>
        <div className="stats">
          {[
            { n: "3.34M", l: "Tennis-ball cricket matches/year" },
            { n: "11", l: "Shoes for Indian ground" },
            { n: "10", l: "Reusable tech platforms" },
            { n: "15", l: "Cities in the Combine" },
          ].map((s, i) => (
            <div key={i}><div className="stat__num">{s.n}</div><div className="stat__label">{s.l}</div></div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* TECHNOLOGY */}
      <section className="section" id="tech">
        <div className="section-label gsap-hidden" style={{ opacity: 0, transform: "translateY(20px)" }}>Technology Platforms</div>
        <h2 className="section-title gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>Ten Platforms.<br />Named. Reusable. Real.</h2>
        <p className="section-desc gsap-hidden" style={{ opacity: 0, transform: "translateY(20px)" }}>Building blocks that live under many shoes and improve over years. Some appear in nearly every shoe. Some solve exactly one problem.</p>
        <div className="tech-grid gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>
          {technologies.map((t) => (
            <div key={t.id} className="tech-card">
              <div className="tech-card__name">{t.name}</div>
              <div className="tech-card__tag">{t.tagline}</div>
              <p className="tech-card__desc">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* SHOES — centre-stage showcases */}
      <section id="shoes">
        <div className="section">
          <div className="section-label gsap-hidden" style={{ opacity: 0, transform: "translateY(20px)" }}>The Lineup</div>
          <h2 className="section-title gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>Eleven Shoes. Two Brands.<br />Built Backwards From Reality.</h2>
          <p className="section-desc gsap-hidden" style={{ opacity: 0, transform: "translateY(20px)" }}>A &mdash; the reason you buy it. B &mdash; the bonus. S &mdash; the surprise that seals it.</p>
          <div className="shoe-nav gsap-hidden" style={{ opacity: 0, transform: "translateY(15px)" }}>
            {shoes.map((s, i) => (
              <button key={s.id} className={`shoe-nav__btn ${i === activeShoe ? "shoe-nav__btn--active" : ""}`} onClick={() => { setActiveShoe(i); scrollTo(`shoe-${s.id}`); }} style={ i === activeShoe ? { borderColor: s.accent, color: s.accent } : undefined }>
                {s.name}
              </button>
            ))}
          </div>
        </div>
        {shoes.map((shoe) => (
          <ShoeShowcase key={shoe.id} shoe={shoe} />
        ))}
      </section>

      <div className="divider" />

      {/* CAMPAIGNS */}
      <section className="section" id="campaigns">
        <div className="section-label gsap-hidden" style={{ opacity: 0, transform: "translateY(20px)" }}>Campaigns</div>
        <h2 className="section-title gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>Do Things.<br />Don&apos;t Just Say Things.</h2>
        <p className="section-desc gsap-hidden" style={{ opacity: 0, transform: "translateY(20px)" }}>Each campaign starts from a reality, belongs to one shoe, and leaves something real behind.</p>
        <div className="campaigns-grid gsap-hidden" style={{ opacity: 0, transform: "translateY(30px)" }}>
          {campaigns.map((c) => (
            <div key={c.id} className="camp">
              <div className="camp__shoe">{c.shoe}</div>
              <h4 className="camp__name">{c.name}</h4>
              <p className="camp__tag">{c.tagline}</p>
              <p className="camp__desc">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__top">
          <div>
            <div className="footer__brand">AGILITAS</div>
            <p className="footer__tagline">Made here for forty years. Designed here from now. The first line of shoes in this country designed for the ground they&apos;ll actually be worn on.</p>
          </div>
          <div>
            <div className="footer__col-title">Brands</div>
            <a className="footer__link" href="#shoes">Lotto</a>
            <a className="footer__link" href="#shoes">one8</a>
          </div>
          <div>
            <div className="footer__col-title">Explore</div>
            <a className="footer__link" href="#tech">Technology</a>
            <a className="footer__link" href="#shoes">Shoes</a>
            <a className="footer__link" href="#campaigns">Campaigns</a>
          </div>
          <div>
            <div className="footer__col-title">Document</div>
            <button className="footer__link" onClick={generate}>Download PDF</button>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; 2025 Agilitas Sports. All rights reserved.</span>
          <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>PREPARED BY PARAM MINHAS</span>
        </div>
      </footer>

      {/* FIXED PDF BUTTON */}
      <button className="pdf-btn" onClick={generate} disabled={generating}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
        {generating ? "Generating..." : "PDF"}
      </button>
    </div>
  );
}
