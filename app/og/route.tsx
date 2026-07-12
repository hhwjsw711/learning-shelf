// The share card, cooked in the board's own Scatterbrain language: cork
// gradient, pinned stickies with hand leans, Shrikhand display + Caveat
// script + Zilla Slab body — and live numbers from the store, so the OG
// image always reflects the actual board. Rendered with next/og (Satori).

import { ImageResponse } from "next/og";
import { listDocs, listJoinedAuthors } from "@/lib/store";

export const dynamic = "force-dynamic";

// Satori needs raw font data (ttf/otf — not woff2). Fetching Google's css2
// with an ancient UA yields ttf URLs. Cached per lambda instance.
const fontCache = new Map<string, Promise<ArrayBuffer>>();

function loadFont(family: string, weight: number): Promise<ArrayBuffer> {
  const key = `${family}:${weight}`;
  const cached = fontCache.get(key);
  if (cached) return cached;
  const promise = (async () => {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
      )
    ).text();
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) throw new Error(`no ttf url for ${key}`);
    return await (await fetch(url)).arrayBuffer();
  })();
  fontCache.set(key, promise);
  return promise;
}

const ink = "#2D2A26";

function Pin({ color }: { color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -11,
        left: "50%",
        marginLeft: -11,
        width: 22,
        height: 22,
        borderRadius: 22,
        background: color,
        boxShadow: "0 3px 6px rgba(45,42,38,0.5)",
        display: "flex",
      }}
    />
  );
}

export async function GET(): Promise<Response> {
  const [shrikhand, caveat, zilla, docs, joined] = await Promise.all([
    loadFont("Shrikhand", 400),
    loadFont("Caveat", 700),
    loadFont("Zilla Slab", 600),
    listDocs().catch(() => []),
    listJoinedAuthors().catch(() => []),
  ]);

  const authors = new Set(docs.map((d) => d.author.toLowerCase()));
  for (const j of joined) authors.add(j.author);
  const words = docs.reduce((sum, d) => sum + (d.wordCount || 0), 0);
  const stats = `${docs.length} living doc${docs.length === 1 ? "" : "s"} · ${authors.size} corner${authors.size === 1 ? "" : "s"} · ${Math.round(words / 1000)}k words deep`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #BC9A6C 0%, #A9855B 55%, #9C7950 100%)",
          padding: "56px 72px",
          position: "relative",
        }}
      >
        {/* title, scribbled straight on the cork */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            transform: "rotate(-1.2deg)",
          }}
        >
          <div
            style={{
              fontFamily: "Shrikhand",
              fontSize: 104,
              color: "#FBF7EE",
              textShadow: "4px 4px 0 rgba(45,42,38,0.45)",
              lineHeight: 1,
            }}
          >
            Learning Shelf
          </div>
          <div
            style={{
              fontFamily: "Caveat",
              fontSize: 44,
              color: "#3B2F21",
              marginTop: 10,
              marginLeft: 8,
            }}
          >
            what we&apos;re learning lately ✏️
          </div>
        </div>

        {/* the sticky cluster */}
        <div style={{ display: "flex", gap: 36, marginTop: 52 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              background: "linear-gradient(135deg, #FFE066 0%, #FFD43B 100%)",
              padding: "34px 38px",
              transform: "rotate(-1.6deg)",
              boxShadow: "3px 5px 18px rgba(45,42,38,0.3)",
              maxWidth: 560,
            }}
          >
            <Pin color="#c92a2a" />
            <div
              style={{
                fontFamily: "Zilla Slab",
                fontSize: 30,
                color: ink,
                lineHeight: 1.4,
              }}
            >
              our little group of friends, pinning up whatever we&apos;re
              learning. our claudes keep the notes.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              background: "linear-gradient(135deg, #FFC9C9 0%, #FFA8A8 100%)",
              padding: "30px 36px",
              transform: "rotate(2deg)",
              boxShadow: "3px 5px 18px rgba(45,42,38,0.3)",
              alignSelf: "flex-start",
            }}
          >
            <Pin color="#f59f00" />
            <div style={{ fontFamily: "Shrikhand", fontSize: 34, color: ink, lineHeight: 1.1 }}>
              join the shelf
            </div>
            <div style={{ fontFamily: "Caveat", fontSize: 30, color: ink, marginTop: 6 }}>
              got the password? grab your kit ✂
            </div>
          </div>
        </div>

        {/* live numbers on a small blue sticky, bottom right */}
        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: 48,
            display: "flex",
            background: "linear-gradient(135deg, #A5D8FF 0%, #74C0FC 100%)",
            padding: "18px 28px",
            transform: "rotate(-2deg)",
            boxShadow: "3px 5px 18px rgba(45,42,38,0.3)",
          }}
        >
          <div style={{ fontFamily: "Caveat", fontSize: 34, color: ink }}>{stats}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Shrikhand", data: shrikhand, weight: 400, style: "normal" },
        { name: "Caveat", data: caveat, weight: 700, style: "normal" },
        { name: "Zilla Slab", data: zilla, weight: 600, style: "normal" },
      ],
    },
  );
}
