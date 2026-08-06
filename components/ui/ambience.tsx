import { ambienceFor } from "@/lib/ambience";

/**
 * A single composited layer, behind the copy, carrying whatever this place
 * has in the air. Renders nothing where a world has no ambience of its own.
 */
export function AmbienceLayer({ world }: { world: string }) {
  const kind = ambienceFor(world);
  if (!kind) return null;
  return (
    <div className={`amb amb--${kind}`} aria-hidden>
      <span />
      <span />
      <span />
    </div>
  );
}
