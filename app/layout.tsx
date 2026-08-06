import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotto / one8 — Agilitas Sports",
  description:
    "Two brands India has never had. Eleven shoes designed for how India actually lives. The complete portfolio by Param Minhas for Agilitas Sports.",
  // Declared explicitly so browsers stop probing /favicon.ico and 404ing.
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
