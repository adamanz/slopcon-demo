"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog while the sun sets behind the rolling hills and a gentle breeze carries the scent of pine through the open window of a small wooden cabin.",
  "Programming is the art of telling another human what one wants the computer to do, and good code reads like a well written essay with clear intent and minimal surprises for the reader.",
  "In the heart of the bustling city, neon lights reflect off rain slicked streets while strangers hurry past coffee shops and bookstores, each carrying their own quiet story home tonight.",
  "Learning to type quickly is less about speed and more about consistency, rhythm, and accuracy, because the fastest typists rarely look down and let their fingers find the keys naturally.",
  "Space exploration captures the imagination because it reminds us that beyond the noise of daily life there are silent worlds, distant stars, and questions that our curiosity may yet answer.",
];

type Status = "idle" | "running" | "done";

const RATINGS: Array<{ min: number; name: string; emoji: string; color: string }> = [
  { min: 80, name: "Lightning", emoji: "⚡", color: "#fbbf24" },
  { min: 60, name: "Cheetah", emoji: "🐆", color: "#f97316" },
  { min: 40, name: "Rabbit", emoji: "🐇", color: "#10b981" },
  { min: 20, name: "Turtle", emoji: "🐢", color: "#3b82f6" },
  { min: 0, name: "Sloth", emoji: "🦥", color: "#a78bfa" },
];

const DURATION = 30;

function pickParagraph(exclude?: string): string {
  const pool = exclude ? PARAGRAPHS.filter((p) => p !== exclude) : PARAGRAPHS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function TypingTest() {
  const [target, setTarget] = useState<string>(PARAGRAPHS[0]);
  const [typed, setTyped] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState<number>(DURATION);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTarget(pickParagraph());
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    if (remaining <= 0) {
      setStatus("done");
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [status, remaining]);

  const { correct, total } = useMemo(() => {
    let c = 0;
    const t = typed.length;
    for (let i = 0; i < t; i++) if (typed[i] === target[i]) c++;
    return { correct: c, total: t };
  }, [typed, target]);

  const elapsed = DURATION - remaining;
  const wpm = elapsed > 0 ? Math.round((correct / 5) * (60 / elapsed)) : 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
  const rating = RATINGS.find((r) => wpm >= r.min) ?? RATINGS[RATINGS.length - 1];

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (status === "done") return;
    const val = e.target.value;
    if (val.length > target.length) return;
    if (status === "idle" && val.length > 0) setStatus("running");
    setTyped(val);
    if (val.length === target.length && val === target) setStatus("done");
  }

  function restart() {
    setTarget(pickParagraph(target));
    setTyped("");
    setRemaining(DURATION);
    setStatus("idle");
    setTimeout(() => taRef.current?.focus(), 0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220" }}>
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif", color: "#e5e7eb" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>⌨️ Typing Speed Test</h1>
      <p style={{ color: "#9ca3af", marginTop: 0 }}>Type the paragraph below. You have {DURATION} seconds.</p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <Stat label="Time" value={`${remaining}s`} highlight={remaining <= 10 && status === "running"} />
        <Stat label="WPM" value={String(wpm)} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
      </div>

      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
          fontSize: "1.25rem",
          lineHeight: 1.7,
          background: "#1f2937",
          padding: "1.25rem",
          borderRadius: 12,
          border: "1px solid #374151",
          marginBottom: "1rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {target.split("").map((ch, i) => {
          let color = "#6b7280";
          let bg = "transparent";
          if (i < typed.length) {
            color = typed[i] === ch ? "#34d399" : "#f87171";
            if (typed[i] !== ch) bg = "rgba(248,113,113,0.15)";
          } else if (i === typed.length && status !== "done") {
            bg = "rgba(96,165,250,0.25)";
          }
          return (
            <span key={i} style={{ color, background: bg, borderRadius: 2 }}>
              {ch}
            </span>
          );
        })}
      </div>

      <textarea
        ref={taRef}
        value={typed}
        onChange={handleChange}
        disabled={status === "done"}
        autoFocus
        spellCheck={false}
        placeholder={status === "idle" ? "Start typing to begin…" : ""}
        style={{
          width: "100%",
          minHeight: 110,
          padding: "0.9rem",
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
          fontSize: "1.05rem",
          background: "#111827",
          color: "#e5e7eb",
          border: "1px solid #374151",
          borderRadius: 12,
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      {status === "done" && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1.25rem",
            background: "#1f2937",
            border: `1px solid ${rating.color}`,
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem" }}>{rating.emoji}</div>
          <div style={{ fontSize: "1.5rem", color: rating.color, fontWeight: 700 }}>{rating.name}</div>
          <div style={{ color: "#d1d5db", marginTop: "0.5rem" }}>
            {wpm} WPM · {accuracy}% accuracy · {correct} correct chars
          </div>
        </div>
      )}

      <button
        onClick={restart}
        style={{
          marginTop: "1.25rem",
          padding: "0.7rem 1.4rem",
          fontSize: "1rem",
          fontWeight: 600,
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        ↻ Restart
      </button>
    </main>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 120,
        padding: "0.75rem 1rem",
        background: "#1f2937",
        border: `1px solid ${highlight ? "#f87171" : "#374151"}`,
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: highlight ? "#f87171" : "#e5e7eb" }}>{value}</div>
    </div>
  );
}
