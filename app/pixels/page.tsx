"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const GRID = 16;
const PIXEL_SIZE = 28;
const PREVIEW_SCALE = 8;
const ERASER = "" as const;

const PALETTE = [
  "#ff2d95", "#ff6ec7", "#ff8a00", "#ffe600",
  "#39ff14", "#00ffa3", "#00e5ff", "#1fa2ff",
  "#7c4dff", "#b026ff", "#ff3860", "#ffffff",
];

type Cell = string;

function makeEmpty(): Cell[] {
  return Array<Cell>(GRID * GRID).fill(ERASER);
}

export default function PixelsPage() {
  const [pixels, setPixels] = useState<Cell[]>(makeEmpty);
  const [color, setColor] = useState<string>(PALETTE[0]);
  const [erasing, setErasing] = useState(false);
  const [painting, setPainting] = useState(false);
  const previewRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cnv = previewRef.current;
    if (!cnv) return;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#0b0b18";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const c = pixels[y * GRID + x];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(x * PREVIEW_SCALE, y * PREVIEW_SCALE, PREVIEW_SCALE, PREVIEW_SCALE);
      }
    }
  }, [pixels]);

  const paintAt = (i: number) => {
    setPixels((prev) => {
      const next = prev.slice();
      next[i] = erasing ? ERASER : color;
      return next;
    });
  };

  const handleClear = () => setPixels(makeEmpty());

  const handleExport = () => {
    const cnv = document.createElement("canvas");
    cnv.width = GRID;
    cnv.height = GRID;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const c = pixels[y * GRID + x];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    const url = cnv.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `pixel-art-${Date.now()}.png`;
    a.click();
  };

  const cellStyle = (c: Cell): CSSProperties => ({
    width: PIXEL_SIZE, height: PIXEL_SIZE,
    background: c || "#0b0b18", cursor: "crosshair",
  });
  const swatchStyle = (c: string, active: boolean): CSSProperties => ({
    width: 32, height: 32, background: c, borderRadius: 6, cursor: "pointer",
    border: active ? "2px solid #fff" : "2px solid transparent",
    boxShadow: active ? `0 0 12px ${c}, 0 0 24px ${c}` : `0 0 6px ${c}80`,
    transition: "transform 80ms ease",
    transform: active ? "scale(1.08)" : "scale(1)",
  });
  const btnStyle = (accent: string, active = false): CSSProperties => ({
    padding: "10px 14px", borderRadius: 8, cursor: "pointer",
    background: active ? accent : "transparent",
    color: active ? "#0b0b18" : accent,
    border: `1px solid ${accent}`,
    fontFamily: "inherit", fontWeight: 700, letterSpacing: 1.5, fontSize: 12,
    boxShadow: `0 0 10px ${accent}55`,
  });

  const styles = {
    page: {
      minHeight: "100vh",
      background: "radial-gradient(circle at 20% 10%, #1a0033 0%, #04040c 60%, #000 100%)",
      color: "#e6e6ff",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      padding: "32px 24px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
    },
    title: {
      fontSize: 32, letterSpacing: 4, margin: 0,
      color: "#fff",
      textShadow: "0 0 8px #ff2d95, 0 0 16px #7c4dff, 0 0 32px #00e5ff",
    },
    subtitle: { margin: 0, color: "#a0a0c8", fontSize: 13, letterSpacing: 1 },
    workspace: { display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" },
    canvasShell: {
      padding: 8, background: "#0b0b18",
      border: "1px solid #2a2a4a",
      borderRadius: 12,
      boxShadow: "0 0 24px rgba(124,77,255,0.35), inset 0 0 12px rgba(0,229,255,0.15)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${GRID}, ${PIXEL_SIZE}px)`,
      gridTemplateRows: `repeat(${GRID}, ${PIXEL_SIZE}px)`,
      gap: 1, background: "#1a1a2e", padding: 1, borderRadius: 4,
      userSelect: "none", touchAction: "none",
    },
    sidebar: { display: "flex", flexDirection: "column", gap: 20, minWidth: 220 },
    sectionLabel: { fontSize: 11, letterSpacing: 2, color: "#8a8ab8", margin: 0 },
    palette: { display: "grid", gridTemplateColumns: "repeat(6, 32px)", gap: 8 },
    previewWrap: {
      padding: 12, borderRadius: 12, background: "#0b0b18",
      border: "1px solid #2a2a4a",
      boxShadow: "0 0 18px rgba(0,229,255,0.25)",
      display: "flex", flexDirection: "column", gap: 8, alignItems: "center",
    },
  } satisfies Record<string, CSSProperties>;

  const stopPaint = () => setPainting(false);

  return (
    <main style={styles.page} onMouseUp={stopPaint} onMouseLeave={stopPaint}>
      <h1 style={styles.title}>NEON PIXELS</h1>
      <p style={styles.subtitle}>16 × 16 // click & drag to paint</p>

      <div style={styles.workspace}>
        <div style={styles.canvasShell}>
          <div style={styles.grid}>
            {pixels.map((c, i) => (
              <div
                key={i}
                style={cellStyle(c)}
                onMouseDown={() => { setPainting(true); paintAt(i); }}
                onMouseEnter={() => { if (painting) paintAt(i); }}
              />
            ))}
          </div>
        </div>

        <div style={styles.sidebar}>
          <div>
            <p style={styles.sectionLabel}>PALETTE</p>
            <div style={{ ...styles.palette, marginTop: 8 }}>
              {PALETTE.map((c) => (
                <div
                  key={c}
                  title={c}
                  style={swatchStyle(c, !erasing && color === c)}
                  onClick={() => { setColor(c); setErasing(false); }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={styles.sectionLabel}>TOOLS</p>
            <button style={btnStyle("#00e5ff", erasing)} onClick={() => setErasing((e) => !e)}>
              {erasing ? "ERASER ON" : "ERASER"}
            </button>
            <button style={btnStyle("#ff2d95")} onClick={handleClear}>CLEAR</button>
            <button style={btnStyle("#39ff14")} onClick={handleExport}>EXPORT AS PNG</button>
          </div>

          <div style={styles.previewWrap}>
            <p style={styles.sectionLabel}>LIVE PREVIEW</p>
            <canvas
              ref={previewRef}
              width={GRID * PREVIEW_SCALE}
              height={GRID * PREVIEW_SCALE}
              style={{ width: 128, height: 128, imageRendering: "pixelated", borderRadius: 4 }}
            />
            <p style={{ ...styles.subtitle, fontSize: 10 }}>actual export: {GRID}×{GRID}px</p>
          </div>
        </div>
      </div>
    </main>
  );
}
