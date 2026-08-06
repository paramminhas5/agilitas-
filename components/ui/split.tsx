"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  text: string;
  className?: string;
  /** char = per-letter (display type). word = per-word (body copy, cheaper). */
  mode?: "char" | "word";
  /** ms between successive units */
  stagger?: number;
  /** ms before the first unit moves */
  delay?: number;
  /** viewport fraction that must be crossed before firing */
  threshold?: number;
};

/**
 * Scroll-triggered text reveal. Words are inline-block so letters never break
 * across lines, and each word masks its own letters with overflow hidden —
 * giving a per-line curtain effect without measuring line boxes.
 */
export function Split({
  text,
  className = "",
  mode = "char",
  stagger = 24,
  delay = 0,
  threshold = 0.25,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);


  const words = text.split(" ");
  let unit = 0;
  const nodes: ReactNode[] = [];

  words.forEach((word, wi) => {
    if (mode === "word") {
      nodes.push(
        <span className="sp__line" key={`w${wi}`}>
          <span className="sp__wd" style={{ ["--d" as string]: `${delay + unit++ * stagger}ms` }}>
            {word}
          </span>
        </span>
      );
    } else {
      nodes.push(
        <span className="sp__line" key={`w${wi}`}>
          {Array.from(word).map((ch, ci) => (
            <span
              className="sp__ch"
              key={`c${wi}-${ci}`}
              style={{ ["--d" as string]: `${delay + unit++ * stagger}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
      );
    }
    if (wi < words.length - 1) nodes.push(<span key={`s${wi}`}> </span>);
  });

  return (
    <span ref={ref} className={`sp ${className}`} aria-label={text}>
      {nodes}
    </span>
  );
}

/** Adds `is-in` to any element when it scrolls into view. */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}
