// One table describing every corner design a contributor can choose. It drives
// two things: the invite picker (label + preview image) and the generic band
// renderer (palette + fonts) for styles that don't have a bespoke renderer.
// The five "hero" styles (daisy-days, block-frame, cobalt-grid, 8-bit-orbit,
// pin-and-paper) have hand-written renderers in sections.tsx; the rest fall to
// the generic renderer, tinted by their real template palette + display font.

export type StyleToken = {
  id: string;
  label: string;
  preview: string; // /previews/<slug>.png
  bespoke?: boolean; // has a dedicated renderer in sections.tsx
  // generic renderer tokens (also used as accents in bespoke where handy)
  bg: string;
  ink: string;
  accent: string;
  accent2?: string;
  display: string;
  body: string;
  radius?: string; // panel + card corner
};

export const STYLE_TOKENS: StyleToken[] = [
  {
    id: "daisy-days",
    label: "Daisy Days — pastel daisies & rounded cards",
    preview: "/previews/daisy-days.png",
    bespoke: true,
    bg: "#F5F0E6", ink: "#2D2D2D", accent: "#A8E6CF", accent2: "#F7C8D4",
    display: "'Fredoka', system-ui, sans-serif", body: "'Quicksand', system-ui, sans-serif",
  },
  {
    id: "block-frame",
    label: "BlockFrame — neon blocks & heavy borders",
    preview: "/previews/block-frame.png",
    bespoke: true,
    bg: "#FFFDF5", ink: "#000000", accent: "#FE90E8", accent2: "#C0F7FE",
    display: "'Space Grotesk', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "cobalt-grid",
    label: "Cobalt Grid — graph paper & electric serif",
    preview: "/previews/cobalt-grid.png",
    bespoke: true,
    bg: "#F0EBDE", ink: "#1F2BE0", accent: "#1F2BE0",
    display: "'Newsreader', Georgia, serif", body: "'Hanken Grotesk', system-ui, sans-serif",
  },
  {
    id: "8-bit-orbit",
    label: "8-Bit Orbit — pixel neon on a navy void",
    preview: "/previews/8-bit-orbit.png",
    bespoke: true,
    bg: "#0A0E27", ink: "#E2D5F2", accent: "#5EDCF4", accent2: "#F0A6CA",
    display: "'Tektur', system-ui, sans-serif", body: "'Chakra Petch', system-ui, sans-serif",
  },
  {
    id: "pin-and-paper",
    label: "Pin & Paper — yellow paper & ink-blue script",
    preview: "/previews/pin-and-paper.png",
    bespoke: true,
    bg: "#EFE56A", ink: "#1F3A8A", accent: "#C2342B", accent2: "#1F3A8A",
    display: "'Caveat', cursive", body: "'Space Grotesk', system-ui, sans-serif",
  },

  // ── generic-token offerings (rendered by the generic band) ──
  {
    id: "sakura-chroma",
    label: "Sakura Chroma — cassette catalogue, cream & ink",
    preview: "/previews/sakura-chroma.png",
    bg: "#F1E6CB", ink: "#3A2516", accent: "#E5392A", accent2: "#3F8BC4",
    display: "'Big Shoulders Display', sans-serif", body: "'Albert Sans', system-ui, sans-serif",
  },
  {
    id: "neo-grid-bold",
    label: "Neo-Grid Bold — editorial with a neon-lime accent",
    preview: "/previews/neo-grid-bold.png",
    bg: "#F5F4EF", ink: "#0A0A0A", accent: "#E6FF3D",
    display: "'Space Grotesk', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "bold-poster",
    label: "Bold Poster — Shrikhand red-and-black poster",
    preview: "/previews/bold-poster.png",
    bg: "#F5F2EF", ink: "#1C1410", accent: "#D8000F",
    display: "'Shrikhand', cursive", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "retro-zine",
    label: "Retro Zine — kraft paper & vintage green",
    preview: "/previews/retro-zine.png",
    bg: "#C8B99A", ink: "#1A1A1A", accent: "#008F4D", accent2: "#F4EFE6",
    display: "'Bebas Neue', sans-serif", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "editorial-forest",
    label: "Editorial Forest — forest green & dusty pink",
    preview: "/previews/editorial-forest.png",
    bg: "#efe7d4", ink: "#1a1a17", accent: "#2e4a2a", accent2: "#e89cb1",
    display: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "coral",
    label: "Coral — warm coral on cream",
    preview: "/previews/coral.png",
    bg: "#F5F0E8", ink: "#1A1A1A", accent: "#E85D5D",
    display: "'Bebas Neue', sans-serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "monochrome",
    label: "Monochrome — quiet cream & serif",
    preview: "/previews/monochrome.png",
    bg: "#fafadf", ink: "#1a1a16", accent: "#5e5e54",
    display: "'Lora', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  },
  {
    id: "capsule",
    label: "Capsule — pill cards & candy pastels",
    preview: "/previews/capsule.png",
    bg: "#F5F5F0", ink: "#1A1A1A", accent: "#E85D4E", accent2: "#8BB4F7",
    display: "'Bodoni Moda', serif", body: "'Space Grotesk', system-ui, sans-serif", radius: "18px",
  },
  {
    id: "biennale-yellow",
    label: "Biennale Yellow — ink-blue serif & sun yellow",
    preview: "/previews/biennale-yellow.png",
    bg: "#E9E5DB", ink: "#1B2566", accent: "#F1EE2E", accent2: "#E26B4A",
    display: "'Instrument Serif', Georgia, serif", body: "'Archivo', system-ui, sans-serif",
  },
  {
    id: "emerald-editorial",
    label: "Emerald Editorial — emerald & navy on paper",
    preview: "/previews/emerald-editorial.png",
    bg: "#F1E9D6", ink: "#0F1A5C", accent: "#3CD896",
    display: "'Bodoni Moda', serif", body: "'Inter', system-ui, sans-serif",
  },
];

export const TOKENS_BY_ID: Record<string, StyleToken> = Object.fromEntries(
  STYLE_TOKENS.map((t) => [t.id, t]),
);
