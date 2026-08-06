/* ═══════════════════════════════════════════════════════════════════════════
   THE TWO AXES
   ---------------------------------------------------------------------------
   Lotto is engineered by surface — organised around the ground under your
   feet. one8 is engineered by day — organised around how an athlete actually
   spends one. These two lists are the argument.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Row = { k: string; v: string };

export const SURFACES: Row[] = [
  { k: "Cement", v: "Outdoor courts, gully cricket, the walk to the main road" },
  { k: "Matting", v: "Club and school cricket, laid over whatever is underneath" },
  { k: "Turf", v: "Five-a-side and padel, booked after work" },
  { k: "Mud and rock", v: "The broken 200 metres, and the weekend trek" },
  { k: "Wet tile", v: "Four months of monsoon, and every staircase in it" },
];

export const DAY: Row[] = [
  { k: "06:00 — Train", v: "Loaded lifting and conditioning, six days a week" },
  { k: "10:00 — Play", v: "The ground itself, in whatever role the game needs" },
  { k: "16:00 — Recover", v: "The hours that decide what tomorrow looks like" },
  { k: "20:00 — Travel", v: "Hotel to ground, ground to home" },
  { k: "22:00 — Home", v: "Still on your feet, still being worn" },
];
