import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "The Shelf",
  description: "A shared directory of living learning docs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Fonts for the global chrome + all three contributor band styles:
            Cobalt Grid (Newsreader/Hanken Grotesk/DM Mono), BlockFrame
            (Space Grotesk/Inter), Daisy Days (Fredoka/Quicksand). */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fredoka:wght@400;500;600&family=Hanken+Grotesk:wght@400;500;700&family=Inter:wght@400;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Quicksand:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* The wall: a quiet warm neutral so every panel's own palette reads
          as intentional against it rather than colliding with a sibling. */}
      <body style={{ margin: 0, background: "#EDE8DE" }}>{children}</body>
    </html>
  );
}
