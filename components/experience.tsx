"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { products, sources, type Product } from "@/data/products";
import { ShoeArt } from "@/components/shoe-art";

const productIds = products.map((product) => product.id);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LevelTag({ level }: { level: Product["systems"][number]["level"] }) {
  return <span className={`level-tag level-tag--${level.toLowerCase().replaceAll(" ", "-")}`}>{level}</span>;
}

function ProductChapter({
  product,
  onOpenEvidence,
}: {
  product: Product;
  onOpenEvidence: (product: Product) => void;
}) {
  const [mode, setMode] = useState(0);

  return (
    <section
      className={`product-chapter product-chapter--${product.brand.toLowerCase()}`}
      id={product.id}
      data-section={product.id}
      style={{
        "--product-accent": product.accent,
        "--product-base": product.palette[0],
        "--product-mid": product.palette[1],
      } as React.CSSProperties}
    >
      <div className="product-chapter__ambient" aria-hidden="true" />
      <div className="product-chapter__grid">
        <header className="product-chapter__header">
          <div className="eyebrow">
            <span>{product.order}</span>
            <span>{product.brand}</span>
            <span>{product.family}</span>
          </div>
          <h2>{product.name}</h2>
          <p className="product-chapter__line">{product.line}</p>
        </header>

        <div className="product-chapter__visual">
          <ShoeArt product={product} mode={mode} />
          <div className="mode-switcher" role="group" aria-label={`Choose a ${product.name} purpose`}>
            {product.purposes.map((purpose, index) => (
              <button
                className={mode === index ? "is-active" : ""}
                key={purpose.code}
                onClick={() => setMode(index)}
                type="button"
                aria-pressed={mode === index}
              >
                <span>{purpose.code}</span>
                {purpose.title}
              </button>
            ))}
          </div>
        </div>

        <div className="product-chapter__story">
          <p className="product-chapter__thesis">{product.thesis}</p>
          <p className="product-chapter__note">{product.note}</p>
          <button className="text-button" type="button" onClick={() => onOpenEvidence(product)}>
            Open the engineering file <ArrowIcon />
          </button>
        </div>

        <div className="purpose-panel" aria-live="polite">
          <span className="purpose-panel__code">{product.purposes[mode].code}</span>
          <div>
            <p className="purpose-panel__label">PURPOSE {mode + 1} / 3</p>
            <h3>{product.purposes[mode].title}</h3>
            <p>{product.purposes[mode].copy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EvidenceDrawer({
  product,
  allSources,
  onClose,
}: {
  product: Product | null;
  allSources: boolean;
  onClose: () => void;
}) {
  const visibleSources = useMemo(() => {
    if (allSources || !product) return sources;
    const ids = new Set(product.systems.flatMap((system) => system.sources));
    return sources.filter((source) => ids.has(source.id));
  }, [allSources, product]);

  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!product && !allSources) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("drawer-open");
    requestAnimationFrame(() => getFocusable()[0]?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("drawer-open");
      previousFocus?.focus();
    };
  }, [product, allSources, onClose]);

  if (!product && !allSources) return null;

  return (
    <div className="drawer-shell" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside ref={drawerRef} className="evidence-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="evidence-drawer__header">
          <div>
            <p className="eyebrow">ENGINEERING FILE / {allSources ? "ALL SOURCES" : product?.order}</p>
            <h2 id="drawer-title">{allSources ? "Evidence, not adjectives." : `${product?.name} / systems`}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close engineering file" autoFocus>
            <CloseIcon />
          </button>
        </header>

        {!allSources && product ? (
          <div className="system-list">
            {product.systems.map((system, index) => (
              <article className="system-card" key={system.name}>
                <div className="system-card__top">
                  <span>0{index + 1}</span>
                  <LevelTag level={system.level} />
                </div>
                <h3>{system.name}</h3>
                <p>{system.copy}</p>
                {system.sources.length > 0 ? <span className="system-card__refs">REF / {system.sources.join(" · ")}</span> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="honesty-note">
            <strong>How to read this site</strong>
            <p>
              A known principle is supported by a standard or published study. A market precedent proves that the behaviour exists in the category. A design target is still a brief—it is not a product claim until a prototype passes a stated test.
            </p>
          </div>
        )}

        <div className="source-list">
          <div className="source-list__title">
            <span>SOURCE LEDGER</span>
            <span>{String(visibleSources.length).padStart(2, "0")}</span>
          </div>
          {visibleSources.map((source) => (
            <a className="source-row" key={source.id} href={source.url} target="_blank" rel="noreferrer">
              <span className="source-row__id">{source.id}</span>
              <span>
                <strong>{source.title}</strong>
                <small>{source.organisation} / {source.year}</small>
                <em>{source.note}</em>
              </span>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function Experience() {
  const [activeSection, setActiveSection] = useState("top");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [allSources, setAllSources] = useState(false);
  const [priceMode, setPriceMode] = useState<"one" | "three">("three");
  const [submitted, setSubmitted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-32% 0px -56% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );

    document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const focusable = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? []);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.body.classList.add("drawer-open");
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => focusable()[0]?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("drawer-open");
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  const closeDrawer = useCallback(() => {
    setDrawerProduct(null);
    setAllSources(false);
  }, []);

  const handleTrial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <div className="site-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <nav className="site-nav" aria-label="Main navigation">
        <a className="site-mark" href="#top" aria-label="All Three home">
          <span>ALL</span><strong>3</strong>
        </a>
        <div className="site-nav__desktop">
          <a href="#lineup">The six</a>
          <a href="#maker">The maker loop</a>
          <button type="button" onClick={() => setAllSources(true)}>Evidence</button>
        </div>
        <span className="site-nav__active" aria-hidden="true">
          {productIds.includes(activeSection) ? products.find((product) => product.id === activeSection)?.name : "INDIA / 2025"}
        </span>
        <button ref={menuButtonRef} className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <MenuIcon />
        </button>
      </nav>

      {menuOpen ? (
        <div ref={menuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="icon-button" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><CloseIcon /></button>
          <p>ALL THREE / INDEX</p>
          <a href="#lineup" onClick={() => setMenuOpen(false)}>Six shoes</a>
          {products.map((product) => (
            <a href={`#${product.id}`} key={product.id} onClick={() => setMenuOpen(false)}>
              <span>{product.order}</span>{product.name}
            </a>
          ))}
          <a href="#maker" onClick={() => setMenuOpen(false)}>Maker loop</a>
          <button type="button" onClick={() => { setMenuOpen(false); setAllSources(true); }}>Evidence ledger</button>
        </div>
      ) : null}

      <section className="hero" id="top" data-section="top">
        <div className="hero__noise" aria-hidden="true" />
        <div className="hero__copy">
          <div className="eyebrow"><span>FOOTWEAR / INDIA</span><span>SIX SYSTEMS</span><span>2025 BASIS</span></div>
          <h1>A ₹4,500 shoe needs <em>three reasons</em> to exist.</h1>
          <p>₹1,500 buys one job. This is not cheaper. It is useful three times.</p>
          <a className="hero__cta" href="#value">
            See the equation <ArrowIcon />
          </a>
        </div>
        <div className="hero__shoe">
          <ShoeArt product={products[5]} mode={2} hero />
        </div>
        <div className="hero__footer">
          <span>ALL THREE</span>
          <span>6 SHOES / 18 REASONS</span>
          <span>SCROLL TO BEGIN ↓</span>
        </div>
      </section>

      <section className="value-section" id="value" data-section="value">
        <div className="section-index">00 / THE VALUE TEST</div>
        <div className="value-section__headline">
          <p>THE PRICE IS NOT THE IDEA.</p>
          <h2>The third reason<br />earns the difference.</h2>
        </div>
        <div className="price-machine">
          <div className="price-machine__switch" role="group" aria-label="Compare shoe value">
            <button type="button" className={priceMode === "one" ? "is-active" : ""} onClick={() => setPriceMode("one")} aria-pressed={priceMode === "one"}>ONE-PURPOSE SHOE</button>
            <button type="button" className={priceMode === "three" ? "is-active" : ""} onClick={() => setPriceMode("three")} aria-pressed={priceMode === "three"}>ALL THREE</button>
          </div>
          <div className="price-machine__number" aria-live="polite">
            <span>{priceMode === "one" ? "₹1,500" : "₹4,500"}</span>
            <small>{priceMode === "one" ? "ONE REASON" : "÷ 3 PURPOSES = ₹1,500 EACH"}</small>
          </div>
          <div className="price-machine__bars" aria-hidden="true">
            <i /><i className={priceMode === "three" ? "is-on" : ""} /><i className={priceMode === "three" ? "is-on" : ""} />
          </div>
          <p>
            At three times the price, “premium” cannot mean softer foam and a longer feature list. It has to remove three purchases, three decisions or three compromises.
          </p>
        </div>
      </section>

      <section className="manifesto" data-section="manifesto">
        <p>THE OLD STORY WAS “THIRD LIFE.”</p>
        <h2>That made the third use sound accidental.</h2>
        <h2 className="manifesto__answer">Here, all three are designed in.</h2>
        <div className="manifesto__grid">
          <article><span>A</span><strong>THE REASON YOU ARRIVE</strong><p>The obvious job. Court. Rain. Cricket. Training.</p></article>
          <article><span>B</span><strong>THE REASON IT STAYS OUT</strong><p>The adjacent work the same structure can do honestly.</p></article>
          <article><span>C</span><strong>THE REASON IT EARNS ₹4,500</strong><p>The everyday use that turns specialist footwear into the pair you keep reaching for.</p></article>
        </div>
      </section>

      <section className="lineup" id="lineup" data-section="lineup">
        <div className="section-index">01–06 / THE LINE</div>
        <div className="lineup__header">
          <h2>Six shoes.<br />No filler.</h2>
          <p>Three for the ground. Three for the hours around it. Every name begins with a situation, not a technology trademark.</p>
        </div>
        <div className="lineup__grid">
          {products.map((product) => (
            <a className="lineup-card" href={`#${product.id}`} key={product.id} style={{ "--card-accent": product.accent } as React.CSSProperties}>
              <span>{product.order} / {product.brand}</span>
              <strong>{product.name}</strong>
              <small>{product.family}</small>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </section>

      {products.map((product) => (
        <ProductChapter product={product} key={product.id} onOpenEvidence={setDrawerProduct} />
      ))}

      <section className="weather-lab" data-section="proof">
        <div className="weather-lab__copy">
          <div className="section-index">07 / CLAIMS HAVE STATES</div>
          <h2>Published,<br />not promised.</h2>
          <p>
            “Waterproof.” “Recovery.” “Made for Indian feet.” All three can become lazy language. So this portfolio marks what is known, what already exists elsewhere and what still has to survive a test.
          </p>
          <button className="solid-button" type="button" onClick={() => setAllSources(true)}>Read the evidence ledger <ArrowIcon /></button>
        </div>
        <div className="claim-legend">
          <article><LevelTag level="KNOWN PRINCIPLE" /><strong>Supported direction</strong><p>A standard or study makes the variable real. It does not automatically validate our product.</p></article>
          <article><LevelTag level="MARKET PRECEDENT" /><strong>Category proof</strong><p>Somebody has made the behaviour work. We still need an original mechanism and better Indian fit.</p></article>
          <article><LevelTag level="DESIGN TARGET" /><strong>Not a claim yet</strong><p>A brief with a test attached. It becomes copy only after a prototype earns the number.</p></article>
        </div>
      </section>

      <section className="maker-loop" id="maker" data-section="maker">
        <div className="maker-loop__intro">
          <div className="section-index">08 / THE MAKER LOOP</div>
          <h2>Do not find a cobbler.<br /><em>Send it home.</em></h2>
          <p>
            The nostalgic repair story asks the customer to solve the brand’s engineering problem. The better system is direct: the maker knows the compound, owns the last and has the original parts.
          </p>
        </div>
        <div className="loop-diagram" aria-label="Maker return process">
          {[
            ["01", "WEAR REVEALS", "A contrast line appears in the zones that actually wear."],
            ["02", "SCAN THE STAMP", "The sole carries batch, compound and service history."],
            ["03", "RETURN TO MAKER", "Pickup, inspect, rebuild or responsibly retire."],
            ["04", "COME BACK DIFFERENT", "New outsole, visible date, the same upper and story."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span><strong>{title}</strong><p>{copy}</p>
            </article>
          ))}
        </div>
        <p className="maker-loop__disclaimer">Lifetime service is a platform proposal, not a guarantee offered by this concept site. Warranty terms require engineering, operations and legal definition.</p>
      </section>

      <section className="trial" id="trial" data-section="trial">
        <div className="trial__copy">
          <div className="section-index">09 / THE TRIAL</div>
          <h2>No celebrities.<br />Just numbers that belong to you.</h2>
          <p>
            A proposed open trial across Indian cities: different grounds, different feet, different movement. Every participant leaves with their own result card; the product team leaves with a better last and fewer assumptions.
          </p>
        </div>
        {submitted ? (
          <div className="trial__success" role="status">
            <span>INTEREST LOGGED / DEMO</span>
            <strong>You are on the prototype list.</strong>
            <p>This prototype form stores nothing and sends nothing yet. It demonstrates the intended flow without pretending a backend exists.</p>
            <button type="button" className="text-button" onClick={() => setSubmitted(false)}>Add another profile <ArrowIcon /></button>
          </div>
        ) : (
          <form className="trial-form" onSubmit={handleTrial}>
            <label>
              <span>NAME</span>
              <input name="name" required autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              <span>CITY</span>
              <input name="city" required autoComplete="address-level2" placeholder="Where you play" />
            </label>
            <label>
              <span>PRIMARY MOVEMENT</span>
              <select name="movement" required defaultValue="">
                <option value="" disabled>Choose one</option>
                <option>Court sport</option>
                <option>Cricket</option>
                <option>Strength training</option>
                <option>Walking / commute</option>
                <option>Mixed</option>
              </select>
            </label>
            <label className="trial-form__email">
              <span>EMAIL</span>
              <input name="email" required type="email" autoComplete="email" placeholder="you@example.com" />
            </label>
            <button className="solid-button" type="submit">Enter the prototype trial <ArrowIcon /></button>
          </form>
        )}
      </section>

      <footer className="site-footer">
        <div>
          <span>ALL</span><strong>3</strong>
        </div>
        <p>Made here for decades.<br />Designed around here now.</p>
        <div className="site-footer__links">
          <a href="#top">Back to top ↑</a>
          <button type="button" onClick={() => setAllSources(true)}>Evidence ledger</button>
          <span>CONCEPT / 2025 EVIDENCE BASIS</span>
        </div>
      </footer>

      <EvidenceDrawer product={drawerProduct} allSources={allSources} onClose={closeDrawer} />
    </main>
  );
}