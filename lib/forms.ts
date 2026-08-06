/* ═══════════════════════════════════════════════════════════════════════════
   FORMS
   ---------------------------------------------------------------------------
   Parameters for the eleven silhouettes. These are honest stand-ins, not the
   real products: a court shoe, a trail boot, a slide, a studded cricket shoe
   and a climbing slipper are built from the same rig but read as different
   objects. Drop a .glb into /public/models and it replaces the form entirely.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Tread = "lug" | "nub" | "stud" | "channel" | "smooth" | "none";

export type Form = {
  /** heel-to-toe length in world units */
  len: number;
  /** forefoot half-width */
  width: number;
  /** heel half-width, usually narrower */
  heel: number;
  /** how bulbous the toe box sits */
  toe: number;
  /** outsole + midsole stack thickness */
  sole: number;
  /** heel lift over the forefoot */
  drop: number;
  /** 0 low-cut, 1 full cuff */
  collar: number;
  /** overall upper height */
  upper: number;
  tread: Tread;
  /** open slide: no upper, single strap */
  slide: boolean;
};

const BASE: Form = {
  len: 3.05, width: 0.58, heel: 0.44, toe: 0.8,
  sole: 0.17, drop: 0.05, collar: 0.1, upper: 0.64,
  tread: "smooth", slide: false,
};

const f = (over: Partial<Form>): Form => ({ ...BASE, ...over });


export const FORMS: Record<string, Form> = {
  /* Low, wide, flat — built to sit stable on cement. */
  alleys: f({ width: 0.6, sole: 0.16, collar: 0.04, upper: 0.62, tread: "lug" }),

  /* Tallest stack, mid cuff, drainage channels cut through the outsole. */
  traktor: f({
    len: 3.15, width: 0.63, heel: 0.48, toe: 0.95,
    sole: 0.26, drop: 0.09, collar: 0.58, upper: 0.84, tread: "channel",
  }),

  /* Everyday slip-off. Soft, unremarkable on purpose. */
  doorway: f({ width: 0.6, sole: 0.18, collar: 0.16, upper: 0.66, tread: "smooth" }),

  /* Lowest and narrowest — a turf shoe you can move sideways in. */
  nightshift: f({
    len: 3.0, width: 0.55, heel: 0.41, toe: 0.68,
    sole: 0.12, drop: 0.02, collar: 0.02, upper: 0.55, tread: "nub",
  }),

  /* Climbing slipper: almost no sole, low volume, flat last. */
  beta: f({
    len: 2.88, width: 0.51, heel: 0.38, toe: 0.58,
    sole: 0.08, drop: 0, collar: 0.08, upper: 0.5, tread: "none",
  }),

  /* Vulcanised skate shoe — flat, slightly wider forefoot. */
  session: f({ width: 0.61, sole: 0.14, drop: 0.01, collar: 0.03, upper: 0.6, tread: "smooth" }),

  /* Cricket: longest, studded, a little more ankle. */
  reverse: f({
    len: 3.22, width: 0.58, heel: 0.45, toe: 0.82,
    sole: 0.19, drop: 0.07, collar: 0.24, upper: 0.72, tread: "stud",
  }),

  /* Trainer with a firm, blocky base for loaded lifting. */
  train: f({ len: 3.1, sole: 0.21, drop: 0.03, collar: 0.12, upper: 0.68, tread: "lug" }),

  /* A slide. Thick absorbing foam, one strap, no upper at all. */
  recover: f({
    len: 3.0, width: 0.64, heel: 0.5, toe: 0.7,
    sole: 0.34, drop: 0.06, collar: 0, upper: 0, tread: "smooth", slide: true,
  }),

  /* Leather mid — the tallest cuff in the line. */
  "everyday-mid": f({ sole: 0.2, collar: 0.9, upper: 0.98, tread: "smooth" }),

  /* Premium low study. Restrained everywhere. */
  "1973": f({ len: 3.0, width: 0.56, sole: 0.16, collar: 0.05, upper: 0.6, tread: "smooth" }),
};

export const formFor = (id: string): Form => FORMS[id] ?? BASE;



/** Which part of the shoe each platform actually lives in. Drives the
 *  exploded view in the technology lab. */
export type Layer = "outsole" | "midsole" | "upper" | "collar" | "lining" | "all";

export const LAYER_FOR_TECH: Record<string, Layer> = {
  "ground-last": "all",
  "grip-rubber": "outsole",
  "two-ground-sole": "outsole",
  "second-skin": "outsole",
  "dry-system": "upper",
  "fold-heel": "collar",
  "resole": "midsole",
  "foot-sensor": "midsole",
  "heat-stable-foam": "midsole",
  "fresh-lining": "lining",
};
