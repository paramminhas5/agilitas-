/* ═══════════════════════════════════════════════════════════════════════════
   THE ICONS
   ---------------------------------------------------------------------------
   Three flagships, carried directly under the hero.

   Each has a formal name and a street name. The street name is what the site
   leads with, because it is how people actually talk about shoes — Air Force
   1s, Sambas, 350s. Nobody says "the Nike Air Force 1 Low".

   NOTE ON "THE KOHLI 1S": this leans on Virat's name directly, which is a
   heavier ask than "Reverse" and probably needs his side's sign-off. Change
   the one string below and it updates everywhere.
   ═══════════════════════════════════════════════════════════════════════════ */

export type IconProduct = {
  /** matches a shoe id in data/products.ts */
  shoeId: string;
  brand: "LOTTO" | "ONE8";
  /** the name on the box */
  formal: string;
  /** the name on the street — what we lead with */
  street: string;
  /** the one number that earns attention */
  metric: string;
  metricLabel: string;
  /** the argument, in one sentence */
  line: string;
};

/*
 * Ordered deliberately: two Lotto on white, then the page turns dark for one8.
 * The section walks the brand story rather than listing three products —
 * you start on cement, you take on the whole year, then you get serious.
 */
export const ICONS: IconProduct[] = [
  {
    shoeId: "alleys",
    brand: "LOTTO",
    formal: "Lotto Alleys",
    street: "The Alleys",
    metric: "3",
    metricLabel: "Court sports, plus the walk home",
    line: "Indian courts are cement, not sprung wood. Every court shoe here ignored that.",
  },
  {
    shoeId: "traktor",
    brand: "LOTTO",
    formal: "Lotto Traktor",
    street: "The Traktors",
    metric: "3",
    metricLabel: "Weather modes, one pair",
    line: "Everyone designs for the monsoon. Nobody designs for the whole Indian year.",
  },
  {
    shoeId: "reverse",
    brand: "ONE8",
    formal: "one8 Reverse",
    street: "The Kohli 1s",
    metric: "3.34M",
    metricLabel: "Tennis-ball matches a year, and no shoe built for them",
    line: "The sport most of India actually plays has never had a shoe. This is it.",
  },
];
