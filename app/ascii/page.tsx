"use client";

import { useMemo, useState } from "react";

const FONT: Record<string, string[]> = {
  A: ["  #  ", " # # ", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  F: ["#####", "#    ", "#### ", "#    ", "#    "],
  G: [" ####", "#    ", "#  ##", "#   #", " ####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "    #", "    #", "#   #", " ### "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "#   #", "#  # ", " ## #"],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", " ### "],
  "2": [" ### ", "#   #", "   # ", "  #  ", "#####"],
  "3": ["#### ", "    #", " ### ", "    #", "#### "],
  "4": ["#  # ", "#  # ", "#####", "   # ", "   # "],
  "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ### ", "#    ", "#### ", "#   #", " ### "],
  "7": ["#####", "    #", "   # ", "  #  ", " #   "],
  "8": [" ### ", "#   #", " ### ", "#   #", " ### "],
  "9": [" ### ", "#   #", " ####", "    #", " ### "],
  "!": ["  #  ", "  #  ", "  #  ", "     ", "  #  "],
  "?": [" ### ", "#   #", "  ## ", "     ", "  #  "],
  ".": ["     ", "     ", "     ", "     ", "  #  "],
  ",": ["     ", "     ", "     ", "  #  ", " #   "],
  "'": ["  #  ", "  #  ", "     ", "     ", "     "],
  "-": ["     ", "     ", " ### ", "     ", "     "],
  "+": ["     ", "  #  ", " ### ", "  #  ", "     "],
  " ": ["     ", "     ", "     ", "     ", "     "],
};

function renderAscii(input: string): string {
  const rows = ["", "", "", "", ""];
  for (const ch of input.toUpperCase()) {
    const glyph = FONT[ch] ?? FONT[" "];
    for (let r = 0; r < 5; r++) rows[r] += glyph[r].replace(/#/g, "█") + " ";
  }
  return rows.join("\n");
}

export default function AsciiPage() {
  const [text, setText] = useState("HELLO");
  const [copied, setCopied] = useState(false);
  const ascii = useMemo(() => renderAscii(text || " "), [text]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ascii);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#33ff66",
        fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 0.25rem", textShadow: "0 0 8px #33ff66" }}>
          {"> ASCII_ART.EXE"}
        </h1>
        <p style={{ opacity: 0.7, marginTop: 0 }}>
          Type below. Letters are rendered as block-letter ASCII art.
        </p>

        <label style={{ display: "block", marginTop: "1rem" }}>
          <span style={{ display: "block", marginBottom: 6 }}>INPUT:</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="type something..."
            maxLength={20}
            style={{
              width: "100%",
              background: "#000",
              color: "#33ff66",
              border: "1px solid #33ff66",
              padding: "0.6rem 0.8rem",
              fontFamily: "inherit",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "0 0 8px rgba(51,255,102,0.4) inset",
              boxSizing: "border-box",
            }}
          />
        </label>

        <button
          onClick={handleCopy}
          style={{
            marginTop: "1rem",
            background: "#000",
            color: "#33ff66",
            border: "1px solid #33ff66",
            padding: "0.5rem 1rem",
            fontFamily: "inherit",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          {copied ? "✓ copied" : "copy to clipboard"}
        </button>

        <pre
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            border: "1px solid #33ff66",
            background: "rgba(51,255,102,0.05)",
            overflowX: "auto",
            fontSize: "0.75rem",
            lineHeight: 1.05,
            textShadow: "0 0 4px #33ff66",
          }}
        >
          {ascii}
        </pre>
      </div>
    </main>
  );
}
