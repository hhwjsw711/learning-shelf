"use client";

// "how the shelf works" — a tiny Scatterbrain slideshow pinned to the bottom
// of the board. The board's chrome already speaks the Scatterbrain design
// system (a presentation template at heart), so the explainer is a real deck:
// each slide is a post-it cluster — Shrikhand headline, Zilla Slab body,
// Caveat quips, feature-icon circle, pin on every primary note, pin + tape on
// the hero — with alternating rotations, advanced by hand-drawn arrows.

import { useState } from "react";

const ink = "#2D2A26";
const inkLight = "#5C5750";
const display = "'Shrikhand', cursive";
const script = "'Caveat', cursive";
const slab = "'Zilla Slab', serif";
const noteShadow = "2px 3px 15px rgba(45,42,38,0.15), 0 1px 3px rgba(45,42,38,0.25)";

type Slide = {
  icon: string; // single Shrikhand glyph in the round feature-icon
  title: string;
  body: string;
  quip: string; // Caveat side-note
  note: string; // post-it gradient
  quipNote: string; // accent post-it fill
  pin: string;
  lean: string; // main note rotation
  quipLean: string;
};

const PINS = {
  red: "radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a)",
  blue: "radial-gradient(circle at 30% 30%, #4dabf7, #1864ab)",
  green: "radial-gradient(circle at 30% 30%, #69db7c, #2f9e44)",
  gold: "radial-gradient(circle at 30% 30%, #ffd43b, #f59f00)",
};

const SLIDES: Slide[] = [
  {
    icon: "?",
    title: "what is this",
    body: "a corkboard shared by a group of friends. each of us keeps living HTML docs of whatever we're learning — written, styled, and republished by our coding agent as we go.",
    quip: "the docs grow while we learn ✎",
    note: "linear-gradient(135deg, #FFE066 0%, #FFD43B 100%)",
    quipNote: "#D0BFFF",
    pin: PINS.red,
    lean: "-1.2deg",
    quipLean: "5deg",
  },
  {
    icon: "1",
    title: "claim a corner",
    body: "get the shelf password from one of us, tap “join the shelf”, type your name, and pick the design your corner will wear. the page mints your personal kit.",
    quip: "no account, no signup — just the password",
    note: "linear-gradient(135deg, #B2F2BB 0%, #8CE99A 100%)",
    quipNote: "#FFCC80",
    pin: PINS.green,
    lean: "1deg",
    quipLean: "-6deg",
  },
  {
    icon: "2",
    title: "paste your kit",
    body: "paste the whole kit into Claude Code or Codex. your agent installs three skills for both tools: the shelf (how to publish here), how we like to learn, and the template library.",
    quip: "one paste, fully set up :)",
    note: "linear-gradient(135deg, #A5D8FF 0%, #74C0FC 100%)",
    quipNote: "linear-gradient(135deg, #FFE066 0%, #FFD43B 100%)",
    pin: PINS.blue,
    lean: "-0.8deg",
    quipLean: "4.5deg",
  },
  {
    icon: "3",
    title: "learn in modules",
    body: "pick a topic and your agent plans it as modules — then teaches exactly one at a time, writing each into your doc as you genuinely get it. the little bar on your card is modules done over modules planned.",
    quip: "the bar never lies — it's what you've actually learned",
    note: "linear-gradient(135deg, #FFC9C9 0%, #FF9F9F 100%)",
    quipNote: "linear-gradient(135deg, #B2F2BB 0%, #8CE99A 100%)",
    pin: PINS.gold,
    lean: "1.1deg",
    quipLean: "-5deg",
  },
  {
    icon: "★",
    title: "it lives here",
    body: "every meaningful update gets republished, so the board always shows the latest of everyone's docs. hang a polaroid on your corner, read your friends' pages, steal their good ideas.",
    quip: "that's the whole thing — go learn something",
    note: "#FFCC80",
    quipNote: "linear-gradient(135deg, #A5D8FF 0%, #74C0FC 100%)",
    pin: PINS.red,
    lean: "-1deg",
    quipLean: "6deg",
  },
];

export function HowItWorks() {
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  const last = SLIDES.length - 1;

  return (
    <section aria-label="how the shelf works" style={{ margin: "72px 0 8px" }}>
      {/* section heading, scribbled straight on the cork */}
      <h2
        style={{
          margin: "0 0 30px",
          fontFamily: display,
          fontWeight: 400,
          fontSize: "clamp(26px, 3.4vw, 38px)",
          color: "#FBF7EE",
          textShadow: "2px 2px 0 rgba(45,42,38,0.4)",
          transform: "rotate(-0.9deg)",
        }}
      >
        how it works{" "}
        <span style={{ fontFamily: script, fontSize: "0.62em", color: "#3B2F21", textShadow: "none", fontWeight: 600 }}>
          — a five-note tour ✎
        </span>
      </h2>

      {/* the deck: one slide at a time, a hero post-it + a floating quip */}
      <div style={{ position: "relative", minHeight: "300px", maxWidth: "660px" }}>
        {/* hero post-it: pin + tape = the "officially posted" treatment */}
        <div
          key={i /* remount per slide so the entrance transition replays */}
          style={{
            position: "relative",
            background: s.note,
            padding: "clamp(24px, 4vw, 40px) clamp(24px, 4.5vw, 46px) clamp(28px, 4vw, 42px)",
            boxShadow: noteShadow,
            transform: `rotate(${s.lean})`,
            animation: "hiw-in 240ms ease-out",
          }}
        >
          {/* tape */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "-13px",
              left: "50%",
              transform: "translateX(-50%) rotate(-2deg)",
              width: "80px",
              height: "25px",
              background: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
          {/* pin */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "-8px",
              left: "30px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: s.pin,
              boxShadow: "0 2px 4px rgba(45,42,38,0.25), inset -2px -2px 4px rgba(0,0,0,0.2)",
              zIndex: 2,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            {/* feature icon: round ink border, single Shrikhand glyph */}
            <span
              aria-hidden
              style={{
                width: "54px",
                height: "54px",
                flex: "0 0 auto",
                border: `3px solid ${ink}`,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontFamily: display,
                fontSize: "22px",
                color: ink,
              }}
            >
              {s.icon}
            </span>
            <h3
              style={{
                margin: 0,
                fontFamily: display,
                fontWeight: 400,
                fontSize: "clamp(22px, 3vw, 30px)",
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                color: ink,
              }}
            >
              {s.title}
            </h3>
          </div>

          <p
            style={{
              margin: "16px 0 0",
              fontFamily: slab,
              fontSize: "clamp(15px, 1.5vw, 17.5px)",
              lineHeight: 1.7,
              color: inkLight,
              maxWidth: "52ch",
            }}
          >
            {s.body}
          </p>
        </div>

        {/* floating accent quip, bigger lean, opposite direction */}
        <div
          key={`q${i}`}
          style={{
            position: "relative",
            display: "inline-block",
            margin: "18px 0 0 clamp(8px, 8vw, 96px)",
            background: s.quipNote,
            padding: "10px 20px 12px",
            boxShadow: noteShadow,
            transform: `rotate(${s.quipLean})`,
            fontFamily: script,
            fontWeight: 600,
            fontSize: "clamp(18px, 2vw, 22px)",
            color: ink,
            animation: "hiw-in 300ms ease-out",
          }}
        >
          {s.quip}
        </div>

        <style>{`@keyframes hiw-in { from { opacity: 0; transform: translateY(10px); } }`}</style>
      </div>

      {/* deck controls: handwritten arrows + one thumbtack dot per slide */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "26px", flexWrap: "wrap" }}>
        <button
          onClick={() => setI(i === 0 ? last : i - 1)}
          aria-label="previous"
          style={arrowStyle}
        >
          ← that way
        </button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {SLIDES.map((sl, d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              aria-label={`slide ${d + 1}: ${sl.title}`}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: d === i ? sl.pin : "rgba(45,42,38,0.28)",
                boxShadow: d === i ? "0 2px 4px rgba(45,42,38,0.4), inset -2px -2px 3px rgba(0,0,0,0.2)" : "none",
                transform: d === i ? "scale(1.15)" : "none",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setI(i === last ? 0 : i + 1)}
          aria-label="next"
          style={arrowStyle}
        >
          this way →
        </button>
        <span style={{ fontFamily: script, fontWeight: 600, fontSize: "19px", color: "#3B2F21" }}>
          {i + 1} of {SLIDES.length}
        </span>
      </div>
    </section>
  );
}

const arrowStyle: React.CSSProperties = {
  fontFamily: "'Caveat', cursive",
  fontWeight: 700,
  fontSize: "22px",
  color: "#3B2F21",
  background: "none",
  border: "none",
  padding: "2px 6px",
  cursor: "pointer",
};
