"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Wave = "sine" | "square" | "sawtooth" | "triangle";
type Pad = { freq: number; wave: Wave; color: string; label: string };

const PADS: Pad[] = [
  { freq: 65.41, wave: "sine", color: "#ff006e", label: "C2" },
  { freq: 82.41, wave: "sine", color: "#ff4081", label: "E2" },
  { freq: 110.0, wave: "triangle", color: "#fb5607", label: "A2" },
  { freq: 146.83, wave: "triangle", color: "#ff9e00", label: "D3" },
  { freq: 196.0, wave: "square", color: "#ffbe0b", label: "G3" },
  { freq: 261.63, wave: "square", color: "#c1ff00", label: "C4" },
  { freq: 329.63, wave: "sawtooth", color: "#3a86ff", label: "E4" },
  { freq: 392.0, wave: "sawtooth", color: "#06b6d4", label: "G4" },
  { freq: 440.0, wave: "sine", color: "#00f5d4", label: "A4" },
  { freq: 523.25, wave: "triangle", color: "#7209b7", label: "C5" },
  { freq: 659.25, wave: "square", color: "#b5179e", label: "E5" },
  { freq: 783.99, wave: "sawtooth", color: "#f72585", label: "G5" },
  { freq: 880.0, wave: "sine", color: "#4cc9f0", label: "A5" },
  { freq: 1046.5, wave: "triangle", color: "#80ffdb", label: "C6" },
  { freq: 1318.5, wave: "square", color: "#ffd60a", label: "E6" },
  { freq: 60.0, wave: "sine", color: "#ef233c", label: "KICK" },
];

type Hit = { idx: number; time: number };

export default function BeatsPage() {
  const [bpm, setBpm] = useState(120);
  const [active, setActive] = useState<Set<number>>(new Set());
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);

  const ctxRef = useRef<AudioContext | null>(null);
  const recStartRef = useRef<number>(0);
  const recHitsRef = useRef<Hit[]>([]);
  const playTimers = useRef<number[]>([]);
  const recBpmRef = useRef<number>(120);

  const getCtx = () => {
    if (!ctxRef.current) {
      const W = window as Window & { webkitAudioContext?: typeof AudioContext };
      const Ctor = window.AudioContext ?? W.webkitAudioContext;
      if (Ctor) ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  };

  const flash = useCallback((idx: number) => {
    setActive((prev) => new Set(prev).add(idx));
    window.setTimeout(() => {
      setActive((prev) => {
        const n = new Set(prev);
        n.delete(idx);
        return n;
      });
    }, 180);
  }, []);

  const playPad = useCallback(
    (idx: number, record = false) => {
      const ctx = getCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();
      const pad = PADS[idx];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = pad.wave;
      osc.frequency.value = pad.freq;
      const t = ctx.currentTime;
      const dur = pad.label === "KICK" ? 0.35 : 0.25;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      if (pad.label === "KICK") {
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + dur);
      }
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      flash(idx);
      if (record && recording) {
        recHitsRef.current.push({ idx, time: performance.now() - recStartRef.current });
      }
    },
    [flash, recording],
  );

  const toggleRecord = () => {
    if (recording) {
      setHits([...recHitsRef.current]);
      setRecording(false);
    } else {
      recHitsRef.current = [];
      recStartRef.current = performance.now();
      recBpmRef.current = bpm;
      setHits([]);
      setRecording(true);
    }
  };

  const stopPlayback = useCallback(() => {
    playTimers.current.forEach((id) => window.clearTimeout(id));
    playTimers.current = [];
    setPlaying(false);
  }, []);

  const playLoop = useCallback(() => {
    if (hits.length === 0) return;
    setPlaying(true);
    const scale = recBpmRef.current / bpm;
    const loopLen = (hits[hits.length - 1].time + 200) * scale;
    const schedule = (offset: number) => {
      hits.forEach((h) => {
        const id = window.setTimeout(() => playPad(h.idx, false), offset + h.time * scale);
        playTimers.current.push(id);
      });
      const nextId = window.setTimeout(() => schedule(offset + loopLen), offset + loopLen);
      playTimers.current.push(nextId);
    };
    schedule(0);
  }, [hits, bpm, playPad]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const btn = (bg: string, on: boolean): React.CSSProperties => ({
    background: on ? bg : "#1a1a2e",
    color: on ? "#000" : "#fff",
    border: `2px solid ${bg}`,
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "monospace",
    letterSpacing: 1,
  });

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "system-ui", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <style>{`
        @keyframes padPulse { 0% { transform: scale(1); filter: brightness(1.8); } 100% { transform: scale(1.06); filter: brightness(2.4); } }
        .pad { transition: transform 80ms ease, box-shadow 80ms ease, background 80ms ease; }
        .pad:hover { transform: translateY(-2px); }
        .pad.lit { animation: padPulse 180ms ease-out; }
      `}</style>
      <h1 style={{ fontSize: "2.2rem", margin: 0, background: "linear-gradient(90deg,#ff006e,#3a86ff,#00f5d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 2 }}>
        NEON BEATS · 4×4 PAD
      </h1>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace" }}>
          BPM <input type="range" min={60} max={200} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
          <span style={{ width: 36, color: "#00f5d4" }}>{bpm}</span>
        </label>
        <button onClick={toggleRecord} style={btn("#ff006e", recording)}>{recording ? "■ STOP REC" : "● RECORD"}</button>
        <button onClick={playing ? stopPlayback : playLoop} disabled={hits.length === 0} style={{ ...btn("#00f5d4", playing), opacity: hits.length === 0 ? 0.4 : 1 }}>
          {playing ? "■ STOP" : "▶ LOOP"}
        </button>
        <button onClick={() => { setHits([]); recHitsRef.current = []; }} style={btn("#ffbe0b", false)}>CLEAR</button>
        <span style={{ fontFamily: "monospace", color: "#888" }}>{hits.length} hit{hits.length === 1 ? "" : "s"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 96px)", gridAutoRows: 96, gap: 12 }}>
        {PADS.map((p, i) => {
          const lit = active.has(i);
          return (
            <button
              key={i}
              className={`pad${lit ? " lit" : ""}`}
              onMouseDown={() => playPad(i, true)}
              style={{
                background: lit ? p.color : `linear-gradient(135deg, ${p.color}33, ${p.color}11)`,
                border: `2px solid ${p.color}`,
                borderRadius: 12,
                cursor: "pointer",
                color: lit ? "#000" : p.color,
                fontWeight: 800,
                fontFamily: "monospace",
                fontSize: 14,
                boxShadow: lit ? `0 0 24px ${p.color}, 0 0 48px ${p.color}` : `0 0 8px ${p.color}66`,
                textShadow: lit ? "none" : `0 0 8px ${p.color}`,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <p style={{ color: "#666", fontFamily: "monospace", fontSize: 12, maxWidth: 520, textAlign: "center" }}>
        Click pads to trigger Web Audio oscillators. Hit RECORD then tap a sequence; LOOP replays it scaled to current BPM.
      </p>
    </main>
  );
}
