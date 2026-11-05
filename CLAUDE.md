# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ARCADE VAULT: a retro arcade game portal (play online, compete for high scores). The product spec lives in [prompt-arcade-vault.md](prompt-arcade-vault.md) and is the source of truth for intended features. The README says the project follows spec-driven development (`/spec`, `/spec-impl` skills from `Klerith/fernando-skills`).

Key spec constraints (the codebase is still the bare `create-next-app` scaffold, so none of this is implemented yet):
- **All UI text must be in Spanish** (e.g. "JUGAR", "SALÓN DE LA FAMA", "PUNTUACIÓN GUARDADA").
- Theme: background `#0a0a0f`, neon cyan `#00f5ff`, magenta `#ff006e`, yellow `#f5ff00`; fonts "Press Start 2P" (headings) + "Courier Prime" (body).
- Planned screens: game library, game detail + leaderboard, player (sandboxed iframe in a CRT bezel), auth, Hall of Fame.
- Guest scores go to localStorage; authenticated scores are meant to go to a backend (REST or Supabase), not yet chosen.

## Architecture

- Next.js 16.4.5 App Router, React 19, TypeScript, Tailwind CSS v4 (via `@import "tailwindcss"` in [app/globals.css](app/globals.css) and `@theme inline` tokens; no tailwind config file).
- Routes live in `app/`; path alias `@/*` maps to the repo root.
- **This Next.js version has breaking changes from what you may know.** Per [AGENTS.md](AGENTS.md), read the relevant guide in `node_modules/next/dist/docs/` (sections `01-app`, `02-pages`, `03-architecture`, `04-community`) before writing Next.js code, and heed deprecation notices.
- `resources/` (untracked) holds reference templates; `__MACOSX/` is archive junk.

## Skills

- Always use `/frontend-design` skill to design user interfaces.