/* ═══════════════════════════════════════════════════════════════════════════
   ASSET SEAM
   ---------------------------------------------------------------------------
   The site currently runs on procedural placeholders. When you add real
   artwork or 3D models to the repo, flip the matching flag below and the
   experience picks them up with no other code changes.

   Product art   →  /public/shoes/<shoe-id>.png     (square, >= 1200px, alpha)
   3D models     →  /public/models/<shoe-id>.glb    (Y-up, ~1 unit long)

   Shoe ids: alleys, traktor, doorway, nightshift, beta, session,
             reverse, train, recover, everyday-mid, 1973
   ═══════════════════════════════════════════════════════════════════════════ */

/** Flip a shoe id to true once /public/shoes/<id>.png is a real image. */
export const HAS_ART: Record<string, boolean> = {
  // alleys: true,
};

/** Flip a shoe id to true once /public/models/<id>.glb exists. */
export const HAS_MODEL: Record<string, boolean> = {
  // alleys: true,
};

export const artPath = (id: string) => `/shoes/${id}.png`;
export const modelPath = (id: string) => `/models/${id}.glb`;

export const hasArt = (id: string) => HAS_ART[id] === true;
export const hasModel = (id: string) => HAS_MODEL[id] === true;

/** True when every shoe still runs on the procedural stand-in. */
export const allPlaceholder = () =>
  Object.keys(HAS_ART).length === 0 && Object.keys(HAS_MODEL).length === 0;
