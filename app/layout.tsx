import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALL THREE — Footwear designed around India",
  description:
    "Six original footwear concepts. Three reasons each. An evidence-led athletic portfolio designed around the ground, weather and rituals of India.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}