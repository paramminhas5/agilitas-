/* ═══════════════════════════════════════════════════════════════════════════
   WORLDS
   ---------------------------------------------------------------------------
   Every shoe and every campaign is somewhere. A world describes that place:
   the air in it, the light on it, the ground under it, and how the object
   behaves there. The rig eases between whichever two worlds it is between,
   so no transition is ever a cut.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Air =
  | "none"    // sealed studio
  | "dust"    // suspended cement particulate
  | "rain"    // falling water, only where weather is the point
  | "mist"    // fine turf damp
  | "chalk"   // climbing chalk, drifts upward
  | "motes"   // slow warm interior specks
  | "grit";   // dry street debris, fast and low

export type Ground = {
  color: string;
  rough: number;
  metal: number;
  opacity: number;
  /** draws a measured grid — courts, matting, gym tile */
  grid: boolean;
} | null;

export type World = {
  label: string;
  /** fog colour doubles as the horizon tint */
  fog: string;
  fogNear: number;
  fogFar: number;
  key: string;
  keyPos: [number, number, number];
  keyIntensity: number;
  fill: string;
  fillIntensity: number;
  air: Air;
  /** 0..1 scale applied to the tier's particle budget */
  density: number;
  ground: Ground;
  /** idle rotation multiplier — nervous vs still */
  spin: number;
};


const STUDIO: World = {
  label: "Studio",
  fog: "#050608",
  fogNear: 7,
  fogFar: 20,
  key: "#EDEBE6",
  keyPos: [2.6, 2.4, 3.2],
  keyIntensity: 24,
  fill: "#8A7CFF",
  fillIntensity: 10,
  air: "dust",
  density: 0.5,
  ground: null,
  spin: 1,
};

/** Shallow merge helper so each world only states what makes it different. */
const w = (over: Partial<World>): World => ({ ...STUDIO, ...over });

export const WORLDS: Record<string, World> = {
  /* ── Framing sections ─────────────────────────────────────────────────── */
  hero: w({
    label: "Origin",
    fog: "#050608",
    key: "#FFFFFF",
    keyIntensity: 30,
    air: "dust",
    density: 0.7,
    spin: 0.7,
  }),
  brands: w({ label: "Two brands", fillIntensity: 14, density: 0.4 }),
  lab: w({
    label: "Laboratory",
    fog: "#07090B",
    key: "#E8F4FF",
    keyPos: [1.8, 3.0, 2.6],
    keyIntensity: 26,
    fill: "#7DF9E8",
    fillIntensity: 8,
    air: "none",
    density: 0,
    ground: { color: "#0D1114", rough: 0.5, metal: 0.1, opacity: 0.5, grid: true },
    spin: 0.35,
  }),
  foot: w({ label: "Close", fogFar: 14, keyIntensity: 12, air: "dust", density: 0.25, spin: 0.5 }),
};


/* ── The eleven ─────────────────────────────────────────────────────────── */
Object.assign(WORLDS, {
  "shoe:alleys": w({
    label: "Outdoor cement court",
    fog: "#070A0B",
    key: "#FFFFFF",
    keyPos: [3.4, 3.6, 2.0],
    keyIntensity: 34,
    fill: "#7DF9E8",
    fillIntensity: 7,
    air: "dust",
    density: 0.85,
    ground: { color: "#15191B", rough: 0.95, metal: 0.02, opacity: 0.65, grid: true },
    spin: 1.15,
  }),
  "shoe:traktor": w({
    label: "Monsoon",
    fog: "#06090D",
    fogNear: 5,
    fogFar: 16,
    key: "#BFD8EA",
    keyPos: [1.4, 4.2, 2.4],
    keyIntensity: 18,
    fill: "#5FB8FF",
    fillIntensity: 16,
    air: "rain",
    density: 1,
    ground: { color: "#0B1218", rough: 0.12, metal: 0.55, opacity: 0.8, grid: false },
    spin: 0.9,
  }),
  "shoe:doorway": w({
    label: "The threshold",
    fog: "#08090C",
    key: "#FFF3E2",
    keyPos: [-3.2, 2.2, 2.6],
    keyIntensity: 20,
    fill: "#A9C6D8",
    fillIntensity: 6,
    air: "motes",
    density: 0.35,
    ground: { color: "#171614", rough: 0.7, metal: 0.05, opacity: 0.55, grid: false },
    spin: 0.5,
  }),
});


Object.assign(WORLDS, {
  "shoe:nightshift": w({
    label: "Floodlit turf, 10pm",
    fog: "#07070E",
    fogNear: 5.5,
    fogFar: 17,
    key: "#DCE6FF",
    keyPos: [-2.8, 4.0, 1.6],
    keyIntensity: 30,
    fill: "#8A7CFF",
    fillIntensity: 20,
    air: "mist",
    density: 0.8,
    ground: { color: "#0E1A14", rough: 0.85, metal: 0.03, opacity: 0.7, grid: false },
    spin: 1.5,
  }),
  "shoe:beta": w({
    label: "Bouldering gym",
    fog: "#060B0A",
    key: "#F2FFFA",
    keyPos: [0.4, 3.4, 3.6],
    keyIntensity: 22,
    fill: "#6FE3C4",
    fillIntensity: 12,
    air: "chalk",
    density: 0.7,
    ground: { color: "#141A18", rough: 0.98, metal: 0, opacity: 0.6, grid: false },
    spin: 0.4,
  }),
  "shoe:session": w({
    label: "Street, dusk",
    fog: "#08070D",
    key: "#FFE9D0",
    keyPos: [3.0, 2.0, 2.2],
    keyIntensity: 21,
    fill: "#B9A8FF",
    fillIntensity: 14,
    air: "grit",
    density: 0.75,
    ground: { color: "#121214", rough: 0.9, metal: 0.04, opacity: 0.6, grid: false },
    spin: 1.25,
  }),
});


Object.assign(WORLDS, {
  "shoe:reverse": w({
    label: "Matting, hard midday sun",
    fog: "#05090B",
    fogFar: 22,
    key: "#FFFFFF",
    keyPos: [2.2, 5.0, 1.4],
    keyIntensity: 40,
    fill: "#4FD8E8",
    fillIntensity: 6,
    air: "dust",
    density: 0.95,
    ground: { color: "#14191B", rough: 0.92, metal: 0.02, opacity: 0.7, grid: true },
    spin: 1.35,
  }),
  "shoe:train": w({
    label: "Conditioning room",
    fog: "#06080D",
    fogNear: 6,
    key: "#D8E4FF",
    keyPos: [0, 4.6, 2.0],
    keyIntensity: 24,
    fill: "#86A6FF",
    fillIntensity: 9,
    air: "none",
    density: 0,
    ground: { color: "#101216", rough: 0.75, metal: 0.08, opacity: 0.68, grid: true },
    spin: 0.85,
  }),
  "shoe:recover": w({
    label: "Home, after",
    fog: "#07060E",
    fogNear: 5,
    fogFar: 15,
    key: "#FFE8D8",
    keyPos: [-2.0, 1.8, 3.0],
    keyIntensity: 15,
    fill: "#9D8CFF",
    fillIntensity: 11,
    air: "motes",
    density: 0.3,
    ground: { color: "#16151A", rough: 0.95, metal: 0, opacity: 0.5, grid: false },
    spin: 0.28,
  }),
});


Object.assign(WORLDS, {
  "shoe:everyday-mid": w({
    label: "Neutral studio",
    fog: "#08090A",
    fogNear: 6.5,
    key: "#FFFFFF",
    keyPos: [2.0, 2.8, 3.4],
    keyIntensity: 26,
    fill: "#C3CBD1",
    fillIntensity: 8,
    air: "none",
    density: 0,
    ground: { color: "#141517", rough: 0.35, metal: 0.15, opacity: 0.6, grid: false },
    spin: 0.32,
  }),
  "shoe:1973": w({
    label: "Archive",
    fog: "#0A0A08",
    fogNear: 6,
    fogFar: 16,
    key: "#FFF6DF",
    keyPos: [1.6, 3.2, 2.8],
    keyIntensity: 23,
    fill: "#D8CFA8",
    fillIntensity: 10,
    air: "motes",
    density: 0.22,
    ground: { color: "#17160F", rough: 0.4, metal: 0.2, opacity: 0.6, grid: false },
    spin: 0.2,
  }),
});


/* ── Campaign scenes ────────────────────────────────────────────────────── */
Object.assign(WORLDS, {
  "camp:the-trial": w({
    label: "The Combine",
    fog: "#07090B",
    key: "#F4FFFE",
    keyPos: [0, 4.4, 2.8],
    keyIntensity: 27,
    fill: "#7DF9E8",
    fillIntensity: 9,
    air: "none",
    density: 0,
    ground: { color: "#0F1416", rough: 0.6, metal: 0.08, opacity: 0.6, grid: true },
    spin: 0.6,
  }),
  "camp:midnight-galli": w({
    label: "Midnight, in the lane",
    fog: "#07070E",
    fogNear: 4.5,
    fogFar: 15,
    key: "#E6DCFF",
    keyPos: [-3.4, 3.4, 1.2],
    keyIntensity: 32,
    fill: "#5FB8FF",
    fillIntensity: 22,
    air: "mist",
    density: 0.85,
    ground: { color: "#0D0C16", rough: 0.55, metal: 0.25, opacity: 0.72, grid: false },
    spin: 1.6,
  }),
  "camp:take-them-off": w({
    label: "Twelve doorways",
    fog: "#08090C",
    key: "#FFF1DE",
    keyPos: [-3.6, 2.0, 2.4],
    keyIntensity: 22,
    fill: "#A9C6D8",
    fillIntensity: 5,
    air: "motes",
    density: 0.32,
    ground: { color: "#181614", rough: 0.72, metal: 0.04, opacity: 0.55, grid: false },
    spin: 0.42,
  }),
});


Object.assign(WORLDS, {
  "camp:10pm-league": w({
    label: "The late slot",
    fog: "#070810",
    fogNear: 5.5,
    key: "#E8F0FF",
    keyPos: [-2.6, 4.4, 1.8],
    keyIntensity: 34,
    fill: "#8A7CFF",
    fillIntensity: 18,
    air: "mist",
    density: 0.7,
    ground: { color: "#0D1712", rough: 0.86, metal: 0.03, opacity: 0.7, grid: false },
    spin: 1.45,
  }),
  "camp:beta-sessions": w({
    label: "Chalk and breath",
    fog: "#060B0A",
    fogFar: 17,
    key: "#F4FFFB",
    keyPos: [0.8, 3.0, 3.4],
    keyIntensity: 20,
    fill: "#6FE3C4",
    fillIntensity: 13,
    air: "chalk",
    density: 0.8,
    ground: { color: "#131917", rough: 0.98, metal: 0, opacity: 0.55, grid: false },
    spin: 0.36,
  }),
  "camp:sunday-session": w({
    label: "The park we built",
    fog: "#08070D",
    fogFar: 21,
    key: "#FFF0DC",
    keyPos: [2.6, 3.8, 2.0],
    keyIntensity: 28,
    fill: "#B9A8FF",
    fillIntensity: 12,
    air: "grit",
    density: 0.8,
    ground: { color: "#151517", rough: 0.9, metal: 0.05, opacity: 0.62, grid: false },
    spin: 1.2,
  }),
});


Object.assign(WORLDS, {
  /* The only two campaigns where weather is the argument. */
  "camp:dry-by-morning": w({
    label: "Genuine rain",
    fog: "#06090D",
    fogNear: 4.5,
    fogFar: 15,
    key: "#C6DCEC",
    keyPos: [1.2, 4.4, 2.2],
    keyIntensity: 17,
    fill: "#4FD8E8",
    fillIntensity: 17,
    air: "rain",
    density: 1,
    ground: { color: "#0A1117", rough: 0.1, metal: 0.6, opacity: 0.82, grid: false },
    spin: 0.95,
  }),
  "camp:rain-locked-drop": w({
    label: "Only when it rains",
    fog: "#05080E",
    fogNear: 4,
    fogFar: 13,
    key: "#AEC8DE",
    keyPos: [-1.6, 4.6, 1.8],
    keyIntensity: 15,
    fill: "#5FB8FF",
    fillIntensity: 24,
    air: "rain",
    density: 1,
    ground: { color: "#080E15", rough: 0.08, metal: 0.7, opacity: 0.85, grid: false },
    spin: 1.1,
  }),
});


Object.assign(WORLDS, {
  "camp:thousand-riders": w({
    label: "Every traffic light",
    fog: "#07080A",
    fogFar: 19,
    key: "#FFEBC4",
    keyPos: [2.8, 2.6, 1.6],
    keyIntensity: 26,
    fill: "#6FE3C4",
    fillIntensity: 15,
    air: "grit",
    density: 0.9,
    ground: { color: "#111214", rough: 0.8, metal: 0.12, opacity: 0.66, grid: false },
    spin: 1.7,
  }),
  "camp:ball-maker-capsule": w({
    label: "Meerut workshop",
    fog: "#0A0A08",
    fogNear: 5,
    fogFar: 16,
    key: "#FFF2D6",
    keyPos: [-1.8, 2.4, 2.8],
    keyIntensity: 21,
    fill: "#D8CFA8",
    fillIntensity: 13,
    air: "motes",
    density: 0.45,
    ground: { color: "#18160F", rough: 0.85, metal: 0.06, opacity: 0.58, grid: false },
    spin: 0.3,
  }),
});

/* ── Resolution ─────────────────────────────────────────────────────────── */

/** Platforms whose whole argument is water. Selecting one makes it rain. */
const WET_PLATFORMS = new Set(["dry-system", "two-ground-sole"]);

export function isWetPlatform(id: string) {
  return WET_PLATFORMS.has(id);
}

export function resolveWorld(key: string): World {
  return WORLDS[key] ?? STUDIO;
}


/** The lab, while a platform whose whole argument is water is selected. */
WORLDS["lab:wet"] = w({
  label: "Laboratory, under water",
  fog: "#06090D",
  fogNear: 5,
  fogFar: 16,
  key: "#C6DCEC",
  keyPos: [1.4, 3.6, 2.6],
  keyIntensity: 19,
  fill: "#4FD8E8",
  fillIntensity: 18,
  air: "rain",
  density: 1,
  ground: { color: "#0A1117", rough: 0.12, metal: 0.58, opacity: 0.7, grid: true },
  spin: 0.5,
});
