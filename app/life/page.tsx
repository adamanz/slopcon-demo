"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SIZE = 30;
const CELL_PX = 18;

type Grid = number[][];

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function randomGrid(): Grid {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => (Math.random() < 0.3 ? 1 : 0))
  );
}

function step(grid: Grid): Grid {
  const next = emptyGrid();
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = (y + dy + SIZE) % SIZE;
          const nx = (x + dx + SIZE) % SIZE;
          if (grid[ny][nx] > 0) neighbors++;
        }
      }
      const alive = grid[y][x] > 0;
      if (alive && (neighbors === 2 || neighbors === 3)) {
        next[y][x] = grid[y][x] + 1;
      } else if (!alive && neighbors === 3) {
        next[y][x] = 1;
      } else {
        next[y][x] = 0;
      }
    }
  }
  return next;
}

function ageColor(age: number): string {
  if (age === 0) return "#0e0e10";
  // age 1: bright green, fading through dark green to grey at high ages.
  const a = Math.min(age, 40);
  const t = (a - 1) / 39; // 0..1
  // bright green (60, 255, 120) -> dark green (20, 80, 40) -> grey (90, 90, 90)
  let r: number, g: number, b: number;
  if (t < 0.5) {
    const k = t / 0.5;
    r = Math.round(60 + (20 - 60) * k);
    g = Math.round(255 + (80 - 255) * k);
    b = Math.round(120 + (40 - 120) * k);
  } else {
    const k = (t - 0.5) / 0.5;
    r = Math.round(20 + (90 - 20) * k);
    g = Math.round(80 + (90 - 80) * k);
    b = Math.round(40 + (90 - 40) * k);
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export default function LifePage() {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(10); // steps per second
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    setGrid((g) => step(g));
    setGeneration((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!running) return;
    const loop = (t: number) => {
      const interval = 1000 / speed;
      if (t - lastTickRef.current >= interval) {
        lastTickRef.current = t;
        tick();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running, speed, tick]);

  const toggleCell = (x: number, y: number) => {
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[y][x] = next[y][x] > 0 ? 0 : 1;
      return next;
    });
  };

  const population = useMemo(
    () => grid.reduce((sum, row) => sum + row.reduce((s, v) => s + (v > 0 ? 1 : 0), 0), 0),
    [grid]
  );

  const btn: React.CSSProperties = {
    background: "#1a1a1f",
    color: "#e6e6e6",
    border: "1px solid #2a2a30",
    padding: "0.45rem 0.9rem",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0c",
        color: "#e6e6e6",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 500, letterSpacing: 0.5 }}>Conway&apos;s Game of Life</h1>
      <div style={{ display: "flex", gap: "1.5rem", fontSize: 13, color: "#9aa" }}>
        <span>Generation: <b style={{ color: "#e6e6e6" }}>{generation}</b></span>
        <span>Population: <b style={{ color: "#e6e6e6" }}>{population}</b></span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button style={btn} onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Play"}</button>
        <button style={btn} onClick={() => { if (!running) tick(); }} disabled={running}>Step</button>
        <button style={btn} onClick={() => { setRunning(false); setGrid(emptyGrid()); setGeneration(0); }}>Clear</button>
        <button style={btn} onClick={() => { setGrid(randomGrid()); setGeneration(0); }}>Random</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: 13, color: "#9aa" }}>
        <label htmlFor="speed">Speed:</label>
        <input
          id="speed"
          type="range"
          min={1}
          max={60}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: 200, accentColor: "#3c8" }}
        />
        <span style={{ width: 60, textAlign: "left" }}>{speed} fps</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`,
          gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)`,
          gap: 1,
          background: "#1a1a1f",
          padding: 1,
          borderRadius: 4,
          userSelect: "none",
        }}
      >
        {grid.map((row, y) =>
          row.map((age, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => toggleCell(x, y)}
              style={{
                width: CELL_PX,
                height: CELL_PX,
                background: ageColor(age),
                cursor: "pointer",
                transition: "background 80ms linear",
              }}
              aria-label={`cell ${x},${y} ${age > 0 ? "alive" : "dead"}`}
            />
          ))
        )}
      </div>
      <p style={{ fontSize: 12, color: "#667", maxWidth: 480, textAlign: "center", margin: 0 }}>
        Click cells to toggle. Cells brighten when freshly born and fade through dark green to grey
        as they age. Edges wrap toroidally.
      </p>
    </main>
  );
}
