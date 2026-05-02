# AGENTS.md

## Cursor Cloud specific instructions

This is a minimal Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5 project. There are no databases, external services, or Docker dependencies.

### Running the app

- **Dev server**: `npm run dev` — starts on `http://localhost:3000`
- **Build**: `npm run build`
- **Start (production)**: `npm start`

### Type checking

No ESLint is configured. Use TypeScript strict-mode checking as the lint step:

```bash
npx tsc --noEmit
```

### Node.js

Node.js v22 is installed via nvm. The update script handles `nvm use` automatically. If node is not on PATH in a new shell, source nvm first:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

### Tests

No test framework is configured in the project at this time. Add one (e.g. Vitest, Jest) as needed.
