// Each contributor gets a contained PANEL on the directory — a framed piece
// hung on the shelf's neutral wall, rendered in the visual language of one
// beautiful-html-templates design (baked into their skill as authorStyle).
// The wall provides unity; the frames provide personality.
//
// Card grammar, shared by every style: SUBJECT is the headline (what is
// actually being learned), description underneath, then a small meta line
// (doc title · template · updated).

import type { DocMeta } from "./store";

export type AuthorGroup = {
  author: string;
  authorStyle: string;
  docs: DocMeta[];
};

export function AuthorPanel({ group }: { group: AuthorGroup }) {
  switch (group.authorStyle) {
    case "cobalt-grid":
      return <CobaltGridPanel group={group} />;
    case "block-frame":
      return <BlockFramePanel group={group} />;
    case "daisy-days":
      return <DaisyDaysPanel group={group} />;
    default:
      return <PlainPanel group={group} />;
  }
}

const date = (iso: string) => iso.slice(0, 10);

// ─────────────────────────────────────────────────────────────────────────
// COBALT GRID — cream paper, one strict cobalt accent, faint graph-paper,
// Newsreader serif + DM Mono, hairline ledger rows.
// ─────────────────────────────────────────────────────────────────────────
function CobaltGridPanel({ group }: { group: AuthorGroup }) {
  const paper = "#F0EBDE";
  const ink = "#1F2BE0";
  const serif = "'Newsreader', Georgia, serif";
  const sans = "'Hanken Grotesk', system-ui, sans-serif";
  const mono = "'DM Mono', ui-monospace, monospace";

  return (
    <section
      id={group.author.toLowerCase()}
      style={{
        background: paper,
        backgroundImage: `linear-gradient(${ink}14 1px, transparent 1px), linear-gradient(90deg, ${ink}14 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
        border: `1.5px solid ${ink}`,
        padding: "34px clamp(24px, 4vw, 48px) 38px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "20px", borderBottom: `1.5px solid ${ink}`, paddingBottom: "10px" }}>
        <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 500, fontStyle: "italic", fontSize: "clamp(32px,4vw,46px)", lineHeight: 0.95, color: ink }}>
          {group.author}
        </h2>
        <span style={{ fontFamily: mono, fontSize: "11px", letterSpacing: "0.1em", color: ink, textTransform: "uppercase" }}>
          index · {String(group.docs.length).padStart(2, "0")}
        </span>
      </div>

      {group.docs.map((doc, i) => (
        <a
          key={doc.slug}
          href={`/d/${doc.slug}`}
          style={{
            display: "grid",
            gridTemplateColumns: "36px 1fr auto",
            gap: "18px",
            alignItems: "start",
            padding: "18px 0",
            borderBottom: i === group.docs.length - 1 ? "none" : `1px solid ${ink}2E`,
            textDecoration: "none",
            color: ink,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: "12px", paddingTop: "8px" }}>{String(i + 1).padStart(2, "0")}</span>
          <span>
            <span style={{ display: "block", fontFamily: serif, fontWeight: 500, fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.05 }}>{doc.subject}</span>
            {doc.description && (
              <span style={{ display: "block", marginTop: "6px", fontFamily: sans, fontSize: "14px", lineHeight: 1.5, color: "#3a3a3a", maxWidth: "58ch" }}>
                {doc.description}
              </span>
            )}
          </span>
          <span style={{ fontFamily: mono, fontSize: "11px", letterSpacing: "0.04em", textAlign: "right", whiteSpace: "nowrap", paddingTop: "8px", opacity: 0.85 }}>
            {doc.title}
            <br />
            {doc.template} · {date(doc.updatedAt)}
          </span>
        </a>
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BLOCKFRAME — off-white, neon pastel blocks, heavy black borders, hard
// offset shadows, Space Grotesk heavy display + Inter body.
// ─────────────────────────────────────────────────────────────────────────
function BlockFramePanel({ group }: { group: AuthorGroup }) {
  const black = "#000000";
  const offwhite = "#FFFDF5";
  const fills = ["#FE90E8", "#C0F7FE", "#99E885", "#F7CB46"];
  const display = "'Space Grotesk', system-ui, sans-serif";
  const body = "'Inter', system-ui, sans-serif";

  return (
    <section
      id={group.author.toLowerCase()}
      style={{ background: offwhite, border: `4px solid ${black}`, boxShadow: `8px 8px 0 ${black}`, padding: "30px clamp(24px, 4vw, 44px) 36px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "24px" }}>
        <span style={{ display: "inline-block", background: fills[0], border: `3px solid ${black}`, boxShadow: `4px 4px 0 ${black}`, padding: "4px 12px", fontFamily: body, fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Contributor
        </span>
        <h2 style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: "clamp(32px,4vw,48px)", lineHeight: 0.9, letterSpacing: "-0.02em", color: black, textTransform: "uppercase" }}>
          {group.author}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "22px" }}>
        {group.docs.map((doc, i) => (
          <a
            key={doc.slug}
            href={`/d/${doc.slug}`}
            style={{ display: "flex", flexDirection: "column", background: "#fff", border: `3px solid ${black}`, boxShadow: `5px 5px 0 ${black}`, textDecoration: "none", color: black }}
          >
            <div style={{ height: "14px", background: fills[i % fills.length], borderBottom: `3px solid ${black}` }} />
            <div style={{ padding: "18px", display: "grid", gap: "10px", alignContent: "start" }}>
              <h3 style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: "24px", lineHeight: 0.98, letterSpacing: "-0.01em", textTransform: "uppercase" }}>{doc.subject}</h3>
              {doc.description && (
                <p style={{ margin: 0, fontFamily: body, fontSize: "13px", lineHeight: 1.55, color: "#222" }}>{doc.description}</p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontFamily: body, fontWeight: 700, fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.07em", borderTop: `2px solid ${black}`, paddingTop: "9px" }}>
                <span>{doc.title}</span>
                <span style={{ opacity: 0.55, whiteSpace: "nowrap" }}>{date(doc.updatedAt)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DAISY DAYS — cream, pastel rainbow, ink 3px outlines, chunky shadows,
// rounded corners, Fredoka display + Quicksand body, hand-drawn daisies.
// ─────────────────────────────────────────────────────────────────────────
function DaisyDaysPanel({ group }: { group: AuthorGroup }) {
  const cream = "#F5F0E6";
  const inkc = "#2D2D2D";
  const caps = ["#A8E6CF", "#D4A5E8", "#FFCBA4", "#A8D8F0", "#F7C8D4", "#FDE68A"];
  const display = "'Fredoka', system-ui, sans-serif";
  const body = "'Quicksand', system-ui, sans-serif";

  return (
    <section
      id={group.author.toLowerCase()}
      style={{ background: cream, border: `3px solid ${inkc}`, borderRadius: "22px", boxShadow: `6px 6px 0 ${inkc}`, padding: "30px clamp(24px, 4vw, 44px) 36px", position: "relative", overflow: "hidden" }}
    >
      <Daisy style={{ position: "absolute", top: "18px", right: "26px" }} color="#F7C8D4" ink={inkc} />

      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
        <Daisy color="#A8D8F0" ink={inkc} size={38} />
        <h2 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: "clamp(32px,4vw,46px)", lineHeight: 1, color: inkc }}>
          {group.author}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "22px" }}>
        {group.docs.map((doc, i) => (
          <a key={doc.slug} href={`/d/${doc.slug}`} style={{ textDecoration: "none", color: inkc }}>
            <div style={{ background: caps[i % caps.length], border: `3px solid ${inkc}`, borderBottom: "none", borderRadius: "16px 16px 0 0", padding: "8px 16px", fontFamily: body, fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {doc.title}
            </div>
            <div style={{ background: "#fff", border: `3px solid ${inkc}`, borderRadius: "0 0 16px 16px", boxShadow: `5px 5px 0 ${inkc}`, padding: "16px", display: "grid", gap: "10px", alignContent: "start" }}>
              <h3 style={{ margin: 0, fontFamily: display, fontWeight: 500, fontSize: "23px", lineHeight: 1.02 }}>{doc.subject}</h3>
              {doc.description && (
                <p style={{ margin: 0, fontFamily: body, fontWeight: 500, fontSize: "13px", lineHeight: 1.55 }}>{doc.description}</p>
              )}
              <span style={{ fontFamily: body, fontWeight: 700, fontSize: "11.5px", opacity: 0.6 }}>updated {date(doc.updatedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Daisy({ color, ink, size = 30, style }: { color: string; ink: string; size?: number; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 40 40" style={style}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="20" cy="9" rx="5.5" ry="9" fill={color} stroke={ink} strokeWidth="2" transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="6" fill="#FDE68A" stroke={ink} strokeWidth="2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PLAIN — neutral fallback for authors whose style is unknown.
// ─────────────────────────────────────────────────────────────────────────
function PlainPanel({ group }: { group: AuthorGroup }) {
  const ink = "#2a2a2a";
  return (
    <section id={group.author.toLowerCase()} style={{ background: "#fff", border: `1.5px solid ${ink}`, padding: "30px clamp(24px,4vw,44px) 34px" }}>
      <h2 style={{ margin: "0 0 18px", fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(28px,3.5vw,40px)", color: ink }}>{group.author}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: "16px" }}>
        {group.docs.map((doc) => (
          <a key={doc.slug} href={`/d/${doc.slug}`} style={{ border: `1.5px solid ${ink}`, padding: "16px", textDecoration: "none", color: ink, display: "grid", gap: "8px", alignContent: "start" }}>
            <strong style={{ fontSize: "19px" }}>{doc.subject}</strong>
            {doc.description && <span style={{ fontSize: "13px", lineHeight: 1.5, opacity: 0.8 }}>{doc.description}</span>}
            <span style={{ fontSize: "11px", opacity: 0.6 }}>{doc.title} · {date(doc.updatedAt)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
