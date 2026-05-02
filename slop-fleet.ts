#!/usr/bin/env bun
/**
 * slop-fleet.ts — spawn N Cursor cloud agents, one per Slop Con attendee idea.
 *
 * Run: bun slop-fleet.ts --n 5
 * Dry: bun slop-fleet.ts --n 5 --dry        (parses CSV, no network)
 * Local: bun slop-fleet.ts --n 3 --local    (runs against cwd, no GitHub repo needed)
 * Custom prompt: bun slop-fleet.ts --n 1 --prompt "Add a CHANGELOG.md"
 *
 * Env:
 *   CURSOR_API_KEY  required (user key, not team key)
 *   SLOP_REPO       e.g. "your-username/scratch" — required unless --local or --dry
 *   SLOP_CSV        path to attendee CSV (default: the file next to this script)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return process.argv.includes(`--${name}`) ? "true" : fallback;
  return process.argv[i + 1] ?? "true";
}
const flag = (name: string) => process.argv.includes(`--${name}`);

const N = parseInt(arg("n", "3")!, 10);
const DRY = flag("dry");
const LOCAL = flag("local");
const CUSTOM_PROMPT = arg("prompt");
const CSV_PATH = process.env.SLOP_CSV ?? findCsv();
const REPO = process.env.SLOP_REPO ?? "adamanz/slopcon-demo";

function findCsv(): string {
  const candidates = readdirSync(HERE).filter((f) => f.endsWith(".csv"));
  if (candidates.length === 0) {
    console.error("No CSV found next to script. Set SLOP_CSV=/path/to/attendees.csv");
    process.exit(1);
  }
  return join(HERE, candidates[0]);
}

// Tiny CSV parser — handles quoted fields with embedded newlines/commas.
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") {}
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows;
  return data.filter((r) => r.length === header.length).map((r) =>
    Object.fromEntries(header.map((h, i) => [h.trim(), r[i]?.trim() ?? ""])),
  );
}

const IDEAS_COL = "What are two projects you want to build with AI?";
const NAME_COL = "first_name";

function pickAttendees(rows: Record<string, string>[], n: number) {
  const candidates = rows.filter((r) => {
    const idea = r[IDEAS_COL];
    return idea && idea.length > 30 && !/judging|photos|sponsor/i.test(idea);
  });
  // Stable shuffle so each run is different but reproducible per seed.
  const seed = Date.now() % 1000;
  return candidates
    .map((r, i) => ({ r, k: (i * 9301 + seed * 49297) % 233280 }))
    .sort((a, b) => a.k - b.k)
    .slice(0, n)
    .map(({ r }) => r);
}

function buildPrompt(idea: string): string {
  return [
    "You're a Slop Con TA. An attendee wants to build the project below.",
    "Make a minimal working prototype in this repo.",
    "1. Create a single-page Next.js app under app/ that demonstrates the core idea.",
    "2. Add a README explaining what it does and how to run it.",
    "3. Keep it under 200 lines total. Ship something runnable, not perfect.",
    "",
    "Attendee idea:",
    idea,
  ].join("\n");
}

async function main() {
  if (!process.env.CURSOR_API_KEY && !DRY) {
    console.error("Set CURSOR_API_KEY (user key, not team key).");
    process.exit(1);
  }
  if (!LOCAL && !DRY && !REPO) {
    console.error('Set SLOP_REPO="your-username/repo" or pass --local or --dry.');
    process.exit(1);
  }

  const csv = parseCsv(readFileSync(CSV_PATH, "utf8"));
  const picks = pickAttendees(csv, N);

  console.log(`\nSlop Fleet — spawning ${picks.length} agents (csv=${CSV_PATH})`);
  console.log("─".repeat(72));

  if (DRY) {
    for (const p of picks) {
      const idea = (p[IDEAS_COL] ?? "").slice(0, 100).replace(/\n+/g, " ");
      console.log(`[${p[NAME_COL]}] ${idea}…`);
    }
    console.log("\n[dry] no network calls made.");
    return;
  }

  const { Agent, CursorAgentError } = await import("@cursor/sdk");

  const startedAt = Date.now();
  const results = await Promise.allSettled(
    picks.map(async (p) => {
      const idea = CUSTOM_PROMPT ?? p[IDEAS_COL];
      const prompt = CUSTOM_PROMPT ?? buildPrompt(idea);
      const opts = LOCAL
        ? { local: { cwd: process.cwd() }, model: { id: "composer-2" as const } }
        : {
            cloud: {
              repos: [{ url: `https://github.com/${REPO}` }],
              autoCreatePR: true,
              skipReviewerRequest: true,
            },
            model: { id: "composer-2" as const },
          };
      const agent = Agent.create({ apiKey: process.env.CURSOR_API_KEY!, ...opts });
      try {
        const run = await agent.send(prompt);
        const tag = idea.slice(0, 60).replace(/\n+/g, " ");
        console.log(`[${p[NAME_COL]}] agent=${agent.agentId} run=${run.id} | "${tag}…"`);
        return { name: p[NAME_COL], agentId: agent.agentId, runId: run.id };
      } catch (err) {
        if (err instanceof CursorAgentError) {
          console.error(`[${p[NAME_COL]}] startup failed: ${err.message} (retryable=${err.isRetryable})`);
        }
        throw err;
      }
    }),
  );

  const ok = results.filter((r) => r.status === "fulfilled").length;
  const ms = Date.now() - startedAt;
  console.log("─".repeat(72));
  console.log(`Spawned ${ok}/${picks.length} agents in ${(ms / 1000).toFixed(1)}s`);
  console.log("\nDashboard: https://cursor.com/dashboard/cloud-agents\n");

  // Fire-and-forget: don't await wait(). Demo wants the spawn moment, not the finish.
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
