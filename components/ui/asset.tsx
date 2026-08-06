"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   ASSET SLOTS
   ---------------------------------------------------------------------------
   Every image and film on the site goes through these. When the file exists
   it renders. When it does not, the slot renders as a designed, labelled
   frame that states what belongs there — so an unfinished site looks
   deliberate rather than broken, and nothing needs changing when the real
   asset lands.
   ═══════════════════════════════════════════════════════════════════════════ */

type SlotProps = {
  src: string | null;
  /** where this file is expected, printed on the empty state */
  want: string;
  alt: string;
  /** css aspect-ratio value, e.g. "1" or "16 / 9" */
  ratio?: string;
  className?: string;
  /** short note on the empty state, e.g. "Macro detail" */
  note?: string;
  priority?: boolean;
};

function Frame({ want, note, ratio }: { want: string; note?: string; ratio: string }) {
  return (
    <div className="slotframe" style={{ aspectRatio: ratio }}>
      <span className="slotframe__c slotframe__c--tl" />
      <span className="slotframe__c slotframe__c--tr" />
      <span className="slotframe__c slotframe__c--bl" />
      <span className="slotframe__c slotframe__c--br" />
      {note && <span className="slotframe__note">{note}</span>}
      <span className="slotframe__path">{want}</span>
    </div>
  );
}


/** A still image slot. */
export function AssetImage({
  src, want, alt, ratio = "1", className = "", note, priority = false,
}: SlotProps) {
  if (!src) return <Frame want={want} note={note} ratio={ratio} />;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className={`asset ${className}`}
      style={{ aspectRatio: ratio }}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/**
 * A film slot. Plays silently and loops, which is what a treatment reel
 * wants; falls back to the poster, then to a labelled frame.
 */
export function AssetFilm({
  src, poster, want, alt, ratio = "16 / 9", note = "Silent loop, 8–15s",
}: {
  src: string | null;
  poster?: string | null;
  want: string;
  alt: string;
  ratio?: string;
  note?: string;
}) {
  if (src) {
    return (
      <video
        className="asset asset--film"
        style={{ aspectRatio: ratio }}
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  if (poster) {
    return (
      <div className="asset asset--posterOnly" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt={alt} loading="lazy" decoding="async" />
        <span className="asset__play" aria-hidden>▶</span>
      </div>
    );
  }
  return <Frame want={want} note={note} ratio={ratio} />;
}
