# Agents Guide

This repo is a live demo target for Slop Con NYC (May 2, 2026). Cloud agents open PRs against it during the presentation.

## What this repo is

A minimal Next.js 16 app (App Router, TypeScript). The starter is intentionally bare — agents are expected to add features, pages, and tests as standalone PRs.

## Rules for agents working here

- Keep each PR focused on ONE attendee's project idea. Don't combine work across ideas.
- All new pages go under `app/`. Use the App Router (`page.tsx`, `layout.tsx`). No Pages Router.
- Ship runnable code, not perfect code. This is a hackathon demo — working > polished.
- Stay under 200 lines per PR. If the idea is big, build the smallest useful slice.
- Add a short README section or inline comments explaining what the feature does and how to run it.
- Don't touch other agents' work. Each PR should be independently mergeable.
- Use `npm run dev` to verify the app still starts. Don't break the existing layout.
- No secrets, API keys, or credentials in code. Use environment variables if needed and document them in README.
- Prefer inline styles or Tailwind (if installed) over CSS modules for speed.
- TypeScript strict mode is on. Don't use `any` or `@ts-ignore`.
