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
    label: "雏菊日 — 粉彩雏菊与圆角卡片",
    preview: "/previews/daisy-days.png",
    bespoke: true,
    bg: "#F5F0E6", ink: "#2D2D2D", accent: "#A8E6CF", accent2: "#F7C8D4",
    display: "'Fredoka', system-ui, sans-serif", body: "'Quicksand', system-ui, sans-serif",
  },
  {
    id: "block-frame",
    label: "色块框架 — 霓虹色块与粗边框",
    preview: "/previews/block-frame.png",
    bespoke: true,
    bg: "#FFFDF5", ink: "#000000", accent: "#FE90E8", accent2: "#C0F7FE",
    display: "'Space Grotesk', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "cobalt-grid",
    label: "钴蓝网格 — 方格纸与电光衬线",
    preview: "/previews/cobalt-grid.png",
    bespoke: true,
    bg: "#F0EBDE", ink: "#1F2BE0", accent: "#1F2BE0",
    display: "'Newsreader', Georgia, serif", body: "'Hanken Grotesk', system-ui, sans-serif",
  },
  {
    id: "8-bit-orbit",
    label: "8 位轨道 — 深蓝虚空上的像素霓虹",
    preview: "/previews/8-bit-orbit.png",
    bespoke: true,
    bg: "#0A0E27", ink: "#E2D5F2", accent: "#5EDCF4", accent2: "#F0A6CA",
    display: "'Tektur', system-ui, sans-serif", body: "'Chakra Petch', system-ui, sans-serif",
  },
  {
    id: "pin-and-paper",
    label: "别针与纸 — 黄纸与墨蓝手写",
    preview: "/previews/pin-and-paper.png",
    bespoke: true,
    bg: "#EFE56A", ink: "#1F3A8A", accent: "#C2342B", accent2: "#1F3A8A",
    display: "'Caveat', cursive", body: "'Space Grotesk', system-ui, sans-serif",
  },

  // ── generic-token offerings (rendered by the generic band) ──
  {
    id: "sakura-chroma",
    label: "樱彩 — 磁带目录，奶油与墨",
    preview: "/previews/sakura-chroma.png",
    bg: "#F1E6CB", ink: "#3A2516", accent: "#E5392A", accent2: "#3F8BC4",
    display: "'Big Shoulders Display', sans-serif", body: "'Albert Sans', system-ui, sans-serif",
  },
  {
    id: "neo-grid-bold",
    label: "新网格粗体 — 编辑风配霓虹柠檬绿",
    preview: "/previews/neo-grid-bold.png",
    bg: "#F5F4EF", ink: "#0A0A0A", accent: "#E6FF3D",
    display: "'Space Grotesk', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "bold-poster",
    label: "粗体海报 — 红黑 Shrikhand 海报",
    preview: "/previews/bold-poster.png",
    bg: "#F5F2EF", ink: "#1C1410", accent: "#D8000F",
    display: "'Shrikhand', cursive", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "retro-zine",
    label: "复古志 — 牛皮纸与复古绿",
    preview: "/previews/retro-zine.png",
    bg: "#C8B99A", ink: "#1A1A1A", accent: "#008F4D", accent2: "#F4EFE6",
    display: "'Bebas Neue', sans-serif", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "editorial-forest",
    label: "编辑森林 — 森林绿与灰粉",
    preview: "/previews/editorial-forest.png",
    bg: "#efe7d4", ink: "#1a1a17", accent: "#2e4a2a", accent2: "#e89cb1",
    display: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "coral",
    label: "珊瑚 — 奶油底上的暖珊瑚",
    preview: "/previews/coral.png",
    bg: "#F5F0E8", ink: "#1A1A1A", accent: "#E85D5D",
    display: "'Bebas Neue', sans-serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "monochrome",
    label: "单色 — 安静奶油与衬线",
    preview: "/previews/monochrome.png",
    bg: "#fafadf", ink: "#1a1a16", accent: "#5e5e54",
    display: "'Lora', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  },
  {
    id: "capsule",
    label: "胶囊 — 药丸卡片与糖果粉彩",
    preview: "/previews/capsule.png",
    bg: "#F5F5F0", ink: "#1A1A1A", accent: "#E85D4E", accent2: "#8BB4F7",
    display: "'Bodoni Moda', serif", body: "'Space Grotesk', system-ui, sans-serif", radius: "18px",
  },
  {
    id: "biennale-yellow",
    label: "双年展黄 — 墨蓝衬线与阳光黄",
    preview: "/previews/biennale-yellow.png",
    bg: "#E9E5DB", ink: "#1B2566", accent: "#F1EE2E", accent2: "#E26B4A",
    display: "'Instrument Serif', Georgia, serif", body: "'Archivo', system-ui, sans-serif",
  },
  {
    id: "emerald-editorial",
    label: "翡翠编辑 — 翡翠绿与海军蓝",
    preview: "/previews/emerald-editorial.png",
    bg: "#F1E9D6", ink: "#0F1A5C", accent: "#3CD896",
    display: "'Bodoni Moda', serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "scatterbrain",
    label: "散漫 — 便签粉彩与软木板感",
    preview: "/previews/scatterbrain.png",
    bg: "#FAF8F3", ink: "#2D2A26", accent: "#FFD43B", accent2: "#A5D8FF",
    display: "'Shrikhand', cursive", body: "'Zilla Slab', serif",
  },
  {
    id: "blue-professional",
    label: "蓝色商务 — 奶油纸与电光钴蓝",
    preview: "/previews/blue-professional.png",
    bg: "#FDFAE7", ink: "#111111", accent: "#1E2BFA",
    display: "'Space Grotesk', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "broadside",
    label: "宣告 — 暗色编辑与火焰橙",
    preview: "/previews/broadside.png",
    bg: "#111111", ink: "#F0ECE5", accent: "#E85D26",
    display: "'Barlow', system-ui, sans-serif", body: "'Barlow', system-ui, sans-serif",
  },
  {
    id: "cartesian",
    label: "笛卡尔 — 安静暖中性色与古典衬线",
    preview: "/previews/cartesian.png",
    bg: "#EDE8E0", ink: "#1A1A1A", accent: "#8A8178",
    display: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "creative-mode",
    label: "创意模式 — 奶油画布，大胆撞色",
    preview: "/previews/creative-mode.png",
    bg: "#EFE9D9", ink: "#0F0F0F", accent: "#1F8A4C", accent2: "#F06CA8",
    display: "'Archivo Black', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "editorial-tri-tone",
    label: "编辑三色 — 灰粉、芥末与酒红",
    preview: "/previews/editorial-tri-tone.png",
    bg: "#F2D86A", ink: "#7A1F35", accent: "#F2B6C6",
    display: "'Bricolage Grotesque', system-ui, sans-serif", body: "'Instrument Serif', Georgia, serif",
  },
  {
    id: "grove",
    label: "树林 — 森林绿、奶油衬线与一只红鸟",
    preview: "/previews/grove.png",
    bg: "#192B1B", ink: "#D4CFBF", accent: "#C8524A",
    display: "'Playfair Display', Georgia, serif", body: "'Jost', system-ui, sans-serif",
  },
  {
    id: "long-table",
    label: "长桌 — 晚餐俱乐部奶油与铁锈红",
    preview: "/previews/long-table.png",
    bg: "#FAF1E2", ink: "#B53D2A", accent: "#8E2D1F",
    display: "'Fraunces', Georgia, serif", body: "'Bricolage Grotesque', system-ui, sans-serif",
  },
  {
    id: "mat",
    label: "哑光 — 深鼠尾草、骨白纸与焦橙",
    preview: "/previews/mat.png",
    bg: "#232E26", ink: "#F0E8D2", accent: "#C07030",
    display: "'Bricolage Grotesque', system-ui, sans-serif", body: "'DM Sans', system-ui, sans-serif",
  },
  {
    id: "peoples-platform",
    label: "人民平台 — 活动海报蓝、橙与红",
    preview: "/previews/peoples-platform.png",
    bg: "#F4E9D6", ink: "#1B1BB0", accent: "#E83A2A", accent2: "#F2A03A",
    display: "'Alfa Slab One', Georgia, serif", body: "'Archivo Narrow', system-ui, sans-serif",
  },
  {
    id: "pink-script",
    label: "粉色手写 — 黑画布与热粉花体",
    preview: "/previews/pink-script.png",
    bg: "#060507", ink: "#F5EDF1", accent: "#ED3D8C",
    display: "'DM Serif Display', Georgia, serif", body: "'Inter', system-ui, sans-serif",
  },
  {
    id: "playful",
    label: "活泼 — 暖阳桃色与友好 Syne",
    preview: "/previews/playful.png",
    bg: "#F0C8A0", ink: "#1A1A1A", accent: "#F7DEC6",
    display: "'Syne', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "raw-grid",
    label: "粗网格 — 新粗野边框，粉与鼠尾草",
    preview: "/previews/raw-grid.png",
    bg: "#FFFFFF", ink: "#0A0A0A", accent: "#F2D4CF", accent2: "#E5EDD6",
    display: "'Archivo Black', 'Segoe UI', system-ui, sans-serif", body: "'Segoe UI', system-ui, sans-serif",
  },
  {
    id: "retro-windows",
    label: "复古窗口 — 95 风格、灰边框与像素字体",
    preview: "/previews/retro-windows.png",
    bg: "#C0C0C0", ink: "#000000", accent: "#000080",
    display: "'Press Start 2P', monospace", body: "Tahoma, 'MS Sans Serif', system-ui, sans-serif",
    radius: "0px",
  },
  {
    id: "signal",
    label: "信号 — 深海军蓝、骨白纸与哑金",
    preview: "/previews/signal.png",
    bg: "#1C2644", ink: "#F0ECE3", accent: "#C8A870",
    display: "'Source Serif 4', Georgia, serif", body: "'DM Sans', system-ui, sans-serif",
  },
  {
    id: "soft-editorial",
    label: "柔软编辑 — 暖纸上的 Cormorant，鼠尾草与腮红",
    preview: "/previews/soft-editorial.png",
    bg: "#F2EEDF", ink: "#2A241B", accent: "#E1A4C2", accent2: "#B7C7A8",
    display: "'Cormorant Garamond', Garamond, serif", body: "'Work Sans', system-ui, sans-serif",
  },
  {
    id: "stencil-tablet",
    label: "模板碑 — 骨白纸、模刻与大地色",
    preview: "/previews/stencil-tablet.png",
    bg: "#E2DCC9", ink: "#0A0A0A", accent: "#EE7A2E", accent2: "#2D7E73",
    display: "'Stardos Stencil', Georgia, serif", body: "'Barlow Condensed', system-ui, sans-serif",
  },
  {
    id: "studio",
    label: "工作室 — 黑画布与酸性黄电压",
    preview: "/previews/studio.png",
    bg: "#1C1C1C", ink: "#F5D200", accent: "#F5D200",
    display: "'Barlow', system-ui, sans-serif", body: "'Barlow', system-ui, sans-serif",
  },
  {
    id: "vellum",
    label: "羊皮纸 — 深海军蓝与暖黄 Cormorant",
    preview: "/previews/vellum.png",
    bg: "#2A3870", ink: "#E8D85C", accent: "#3A7878",
    display: "'Cormorant Garamond', Georgia, serif", body: "'DM Sans', system-ui, sans-serif",
  },
  {
    id: "fal-style",
    label: "fal 风格 — 幽灵网格、电紫与柠檬绿",
    preview: "/previews/fal-style.png",
    bespoke: true,
    bg: "#FEFDFF", ink: "#09090B", accent: "#681DE4", accent2: "#ADFF00",
    display: "'Archivo', 'Arial Black', system-ui, sans-serif",
    body: "'Archivo', system-ui, sans-serif",
  }
];

export const TOKENS_BY_ID: Record<string, StyleToken> = Object.fromEntries(
  STYLE_TOKENS.map((t) => [t.id, t]),
);
