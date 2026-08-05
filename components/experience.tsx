"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shoes, technologies, campaigns } from "@/data/products";
import type { Shoe, Technology, Campaign } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);


/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getShoesForTech(techId: string): Shoe[] {
  return shoes.filter(s => s.technologies.includes(techId));
}


/* ═══════════════════════════════════════════════════════════════════════════
   PDF DOWNLOAD HOOK
   ═══════════════════════════════════════════════════════════════════════════ */
function usePdf() {
  const [busy, setBusy] = useState(false);
  const gen = useCallback(async () => {
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const d = new jsPDF("portrait", "mm", "a4");
      const m = 15, w = 180;
      let y = m;
      const page = () => { d.addPage(); y = m; };
      const chk = (n: number) => { if (y + n > 280) page(); };

      d.setFillColor(6,6,6); d.rect(0,0,210,297,"F");
      d.setTextColor(240,240,240); d.setFontSize(38); d.setFont("helvetica","bold");
      d.text("LOTTO / ONE8", m, 55);
      d.setFontSize(11); d.setFont("helvetica","normal");
      d.text("AGILITAS SPORTS \u2014 THE COMPLETE PORTFOLIO", m, 70);
      d.setFontSize(9); d.setTextColor(150,150,150);
      d.text("For fifty years, sports shoes have been designed for how people", m, 95);
      d.text("live somewhere else. We design for how India actually lives.", m, 101);
      d.setTextColor(0,255,136); d.setFontSize(8);
      d.text("Made here for forty years. Designed here from now.", m, 125);
      d.setTextColor(100,100,100); d.setFontSize(7);
      d.text("Prepared by Param Minhas, Creative Direction", m, 280);

      page(); d.setFillColor(6,6,6); d.rect(0,0,210,297,"F");
      d.setTextColor(0,255,136); d.setFontSize(8); d.text("TECHNOLOGY PLATFORMS", m, y); y += 10;
      d.setTextColor(240,240,240); d.setFontSize(18); d.setFont("helvetica","bold");
      d.text("Ten Platforms. Named. Reusable. Real.", m, y); y += 14;
      technologies.forEach(t => {
        chk(20); d.setTextColor(240,240,240); d.setFontSize(10); d.setFont("helvetica","bold");
        d.text(t.name, m, y); y += 5;
        d.setTextColor(0,255,136); d.setFontSize(7); d.setFont("helvetica","normal");
        d.text(t.tagline, m, y); y += 4;
        d.setTextColor(150,150,150); d.setFontSize(8);
        const l = d.splitTextToSize(t.description, w); d.text(l, m, y); y += l.length * 4 + 5;
      });


      shoes.forEach(s => {
        page(); d.setFillColor(6,6,6); d.rect(0,0,210,297,"F");
        d.setTextColor(100,100,100); d.setFontSize(7);
        d.text(`${s.brand} \u2014 ${String(s.order).padStart(2,"0")} / 11`, m, y); y += 8;
        d.setTextColor(240,240,240); d.setFontSize(24); d.setFont("helvetica","bold");
        d.text(s.name, m, y); y += 8;
        d.setFontSize(11); d.setFont("helvetica","normal"); d.text(s.subtitle, m, y); y += 10;
        d.setTextColor(150,150,150); d.setFontSize(9);
        const wl = d.splitTextToSize(s.whyWeMadeIt, w); d.text(wl, m, y); y += wl.length * 4.5 + 8;
        [{code:"A",...s.purposeA},{code:"B",...s.purposeB},{code:"S",...s.purposeS}].forEach(p => {
          chk(16); d.setTextColor(0,255,136); d.setFontSize(12); d.setFont("helvetica","bold");
          d.text(p.code, m, y); d.setTextColor(240,240,240); d.setFontSize(9); d.text(p.label, m+10, y); y += 5;
          d.setTextColor(150,150,150); d.setFontSize(8); d.setFont("helvetica","normal");
          const dl = d.splitTextToSize(p.description, w-10); d.text(dl, m+10, y); y += dl.length*4+5;
        });
        chk(12); d.setTextColor(240,240,240); d.setFontSize(8); d.setFont("helvetica","bold");
        d.text("THE VALUE", m, y); y += 4; d.setFont("helvetica","normal"); d.setTextColor(150,150,150);
        const vl = d.splitTextToSize(s.value, w); d.text(vl, m, y); y += vl.length*4+4;
      });

      page(); d.setFillColor(6,6,6); d.rect(0,0,210,297,"F");
      d.setTextColor(0,255,136); d.setFontSize(8); d.text("CAMPAIGNS", m, y); y += 10;
      d.setTextColor(240,240,240); d.setFontSize(18); d.setFont("helvetica","bold");
      d.text("Do Things. Don\u2019t Just Say Things.", m, y); y += 14;
      campaigns.forEach(c => {
        chk(20); d.setTextColor(240,240,240); d.setFontSize(10); d.setFont("helvetica","bold");
        d.text(c.name, m, y); d.setTextColor(100,100,100); d.setFontSize(7); d.setFont("helvetica","normal");
        d.text(` \u2014 ${c.shoe}`, m+d.getTextWidth(c.name+" "), y); y += 5;
        d.setTextColor(0,255,136); d.setFontSize(8); d.text(c.tagline, m, y); y += 4;
        d.setTextColor(150,150,150); const dl = d.splitTextToSize(c.description, w); d.text(dl, m, y); y += dl.length*4+6;
      });

      d.save("Agilitas-LOTTO-ONE8-Portfolio.pdf");
    } catch(e) { console.error(e); } finally { setBusy(false); }
  }, []);
  return { gen, busy };
}


/* ═══════════════════════════════════════════════════════════════════════════
   TECHNOLOGY ITEM — Expandable on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function TechItem({ tech }: { tech: Technology }) {
  const ref = useRef<HTMLDivElement>(null);
  const linkedShoes = getShoesForTech(tech.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "top 20%",
        onEnter: () => el.classList.add("is-active"),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="tech-item" id={`tech-${tech.id}`}>
      <div className="tech-item__header" onClick={() => ref.current?.classList.toggle("is-active")}>
        <div className="tech-item__left">
          <div className="tech-item__name">{tech.name}</div>
          <div className="tech-item__tagline">{tech.tagline}</div>
        </div>
        <div className="tech-item__preview">{tech.description}</div>
      </div>
      <div className="tech-item__expanded">
        <div className="tech-item__expanded-inner">
          <div />
          <div className="tech-item__detail">{tech.detail}</div>
          <div className="tech-item__specs">
            <div className="tech-item__spec-label">Used in</div>
            <div className="tech-item__shoes">
              {linkedShoes.map(s => (
                <span key={s.id} className="tech-item__shoe-link" onClick={() => scrollTo(`shoe-${s.id}`)}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SHOE SHOWCASE — Full viewport with specs
   ═══════════════════════════════════════════════════════════════════════════ */
function ShoeShowcase({ shoe, index }: { shoe: Shoe; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const techs = technologies.filter(t => shoe.technologies.includes(t.id));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 75%", end: "top 20%", toggleActions: "play none none none" }
      });
      tl.from(el.querySelector(".shoe__header"), { opacity: 0, y: 60, duration: 1, ease: "power3.out" })
        .from(el.querySelector(".shoe__img-wrap"), { opacity: 0, scale: 0.85, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .from(el.querySelectorAll(".shoe__left .feat"), { opacity: 0, x: -50, stagger: 0.1, duration: 0.7, ease: "power3.out" }, "-=0.8")
        .from(el.querySelectorAll(".shoe__right .feat"), { opacity: 0, x: 50, stagger: 0.1, duration: 0.7, ease: "power3.out" }, "-=0.7")
        .from(el.querySelector(".shoe__specs"), { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(el.querySelectorAll(".pill"), { opacity: 0, y: 10, stagger: 0.03, duration: 0.4 }, "-=0.3");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="shoe"
      id={`shoe-${shoe.id}`}
      style={{ "--shoe-accent": shoe.accent } as React.CSSProperties}
    >
      <div className="shoe__ambient" />
      <div className="shoe__inner">
        {/* Header */}
        <div className="shoe__header">
          <div className="shoe__brand-tag" style={{ color: shoe.accent, borderColor: `${shoe.accent}40` }}>
            {shoe.brand} &mdash; {String(shoe.order).padStart(2, "0")} / 11
          </div>
          <h2 className="shoe__name" style={{ color: shoe.accent }}>{shoe.name}</h2>
          <p className="shoe__subtitle">{shoe.subtitle}</p>
          <p className="shoe__why">&ldquo;{shoe.whyWeMadeIt}&rdquo;</p>
        </div>


        {/* Left: A + B */}
        <div className="shoe__left">
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

        {/* Centre: Shoe Image */}
        <div className="shoe__center">
          <div className="shoe__img-wrap">
            <div className="shoe__ring" />
            <Image
              src={`/shoes/${shoe.id}.png`}
              alt={`${shoe.name} — ${shoe.subtitle}`}
              width={600}
              height={600}
              className="shoe__img"
              priority={index < 2}
              unoptimized
            />
          </div>
        </div>

        {/* Right: S + Value */}
        <div className="shoe__right">
          <div className="feat">
            <div className="feat__code feat__code--s">S</div>
            <div className="feat__label">{shoe.purposeS.label}</div>
            <div className="feat__desc">{shoe.purposeS.description}</div>
          </div>
          <div className="feat" style={{ borderColor: `${shoe.accent}25` }}>
            <div className="feat__label" style={{ color: shoe.accent }}>THE VALUE</div>
            <div className="feat__desc">{shoe.value}</div>
          </div>
        </div>


        {/* Specs & Features — THE KEY ADDITION */}
        <div className="shoe__specs">
          <div className="shoe__spec-block">
            <div className="shoe__spec-title">Features &amp; Specs</div>
            <div className="shoe__spec-text">{shoe.features}</div>
          </div>
          <div className="shoe__spec-block">
            <div className="shoe__spec-title">Who It&apos;s For</div>
            <div className="shoe__spec-text">{shoe.whoItsFor}</div>
          </div>
        </div>

        {/* Tech pills — clickable, scroll to tech */}
        <div className="shoe__techs">
          {techs.map(t => (
            <span key={t.id} className="pill" onClick={() => scrollTo(`tech-${t.id}`)}>
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   CAMPAIGN SECTION — Full viewport immersive scroll section
   ═══════════════════════════════════════════════════════════════════════════ */
function CampaignSection({ campaign }: { campaign: Campaign }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 70%", end: "top 20%", toggleActions: "play none none none" }
      });
      tl.from(el.querySelector(".camp-section__shoe-tag"), { opacity: 0, x: -20, duration: 0.6, ease: "power3.out" })
        .from(el.querySelector(".camp-section__name"), { opacity: 0, y: 50, duration: 0.9, ease: "power3.out" }, "-=0.3")
        .from(el.querySelector(".camp-section__tagline"), { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(el.querySelector(".camp-section__desc"), { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .from(el.querySelectorAll(".camp-section__block"), { opacity: 0, y: 30, stagger: 0.15, duration: 0.7, ease: "power3.out" }, "-=0.3");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="camp-section" id={`camp-${campaign.id}`}>
      <div className="camp-section__ambient" />
      <div className="camp-section__inner">
        <div className="camp-section__left">
          <div className="camp-section__shoe-tag" onClick={() => scrollTo("shoes")}>
            {campaign.shoe}
          </div>
          <h3 className="camp-section__name">{campaign.name}</h3>
          <p className="camp-section__tagline">&ldquo;{campaign.tagline}&rdquo;</p>
          <p className="camp-section__desc">{campaign.description}</p>
        </div>
        <div className="camp-section__right">
          <div className="camp-section__block">
            <div className="camp-section__block-title camp-section__block-title--film">The Film</div>
            <div className="camp-section__block-text">{campaign.film}</div>
          </div>
          <div className="camp-section__block">
            <div className="camp-section__block-title camp-section__block-title--gtm">Go-to-Market</div>
            <div className="camp-section__block-text">{campaign.gtm}</div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR GLOW HOOK
   ═══════════════════════════════════════════════════════════════════════════ */
function useCursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf: number;
    const move = (e: MouseEvent) => {
      raf = requestAnimationFrame(() => {
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.classList.add("active");
      });
    };
    const leave = () => el.classList.remove("active");
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}


/* ═══════════════════════════════════════════════════════════════════════════
   SHOE COUNTER HOOK — tracks which shoe is in view
   ═══════════════════════════════════════════════════════════════════════════ */
function useShoeCounter() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    shoes.forEach((shoe, i) => {
      const el = document.getElementById(`shoe-${shoe.id}`);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => { setCurrent(i + 1); setVisible(true); },
          onEnterBack: () => { setCurrent(i + 1); setVisible(true); },
          onLeave: () => { if (i === shoes.length - 1) setVisible(false); },
          onLeaveBack: () => { if (i === 0) setVisible(false); },
        })
      );
    });
    return () => triggers.forEach(t => t.kill());
  }, []);

  return { current, visible };
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPERIENCE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export function Experience() {
  const { gen, busy } = usePdf();
  const mainRef = useRef<HTMLDivElement>(null);
  const cursorRef = useCursorGlow();
  const { current: shoeNum, visible: counterVisible } = useShoeCounter();

  // Lenis smooth scroll
  useEffect(() => {
    let lenis: any;
    import("lenis").then(mod => {
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    });
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  // Progress bar
  useEffect(() => {
    const bar = document.querySelector(".progress") as HTMLElement;
    if (!bar) return;
    const update = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      bar.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Reveal animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("visible"),
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);


  return (
    <div ref={mainRef}>
      {/* Ambient layers */}
      <div className="noise" />
      <div className="cursor-glow" ref={cursorRef} />
      <div className="progress" style={{ transform: "scaleX(0)" }} />

      {/* Shoe counter */}
      <div className={`shoe-counter ${counterVisible ? "visible" : ""}`}>
        <div className="shoe-counter__current">{String(shoeNum).padStart(2, "0")}</div>
        <div className="shoe-counter__divider" />
        <div className="shoe-counter__total">11</div>
      </div>

      {/* ═══ NAV ═══ */}
      <nav className="nav">
        <div className="nav__logo" onClick={() => scrollTo("hero")}>AGILITAS</div>
        <div className="nav__links">
          <span className="nav__link" onClick={() => scrollTo("tech")}>Technology</span>
          <span className="nav__link" onClick={() => scrollTo("shoes")}>Shoes</span>
          <span className="nav__link" onClick={() => scrollTo("campaigns")}>Campaigns</span>
        </div>
        <button className="nav__cta" onClick={gen} disabled={busy}>
          {busy ? "Generating..." : "Download PDF"}
        </button>
      </nav>


      {/* ═══ HERO ═══ */}
      <section className="hero" id="hero">
        <div className="hero__grid" />
        <div className="hero__orb" style={{ top: "20%", left: "30%" }} />
        <div className="hero__orb hero__orb--2" style={{ bottom: "20%", right: "20%" }} />
        <div className="hero__tag">
          <span className="hero__dot" />
          Agilitas Sports &mdash; Two Brands, One Vision
        </div>
        <h1 className="hero__h1">LOTTO<span className="hero__slash"> / </span>ONE8</h1>
        <p className="hero__sub">
          For fifty years, sports shoes have been designed for how people live somewhere else.
          We design for how <strong>India actually lives.</strong>
        </p>
        <div className="hero__ctas">
          <button className="btn btn--fill" onClick={() => scrollTo("shoes")}>Explore the Lineup</button>
          <button className="btn btn--neon" onClick={() => scrollTo("tech")}>The Technology</button>
        </div>
        <div className="hero__scroll"><span>Scroll</span><div className="hero__scroll-line" /></div>
      </section>

      {/* ═══ BRANDS ═══ */}
      <div className="section reveal">
        <div className="brands">
          <div className="brand-card">
            <div className="brand-card__label" style={{ color: "var(--lotto)" }}>LOTTO &mdash; EVERYDAY</div>
            <h3 className="brand-card__h">The best-engineered shoe a normal person can actually afford.</h3>
            <p className="brand-card__p">For the sports and streets they use every day. Italian sportswear heritage meeting the Indian street &mdash; bright, real, unpolished.</p>
          </div>
          <div className="brand-card">
            <div className="brand-card__label" style={{ color: "var(--one8)" }}>ONE8 &mdash; ELITE</div>
            <h3 className="brand-card__h">The high-performance brand, built on discipline.</h3>
            <p className="brand-card__p">Founded by Virat Kohli, aimed at the serious athlete. Nobody&apos;s born ready.</p>
          </div>
        </div>
      </div>


      {/* ═══ STATS ═══ */}
      <div className="section reveal">
        <div className="stats">
          {[
            { n: "3.34M", l: "Tennis-ball matches / year" },
            { n: "11", l: "Shoes for Indian ground" },
            { n: "10", l: "Reusable tech platforms" },
            { n: "15", l: "Cities in the Combine" },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat__num">{s.n}</div>
              <div className="stat__label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* ═══ TECHNOLOGY ═══ */}
      <section className="section" id="tech">
        <div className="label reveal">Technology Platforms</div>
        <h2 className="title reveal">Ten Platforms.<br />Named. Reusable. Real.</h2>
        <p className="desc reveal">
          Building blocks that live under many shoes and improve over years.
          Like Nike&apos;s &ldquo;Air&rdquo; &mdash; but honest about what&apos;s proven and what&apos;s still a target.
        </p>
        <div className="tech-grid">
          {technologies.map(t => <TechItem key={t.id} tech={t} />)}
        </div>
      </section>

      <div className="divider" />


      {/* ═══ SHOES ═══ */}
      <section id="shoes">
        <div className="section">
          <div className="label reveal">The Lineup</div>
          <h2 className="title reveal">Eleven Shoes. Two Brands.<br />Built Backwards From Reality.</h2>
          <p className="desc reveal">
            A &mdash; the reason you buy it. B &mdash; the bonus. S &mdash; the surprise that seals it.
            One shoe, three uses &mdash; stated plainly every time.
          </p>
        </div>
        {shoes.map((shoe, i) => <ShoeShowcase key={shoe.id} shoe={shoe} index={i} />)}
      </section>

      <div className="divider" />

      {/* ═══ CAMPAIGNS — Overview + Full Sections ═══ */}
      <section id="campaigns">
        <div className="section">
          <div className="label reveal">Campaigns</div>
          <h2 className="title reveal">Do Things.<br />Don&apos;t Just Say Things.</h2>
          <p className="desc reveal">
            Each campaign starts from a reality, belongs to one shoe, and leaves something real behind.
            No hero. No celebrity. Scroll to explore each one.
          </p>
          {/* Quick-nav grid */}
          <div className="camps-nav reveal">
            {campaigns.map(c => (
              <div key={c.id} className="camps-nav__item" onClick={() => scrollTo(`camp-${c.id}`)}>
                <div className="camps-nav__shoe">{c.shoe}</div>
                <div className="camps-nav__name">{c.name}</div>
                <div className="camps-nav__tag">{c.tagline}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full campaign sections */}
        {campaigns.map(c => <CampaignSection key={c.id} campaign={c} />)}
      </section>

      <div className="divider" />


      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer__top">
          <div>
            <div className="footer__brand">AGILITAS</div>
            <p className="footer__tagline">
              Made here for forty years. Designed here from now.
              The first line of shoes designed for the ground they&apos;ll actually be worn on.
            </p>
          </div>
          <div>
            <div className="footer__col-title">Brands</div>
            <span className="footer__link" onClick={() => scrollTo("shoes")}>Lotto</span>
            <span className="footer__link" onClick={() => scrollTo("shoes")}>one8</span>
          </div>
          <div>
            <div className="footer__col-title">Explore</div>
            <span className="footer__link" onClick={() => scrollTo("tech")}>Technology</span>
            <span className="footer__link" onClick={() => scrollTo("shoes")}>Shoes</span>
            <span className="footer__link" onClick={() => scrollTo("campaigns")}>Campaigns</span>
          </div>
          <div>
            <div className="footer__col-title">Document</div>
            <button className="footer__link" onClick={gen}>Download PDF</button>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; 2025 Agilitas Sports</span>
          <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>PREPARED BY PARAM MINHAS</span>
        </div>
      </footer>

      {/* PDF floating button */}
      <button className="pdf-btn" onClick={gen} disabled={busy}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        {busy ? "..." : "PDF"}
      </button>
    </div>
  );
}
