/* ═══════════════════════════════════════════════════════════════════════════
   MODE
   ---------------------------------------------------------------------------
   Lotto is light, one8 is dark. The accents were picked for a near-black
   surface, and several of them — signal aqua especially — are close to
   invisible on white. Rather than keeping a second palette by hand, each
   accent is darkened and slightly saturated for light mode, which holds the
   hue relationship while restoring contrast.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Mode = "light" | "dark";

/** Brand → surface mode. The one rule this whole system hangs on. */
export const modeForBrand = (brand: "LOTTO" | "ONE8"): Mode =>
  brand === "LOTTO" ? "light" : "dark";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");

/**
 * Darkens toward ink and pushes saturation, so an accent tuned for black
 * still carries on white. Returns the input untouched in dark mode.
 */
export function accentFor(hex: string, mode: Mode): string {
  if (mode === "dark") return hex;
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  // The brighter the original, the harder it has to come down.
  const pull = 0.34 + lum * 0.36;
  const mid = (r + g + b) / 3;
  const sat = 1.5; // push channels away from their own mean
  return toHex(
    (mid + (r - mid) * sat) * (1 - pull),
    (mid + (g - mid) * sat) * (1 - pull),
    (mid + (b - mid) * sat) * (1 - pull)
  );
}
