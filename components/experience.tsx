"use client";

import { useEffect, useRef, useState, useCallback, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shoes, technologies, campaigns } from "@/data/products";
import type { Shoe, Technology, Campaign } from "@/data/products";

// Lazy load the 3D components
const Shoe3D = lazy(() =>
  import("./shoe-3d").then((mod) => ({ default: mod.Shoe3D }))
);
const Shoe3DMini = lazy(() =>
  import("./shoe-3d").then((mod) => ({ default: mod.Shoe3DMini }))
);

gsap.registerPlugin(ScrollTrigger);

// ─── PDF Download ────────────────────────────────────────────────────────────

function usePdfDownload() {
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210;
      const margin = 15;
      const contentW = pageW - margin * 2;
      let y = margin;

      const addPage = () => { doc.addPage(); y = margin; };
      const checkSpace = (needed: number) => { if (y + needed > 280) addPage(); };


      // Cover page
      doc.setFillColor(5, 5, 5);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(240, 240, 240);
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.text("LOTTO / ONE8", margin, 60);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("AGILITAS SPORTS — THE COMPLETE PORTFOLIO", margin, 75);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("For fifty years, sports shoes have been designed for how people", margin, 100);
      doc.text("live somewhere else, then shipped here.", margin, 106);
      doc.text("We design for how India actually lives.", margin, 116);
      doc.setTextColor(0, 255, 136);
      doc.setFontSize(8);
      doc.text("Made here for forty years. Designed here from now.", margin, 140);

      // Technologies page
      addPage();
      doc.setFillColor(5, 5, 5);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(0, 255, 136);
      doc.setFontSize(8);
      doc.text("TECHNOLOGY PLATFORMS", margin, y);
      y += 10;
      doc.setTextColor(240, 240, 240);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Ten Platforms.", margin, y);
      y += 12;

      technologies.forEach((tech) => {
        checkSpace(25);
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(tech.name, margin, y);
        y += 5;
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(tech.tagline, margin, y);
        y += 5;
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        const lines = doc.splitTextToSize(tech.description, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 6;
      });


      // Shoes pages
      shoes.forEach((shoe) => {
        addPage();
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 297, "F");
        // Brand tag
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(7);
        doc.text(`${shoe.brand} — ${String(shoe.order).padStart(2, "0")}`, margin, y);
        y += 8;
        // Name
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(shoe.name, margin, y);
        y += 8;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(shoe.subtitle, margin, y);
        y += 12;
        // Why
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(9);
        const whyLines = doc.splitTextToSize(shoe.whyWeMadeIt, contentW);
        doc.text(whyLines, margin, y);
        y += whyLines.length * 4.5 + 8;
        // Purposes
        const purposes = [
          { code: "A", ...shoe.purposeA },
          { code: "B", ...shoe.purposeB },
          { code: "S", ...shoe.purposeS },
        ];
        purposes.forEach((p) => {
          checkSpace(18);
          doc.setTextColor(0, 255, 136);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(p.code, margin, y);
          doc.setTextColor(240, 240, 240);
          doc.setFontSize(9);
          doc.text(p.label, margin + 10, y);
          y += 5;
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          const descLines = doc.splitTextToSize(p.description, contentW - 10);
          doc.text(descLines, margin + 10, y);
          y += descLines.length * 4 + 5;
        });
        // Value
        checkSpace(15);
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("THE VALUE", margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        const valLines = doc.splitTextToSize(shoe.value, contentW);
        doc.text(valLines, margin, y);
        y += valLines.length * 4 + 5;
      });


      // Campaigns page
      addPage();
      doc.setFillColor(5, 5, 5);
      doc.rect(0, 0, 210, 297, "F");
      y = margin;
      doc.setTextColor(0, 255, 136);
      doc.setFontSize(8);
      doc.text("CAMPAIGNS", margin, y);
      y += 10;
      doc.setTextColor(240, 240, 240);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Do Things, Don\u2019t Just Say Things.", margin, y);
      y += 12;

      campaigns.forEach((c) => {
        checkSpace(22);
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(c.name, margin, y);
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`\u2014 ${c.shoe}`, margin + doc.getTextWidth(c.name + "  "), y);
        y += 5;
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(8);
        doc.text(c.tagline, margin, y);
        y += 5;
        doc.setTextColor(150, 150, 150);
        const dLines = doc.splitTextToSize(c.description, contentW);
        doc.text(dLines, margin, y);
        y += dLines.length * 4 + 6;
      });

      doc.save("Agilitas-LOTTO-ONE8-Portfolio.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }, []);

  return { generate, generating };
}


// ─── Smooth Scroll Hook ──────────────────────────────────────────────────────

function useLenis() {
  useEffect(() => {
    let lenis: any;
    import("lenis").then((mod) => {
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Sync ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);
    });
    return () => { if (lenis) lenis.destroy(); };
  }, []);
}

// ─── Navigation Component ────────────────────────────────────────────────────

function Navigation({ onDownload, generating }: { onDownload: () => void; generating: boolean }) {
  const sections = ["hero", "technology", "lineup", "shoes", "campaigns"];
  const labels = ["Home", "Technology", "Lineup", "Shoes", "Campaigns"];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="nav">
      <div className="nav__logo">AGILITAS</div>
      <div className="nav__links">
        {sections.map((s, i) => (
          <span key={s} className="nav__link" onClick={() => scrollTo(s)}>
            {labels[i]}
          </span>
        ))}
      </div>
      <button className="nav__cta" onClick={onDownload} disabled={generating}>
        {generating ? "Generating..." : "Download PDF"}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      </button>
    </nav>
  );
}


// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__badge", { opacity: 0, y: 20, duration: 0.8, delay: 0.3 })
        .from(".hero__title", { opacity: 0, y: 60, duration: 1 }, "-=0.4")
        .from(".hero__subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.5")
        .from(".hero__actions", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".hero__scroll-indicator", { opacity: 0, duration: 0.6 }, "-=0.2");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="grid-bg" />
      <div className="hero__badge">
        <span className="hero__badge-dot" />
        Agilitas Sports — Two Brands, One Vision
      </div>
      <h1 className="text-display hero__title">
        LOTTO<span className="hero__accent"> / </span>ONE8
      </h1>
      <p className="hero__subtitle">
        For fifty years, sports shoes have been designed for how people live somewhere else.
        We design for how <strong>India actually lives.</strong>
      </p>
      <div className="hero__actions" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <a href="#lineup" className="btn btn--primary">Explore the Lineup</a>
        <a href="#technology" className="btn btn--neon">The Technology</a>
      </div>
      <div className="hero__scroll-indicator">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}


// ─── Brand Split Section ─────────────────────────────────────────────────────

function BrandSplitSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".brand-split__item", {
        scrollTrigger: {
          trigger: ".brand-split",
          start: "top 80%",
        },
        opacity: 0,
        y: 60,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section brand-split" style={{ padding: "var(--section-padding) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
          <div className="brand-split__item" style={{ background: "var(--bg-card)", padding: "var(--space-2xl)" }}>
            <div className="text-label" style={{ color: "var(--accent-lotto)", marginBottom: "var(--space-md)" }}>LOTTO — EVERYDAY</div>
            <h3 className="text-title" style={{ marginBottom: "var(--space-md)" }}>The best-engineered shoe a normal person can actually afford.</h3>
            <p className="text-body">For the sports and streets they use every day. Italian sportswear heritage meeting the Indian street — bright, real, unpolished.</p>
          </div>
          <div className="brand-split__item" style={{ background: "var(--bg-card)", padding: "var(--space-2xl)" }}>
            <div className="text-label" style={{ color: "var(--accent-one8)", marginBottom: "var(--space-md)" }}>ONE8 — ELITE</div>
            <h3 className="text-title" style={{ marginBottom: "var(--space-md)" }}>The high-performance brand, built on discipline.</h3>
            <p className="text-body">Founded by Virat Kohli, aimed at the serious athlete. Serious, quiet, expensive-feeling. Nobody&apos;s born ready.</p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── Technology Section ──────────────────────────────────────────────────────

function TechnologySection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tech-item", {
        scrollTrigger: {
          trigger: ".tech-grid",
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" className="section" ref={ref}>
      <div className="container">
        <div className="section-header gsap-reveal">
          <div className="section-header__label">Technology Platforms</div>
          <h2 className="section-header__title">Ten Platforms.<br />Named. Reusable. Real.</h2>
          <p className="section-header__desc">
            Building blocks that live under many shoes and improve over years.
            Some appear in nearly every shoe. Some solve exactly one problem.
          </p>
        </div>
        <div className="tech-grid">
          {technologies.map((tech) => (
            <div key={tech.id} className="tech-item">
              <h4 className="tech-item__name">{tech.name}</h4>
              <div className="tech-item__tagline">{tech.tagline}</div>
              <p className="tech-item__desc">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Shoe Lineup Section (Horizontal Scroll Cards) ───────────────────────────

function LineupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="lineup" className="horizontal-scroll" ref={sectionRef}>
      <div style={{ padding: "var(--space-xl) clamp(1.5rem, 4vw, 4rem)", paddingBottom: "var(--space-md)" }}>
        <div className="section-header">
          <div className="section-header__label">The Lineup</div>
          <h2 className="section-header__title">Eleven Shoes. Two Brands.</h2>
          <p className="section-header__desc">Each designed backwards from a reality. One shoe, three uses — stated plainly every time.</p>
        </div>
      </div>
      <div className="horizontal-scroll__track" ref={trackRef}>
        {shoes.map((shoe) => (
          <div key={shoe.id} className="horizontal-scroll__item">
            <div className="shoe-card" style={{ "--shoe-glow": `${shoe.accent}15` } as React.CSSProperties}>
              <div className="shoe-card__canvas">
                <Suspense fallback={<div style={{ width: "100%", height: "240px", background: "var(--bg-card)" }} />}>
                  <Shoe3DMini accent={shoe.accent} />
                </Suspense>
              </div>
              <div className="shoe-card__info">
                <div className="shoe-card__brand">{shoe.brand}</div>
                <h3 className="shoe-card__name" style={{ color: shoe.accent }}>{shoe.name}</h3>
                <p className="shoe-card__subtitle">{shoe.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


// ─── Individual Shoe Detail Section ──────────────────────────────────────────

function ShoeDetailSection({ shoe, index }: { shoe: Shoe; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".shoe-detail__visual", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
        },
        opacity: 0,
        x: isEven ? -80 : 80,
        duration: 1.2,
        ease: "power3.out",
      });
      gsap.from(".shoe-detail__content > *", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, [isEven]);

  const techs = technologies.filter((t) => shoe.technologies.includes(t.id));

  return (
    <div
      ref={ref}
      className="shoe-detail container"
      style={{ direction: isEven ? "ltr" : "rtl" }}
    >
      <div className="shoe-detail__visual" style={{ direction: "ltr" }}>
        <Suspense fallback={<div style={{ width: "100%", aspectRatio: "1", background: "var(--bg-card)", borderRadius: "var(--radius-lg)" }} />}>
          <Shoe3D accent={shoe.accent} style={{ width: "100%", height: "100%", minHeight: "400px" }} />
        </Suspense>
      </div>
      <div className="shoe-detail__content" style={{ direction: "ltr" }}>
        <div className="shoe-detail__number">
          {String(shoe.order).padStart(2, "0")} / 11
        </div>
        <div className="shoe-detail__brand-tag" style={{ borderColor: shoe.accent, color: shoe.accent }}>
          {shoe.brand}
        </div>
        <h2 className="text-headline" style={{ color: shoe.accent }}>{shoe.name}</h2>
        <p className="text-subtitle">{shoe.subtitle}</p>
        <div className="shoe-detail__why">{shoe.whyWeMadeIt}</div>


        <div className="purposes">
          <div className="purpose">
            <span className="purpose__code purpose__code--a">A</span>
            <div>
              <div className="purpose__label">{shoe.purposeA.label}</div>
              <div className="purpose__desc">{shoe.purposeA.description}</div>
            </div>
          </div>
          <div className="purpose">
            <span className="purpose__code purpose__code--b">B</span>
            <div>
              <div className="purpose__label">{shoe.purposeB.label}</div>
              <div className="purpose__desc">{shoe.purposeB.description}</div>
            </div>
          </div>
          <div className="purpose">
            <span className="purpose__code purpose__code--s">S</span>
            <div>
              <div className="purpose__label">{shoe.purposeS.label}</div>
              <div className="purpose__desc">{shoe.purposeS.description}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-label" style={{ marginBottom: "var(--space-sm)" }}>The Value</div>
          <p className="text-body">{shoe.value}</p>
        </div>

        <div>
          <div className="text-label" style={{ marginBottom: "var(--space-sm)" }}>Who It&apos;s For</div>
          <p className="text-body">{shoe.whoItsFor}</p>
        </div>

        <div className="tech-pills">
          {techs.map((t) => (
            <span key={t.id} className="tech-pill">{t.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── All Shoes Section ───────────────────────────────────────────────────────

function ShoesSection() {
  return (
    <section id="shoes" className="section">
      <div className="container" style={{ marginBottom: "var(--space-2xl)" }}>
        <div className="section-header">
          <div className="section-header__label">The Shoes</div>
          <h2 className="section-header__title">Built Backwards From Reality.</h2>
          <p className="section-header__desc">
            Every shoe starts from something true about life in India.
            A — the reason you buy it. B — the bonus. S — the surprise that seals it.
          </p>
        </div>
      </div>
      {shoes.map((shoe, i) => (
        <ShoeDetailSection key={shoe.id} shoe={shoe} index={i} />
      ))}
    </section>
  );
}

// ─── Campaigns Section ───────────────────────────────────────────────────────

function CampaignsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".campaign-card", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="campaigns" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <div className="section-header__label">Campaigns</div>
          <h2 className="section-header__title">Do Things.<br />Don&apos;t Just Say Things.</h2>
          <p className="section-header__desc">
            Each campaign starts from a reality, belongs to one shoe, and leaves something real behind.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
          {campaigns.map((c) => (
            <div key={c.id} className="campaign-card">
              <div className="campaign-card__shoe">{c.shoe}</div>
              <h4 className="campaign-card__name">{c.name}</h4>
              <p className="campaign-card__tagline">{c.tagline}</p>
              <p className="campaign-card__desc">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Stats Counter Section ───────────────────────────────────────────────────

function StatsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const stats = [
    { number: "3.34M", label: "Tennis-ball cricket matches last year" },
    { number: "11", label: "Shoes designed for Indian ground" },
    { number: "10", label: "Reusable technology platforms" },
    { number: "15", label: "Cities in the Combine tour" },
  ];

  return (
    <section ref={ref} className="section" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)", textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: "var(--accent-neon)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.number}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)", marginTop: "var(--space-sm)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">AGILITAS</div>
            <p className="footer__tagline">
              Made here for forty years. Designed here from now.
              The first line of shoes in this country designed for the ground they&apos;ll actually be worn on.
            </p>
          </div>
          <div>
            <div className="footer__col-title">Brands</div>
            <a className="footer__link" href="#lineup">Lotto</a>
            <a className="footer__link" href="#lineup">one8</a>
          </div>
          <div>
            <div className="footer__col-title">Explore</div>
            <a className="footer__link" href="#technology">Technology</a>
            <a className="footer__link" href="#shoes">Shoes</a>
            <a className="footer__link" href="#campaigns">Campaigns</a>
          </div>
          <div>
            <div className="footer__col-title">The Vision</div>
            <a className="footer__link" href="#hero">The Big Idea</a>
            <a className="footer__link" href="#technology">Platforms</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; 2025 Agilitas Sports. All rights reserved.</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.06em" }}>
            PREPARED BY PARAM MINHAS
          </span>
        </div>
      </div>
    </footer>
  );
}


// ─── Scroll Progress Bar ─────────────────────────────────────────────────────

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!barRef.current) return;
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      barRef.current.style.transform = `scaleX(${scrolled})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div ref={barRef} className="scroll-progress" style={{ transform: "scaleX(0)" }} />;
}

// ─── PDF Download Button (fixed) ─────────────────────────────────────────────

function PdfButton({ onClick, generating }: { onClick: () => void; generating: boolean }) {
  return (
    <button className="pdf-btn" onClick={onClick} disabled={generating}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
      {generating ? "Generating..." : "PDF"}
    </button>
  );
}

// ─── Main Experience Component ───────────────────────────────────────────────

export function Experience() {
  const { generate, generating } = usePdfDownload();
  useLenis();

  // GSAP reveal animations for section headers
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="noise-overlay" />
      <ScrollProgress />
      <Navigation onDownload={generate} generating={generating} />
      <HeroSection />
      <BrandSplitSection />
      <StatsSection />
      <TechnologySection />
      <LineupSection />
      <ShoesSection />
      <CampaignsSection />
      <Footer />
      <PdfButton onClick={generate} generating={generating} />
    </>
  );
}
