"use client";

import { useCallback, useState } from "react";
import { shoes, technologies, campaigns } from "@/data/products";

/** Builds the portfolio PDF client-side. jsPDF is loaded on demand. */
export function usePdf() {
  const [busy, setBusy] = useState(false);

  const gen = useCallback(async () => {
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const d = new jsPDF("portrait", "mm", "a4");
      const M = 15, W = 180;
      let y = M;

      const bg = () => { d.setFillColor(5, 6, 8); d.rect(0, 0, 210, 297, "F"); };
      const page = () => { d.addPage(); bg(); y = M; };
      const room = (n: number) => { if (y + n > 278) page(); };
      const ink = (r: number, g: number, b: number) => d.setTextColor(r, g, b);
      const bone = () => ink(237, 235, 230);
      const dim = () => ink(150, 152, 150);
      const sig = () => ink(125, 249, 232);

      const para = (text: string, size = 8, lead = 4) => {
        const lines = d.splitTextToSize(text, W);
        room(lines.length * lead + 2);
        d.setFontSize(size);
        d.text(lines, M, y);
        y += lines.length * lead;
      };

      // ── Cover ──
      bg();
      bone(); d.setFont("helvetica", "bold"); d.setFontSize(40);
      d.text("LOTTO", M, 62); d.text("one8", M, 80);
      d.setFont("helvetica", "normal"); d.setFontSize(10); dim();
      d.text("AGILITAS SPORTS — THE COMPLETE PORTFOLIO", M, 96);
      d.setFontSize(9);
      d.text("For fifty years, sports shoes have been designed for how people", M, 118);
      d.text("live somewhere else. We design for how India actually lives.", M, 124);
      sig(); d.setFontSize(8);
      d.text("Made here for forty years. Designed here from now.", M, 146);
      ink(100, 102, 104); d.setFontSize(7);
      d.text("Prepared by Param Minhas — Creative Direction", M, 282);


      // ── Platforms ──
      page();
      sig(); d.setFontSize(8); d.text("TECHNOLOGY PLATFORMS", M, y); y += 10;
      bone(); d.setFont("helvetica", "bold"); d.setFontSize(18);
      d.text("Named. Reusable. Real.", M, y); y += 13;
      technologies.forEach((t, i) => {
        room(24);
        bone(); d.setFont("helvetica", "bold"); d.setFontSize(10);
        d.text(`${String(i + 1).padStart(2, "0")}  ${t.name}`, M, y); y += 5;
        sig(); d.setFont("helvetica", "normal"); d.setFontSize(7);
        d.text(t.tagline, M, y); y += 4.5;
        dim(); para(t.description); y += 1.5;
        ink(120, 122, 124); para(t.detail, 7.5, 3.6); y += 5;
      });

      // ── Shoes ──
      shoes.forEach((s) => {
        page();
        ink(100, 102, 104); d.setFontSize(7);
        d.text(`${s.brand}  —  ${String(s.order).padStart(2, "0")} / 11`, M, y); y += 9;
        bone(); d.setFont("helvetica", "bold"); d.setFontSize(26);
        d.text(s.name, M, y); y += 9;
        d.setFont("helvetica", "normal"); d.setFontSize(11);
        d.text(s.subtitle, M, y); y += 9;
        dim(); para(s.whyWeMadeIt, 9, 4.4); y += 6;

        ([["A", s.purposeA], ["B", s.purposeB], ["S", s.purposeS]] as const).forEach(([code, p]) => {
          room(18);
          sig(); d.setFont("helvetica", "bold"); d.setFontSize(12);
          d.text(code, M, y);
          bone(); d.setFontSize(9); d.text(p.label, M + 9, y); y += 5;
          dim(); d.setFont("helvetica", "normal"); d.setFontSize(8);
          const l = d.splitTextToSize(p.description, W - 9);
          d.text(l, M + 9, y); y += l.length * 4 + 4;
        });

        const block = (title: string, body: string) => {
          room(16);
          bone(); d.setFont("helvetica", "bold"); d.setFontSize(8);
          d.text(title, M, y); y += 4.4;
          dim(); d.setFont("helvetica", "normal"); para(body); y += 4;
        };
        block("FEATURES & SPECS", s.features);
        block("THE VALUE", s.value);
        block("WHO IT'S FOR", s.whoItsFor);
      });


      // ── Campaigns ──
      page();
      sig(); d.setFontSize(8); d.text("CAMPAIGNS", M, y); y += 10;
      bone(); d.setFont("helvetica", "bold"); d.setFontSize(18);
      d.text("Do things. Don't just say things.", M, y); y += 13;
      campaigns.forEach((c, i) => {
        room(34);
        bone(); d.setFont("helvetica", "bold"); d.setFontSize(11);
        d.text(`${String(i + 1).padStart(2, "0")}  ${c.name}`, M, y); y += 5;
        ink(100, 102, 104); d.setFont("helvetica", "normal"); d.setFontSize(7);
        d.text(c.shoe, M, y); y += 4.5;
        sig(); d.setFontSize(8); d.text(c.tagline, M, y); y += 5;
        dim(); para(c.description); y += 2.5;
        ink(169, 198, 216); d.setFontSize(7); d.text("FILM", M, y); y += 3.8;
        dim(); para(c.film, 7.5, 3.6); y += 2.5;
        ink(138, 124, 255); d.setFontSize(7); d.text("GO TO MARKET", M, y); y += 3.8;
        dim(); para(c.gtm, 7.5, 3.6); y += 7;
      });

      d.save("Agilitas-Lotto-one8-Portfolio.pdf");
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setBusy(false);
    }
  }, []);

  return { gen, busy };
}
