"use client";

// The "let's learn" sticky: type a topic, tap your agent, and your desktop
// app opens with "I want to learn about <topic>" already typed. Deep links:
// claude://code/new?q=…  (Claude Code session — where the shelf skills live)
// codex://threads/new?prompt=…  (Codex app, chatbox prefilled, not auto-run)
// Desktop-only: phones don't have the apps, so the note never renders there.

import { useEffect, useState } from "react";

const ink = "#2D2A26";
const display = "'Shrikhand', cursive";
const script = "'Caveat', cursive";
const slab = "'Zilla Slab', serif";
const noteShadow = "2px 3px 15px rgba(45,42,38,0.22), 0 1px 3px rgba(45,42,38,0.28)";

export function LetsLearn() {
  const [desktop, setDesktop] = useState(false);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setDesktop(fine && window.innerWidth >= 768);
  }, []);

  if (!desktop) return null;

  const prompt = `I want to learn about ${topic.trim() || "____"}`;
  const ready = topic.trim().length > 0;

  function open(scheme: "claude" | "codex") {
    if (!ready) return;
    const url =
      scheme === "claude"
        ? `claude://code/new?q=${encodeURIComponent(prompt)}`
        : `codex://threads/new?prompt=${encodeURIComponent(prompt)}`;
    window.location.href = url;
  }

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        background: "linear-gradient(135deg, #A5D8FF 0%, #74C0FC 100%)",
        padding: "18px 24px 18px",
        boxShadow: noteShadow,
        transform: "rotate(-0.9deg)",
        maxWidth: "360px",
      }}
    >
      {/* blue tack to match the note */}
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
          background: "radial-gradient(circle at 30% 30%, #4dabf7, #1864ab)",
          boxShadow: "0 2px 4px rgba(45,42,38,0.5), inset -2px -2px 4px rgba(0,0,0,0.2)",
        }}
      />
      <span style={{ display: "block", fontFamily: display, fontSize: "20px", lineHeight: 1.1 }}>
        let&apos;s learn
      </span>
      <label style={{ display: "block", marginTop: "8px", fontFamily: script, fontWeight: 600, fontSize: "19px" }}>
        I want to learn about{" "}
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && open("claude")}
          placeholder="____"
          size={12}
          style={{
            fontFamily: script,
            fontWeight: 700,
            fontSize: "19px",
            color: ink,
            background: "transparent",
            border: "none",
            borderBottom: `2px solid ${ink}`,
            outline: "none",
            padding: "0 2px 1px",
          }}
        />
      </label>
      <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
        <button onClick={() => open("claude")} disabled={!ready} style={btn("#FFFDF5", ready)}>
          learn with claude ✎
        </button>
        <button onClick={() => open("codex")} disabled={!ready} style={btn("#FFFDF5", ready)}>
          learn with codex ⌨
        </button>
      </div>
    </div>
  );
}

function btn(bg: string, ready: boolean): React.CSSProperties {
  return {
    fontFamily: slab,
    fontWeight: 600,
    fontSize: "14px",
    padding: "7px 13px",
    background: bg,
    color: ink,
    border: `2px solid ${ink}`,
    boxShadow: ready ? "2px 2px 0 rgba(45,42,38,0.5)" : "none",
    cursor: ready ? "pointer" : "not-allowed",
    opacity: ready ? 1 : 0.55,
  };
}
