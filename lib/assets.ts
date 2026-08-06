/* ═══════════════════════════════════════════════════════════════════════════
   ASSET SEAM
   ---------------------------------------------------------------------------
   There is nothing to configure. Drop a file into the right folder with the
   right name and it appears on the site at the next build. The manifest in
   generated-assets.ts is rebuilt automatically by scripts/assets.mjs, which
   runs before both `npm run dev` and `npm run build`.

     /public/shoes/<shoe-id>.png            product art, square, alpha
     /public/models/<shoe-id>.glb           3D model, Y-up, ~1 unit long
     /public/tech/<tech-id>.jpg             macro detail photograph
     /public/tech/<tech-id>-schematic.svg   line diagram of the mechanism
     /public/campaigns/<campaign-id>.jpg    key visual / poster
     /public/campaigns/<campaign-id>.mp4    silent looping film, 8-15s

   A 1x1 pixel PNG counts as absent, so the committed stand-ins never
   masquerade as real artwork.
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  shoeArt,
  shoeModel,
  techMacro,
  techSchematic,
  campaignPoster,
  campaignFilm,
} from "./generated-assets";

/* ── Lookups. Each returns a public path, or null when nothing is there. ── */

export const artFor = (shoeId: string) => shoeArt[shoeId] ?? null;
export const modelFor = (shoeId: string) => shoeModel[shoeId] ?? null;
export const macroFor = (techId: string) => techMacro[techId] ?? null;
export const schematicFor = (techId: string) => techSchematic[techId] ?? null;
export const posterFor = (campaignId: string) => campaignPoster[campaignId] ?? null;
export const filmFor = (campaignId: string) => campaignFilm[campaignId] ?? null;


/* ── Where each asset is expected to land. Placeholders print these, so an
      empty slot documents exactly what to drop in and where. ───────────── */

export const wantArt = (shoeId: string) => `shoes/${shoeId}.png`;
export const wantModel = (shoeId: string) => `models/${shoeId}.glb`;
export const wantMacro = (techId: string) => `tech/${techId}.jpg`;
export const wantSchematic = (techId: string) => `tech/${techId}-schematic.svg`;
export const wantPoster = (campaignId: string) => `campaigns/${campaignId}.jpg`;
export const wantFilm = (campaignId: string) => `campaigns/${campaignId}.mp4`;

/** Rough progress readout, useful while the shoot is still in flight. */
export function assetProgress() {
  const n = (m: Record<string, string>) => Object.keys(m).length;
  return {
    art: n(shoeArt),
    models: n(shoeModel),
    macro: n(techMacro),
    schematic: n(techSchematic),
    posters: n(campaignPoster),
    films: n(campaignFilm),
  };
}
