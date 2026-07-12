// The whole app, as far as visitors are concerned: one directory page.
// Sakura Chroma vocabulary — cream paper, warm-brown ink, six flat primaries.

import { listDocs, type DocMeta } from "@/lib/store";

export const dynamic = "force-dynamic";

const paper = "#F1E6CB";
const paperDark = "#E5D6B0";
const ink = "#3A2516";
const chipColors = ["#E5392A", "#E54489", "#F09131", "#3D9F47", "#3F8BC4"];

const displayFont = "'Big Shoulders Display', sans-serif";
const bodyFont = "'Albert Sans', ui-sans-serif, system-ui, sans-serif";
const monoFont = "'JetBrains Mono', ui-monospace, monospace";

export default async function ShelfPage() {
  const docs = await listDocs();

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "56px 64px 80px",
        fontFamily: bodyFont,
        color: ink,
      }}
    >
      <header
        style={{
          borderBottom: `1.5px solid ${ink}`,
          paddingBottom: "18px",
          marginBottom: "34px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span aria-hidden style={{ display: "flex" }}>
              {chipColors.slice(0, 4).map((c, i) => (
                <span
                  key={c}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: c,
                    marginLeft: i === 0 ? 0 : "-6px",
                  }}
                />
              ))}
            </span>
            <h1
              style={{
                margin: 0,
                fontFamily: displayFont,
                fontWeight: 900,
                fontSize: "64px",
                lineHeight: 0.88,
                letterSpacing: "-0.022em",
                textTransform: "uppercase",
              }}
            >
              The Shelf
            </h1>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "16px", maxWidth: "58ch" }}>
            A shared directory of living learning docs. Each one is a single
            HTML file, written and republished by somebody&apos;s Claude as
            they learn.
          </p>
        </div>
        <div
          style={{
            fontFamily: monoFont,
            fontSize: "12px",
            letterSpacing: "0.06em",
            opacity: 0.7,
          }}
        >
          {docs.length} doc{docs.length === 1 ? "" : "s"} on the shelf
        </div>
      </header>

      {docs.length === 0 ? (
        <p style={{ fontSize: "17px" }}>
          Nothing here yet. Publish the first doc with the shelf skill.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "22px",
          }}
        >
          {docs.map((doc, index) => (
            <DocCard key={doc.slug} doc={doc} accent={chipColors[index % chipColors.length]} />
          ))}
        </div>
      )}

      <footer
        style={{
          marginTop: "64px",
          borderTop: `1.5px solid ${ink}`,
          paddingTop: "16px",
          fontFamily: monoFont,
          fontSize: "12px",
          letterSpacing: "0.04em",
          opacity: 0.7,
        }}
      >
        contribute: ask your claude — it has the shelf skill and the secret.
      </footer>
    </main>
  );
}

function DocCard({ doc, accent }: { doc: DocMeta; accent: string }) {
  return (
    <a
      href={`/d/${doc.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        border: `1.5px solid ${ink}`,
        background: paper,
        textDecoration: "none",
        color: ink,
        boxShadow: `6px 6px 0 ${ink}`,
      }}
    >
      <div style={{ height: "14px", background: accent }} />
      <div style={{ padding: "18px 20px 16px", display: "grid", gap: "10px" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: displayFont,
            fontWeight: 900,
            fontSize: "30px",
            lineHeight: 0.94,
            letterSpacing: "-0.012em",
          }}
        >
          {doc.title}
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            borderTop: `1px dashed ${ink}`,
            paddingTop: "10px",
            fontFamily: monoFont,
            fontSize: "11.5px",
            letterSpacing: "0.04em",
          }}
        >
          <span>BY {doc.author.toUpperCase()}</span>
          <span style={{ opacity: 0.7 }}>{doc.template}</span>
        </div>
        <div
          style={{
            fontFamily: monoFont,
            fontSize: "11px",
            letterSpacing: "0.04em",
            opacity: 0.6,
            background: paperDark,
            padding: "4px 8px",
            width: "fit-content",
          }}
        >
          updated {doc.updatedAt.slice(0, 10)}
        </div>
      </div>
    </a>
  );
}
