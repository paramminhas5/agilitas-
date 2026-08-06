/* ═══════════════════════════════════════════════════════════════════════════
   AMBIENCE
   ---------------------------------------------------------------------------
   Rain works because it is specific and physical rather than decorative. Four
   more in the same spirit, each tied to a place that actually has it. Every
   one is a composited layer behind the copy — cheap, and it never touches
   the text.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Ambience =
  | "sweep"    // a floodlight pool crossing the frame
  | "shimmer"  // heat haze off hot ground
  | "sodium"   // warm street pools, faintly flickering
  | "shaft";   // dust caught in one hard side light

/** Keyed the same way as WORLDS: "shoe:<id>" and "camp:<id>". */
export const AMBIENCE: Record<string, Ambience> = {
  // Floodlights: night sport played under rigs
  "shoe:nightshift": "sweep",
  "camp:10pm-league": "sweep",
  "camp:midnight-galli": "sweep",

  // Heat off cement and matting in full sun
  "shoe:reverse": "shimmer",
  "shoe:alleys": "shimmer",
  "camp:the-trial": "shimmer",

  // Sodium street light
  "shoe:dad-shoe": "sodium",
  "camp:thousand-riders": "sodium",
  "camp:sunday-session": "sodium",

  // One hard light through a doorway, and the dust in it
  "shoe:barefoot-nps": "shaft",
  "shoe:recover": "shaft",
  "camp:take-them-off": "shaft",
  "camp:ball-maker-capsule": "shaft",
};

export const ambienceFor = (world: string): Ambience | null =>
  AMBIENCE[world] ?? null;
