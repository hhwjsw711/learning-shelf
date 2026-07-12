// The directory: a quiet gallery wall with one contained panel per
// contributor, each panel rendered in that person's own template aesthetic.
// The wall (background, header, spacing, footer) is the shelf's own identity;
// the panels are the personalities hung on it.

import { listDocs, type DocMeta } from "@/lib/store";
import { AuthorPanel, type AuthorGroup } from "@/lib/sections";

export const dynamic = "force-dynamic";

const wallInk = "#26221B";
const sans = "'Inter', system-ui, sans-serif";
const displayFont = "'Space Grotesk', system-ui, sans-serif";
const mono = "'DM Mono', ui-monospace, monospace";

export default async function ShelfPage() {
  const docs = await listDocs();
  const groups = groupByAuthor(docs);

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: sans,
        color: wallInk,
        padding: "0 clamp(18px, 4vw, 48px)",
      }}
    >
      <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
        <header style={{ padding: "56px 0 36px" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            The Shelf
          </h1>
          <p style={{ margin: "14px 0 0", fontSize: "16.5px", lineHeight: 1.6, maxWidth: "60ch", color: "#4b463d" }}>
            A shared directory of living learning docs. Each of us is learning
            something; each of our Claudes keeps a single HTML doc about it and
            republishes it here as it grows. Every panel below is one
            person&apos;s corner, in their own design.
          </p>

          {groups.length > 0 && (
            <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "22px" }}>
              {groups.map((g) => (
                <a
                  key={g.author}
                  href={`#${g.author.toLowerCase()}`}
                  style={{
                    fontFamily: mono,
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    color: wallInk,
                    textDecoration: "none",
                    border: `1.5px solid ${wallInk}`,
                    borderRadius: "999px",
                    padding: "5px 14px",
                    background: "#FBF9F4",
                  }}
                >
                  {g.author.toLowerCase()} · {g.docs.length}
                </a>
              ))}
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                  color: "#7a7468",
                  padding: "5px 4px",
                }}
              >
                {docs.length} doc{docs.length === 1 ? "" : "s"} · updated {docs[0] ? docs[0].updatedAt.slice(0, 10) : "—"}
              </span>
            </nav>
          )}
        </header>

        {groups.length === 0 ? (
          <p style={{ fontSize: "17px" }}>Nothing on the shelf yet. Publish the first doc with the shelf skill.</p>
        ) : (
          <div style={{ display: "grid", gap: "44px", paddingBottom: "24px" }}>
            {groups.map((group) => (
              <AuthorPanel key={group.author} group={group} />
            ))}
          </div>
        )}

        <footer
          style={{
            margin: "40px 0 0",
            padding: "20px 0 48px",
            borderTop: `1.5px solid #D8D2C4`,
            fontFamily: mono,
            fontSize: "12px",
            letterSpacing: "0.04em",
            color: "#7a7468",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <span>want a corner? ask your claude — it has the shelf skill, your name, and your design baked in.</span>
          <span>docs are living — they change as we learn.</span>
        </footer>
      </div>
    </main>
  );
}

// Group docs by author (case-insensitive). Each author's panel style is the
// authorStyle of their most recently updated doc; authors are ordered by that
// same recency, so the freshest contributor sits on top.
function groupByAuthor(docs: DocMeta[]): AuthorGroup[] {
  const map = new Map<string, DocMeta[]>();

  for (const doc of docs) {
    const key = doc.author.trim().toLowerCase();
    const bucket = map.get(key) ?? [];
    bucket.push(doc);
    map.set(key, bucket);
  }

  const groups: AuthorGroup[] = [...map.values()].map((bucket) => {
    const sorted = [...bucket].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
    return {
      author: sorted[0].author,
      authorStyle: sorted[0].authorStyle,
      docs: sorted,
    };
  });

  return groups.sort((a, b) =>
    b.docs[0].updatedAt.localeCompare(a.docs[0].updatedAt),
  );
}
