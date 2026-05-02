"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOLS = ["🍒", "🍋", "🍇", "🍉", "⭐", "💎", "🔔", "7️⃣"];

type Reel = { value: string; spinning: boolean };
type Confetto = { id: number; emoji: string; left: number; delay: number; duration: number; size: number };

const pick = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

export default function SlotsPage() {
  const [reels, setReels] = useState<Reel[]>([
    { value: "🍒", spinning: false },
    { value: "🍋", spinning: false },
    { value: "💎", spinning: false },
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);
  const [confetti, setConfetti] = useState<Confetto[]>([]);
  const [count, setCount] = useState(0);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => () => intervalsRef.current.forEach(clearInterval), []);

  function launchConfetti(winSymbol: string) {
    const pool = [winSymbol, "🎉", "✨", "🎊", "⭐", "💖", "💫"];
    setConfetti(
      Array.from({ length: 40 }, (_, i) => ({
        id: i + Date.now(),
        emoji: pool[i % pool.length],
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        size: 22 + Math.random() * 28,
      }))
    );
    setTimeout(() => setConfetti([]), 4000);
  }

  function spin() {
    if (spinning) return;
    setWin(false);
    setConfetti([]);
    setSpinning(true);
    setCount((c) => c + 1);
    const finals = [pick(), pick(), pick()];
    const stops = [900, 1500, 2200];
    setReels((r) => r.map((x) => ({ ...x, spinning: true })));
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
    for (let i = 0; i < 3; i++) {
      const id = setInterval(() => {
        setReels((prev) => {
          const next = [...prev];
          if (next[i].spinning) next[i] = { ...next[i], value: pick() };
          return next;
        });
      }, 110);
      intervalsRef.current.push(id);
      setTimeout(() => {
        clearInterval(id);
        setReels((prev) => {
          const next = [...prev];
          next[i] = { value: finals[i], spinning: false };
          return next;
        });
        if (i === 2) {
          setSpinning(false);
          if (finals[0] === finals[1] && finals[1] === finals[2]) {
            setWin(true);
            launchConfetti(finals[0]);
          }
        }
      }, stops[i]);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#ff6ec4 0%,#7873f5 50%,#4ade80 100%)", fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden" }}>
      <h1 style={{ fontSize: "3rem", margin: 0, color: "#fff", textShadow: "3px 3px 0 #000, 0 0 20px rgba(255,255,255,0.6)", letterSpacing: 2 }}>🎰 Emoji Slots 🎰</h1>
      <p style={{ color: "#fff", textShadow: "1px 1px 0 #000", marginBottom: "1.5rem" }}>
        Match all three to win! · Spins: {count}
      </p>
      <div style={{ display: "flex", gap: "1rem", padding: "1.25rem", background: "linear-gradient(180deg,#fde68a,#f59e0b)", borderRadius: 24, boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 0 0 6px #b45309" }}>
        {reels.map((reel, i) => (
          <div key={i} style={{ width: 110, height: 130, background: "#fff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, overflow: "hidden", boxShadow: "inset 0 0 0 4px #1f2937, 0 4px 0 #1f2937", userSelect: "none" }}>
            <span
              key={reel.spinning ? `s-${reel.value}-${i}` : `f-${reel.value}-${i}`}
              style={{
                display: "inline-block",
                animation: reel.spinning ? "reelspin 110ms linear" : win ? "bounce 0.5s ease" : "none",
                filter: win ? "drop-shadow(0 0 12px gold)" : "none",
              }}
            >
              {reel.value}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        style={{ marginTop: "2rem", padding: "1rem 3rem", fontSize: "1.75rem", fontWeight: 900, letterSpacing: 2, color: "#fff", background: spinning ? "linear-gradient(180deg,#9ca3af,#4b5563)" : "linear-gradient(180deg,#ef4444,#b91c1c)", border: "4px solid #fff", borderRadius: 999, boxShadow: "0 8px 0 #7f1d1d, 0 12px 30px rgba(0,0,0,0.35)", cursor: spinning ? "not-allowed" : "pointer", transform: spinning ? "translateY(4px)" : "none", transition: "transform 80ms ease-out", textShadow: "2px 2px 0 #000" }}
      >
        {spinning ? "SPINNING…" : "SPIN!"}
      </button>
      {win && (
        <div style={{ marginTop: "1.5rem", fontSize: "2rem", fontWeight: 900, color: "#fff", textShadow: "2px 2px 0 #000, 0 0 14px gold", animation: "pulse 0.6s ease-in-out infinite alternate" }}>
          🎉 JACKPOT! 🎉
        </div>
      )}
      {confetti.map((c) => (
        <span key={c.id} style={{ position: "fixed", top: -50, left: `${c.left}%`, fontSize: c.size, animation: `fall ${c.duration}s linear ${c.delay}s forwards`, pointerEvents: "none" }}>
          {c.emoji}
        </span>
      ))}
      <style>{`
        @keyframes reelspin { 0% { transform: translateY(-110px); opacity: 0.2; } 50% { opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes bounce { 0% { transform: scale(1); } 50% { transform: scale(1.35); } 100% { transform: scale(1); } }
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0.9; } }
      `}</style>
    </main>
  );
}
