"use client";

import { useState } from "react";

type Phase = "idle" | "fighting" | "result";
type Side = "red" | "blue";

export default function BattlePage() {
  const [redPrompt, setRedPrompt] = useState("");
  const [bluePrompt, setBluePrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [winner, setWinner] = useState<Side | null>(null);
  const [stats, setStats] = useState({ red: 0, blue: 0 });

  const fight = () => {
    if (phase === "fighting") return;
    setPhase("fighting");
    setWinner(null);
    setTimeout(() => {
      const w: Side = Math.random() < 0.5 ? "red" : "blue";
      setWinner(w);
      setStats((s) => ({ ...s, [w]: s[w] + 1 }));
      setPhase("result");
    }, 2200);
  };

  const reset = () => { setPhase("idle"); setWinner(null); };
  const fighting = phase === "fighting";
  const showResult = phase === "result" && winner;

  return (
    <main className="arena">
      <h1 className="title">⚔️ PROMPT BATTLE ARENA ⚔️</h1>
      <div className="scoreboard">
        <span className="score score-red">RED: {stats.red}</span>
        <span className="score score-blue">BLUE: {stats.blue}</span>
      </div>
      <div className={`battlefield ${fighting ? "shaking" : ""}`}>
        <div className={`fighter red ${winner === "red" ? "winner" : ""} ${winner === "blue" ? "loser" : ""}`}>
          <div className="label">RED TEAM</div>
          <textarea className="prompt" placeholder="Write your battle prompt..."
            value={redPrompt} onChange={(e) => setRedPrompt(e.target.value)} disabled={fighting} />
        </div>
        <div className={`vs ${fighting ? "vs-flash" : ""}`}>
          <span>VS</span>
          {showResult && <div className={`explosion explosion-${winner}`}><div className="boom">POW!</div></div>}
        </div>
        <div className={`fighter blue ${winner === "blue" ? "winner" : ""} ${winner === "red" ? "loser" : ""}`}>
          <div className="label">BLUE TEAM</div>
          <textarea className="prompt" placeholder="Write your battle prompt..."
            value={bluePrompt} onChange={(e) => setBluePrompt(e.target.value)} disabled={fighting} />
        </div>
      </div>
      <div className="controls">
        {phase !== "result" ? (
          <button className="fight-btn" onClick={fight} disabled={fighting}>
            {fighting ? "FIGHTING..." : "FIGHT!"}
          </button>
        ) : (
          <button className="fight-btn rematch" onClick={reset}>REMATCH</button>
        )}
      </div>
      {showResult && (
        <div className={`announcement ann-${winner}`}>
          {winner === "red" ? "RED" : "BLUE"} TEAM WINS!
        </div>
      )}
      <style>{`
        body { margin: 0; }
        .arena { min-height: 100vh; background: radial-gradient(circle at center, #1a0010 0%, #000 70%);
          color: #fff; font-family: "Impact", "Arial Black", sans-serif; padding: 2rem 1rem; text-align: center; overflow: hidden; }
        .title { font-size: 2.5rem; letter-spacing: 4px; margin: 0 0 1rem; text-shadow: 0 0 20px #ff0044, 0 0 40px #4488ff; }
        .scoreboard { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; font-size: 1.2rem; }
        .score-red { color: #ff3355; text-shadow: 0 0 10px #ff0044; }
        .score-blue { color: #4488ff; text-shadow: 0 0 10px #0044ff; }
        .battlefield { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch;
          gap: 1rem; max-width: 1100px; margin: 0 auto; }
        .battlefield.shaking { animation: shake 0.15s infinite; }
        .fighter { padding: 1rem; border-radius: 12px; border: 3px solid; transition: transform 0.3s; }
        .fighter.red { border-color: #ff3355; box-shadow: 0 0 30px #ff0044, inset 0 0 20px rgba(255,0,68,0.2);
          background: linear-gradient(135deg, #2a0008, #4a0010); }
        .fighter.blue { border-color: #4488ff; box-shadow: 0 0 30px #0044ff, inset 0 0 20px rgba(0,68,255,0.2);
          background: linear-gradient(135deg, #00082a, #00104a); }
        .battlefield.shaking .fighter.red { animation: glow-red 0.4s infinite alternate; }
        .battlefield.shaking .fighter.blue { animation: glow-blue 0.4s infinite alternate; }
        .fighter.winner { animation: celebrate 0.6s ease-out 4 alternate; z-index: 2; }
        .fighter.loser { opacity: 0.4; transform: scale(0.95); filter: grayscale(0.6); }
        .label { font-size: 1.4rem; letter-spacing: 3px; margin-bottom: 0.5rem; }
        .red .label { color: #ff5577; } .blue .label { color: #66aaff; }
        .prompt { width: 100%; min-height: 140px; padding: 0.75rem; box-sizing: border-box;
          background: rgba(0,0,0,0.6); color: #fff; border: 2px solid rgba(255,255,255,0.2);
          border-radius: 6px; font-family: monospace; font-size: 1rem; resize: vertical; }
        .vs { display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #ffcc00;
          text-shadow: 0 0 20px #ff0044, 0 0 40px #4488ff, 4px 4px 0 #000; padding: 0 0.5rem;
          position: relative; font-style: italic; }
        .vs-flash { animation: flash 0.2s infinite; }
        .explosion { position: absolute; inset: -40px; pointer-events: none;
          display: flex; align-items: center; justify-content: center; }
        .boom { font-size: 3rem; color: #fff200;
          background: radial-gradient(circle, #ffcc00 30%, #ff3300 60%, transparent 70%);
          padding: 2rem 2.5rem; border-radius: 50%;
          text-shadow: 3px 3px 0 #000, -2px -2px 0 #000;
          animation: explode 0.6s ease-out forwards;
          clip-path: polygon(50% 0%,61% 22%,85% 15%,75% 38%,98% 50%,75% 62%,85% 85%,61% 78%,50% 100%,39% 78%,15% 85%,25% 62%,2% 50%,25% 38%,15% 15%,39% 22%); }
        .controls { margin-top: 2rem; }
        .fight-btn { font-family: inherit; font-size: 2rem; letter-spacing: 4px; padding: 1rem 3rem;
          border: 4px solid #ffcc00; background: linear-gradient(135deg, #ff0044, #4488ff); color: #fff;
          cursor: pointer; border-radius: 8px; text-shadow: 2px 2px 0 #000;
          box-shadow: 0 0 30px #ff0044, 0 0 30px #4488ff; transition: transform 0.1s; }
        .fight-btn:hover:not(:disabled) { transform: scale(1.05); }
        .fight-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .fight-btn.rematch { background: linear-gradient(135deg, #00aa44, #ffcc00); }
        .announcement { margin-top: 1.5rem; font-size: 3rem; letter-spacing: 6px; animation: bounceIn 0.6s ease-out; }
        .ann-red { color: #ff3355; text-shadow: 0 0 30px #ff0044, 4px 4px 0 #000; }
        .ann-blue { color: #4488ff; text-shadow: 0 0 30px #0044ff, 4px 4px 0 #000; }
        @keyframes shake { 0%{transform:translate(0,0) rotate(0)} 25%{transform:translate(-6px,4px) rotate(-0.5deg)}
          50%{transform:translate(6px,-4px) rotate(0.5deg)} 75%{transform:translate(-4px,-2px) rotate(-0.3deg)}
          100%{transform:translate(4px,2px) rotate(0.3deg)} }
        @keyframes glow-red { from{box-shadow:0 0 30px #ff0044, inset 0 0 20px rgba(255,0,68,0.2)}
          to{box-shadow:0 0 80px #ff0044, 0 0 120px #ff3355, inset 0 0 40px rgba(255,0,68,0.5)} }
        @keyframes glow-blue { from{box-shadow:0 0 30px #0044ff, inset 0 0 20px rgba(0,68,255,0.2)}
          to{box-shadow:0 0 80px #0044ff, 0 0 120px #4488ff, inset 0 0 40px rgba(0,68,255,0.5)} }
        @keyframes flash { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.3);color:#fff} }
        @keyframes celebrate { from{transform:scale(1) rotate(0)} to{transform:scale(1.08) rotate(2deg);box-shadow:0 0 100px #ffcc00} }
        @keyframes explode { 0%{transform:scale(0) rotate(0);opacity:0} 40%{transform:scale(1.4) rotate(15deg);opacity:1} 100%{transform:scale(1.8) rotate(-10deg);opacity:0} }
        @keyframes bounceIn { 0%{transform:scale(0.2);opacity:0} 60%{transform:scale(1.2);opacity:1} 100%{transform:scale(1)} }
      `}</style>
    </main>
  );
}
