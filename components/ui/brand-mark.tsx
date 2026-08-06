"use client";

import { markFor, wantMark } from "@/lib/assets";
import type { Mode } from "@/lib/theme";

/* ═══════════════════════════════════════════════════════════════════════════
   BRAND MARK
   ---------------------------------------------------------------------------
   Renders the real logo the moment one lands in /public/brand. Until then it
   sets the name as a wordmark and flags itself quietly, so the layout is
   already the right shape for the artwork.
   ═══════════════════════════════════════════════════════════════════════════ */

export function BrandMark({
  brand,
  mode,
  size = 28,
  className = "",
}: {
  brand: "LOTTO" | "ONE8";
  mode: Mode;
  /** rendered height in px */
  size?: number;
  className?: string;
}) {
  const src = markFor(brand, mode);
  const label = brand === "LOTTO" ? "Lotto" : "one8";

  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={label}
        className={`mark ${className}`}
        style={{ height: size }}
      />
    );
  }

  return (
    <span
      className={`mark mark--stand ${className}`}
      style={{ fontSize: size * 0.72 }}
      title={`Awaiting ${wantMark(brand)}`}
    >
      {label}
    </span>
  );
}
