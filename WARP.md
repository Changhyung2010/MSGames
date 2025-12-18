# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project type
- Vite + React + TypeScript single-page app.
- Linting via ESLint “flat config” (`eslint.config.js`).

## Common commands
This repo includes `package-lock.json`, so prefer npm.

- Install dependencies (clean):
  - `npm ci`
- Start dev server (HMR):
  - `npm run dev`
- Production build (typecheck + Vite build):
  - `npm run build`
  - Note: runs `tsc -b` first, then `vite build`.
- Typecheck only (no Vite build):
  - `npx tsc -b`
- Preview the production build locally:
  - `npm run preview`
- Lint:
  - `npm run lint`
  - Lint a single file/folder:
    - `npx eslint src/minesweeper/game.ts`

Tests
- No test runner is configured yet (no `test` script in `package.json`).

## High-level architecture
### Entry points
- `index.html` mounts the app at `#root` and loads `src/main.tsx`.
- `src/main.tsx` creates the React root and renders `<App />` inside `React.StrictMode`.
- `src/App.tsx` is a thin wrapper that renders the minesweeper UI (`<MinesweeperGame />`).

### Minesweeper feature module (`src/minesweeper/`)
- `MinesweeperGame.tsx`: UI/interaction layer.
  - Renders the header/status, a CSS grid board, and the reset button.
  - Left click calls `reveal()`; right click (context menu) calls `toggleFlag()`.
- `useMinesweeper.ts`: game state hook.
  - Holds `{ config, board, status }` and exposes `reset`, `reveal`, and `toggleFlag`.
  - On the first reveal (status `ready`), it creates the board using a “safe first click” (see `createBoard(..., { safeCoord, safeRadius: 1 })`).
- `game.ts`: pure game engine utilities/types.
  - Board representation: `Board = Cell[][]`, where each `Cell` tracks `{ row, col, isMine, adjacentMines, state }`.
  - Core operations: `createBoard`, `revealAt` (BFS flood-fill for 0-adjacent cells), `toggleFlagAt`, and various counters.
- Styling lives alongside the module (`minesweeper.css`) and is imported by `MinesweeperGame.tsx`.

### Build / toolchain structure
- TypeScript uses project references:
  - `tsconfig.json` references `tsconfig.app.json` (app code under `src/`) and `tsconfig.node.json` (tooling like `vite.config.ts`).
- Vite configuration lives in `vite.config.ts` and uses `@vitejs/plugin-react`.

### Assets & output
- Static assets:
  - `public/` for files served as-is at the site root.
  - `src/assets/` for assets imported from code.
- `dist/` is the Vite production build output (generated).
