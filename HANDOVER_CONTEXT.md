# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-06T12:32 (Session 5eeef88f)

## Project Status: LIVE (Under Construction)

Under-construction holding page for `maschke.ai`. Fullscreen terminal experience with scripted boot sequence, limited Mistral AI chat (5 messages/session), and astronaut mascot Yori.

**Live URL:** https://maschkeai-uc.pages.dev/
**GitHub:** https://github.com/MSCHKY/maschkeai-uc

## Architecture

| Component | File | Status |
|-----------|------|--------|
| HTML Shell | `index.html` | ✅ Done (+ astronaut overlay + debug panel) |
| Main Orchestrator | `src/main.ts` | ✅ Done (Easter Eggs, astronaut, click-to-fall, AI text formatting) |
| Terminal CSS | `src/style.css` | ✅ Done (1:1 from main project + astronaut + AI text styles) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (NEXUS OS v4.0.2, German) |
| Commands | `src/commands.ts` | ✅ Done (hilfe, Easter Eggs, aliases, fixed box alignment) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, full system prompt) |
| Legal Content | `src/legal.ts` | ✅ Done (full address filled in) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall sprites) |
| Workflows | `.agent/workflows/` | ✅ session-start + session-end |

## Astronaut Yori

**Pixel mascot from main project, fully integrated:**
- **Sprite sheets:** `sprite-256px-9.png` (idle, 3×3 grid), `sprite_fall-256px-9.png` (fall, 3×3 grid)
- **Position:** CSS custom properties (`--astroX`, `--astroY`, `--astroScale`, `--astroBubbleX/Y`)
  - Desktop: X:-52px Y:-26px S:61%
  - Mobile (≤768px): X:-21px Y:-22px S:51%
- **Speech Bubbles:** 22 rotating lines in 3 categories (10s visible, 15s hidden):
  - **Baustellenhumor** (8): "Noch 99 Bugs…", "Coming Soon*ish", etc.
  - **Tech-Redewendungen** (10): "Des Devs Website ist immer UC", "In der Latenz liegt die Kraft", "Viele Prompts verderben den Output", etc.
  - **Easter-Egg-Hints** (4): "Tippe mal hilfe", "Was passiert bei sudo?", etc.
- **Click-to-Fall Easter Egg:** Click Yori → fall animation + red warning bubble ("NICHT ANFASSEN!!!", etc.) — 1:1 from `useAstronaut.ts`
- **Debug Panel:** `?debug=1` URL param shows live sliders for position tuning (matching `AstronautControls.tsx` pattern)

## AI Text Rendering

**`formatAiText()` in `main.ts` processes AI responses during streaming:**
- `**bold**` → `<strong>bold</strong>` (rendered as bold text)
- `` `command` `` → clickable `.cmd-chip` span (executes command on click)
- HTML-escaped first to prevent XSS
- Applied on each streaming chunk for live formatting

## Design System

**All CSS variables are 1:1 from the main `maschkeai-chatbot` project:**
- `--terminal-ink`, `--terminal-sub`, `--terminal-accent`, `--terminal-grad`
- SF Mono system font stack, `font-weight: 600`, `line-height: 1.35`
- NexusAscii 2-layer system (solid + dither) with animated gradient (8s scroll)
- VHS scan-line tear glitch (clip-path clones, 8s interval, 2 bursts per cycle — **amplified**)
- Light/Dark mode via `[data-theme="dark"]` with `localStorage` persistence
- Astronaut bubble styling 1:1 from main project's `.astro-bubble`

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (§5 DDG). Terminal commands are a bonus, not a replacement.
2. **Same Mistral API key** as main project — set as `MISTRAL_API_KEY` env var on Cloudflare Pages.
3. **Deploys auto-trigger** on push to `main` branch via Cloudflare Pages Git integration.
4. **Reuse before recreate**: Always check main `maschkeai-chatbot` project for existing patterns, CSS, and logic before building new ones.

## Completed Tasks

### ✅ P1: Boot Sequence + Commands (Session 0639df28)
- Boot: NEXUS OS v4.0.2 with German BOOT lines (Secure Shell, Uplink, Protokoll-Stack)
- Commands: `hilfe` as primary (with `help` alias), all German labels
- Easter Eggs: ping, sudo, stats, matrix, secret, hack (animated)
- Alias system for flexible command mapping

### ✅ P2: GitHub Repo + Cloudflare Pages (Session 0639df28)
- GitHub: `MSCHKY/maschkeai-uc` (public)
- Cloudflare Pages: `maschkeai-uc.pages.dev` (Global, auto-deploy from main)
- `MISTRAL_API_KEY` set as production env var
- AI Chat verified working on production

### ✅ P3: Impressum Addresses (Session f51f758a)
- Full address: Kirchstr. 7, 52391 Vettweiß, Deutschland
- Updated in both HTML overlay (`IMPRESSUM_CONTENT`) and terminal ASCII (`IMPRESSUM_TERMINAL`)

### ✅ P4: Visual Polish + Astronaut (Session f51f758a)
- VHS glitch effect amplified (2 bursts per cycle, stronger shifts up to 22px, higher opacity)
- Astronaut Yori integrated with idle animation, speech bubbles, click-to-fall
- Position pixel-tuned via debug panel (Desktop + Mobile values locked in)
- Theme toggle verified (dark/light/auto)
- Mobile responsiveness verified

### ✅ P5: Terminal Content & System Prompt (Session 5eeef88f)
- **System Prompt**: Complete rewrite for UC context — "Early Access" NEXUS identity
  - Sections: Kontext, Voice, Format, Antwortlänge, Kern-Wissen, Strategie, UC-Bewusstsein, Guardrails
  - 5-message funnel: Neugier → Kompetenz → Konkret → E-Mail CTA
  - Teaser-level knowledge (services without prices, kontakt@maschke.ai as only CTA)
  - Full guardrails matching main site (prompt protection, no code, context lock, role integrity)
- **AI Text Rendering**: `formatAiText()` renders `**bold**` and `` `commands` `` live during streaming
- **Yori Sprüche**: Expanded from 11 to 22 — tech-remixed German proverbs ("Guter Code will Weile haben", etc.)
- **Contact Box**: Fixed emoji alignment issue, tightened layout

## Open Tasks (Priority Order)

### 🟢 P6: Custom Domain
- Point `maschke.ai` (or subdomain) to Cloudflare Pages
- Update OG meta tags in `index.html`

### 🟢 P7: Additional Astronaut States
- Perfume animation (sprite exists in main project: `sprite_perfume-256px-9.png`)
- Talk animation tied to AI responses
- Consider: should Yori react to specific commands?

## Branch Status

- **Branch:** `main`
- **HEAD:** `db9181c` — `feat: P5 content strategy — system prompt, bold rendering, Yori proverbs`
- **Session commits:** 1 (db9181c)

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` — Astronaut state machine (already adapted)
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` — Debug panel (already adapted)
- `maschkeai-chatbot/components/TerminalBoard.tsx` — AstronautOverlay component
- `maschkeai-chatbot/tailwind.css` — All CSS variables (already extracted)
- `maschkeai-chatbot/functions/api/mistral.js` — Full system prompt (reference for UC prompt)
