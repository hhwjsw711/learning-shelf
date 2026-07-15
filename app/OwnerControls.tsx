"use client";

// The strip a signed-in member sees at the bottom of THEIR paper (nobody
// else's): add a lesson via their agent, delete one of their lessons, or
// leave the board entirely — the destructive ones behind a confirm modal.
// Auth rides on the httpOnly owner cookie; the API checks it server-side.

import { useState } from "react";
import { createPortal } from "react-dom";

const ink = "#2D2A26";
const display = "'Shrikhand', cursive";
const script = "'Caveat', cursive";
const slab = "'Zilla Slab', serif";

type Lesson = { slug: string; subject: string };

export function OwnerControls({ author, authorName, lessons }: { author: string; authorName?: string; lessons: Lesson[] }) {
  const [confirm, setConfirm] = useState<
    | { kind: "lesson"; slug: string; subject: string }
    | { kind: "leave" }
    | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!confirm) return;
    setBusy(true);
    setError(null);
    const url =
      confirm.kind === "lesson"
        ? `/api/publish?slug=${encodeURIComponent(confirm.slug)}`
        : "/api/member";
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "操作失败 — 请重试");
      setBusy(false);
      return;
    }
    window.location.href = confirm.kind === "leave" ? "/" : window.location.pathname;
    window.location.reload();
  }

  return (
    <div
      style={{
        marginTop: "14px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flexWrap: "wrap",
        fontFamily: script,
        fontWeight: 600,
        fontSize: "19px",
        color: "#4A4139",
      }}
    >
      <span>你的角落 ✎</span>
      <button
        onClick={() =>
          (window.location.href = `claude://code/new?q=${encodeURIComponent(
            "我想在学习文档里添加新一课",
          )}`)
        }
        style={chip("#B2F2BB")}
      >
        + 添加一课
      </button>
      {lessons.map((l) => (
        <button
          key={l.slug}
          onClick={() => setConfirm({ kind: "lesson", slug: l.slug, subject: l.subject })}
          style={chip("#FFC9C9")}
        >
          删除「{l.subject}」
        </button>
      ))}
      <button onClick={() => setConfirm({ kind: "leave" })} style={chip("#E9ECEF")}>
        离开布告板
      </button>

      {/* portal: the paper wrapper is CSS-transformed, which would trap
          position:fixed and shrink the overlay to the panel */}
      {confirm && createPortal(
        <div
          role="dialog"
          aria-modal
          onClick={() => !busy && setConfirm(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(45,42,38,0.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "380px",
              margin: "20px",
              background: "linear-gradient(180deg, #FFE066 0%, #FFD43B 100%)",
              padding: "26px 30px 28px",
              boxShadow: "2px 3px 15px rgba(45,42,38,0.4), 0 1px 3px rgba(45,42,38,0.3)",
              transform: "rotate(-1deg)",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a)",
                boxShadow: "0 2px 4px rgba(45,42,38,0.5), inset -2px -2px 4px rgba(0,0,0,0.2)",
              }}
            />
            <p style={{ margin: 0, fontFamily: script, fontWeight: 700, fontSize: "26px", lineHeight: 1.15, color: ink }}>
              {confirm.kind === "lesson"
                ? `拆掉「${confirm.subject}」？`
                : "离开布告板？"}
            </p>
            <p style={{ margin: "10px 0 0", fontFamily: slab, fontSize: "15px", lineHeight: 1.5, color: ink }}>
              {confirm.kind === "lesson"
                ? "这会从布告板上永久取下这篇文档。本地源文件不受影响，之后可以重新发布。"
                : `这会拆掉 ${authorName || author} 的整个角落 — 所有笔记、照片和名字认领都会移除。无法撤销。`}
            </p>
            {error && (
              <p style={{ margin: "10px 0 0", fontFamily: slab, fontWeight: 600, fontSize: "14px", color: "#B23B3B" }}>
                {error}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
              <button
                onClick={run}
                disabled={busy}
                style={{
                  fontFamily: display,
                  fontSize: "15px",
                  padding: "8px 18px",
                  background: "#FFC9C9",
                  color: ink,
                  border: `2px solid ${ink}`,
                  boxShadow: `3px 3px 0 ${ink}`,
                  cursor: busy ? "wait" : "pointer",
                }}
              >
                {busy ? "正在拆除…" : confirm.kind === "lesson" ? "是的，删除" : "是的，离开"}
              </button>
              <button
                onClick={() => setConfirm(null)}
                disabled={busy}
                style={{
                  fontFamily: script,
                  fontWeight: 700,
                  fontSize: "20px",
                  background: "none",
                  border: "none",
                  color: ink,
                  cursor: "pointer",
                }}
              >
                保留
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

function chip(bg: string): React.CSSProperties {
  return {
    fontFamily: slab,
    fontWeight: 600,
    fontSize: "13px",
    padding: "6px 12px",
    background: bg,
    color: ink,
    border: `2px solid ${ink}`,
    boxShadow: "2px 2px 0 rgba(45,42,38,0.45)",
    cursor: "pointer",
  };
}
