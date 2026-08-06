"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { campaigns, shoes, technologies, type Campaign, type Shoe } from "@/data/products";
import { ICONS } from "@/lib/icons";
import { artFor, modelFor } from "@/lib/assets";
import { SURFACES, DAY } from "@/lib/system-data";
import { accentFor, modeForBrand } from "@/lib/theme";
import { claimStage, set } from "@/lib/store";
import { goTo } from "@/lib/scroll";
import { isWetPlatform } from "@/lib/worlds";

import { AmbienceLayer } from "@/components/ui/ambience";
import { BrandMark } from "@/components/ui/brand-mark";
import { Chapter } from "@/components/ui/chapter";
import { OrbitSlot } from "@/components/ui/orbit-slot";
import { Split } from "@/components/ui/split";

const FEATURED_CAMPAIGNS = [
  "midnight-galli",
  "dry-by-morning",
  "the-trial",
  "take-them-off",
] as const;

const featuredCampaigns = FEATURED_CAMPAIGNS.map((id) =>
  campaigns.find((campaign) => campaign.id === id),
).filter((campaign): campaign is Campaign => Boolean(campaign));

const shoeById = (id: string) => shoes.find((shoe) => shoe.id === id);

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="gm-label rise">
      <span>{n}</span>
      <span>{children}</span>
    </div>
  );
}

function Origin() {
  const slot = useRef<HTMLDivElement>(null);

  return (
    <Chapter
      id="ground"
      mode="dark"
      className="gm-origin"
      threshold={0.2}
      onEnter={() => {
        claimStage(slot.current);
        set({ world: "shoe:reverse", formId: "reverse", presence: 1 });
      }}
    >
      <AmbienceLayer world="shoe:reverse" />
      <div className="gm-origin__grid">
        <div className="gm-origin__copy">
          <div className="gm-origin__meta rise">
            <span className="gm-pulse" />
            Lotto × one8 / Agilitas Sports
          </div>
          <h2 className="gm-origin__title">
            <Split text="Designed" stagger={34} />
            <Split text="for this" stagger={34} delay={170} />
            <Split text="ground." className="gm-serif gm-signal" stagger={38} delay={320} />
          </h2>
          <p className="gm-origin__lede rise rise-d2">
            For fifty years, sports shoes sold here began with somebody else&apos;s floor,
            somebody else&apos;s weather, somebody else&apos;s foot. We began underneath.
          </p>
        </div>

        <div className="gm-origin__stage" ref={slot}>
          <OrbitSlot label="Drag the flagship" />
          <span className="gm-origin__orbit" aria-hidden />
        </div>
      </div>

      <button className="gm-scroll-cue" onClick={() => goTo("ground-story")} data-cur="Scroll">
        <span className="gm-scroll-cue__label">Scroll to begin</span>
        <span className="gm-scroll-cue__track"><i /></span>
      </button>

      <div className="gm-groundline" aria-hidden>
        <span className="gm-groundline__runner" />
        {['Cement', 'Matting', 'Turf', 'Rain', 'Home'].map((ground, index) => (
          <span className="gm-groundline__point" key={ground} style={{ "--i": index } as CSSProperties}>
            {ground}
          </span>
        ))}
      </div>

      <div className="gm-manifesto" id="ground-story">
        <p className="gm-manifesto__line rise">We did not begin with a shoe.</p>
        <p className="gm-manifesto__line gm-manifesto__line--shift rise">We began with the ground.</p>
        <p className="gm-manifesto__answer rise">Then built the movement it demanded.</p>
      </div>
    </Chapter>
  );
}

function BrandAxis({
  brand,
  title,
  copy,
  rows,
  index,
}: {
  brand: "LOTTO" | "ONE8";
  title: string;
  copy: string;
  rows: { k: string; v: string }[];
  index: string;
}) {
  const mode = modeForBrand(brand);
  return (
    <article className={`gm-axis gm-axis--${brand.toLowerCase()}`} data-mode={mode}>
      <div className="gm-axis__top">
        <span className="gm-axis__index">{index}</span>
        <BrandMark brand={brand} mode={mode} size={32} />
      </div>
      <h3>{title}</h3>
      <p className="gm-axis__copy">{copy}</p>
      <div className="gm-axis__ledger">
        {rows.map((row, rowIndex) => (
          <div className="gm-axis__row" key={row.k}>
            <span>{String(rowIndex + 1).padStart(2, "0")}</span>
            <strong>{row.k}</strong>
            <p>{row.v}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function BrandSystem() {
  return (
    <Chapter
      id="system"
      mode="light"
      className="gm-system"
      threshold={0.2}
      onEnter={() => {
        claimStage(null);
        set({ world: "brands", presence: 0 });
      }}
    >
      <div className="gm-wrap">
        <SectionLabel n="02">Two ways forward</SectionLabel>
        <div className="gm-system__head">
          <h2>
            <Split text="One country." stagger={28} />
            <Split text="Two systems." className="gm-serif" stagger={32} delay={180} />
          </h2>
          <p className="rise rise-d2">
            Lotto starts with where you play. one8 starts with how your whole day moves.
            They meet where participation becomes progress.
          </p>
        </div>

        <div className="gm-system__axes">
          <BrandAxis
            brand="LOTTO"
            index="A / SURFACE"
            title="Engineered by surface."
            copy="For everyone who plays — built backwards from the ground under them."
            rows={SURFACES}
          />
          <BrandAxis
            brand="ONE8"
            index="B / DAY"
            title="Engineered by day."
            copy="For those getting better — training, playing, recovering and moving again."
            rows={DAY}
          />
        </div>

        <section className="gm-system__bridge" aria-label="The progression from Lotto to one8">
          <div className="gm-bridge__header">
            <span>THE PROGRESSION / ONE CONTINUOUS SYSTEM</span>
            <p>Participation is the beginning. Progress is what keeps people moving.</p>
          </div>

          <div className="gm-bridge__path">
            <article className="gm-bridge-card gm-bridge-card--lotto" data-mode="light">
              <div className="gm-bridge-card__top">
                <span>01 / ENTER THE GAME</span>
                <BrandMark brand="LOTTO" mode="light" size={28} />
              </div>
              <strong className="gm-bridge-card__verb">LEARN</strong>
              <h3>with Lotto.</h3>
              <p>Start anywhere. Play on the surface you already have. Build confidence through access, repetition and joy.</p>
              <div className="gm-bridge-card__proof">
                <span><b>08</b> surface-led shoes</span>
                <span><b>01</b> open door to play</span>
              </div>
            </article>

            <div className="gm-bridge__connector" aria-hidden>
              <span>A</span>
              <i />
              <strong>PLAY BECOMES PRACTICE</strong>
              <i />
              <span>B</span>
            </div>

            <article className="gm-bridge-card gm-bridge-card--one8" data-mode="dark">
              <div className="gm-bridge-card__top">
                <span>02 / BUILD THE DAY</span>
                <BrandMark brand="ONE8" mode="dark" size={28} />
              </div>
              <strong className="gm-bridge-card__verb">PROGRESS</strong>
              <h3>with one8.</h3>
              <p>Train with intent. Recover properly. Return stronger. Turn daily movement into a visible path forward.</p>
              <div className="gm-bridge-card__proof">
                <span><b>03</b> progression-led shoes</span>
                <span><b>04</b> connected day states</span>
              </div>
            </article>
          </div>

          <p className="gm-bridge__close">
            Not two disconnected brands. <strong>One lifetime in motion.</strong>
          </p>
        </section>
      </div>
    </Chapter>
  );
}

function IconScene({
  shoe,
  icon,
  index,
  onAtlas,
}: {
  shoe: Shoe;
  icon: (typeof ICONS)[number];
  index: number;
  onAtlas: (id: string) => void;
}) {
  const slot = useRef<HTMLDivElement>(null);
  const model = modelFor(shoe.id);
  const art = artFor(shoe.id);
  const mode = modeForBrand(shoe.brand);
  const accent = accentFor(shoe.accent, mode);

  return (
    <Chapter
      mode={mode}
      id={`icon-${shoe.id}`}
      className={`gm-icon gm-icon--${shoe.id}`}
      threshold={0.34}
      style={{ "--accent": accent } as CSSProperties}
      onEnter={() => {
        claimStage(model ? slot.current : null);
        set({
          world: `shoe:${shoe.id}`,
          formId: shoe.id,
          accent: shoe.accent,
          presence: model ? 1 : 0,
        });
      }}
    >
      <AmbienceLayer world={`shoe:${shoe.id}`} />
      <div className="gm-icon__field" aria-hidden>
        <span>{shoe.id === "alleys" ? "COURT" : shoe.id === "traktor" ? "WEATHER" : "CRICKET"}</span>
      </div>
      <div className="gm-icon__grid">
        <div className="gm-icon__copy">
          <div className="gm-icon__meta rise">
            <span>0{index}</span>
            <span>{icon.formal}</span>
          </div>
          <p className="gm-icon__formal rise">{shoe.subtitle}</p>
          <h3>
            <Split text={icon.street} stagger={35} />
          </h3>
          <p className="gm-icon__line rise rise-d1">{icon.line}</p>
          <div className="gm-icon__metric rise rise-d2">
            <strong>{icon.metric}</strong>
            <span>{icon.metricLabel}</span>
          </div>
          <button className="gm-text-link rise rise-d3" data-cur="Find" onClick={() => onAtlas(shoe.id)}>
            Find in the eleven
          </button>
        </div>

        <div className="gm-icon__visual" ref={slot}>
          {model ? (
            <OrbitSlot label="Drag to inspect" />
          ) : art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt={`${shoe.name} — ${shoe.subtitle}`} />
          ) : (
            <div className="gm-abstract-shoe" aria-label={`${shoe.name} concept`}>
              <span>{shoe.name}</span>
            </div>
          )}
          <div className="gm-icon__coordinates" aria-hidden>
            <span>28.6139° N</span>
            <span>77.2090° E</span>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

function IconRun({ onAtlas }: { onAtlas: (id: string) => void }) {
  return (
    <div id="icons" className="gm-icons">
      <Chapter
        mode="dark"
        className="gm-icons__intro"
        threshold={0.25}
        onEnter={() => {
          claimStage(null);
          set({ world: "brands", presence: 0 });
        }}
      >
        <div className="gm-wrap">
          <SectionLabel n="03">The icons</SectionLabel>
          <h2>
            <Split text="Three shoes" stagger={28} />
            <Split text="carry the line." className="gm-serif gm-signal" stagger={32} delay={180} />
          </h2>
          <p className="gm-icons__intro-copy rise rise-d2">
            Not eleven equal launches. Three unmistakable objects that make the whole system believable.
          </p>
        </div>
      </Chapter>
      {ICONS.map((icon, index) => {
        const shoe = shoeById(icon.shoeId);
        return shoe ? (
          <IconScene key={shoe.id} shoe={shoe} icon={icon} index={index + 1} onAtlas={onAtlas} />
        ) : null;
      })}
    </div>
  );
}

function TechnologyTerrain({ onAtlas }: { onAtlas: (id: string) => void }) {
  const [selected, setSelected] = useState(0);
  const slot = useRef<HTMLDivElement>(null);
  const technology = technologies[selected];
  const usedBy = shoes.filter((shoe) => shoe.technologies.includes(technology.id));

  const choose = (index: number) => {
    setSelected(index);
    set({
      tech: index,
      world: isWetPlatform(technologies[index].id) ? "lab:wet" : "lab",
      formId: "material-study",
      presence: 1,
    });
  };

  return (
    <Chapter
      id="terrain"
      mode="dark"
      className="gm-terrain"
      threshold={0.2}
      onEnter={() => {
        claimStage(slot.current);
        set({
          tech: selected,
          world: isWetPlatform(technology.id) ? "lab:wet" : "lab",
          formId: "material-study",
          presence: 1,
        });
      }}
    >
      <div className="gm-terrain__contours" aria-hidden>
        {Array.from({ length: 9 }).map((_, index) => <span key={index} />)}
      </div>
      <div className="gm-wrap gm-terrain__inner">
        <SectionLabel n="04">Technology becomes terrain</SectionLabel>
        <div className="gm-terrain__head">
          <h2>
            <Split text="Built underneath." stagger={28} />
            <Split text="Felt everywhere." className="gm-serif" stagger={32} delay={180} />
          </h2>
          <p className="rise rise-d2">
            Ten reusable platforms. Named so they can improve, specific enough to be proved.
          </p>
        </div>

        <div className="gm-terrain__console">
          <div className="gm-tech-map" role="tablist" aria-label="Technology platforms">
            {technologies.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={selected === index}
                className={selected === index ? "is-active" : ""}
                onClick={() => choose(index)}
                onFocus={() => choose(index)}
                data-cur="Inspect"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>

          <div className="gm-tech__study" ref={slot}>
            <OrbitSlot label="Drag the material study" />
            <div className="gm-tech__rings" aria-hidden><span /><span /><span /></div>
          </div>

          <div className="gm-tech__readout" key={technology.id}>
            <span className="gm-tech__count">Platform {String(selected + 1).padStart(2, "0")} / 10</span>
            <h3>{technology.name}</h3>
            <p className="gm-tech__tagline">{technology.tagline}</p>
            <p className="gm-tech__description">{technology.description}</p>
            <p className="gm-tech__detail">{technology.detail}</p>
            <div className="gm-tech__used">
              <span>Lives under</span>
              <div>
                {usedBy.map((shoe) => (
                  <button key={shoe.id} onClick={() => onAtlas(shoe.id)} data-cur="Find">
                    {shoe.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

type AtlasFilter = "ALL" | "LOTTO" | "ONE8";

function ShoeArtwork({ shoe, large = false }: { shoe: Shoe; large?: boolean }) {
  const art = artFor(shoe.id);
  if (art) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={art} alt={`${shoe.name} — ${shoe.subtitle}`} className={large ? "is-large" : ""} />
    );
  }
  return (
    <div className={`gm-shoe-ghost ${large ? "is-large" : ""}`} style={{ "--shoe-accent": shoe.accent } as CSSProperties}>
      <span className="gm-shoe-ghost__sole" />
      <span className="gm-shoe-ghost__upper" />
      <strong>{String(shoe.order).padStart(2, "0")}</strong>
    </div>
  );
}

function ShoeDrawer({ shoe, onClose }: { shoe: Shoe; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const tech = technologies.filter((item) => shoe.technologies.includes(item.id));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("drawer-open");
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="gm-drawer" role="dialog" aria-modal="true" aria-labelledby="shoe-drawer-title">
      <button className="gm-drawer__veil" aria-label="Close product details" onClick={onClose} />
      <article className="gm-drawer__panel" data-mode={modeForBrand(shoe.brand)}>
        <div className="gm-drawer__top">
          <span>{shoe.brand} / {String(shoe.order).padStart(2, "0")}</span>
          <button ref={closeRef} onClick={onClose} data-cur="Close" aria-label="Close product details">Close ×</button>
        </div>
        <div className="gm-drawer__layout">
          <div className="gm-drawer__art"><ShoeArtwork shoe={shoe} large /></div>
          <div className="gm-drawer__copy">
            <p>{shoe.subtitle}</p>
            <h3 id="shoe-drawer-title">{shoe.name}</h3>
            <blockquote>{shoe.whyWeMadeIt}</blockquote>
            <div className="gm-drawer__value">
              <span>The value</span>
              <p>{shoe.value}</p>
            </div>
            <div className="gm-drawer__purposes">
              {[
                ["A", shoe.purposeA],
                ["B", shoe.purposeB],
                ["S", shoe.purposeS],
              ].map(([code, purpose]) => {
                const item = purpose as Shoe["purposeA"];
                return (
                  <div key={code as string}>
                    <span>{code as string}</span>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="gm-drawer__spec">
              <span>Features</span>
              <p>{shoe.features}</p>
            </div>
            <div className="gm-drawer__chips">
              {tech.map((item) => <span key={item.id}>{item.name}</span>)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function ProductAtlas({ focusId, onFocusHandled }: { focusId: string | null; onFocusHandled: () => void }) {
  const [filter, setFilter] = useState<AtlasFilter>("ALL");
  const [open, setOpen] = useState<Shoe | null>(null);
  const focusTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!focusId) return;
    setFilter("ALL");
    const card = document.getElementById(`atlas-${focusId}`);
    focusTimer.current = window.setTimeout(() => {
      card?.classList.add("is-called");
      window.setTimeout(() => card?.classList.remove("is-called"), 1600);
      onFocusHandled();
    }, 750);
    return () => {
      if (focusTimer.current) window.clearTimeout(focusTimer.current);
    };
  }, [focusId, onFocusHandled]);

  const visible = filter === "ALL" ? shoes : shoes.filter((shoe) => shoe.brand === filter);

  return (
    <Chapter
      id="atlas"
      mode="light"
      className="gm-atlas"
      threshold={0.18}
      onEnter={() => {
        claimStage(null);
        set({ world: "brands", presence: 0 });
      }}
    >
      <div className="gm-wrap">
        <div className="gm-atlas__head">
          <div>
            <SectionLabel n="04.2">The eleven / optional deep dive</SectionLabel>
            <h2>
              <Split text="Every reality." stagger={28} />
              <Split text="One system." className="gm-serif" stagger={32} delay={180} />
            </h2>
          </div>
          <div className="gm-atlas__filters" role="group" aria-label="Filter the product atlas">
            {(["ALL", "LOTTO", "ONE8"] as AtlasFilter[]).map((item) => (
              <button
                key={item}
                className={filter === item ? "is-active" : ""}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item === "ALL" ? "All 11" : item === "ONE8" ? "one8" : "Lotto"}
              </button>
            ))}
          </div>
        </div>

        <div className="gm-atlas__grid">
          {visible.map((shoe) => (
            <button
              id={`atlas-${shoe.id}`}
              key={shoe.id}
              className="gm-product-card"
              onClick={() => setOpen(shoe)}
              data-cur="Open"
              style={{ "--shoe-accent": accentFor(shoe.accent, "light") } as CSSProperties}
            >
              <span className="gm-product-card__top">
                <span>{String(shoe.order).padStart(2, "0")}</span>
                <span>{shoe.brand === "ONE8" ? "one8" : "Lotto"}</span>
              </span>
              <span className="gm-product-card__art"><ShoeArtwork shoe={shoe} /></span>
              <span className="gm-product-card__name">{shoe.name}</span>
              <span className="gm-product-card__sub">{shoe.subtitle}</span>
              <span className="gm-product-card__open">View dossier</span>
            </button>
          ))}
        </div>
      </div>
      {open && <ShoeDrawer shoe={open} onClose={() => setOpen(null)} />}
    </Chapter>
  );
}

function CampaignVisual({ campaign }: { campaign: Campaign }) {
  return (
    <div className={`gm-campaign-visual gm-campaign-visual--${campaign.id}`} aria-hidden>
      <span className="gm-campaign-visual__horizon" />
      <span className="gm-campaign-visual__object" />
      <span className="gm-campaign-visual__motion" />
      <span className="gm-campaign-visual__type">{campaign.name}</span>
    </div>
  );
}

function Culture() {
  const [selected, setSelected] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const campaign = featuredCampaigns[selected];

  const choose = (index: number) => {
    setSelected(index);
    set({ world: `camp:${featuredCampaigns[index].id}`, presence: 0 });
  };

  return (
    <Chapter
      id="culture"
      mode="dark"
      className="gm-culture"
      threshold={0.2}
      onEnter={() => {
        claimStage(null);
        set({ world: `camp:${campaign.id}`, presence: 0 });
      }}
    >
      <div className="gm-wrap">
        <SectionLabel n="05">Release it into culture</SectionLabel>
        <div className="gm-culture__head">
          <h2>
            <Split text="Do things." stagger={30} />
            <Split text="Don't just say things." className="gm-serif gm-signal" stagger={30} delay={170} />
          </h2>
          <p className="rise rise-d2">
            Four launch ideas shown at full volume. Six more remain ready behind them.
          </p>
        </div>

        <div className="gm-campaign">
          <div className="gm-campaign__plate" key={campaign.id}>
            <CampaignVisual campaign={campaign} />
            <div className="gm-campaign__stamp">Treatment / 0{selected + 1}</div>
          </div>
          <div className="gm-campaign__copy" key={`${campaign.id}-copy`}>
            <span>{campaign.shoe}</span>
            <h3>{campaign.name}</h3>
            <p className="gm-campaign__tag">{campaign.tagline}</p>
            <p className="gm-campaign__idea">{campaign.description}</p>
            <div className="gm-campaign__notes">
              <div><span>The film</span><p>{campaign.film}</p></div>
              <div><span>In the world</span><p>{campaign.gtm}</p></div>
            </div>
          </div>
        </div>

        <div className="gm-campaign__nav" role="tablist" aria-label="Featured campaign treatments">
          {featuredCampaigns.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={selected === index}
              className={selected === index ? "is-active" : ""}
              onClick={() => choose(index)}
            >
              <span>0{index + 1}</span>
              <strong>{item.name}</strong>
              <small>{item.shoe}</small>
            </button>
          ))}
        </div>

        <button className="gm-all-toggle" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll}>
          {showAll ? "Close campaign index" : "View all ten campaign ideas"}
          <span>{showAll ? "−" : "+"}</span>
        </button>

        {showAll && (
          <div className="gm-campaign-index">
            {campaigns.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  const featuredIndex = featuredCampaigns.findIndex((candidate) => candidate.id === item.id);
                  if (featuredIndex >= 0) {
                    choose(featuredIndex);
                    goTo("culture");
                  }
                }}
                disabled={!featuredCampaigns.some((candidate) => candidate.id === item.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.tagline}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </Chapter>
  );
}

function Closing({ onPdf, busy }: { onPdf: () => void; busy: boolean }) {
  return (
    <Chapter
      id="foot"
      mode="dark"
      className="gm-close"
      threshold={0.25}
      onEnter={() => {
        claimStage(null);
        set({ world: "foot", presence: 0 });
      }}
    >
      <div className="gm-close__signal" aria-hidden><span /></div>
      <div className="gm-wrap gm-close__inner">
        <p className="gm-close__pre rise">Agilitas Sports / Lotto × one8</p>
        <h2>
          <Split text="Made here" stagger={34} />
          <Split text="for forty years." className="gm-serif" stagger={34} delay={150} />
          <Split text="Designed here" stagger={34} delay={310} />
          <Split text="from now." className="gm-serif gm-signal" stagger={34} delay={460} />
        </h2>
        <div className="gm-close__actions rise rise-d3">
          <button className="gm-primary" onClick={onPdf} disabled={busy} data-cur="Save">
            {busy ? "Building the document…" : "Download the complete pitch"}
          </button>
          <button className="gm-secondary" onClick={() => goTo("ground")} data-cur="Replay">
            Return to the ground
          </button>
        </div>
        <div className="gm-close__base">
          <span>11 shoes</span>
          <span>10 platforms</span>
          <span>2 brands</span>
          <span>1 system</span>
        </div>
      </div>
    </Chapter>
  );
}

export function GroundMotion({ onPdf, busy }: { onPdf: () => void; busy: boolean }) {
  const [atlasFocus, setAtlasFocus] = useState<string | null>(null);
  const clearAtlasFocus = useMemo(() => () => setAtlasFocus(null), []);

  const findInAtlas = (id: string) => {
    setAtlasFocus(id);
    goTo("atlas");
  };

  return (
    <>
      <Origin />
      <BrandSystem />
      <IconRun onAtlas={findInAtlas} />
      <TechnologyTerrain onAtlas={findInAtlas} />
      <ProductAtlas focusId={atlasFocus} onFocusHandled={clearAtlasFocus} />
      <Culture />
      <Closing onPdf={onPdf} busy={busy} />
    </>
  );
}
