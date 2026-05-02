"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";

type Mode = "work" | "break";

const DURATIONS: Record<Mode, number> = { work: 25 * 60, break: 5 * 60 };

const C = {
  bg: "#FBF6EE",
  surface: "#F4E9D8",
  ink: "#2B1810",
  inkSoft: "#7A5C48",
  work: "#C2410C",
  workSoft: "#FB923C",
  break: "#B45309",
  breakSoft: "#FCD34D",
};

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>("work");
  const [remaining, setRemaining] = useState<number>(DURATIONS.work);
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setRemaining(DURATIONS[next]);
    setRunning(false);
  };
  const reset = () => {
    setRunning(false);
    setRemaining(DURATIONS[mode]);
  };

  const total = DURATIONS[mode];
  const progress = 1 - remaining / total;
  const size = 320;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const accent = mode === "work" ? C.work : C.break;
  const accentSoft = mode === "work" ? C.workSoft : C.breakSoft;

  const tabBtn = (active: boolean): CSSProperties => ({
    border: "none",
    background: active ? C.bg : "transparent",
    color: active ? C.ink : C.inkSoft,
    padding: "0.55rem 1.4rem",
    borderRadius: 999,
    fontSize: 13,
    fontFamily: "inherit",
    letterSpacing: "0.05em",
    cursor: "pointer",
    boxShadow: active ? "0 1px 3px rgba(43,24,16,0.08)" : "none",
    transition: "all 0.2s ease",
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 50% 20%, ${C.surface}, ${C.bg})`,
        color: C.ink,
        fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p style={{ letterSpacing: "0.4em", fontSize: 12, textTransform: "uppercase", color: C.inkSoft, margin: 0 }}>
          Pomodoro
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 400, margin: "0.5rem 0 0", letterSpacing: "-0.01em" }}>
          {mode === "work" ? "Focus Session" : "Take a Breath"}
        </h1>
      </div>

      <div
        role="tablist"
        style={{
          display: "inline-flex",
          background: C.surface,
          padding: 4,
          borderRadius: 999,
          marginBottom: "2.5rem",
          boxShadow: "inset 0 1px 2px rgba(43,24,16,0.06)",
        }}
      >
        {(["work", "break"] as Mode[]).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => switchMode(m)} style={tabBtn(mode === m)}>
            {m === "work" ? "Work · 25" : "Break · 5"}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surface} strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 300, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
            {fmt(remaining)}
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: accentSoft, marginTop: 4 }}>
            {running ? "In progress" : remaining === 0 ? "Complete" : "Ready"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: "2.5rem" }}>
        <button
          onClick={() => setRunning((v) => !v)}
          disabled={remaining === 0}
          style={{
            border: "none",
            background: accent,
            color: C.bg,
            padding: "0.85rem 2.5rem",
            borderRadius: 999,
            fontSize: 14,
            fontFamily: "inherit",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: remaining === 0 ? "not-allowed" : "pointer",
            opacity: remaining === 0 ? 0.4 : 1,
            boxShadow: `0 4px 14px ${accent}33`,
            transition: "all 0.2s ease",
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          style={{
            border: `1px solid ${C.surface}`,
            background: "transparent",
            color: C.inkSoft,
            padding: "0.85rem 1.75rem",
            borderRadius: 999,
            fontSize: 14,
            fontFamily: "inherit",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Reset
        </button>
      </div>
    </main>
  );
}
