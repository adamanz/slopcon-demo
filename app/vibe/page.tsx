"use client";

import { useState, type CSSProperties } from "react";

type MoodId = "happy" | "sad" | "anxious" | "chill" | "energetic" | "sleepy";

type Mood = {
  id: MoodId;
  label: string;
  emoji: string;
  rainEmoji: string;
  rainCount: number;
  rainSpeed: number;
  bg: string;
  accent: string;
  caption: string;
};

const MOODS: Mood[] = [
  { id: "happy", label: "Happy", emoji: "😄", rainEmoji: "🌞", rainCount: 14, rainSpeed: 7,
    bg: "linear-gradient(135deg,#ffd166 0%,#ff8c42 50%,#ffb627 100%)", accent: "#fff7d6",
    caption: "Sunshine on the brain." },
  { id: "sad", label: "Sad", emoji: "😢", rainEmoji: "💧", rainCount: 40, rainSpeed: 1.4,
    bg: "linear-gradient(180deg,#3a4a5c 0%,#5a6e82 60%,#7d8fa3 100%)", accent: "#cfe0f0",
    caption: "Soft rain, soft heart." },
  { id: "anxious", label: "Anxious", emoji: "😰", rainEmoji: "🌪️", rainCount: 18, rainSpeed: 2,
    bg: "linear-gradient(135deg,#6d597a 0%,#b56576 50%,#e56b6f 100%)", accent: "#fff0f0",
    caption: "Swirling clouds, deep breaths." },
  { id: "chill", label: "Chill", emoji: "😌", rainEmoji: "❄️", rainCount: 36, rainSpeed: 9,
    bg: "linear-gradient(180deg,#a8dadc 0%,#cdeaef 60%,#f1faee 100%)", accent: "#1d3557",
    caption: "Gentle snow, gentle pace." },
  { id: "energetic", label: "Energetic", emoji: "⚡", rainEmoji: "⚡", rainCount: 22, rainSpeed: 1.1,
    bg: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", accent: "#ffe066",
    caption: "Lightning in your veins." },
  { id: "sleepy", label: "Sleepy", emoji: "😴", rainEmoji: "💤", rainCount: 12, rainSpeed: 11,
    bg: "linear-gradient(180deg,#0d1b2a 0%,#1b263b 60%,#415a77 100%)", accent: "#e0e1dd",
    caption: "Drifting off into the night." },
];

export default function VibePage() {
  const [mood, setMood] = useState<Mood | null>(null);

  return (
    <main style={styles.main}>
      {mood && (
        <div key={mood.id} style={{ ...styles.weather, background: mood.bg }} aria-hidden>
          <div style={styles.shimmer} />
          {Array.from({ length: mood.rainCount }).map((_, i) => {
            const left = (i * 97) % 100;
            const delay = (i * 0.37) % mood.rainSpeed;
            const size = 18 + ((i * 13) % 28);
            const drift = (i % 2 === 0 ? 1 : -1) * (4 + (i % 6));
            const stationary = mood.id === "happy" || mood.id === "energetic";
            const top = stationary ? `${(i * 23) % 80 + 5}%` : undefined;
            const dropStyle: CSSProperties & Record<string, string | number> = {
              left: `${left}%`,
              fontSize: `${size}px`,
              animationDuration: `${mood.rainSpeed}s`,
              animationDelay: `-${delay}s`,
              "--drift": `${drift}px`,
              ...(top ? { top } : null),
            };
            return (
              <span key={i} className={`drop drop-${mood.id}`} style={dropStyle}>
                {mood.rainEmoji}
              </span>
            );
          })}
        </div>
      )}

      <section style={{ ...styles.panel, color: mood?.accent ?? "#222" }}>
        <h1 style={styles.title}>What&apos;s your vibe?</h1>
        <p style={styles.subtitle}>
          {mood ? mood.caption : "Pick a mood and watch the weather shift."}
        </p>
        <div style={styles.grid}>
          {MOODS.map((m) => {
            const active = mood?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMood(active ? null : m)}
                style={{
                  ...styles.moodBtn,
                  transform: active ? "scale(1.08)" : "scale(1)",
                  boxShadow: active
                    ? "0 0 0 3px rgba(255,255,255,0.9), 0 12px 32px rgba(0,0,0,0.35)"
                    : "0 6px 18px rgba(0,0,0,0.18)",
                  background: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.78)",
                }}
                aria-pressed={active}
              >
                <span style={styles.moodEmoji}>{m.emoji}</span>
                <span style={styles.moodLabel}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <style>{`
        html, body { margin: 0; padding: 0; min-height: 100%; background: #0f1115; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
        .drop { position: absolute; top: -10vh; opacity: 0.95; will-change: transform; pointer-events: none;
                animation-name: fall; animation-iteration-count: infinite; animation-timing-function: linear; }
        .drop-energetic { animation-name: flash; animation-timing-function: ease-in-out; opacity: 0; filter: drop-shadow(0 0 16px #fff7a8); }
        .drop-anxious   { animation-name: swirl; }
        .drop-chill     { animation-name: drift; }
        .drop-sleepy    { animation-name: float; }
        .drop-happy     { animation-name: pulse; animation-timing-function: ease-in-out; filter: drop-shadow(0 0 6px rgba(255,210,90,0.45)); }
        @keyframes fall   { 0%{transform:translate3d(0,-10vh,0)} 100%{transform:translate3d(var(--drift),110vh,0)} }
        @keyframes drift  { 0%{transform:translate3d(0,-10vh,0) rotate(0)} 100%{transform:translate3d(calc(var(--drift)*4),110vh,0) rotate(360deg)} }
        @keyframes swirl  { 0%{transform:translate3d(0,-10vh,0) rotate(0)} 50%{transform:translate3d(calc(var(--drift)*6),50vh,0) rotate(180deg)} 100%{transform:translate3d(0,110vh,0) rotate(360deg)} }
        @keyframes float  { 0%{transform:translate3d(0,110vh,0); opacity:0} 30%{opacity:.9} 100%{transform:translate3d(var(--drift),-10vh,0); opacity:0} }
        @keyframes pulse  { 0%,100%{transform:translate3d(0,0,0) scale(1); opacity:.95} 50%{transform:translate3d(var(--drift),-10px,0) scale(1.18); opacity:1} }
        @keyframes flash  { 0%,82%,100%{opacity:0; transform:scale(1)} 86%{opacity:1; transform:scale(1.6)} 90%{opacity:.7; transform:scale(1.2)} 94%{opacity:1; transform:scale(1.4)} 97%{opacity:.3} }
        @keyframes shimmer{ 0%{transform:translateX(-30%)} 100%{transform:translateX(30%)} }
        @keyframes pop    { 0%{opacity:0; transform:translateY(8px)} 100%{opacity:1; transform:translateY(0)} }
      `}</style>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: { position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex",
    alignItems: "center", justifyContent: "center", padding: "32px 20px",
    background: "radial-gradient(circle at 50% 30%, #1f2330, #0f1115 70%)" },
  weather: { position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
    transition: "background 600ms ease", animation: "pop 400ms ease both" },
  shimmer: { position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.18), transparent 60%)",
    animation: "shimmer 8s ease-in-out infinite alternate" },
  panel: { position: "relative", zIndex: 1, maxWidth: 720, width: "100%", padding: "32px",
    borderRadius: 24, background: "rgba(15,17,21,0.55)", backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)", color: "#f7f7f7", textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)" },
  title: { fontSize: 38, margin: "0 0 8px", letterSpacing: -0.5, color: "#fff" },
  subtitle: { margin: "0 0 28px", fontSize: 17, opacity: 0.92, minHeight: 24 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 },
  moodBtn: { padding: "18px 10px", borderRadius: 16, border: "none", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    transition: "transform 200ms ease, box-shadow 200ms ease, background 200ms ease",
    color: "#1a1a1a", fontWeight: 600 },
  moodEmoji: { fontSize: 36, lineHeight: 1 },
  moodLabel: { fontSize: 14, letterSpacing: 0.3 },
};
