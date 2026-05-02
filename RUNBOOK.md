# Slop Con — 20-Min Runbook

**You = Cursor at the Lunch & Learn slot.** Thesis: *Cursor employees are slop cannons too. Here's what changes when every prompt becomes a fleet.*

Three demos, ordered by reliability. Demo 1 alone carries the talk.

---

## RIGHT-NOW PREP (5 min, do this first)

Run in order. Each step is a checkbox.

- [ ] **Shell env** in the terminal you'll demo from:
  ```bash
  export CURSOR_API_KEY="cursor_..."   # user key, NOT team key. dashboard > API keys
  echo $CURSOR_API_KEY | head -c 12     # sanity check, expect cursor_xxxx
  ```
- [ ] **Sample repo open in Cursor** — one with a real-but-tiny task (a flaky test, an obvious refactor, a missing README). If you have nothing handy: `gh repo clone <your-username>/scratch && cursor scratch`. Worst case, use the repo you're already in.
- [ ] **Models pre-warmed** — open Cursor settings > Models. Confirm enabled: `composer-2`, `gpt-5.5`, `claude-4.6-sonnet`, `gemini-3.1-pro`. Best-of-N picks from this list.
- [ ] **Browser tabs, in this order** (cmd-1..4):
  1. `https://cursor.com/dashboard/cloud-agents` (signed in)
  2. The GitHub repo you'll target
  3. Slack workspace with `@Cursor` already invited to a channel
  4. This runbook (you'll glance, not read)
- [ ] **Pre-bake fallback PR** — kick off ONE cloud agent right now from the dashboard with prompt `add a CHANGELOG.md noting today is Slop Con` against your scratch repo. If everything dies live, you screenshot the resulting PR.
- [ ] **Font size** — Cursor: cmd-+ five times. Terminal: cmd-+ five times. Browser: cmd-+ three times. Audience can't read your normal size.
- [ ] **Quiet mode** — close Slack DMs, mute notifications except the demo channel. Quit anything that pings.

If you have only 15 min of prep, stop after font size. Skip pre-bake — the punt phrases below cover you.

---

## DRY RUN (10 min, if you have it)

Run each demo block once exactly as written below. If a block fails on dry run, swap it for the fallback now, before stage. Don't fix bugs — just route around them.

---

## TALK STRUCTURE (20 min)

| Block | Time | Form |
|---|---|---|
| Hook + thesis | 2 min | Talk, no slides |
| Demo 1: best-of-n inside Cursor | 4 min | Live |
| Demo 2: parallel worktrees | 5 min | Live |
| Demo 3: SDK fleet against the attendee list | 6 min | Live |
| Close + 1 takeaway | 3 min | Talk |

If you're at 15 min talk-time only: cut Demo 2.
If a demo dies on stage: punt it (phrases below) and skip to next.

---

## OPENING (2 min, no slides)

> "Show of hands — who shipped something to prod this week using an AI agent? ... Now who shipped 5 things in parallel? That's the gap. I'm at Cursor. We don't write code one prompt at a time anymore — we run fleets. I'm going to show you three ways we do that, and the last one uses your registration data."

That's the whole open. Land it and go to the demo.

---

## DEMO 1 — `/best-of-n` (most reliable, lead with this)

**Goal:** show 4 frontier models race the same task, side-by-side, in 60 seconds.

### Setup
Cursor open, sample repo, one file open with a real-but-small task (e.g., "this function has a bug" or "rewrite this in idiomatic style").

### Run
1. Open chat panel.
2. Type: `/best-of-n` and pick 4 models when prompted: `composer-2`, `gpt-5.5`, `claude-4.6-sonnet`, `gemini-3.1-pro`.
3. Prompt: `Find and fix the bug in <file>. Add a regression test.`
4. Hit enter.

### Look for
Four agent tabs spawn at once in the Agents Window. Each shows a worktree branch like `agent/best-of-n-1`, `-2`, etc. Within ~30s, diffs start appearing in each tab. Within ~90s, all four have proposed solutions.

### Talking points while it runs
- "Each model gets its own git worktree — same `.git`, isolated working dirs, zero merge conflict risk."
- "I'm not picking the best model upfront. I'm letting them compete and picking the winner."
- "This is the unlock: the cost of attempts went to zero, so attempt more."

### Land it
Click into 2 of the 4 tabs, show the diffs differ. Pick a winner, click Accept on its worktree. *"That's the slop cannon move — N attempts, pick one, ship."*

### Fallback
If `/best-of-n` errors or models aren't enabled: open a pre-baked screenshot of the Agents Window with 4 worktrees. Say *"Here's what it looks like when it's running — I ran this earlier. Four models, four diffs, pick one."* Move on.

### Punt phrase
> "This is the live nature of slop — even the demo wants to be best-of-N. Let me show you the recording." [switch to screenshot]

---

## DEMO 2 — `/worktree` for parallel feature work (riskier, has setup)

**Goal:** show 3 agents working on different parts of the SAME feature simultaneously.

### Setup
Same repo. Pick a feature with 3 separable concerns (e.g., "add a /health endpoint": route, test, docs).

### Run
1. In chat: `/worktree` × 3 (or `/worktree 3`).
2. Prompt agent 1: `Add a /health endpoint that returns {status: "ok"}. Touch only the route file.`
3. Prompt agent 2: `Add an integration test for /health. Touch only the test file.`
4. Prompt agent 3: `Add a docs section for /health. Touch only the README.`

### Look for
Three tabs in the Agents Window. Each works in its own branch. Diffs show non-overlapping files. After all three finish, you click each → Accept → and the working tree is now consistent.

### Talking points
- "Worktrees aren't branches you switch between. They're parallel checkouts of the same repo. Three agents, three branches, three working dirs, one `.git`."
- "Cursor merges 39% more PRs after teams adopt this. Not because the agents got smarter — because devs stopped serializing work."

### Fallback
If any agent collides or stalls: drop one, say *"Two of three is plenty"* and continue. If all stall: skip to Demo 3.

### Punt phrase
> "Worktrees take 5 seconds to spawn and zero seconds to forget about. Let me show you the version that actually scares me." [go to Demo 3]

### CUT THIS DEMO IF
- You're under 15 min total
- Demo 1 took >5 min
- Audience reaction to Demo 1 was already "wow"

---

## DEMO 3 — SDK fleet against the attendee list (highest wow, highest risk)

**Goal:** spawn N cloud agents from a script, each working on a real attendee's project idea. They're sitting in the room.

### Setup (do this in prep, NOT live)
1. Confirm `bun` installed: `bun --version`. If not: `curl -fsSL https://bun.sh/install | bash`.
2. Confirm script exists at `~/Downloads/slop-fleet.ts` (it does — written next to this runbook).
3. Set `SLOP_REPO` env var to a GitHub repo your `CURSOR_API_KEY` can access (a scratch repo is fine):
   ```bash
   export SLOP_REPO="your-username/scratch"
   ```
4. **Dry-run with N=1 first:**
   ```bash
   cd ~/Downloads && bun slop-fleet.ts --n 1 --dry
   ```
   Expect: prints 1 attendee name + project idea. No network calls. Confirms CSV parses.
5. **Real dry-run with N=2:**
   ```bash
   bun slop-fleet.ts --n 2
   ```
   Expect: 2 cloud agents start, prints `agent=bc-...` and `run=...` for each. Open dashboard tab — see both. Cancel them from the dashboard if you want to save quota.

### Run live
```bash
bun ~/Downloads/slop-fleet.ts --n 5
```

### Look for
Terminal prints 5 lines like `[Nancy] agent=bc-abc123 run=run-xyz | "Strava for walking"`. Then the script auto-opens the dashboard tab. The dashboard shows 5 agents in `running` state.

### Talking points while it runs
- "I just read the registration CSV. Picked five of you with great project ideas. Each one now has a cloud agent prototyping it as we speak."
- "This is `@cursor/sdk`. Same SDK that powers our internal automations — PR review bots, migration runners, security scanners."
- "The repo each agent works on is a Next.js starter. They'll open PRs against it. By the end of this talk, five of you have a prototype waiting."

### Land it
Click into one agent on the dashboard. Show the live tool calls / file edits streaming. Say *"This is what 5x leverage looks like — and the script is 40 lines."*

### Fallback ladder (in order)
1. **Auth fails (401):** *"Wrong key, classic slop. Let me show you yesterday's run."* → switch to dashboard tab, pick any recent cloud agent, walk through it.
2. **CSV parse fails:** drop `--n` to 1, re-run with hardcoded prompt: `bun slop-fleet.ts --n 1 --prompt "Add a CHANGELOG.md"`
3. **No GitHub creds for repo:** add `--local` flag (script supports it) — runs against current cwd, no PR. Less wow, still works.
4. **Total fail:** open the pre-baked PR from prep step. *"Here's one I baked earlier."*

### Punt phrase
> "This is exactly why slop cannons keep a fallback PR in their back pocket. Watch this." [open the pre-baked PR tab]

### CUT THIS DEMO IF
- Demo 1 + Demo 2 already ate 14 min
- Cloud agents are clearly degraded (check dashboard before talk)

---

## CLOSING (3 min, no slides)

One slide max — a single line:

> **The slop cannon stack: best-of-N for decisions, worktrees for tasks, SDK for fleets.**

Then talk:
- "Three things to take home. One: if you're prompting one agent at a time in 2026, you're leaving the leverage on the table. Two: the bottleneck isn't the model anymore, it's how many you can run in parallel. Three: every one of those agents I just spawned is still working. Check your project idea on the dashboard after this talk — there might be a PR waiting for you."
- "We're hiring slop cannons. Come find me at lunch."

Done.

---

## MINIMUM VIABLE PATH (if everything is on fire)

If you have 15 min of prep and zero dry run:
1. Skip Demo 3 entirely. The SDK demo is the highest-risk by far.
2. Run Demo 1 only. Talk for 4 min before, 4 min during, 4 min after.
3. Open: thesis (2 min). Demo 1 (8 min, take your time). Talk through the SDK + worktree concepts on the dashboard tab without running them (5 min). Close (1 min).
4. The dashboard alone is a great visual — pull up the cloud agents page and walk through any 2-3 recent ones. *"Here's what we ran this week internally."*

---

## PUNT PHRASE LIBRARY

For any demo death, in increasing severity:
1. *"That's the live nature of slop."* (small hiccup)
2. *"And this is exactly why we keep a fallback PR in our back pocket."* (switch to baked artifact)
3. *"Let me let that cook in the background and come back to it."* (defer, don't lose the room)
4. *"The slop cannon's first rule: ship the recording when the demo dies."* (full pivot to screenshots)
5. *"I'm going to do the most slop cannon thing possible — improvise."* (talk through what would have happened)

---

## RESOURCES (for your own reference, NOT to read on stage)

- SDK docs: `https://cursor.com/docs/api/sdk/typescript`
- Cloud agents dashboard: `https://cursor.com/dashboard/cloud-agents`
- Slack docs: `https://cursor.com/docs/integrations/slack`
- Worktrees docs: `https://cursor.com/docs/configuration/worktrees`

---

## TIMING SANITY CHECK

- Now: ~11:55 AM
- Lunch & Learn starts: 12:30 PM
- Your slot is one of three (~20 min each), so you're on at 12:30, 12:50, OR 13:10
- Walk to venue: ?
- Hard deadline to finish prep: 12:20 PM

If it's 12:15 and you haven't finished the dry run: **stop dry-running, do the talk on Demo 1 only.** It's the bulletproof one.
