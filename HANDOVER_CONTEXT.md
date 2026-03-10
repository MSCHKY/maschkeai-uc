# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-10T14:52 (Session 83aecd6e)

## Project Status: LIVE (Under Construction)

Under-construction holding page for `maschke.ai`. Fullscreen terminal experience with scripted boot sequence, limited Mistral AI chat (5 messages/page-load), and astronaut mascot YORI.

**Live URL:** https://maschkeai-uc.pages.dev/
**GitHub:** https://github.com/MSCHKY/maschkeai-uc

## ⚠️ CRITICAL RULE: REUSE FROM MAIN PROJECT

**Robert has repeatedly asked to reuse code from the main `maschkeai-chatbot` project instead of rebuilding from scratch.** Always check how something is done in the main project first:
- `/Volumes/Work/AI/__CODING/maschkeai-chatbot/` is the reference codebase
- Check `.agent/rules/REUSE_MAIN_PROJECT.md` before building anything new
- Key reference files listed at the bottom of this doc

## Architecture

| Component | File | Status |
|-----------|------|--------|
| HTML Shell | `index.html` | ✅ Done (block-cursor span, separators, status bar) |
| Main Orchestrator | `src/main.ts` | ✅ Done (consent gate, formatAiText, talk anim, glitch scanline, dark default) |
| Terminal CSS | `src/style.css` | ✅ Done (Gemini CLI polish, borderless input, block cursor, text gradient, glitch) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (new creative welcome text) |
| Commands | `src/commands.ts` | ✅ Done (line-based output, no boxes) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, max_tokens=400) |
| Legal Content | `src/legal.ts` | ✅ Done (maschke.ai lowercase everywhere) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, max_tokens=400) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |

## Recent Session Changes (83aecd6e — 2026-03-10, Part 2: Visual Polish)

### ✅ Gemini CLI-Inspired Terminal Polish (10 commits)
Major visual refinement pass inspired by the Gemini CLI terminal aesthetic:

- ✅ **"UNDER CONSTRUCTION" text**: Repositioned inline next to progress bar (after 100%), with slow-pulse animation
- ✅ **Borderless input field**: Removed box/border from command line, open left/right like Gemini CLI
- ✅ **Separator lines**: Top separator increased opacity; added second separator below input
- ✅ **Prompt font weight**: Reduced to 400 (was 600) for cleaner look
- ✅ **Status bar**: Font-size reduced to 0.85em, removed stray `~` symbol
- ✅ **Dark mode default**: Site always starts in dark mode (treats 'auto' as 'dark')
- ✅ **Text gradient**: Terminal output text uses `--terminal-grad` via `background-clip: text` per-line (carried over from main chatbot project)
- ✅ **Block cursor**: Retro blinking `█` cursor (HTML span + auto-sized input), replaces thin native caret
- ✅ **Glitch scanline**: Periodic CRT interference line flashes through terminal output (4-8s interval, 5px, 200ms)
- ✅ **Welcome text reworked**: "System initialisiert. Die Oberfläche wird noch kalibriert. Die KI läuft bereits — frag drauf los."
- ✅ **Astronaut repositioned**: `--astroY: -24px`, anchored to input line (`bottom: 78px`)

## Astronaut YORI — Positioning System

**Desktop/Tablet:** Anchored via `bottom: 78px`, `right: 24px`.
**Mobile (≤480px):** Anchored via `bottom: 68px`, `right: 10px` (matching card insets).

| Breakpoint | `--astroX` | `--astroY` | `--astroScale` | `--astroBubbleScale` |
|------------|-----------|-----------|---------------|---------------------|
| Desktop (>768px) | -52px | -24px | 0.61 | 1.4 |
| Tablet (≤768px) | -21px | 4px | 0.51 | 1.65 |
| Mobile (≤480px) | -26px | 0px | 0.44 | 1.9 |

**Speech Bubble Counter-Scale:** Bubble inherits parent's `scale()`, so `--astroBubbleScale` counteracts shrinkage to keep text readable. `transform-origin: right center`.

**Animations:**
- **Idle:** 8s cycle, 3×3 sprite sheet (9 frames)
- **Fall:** Click Yori → 1100ms fall animation + red warning bubble
- **Perfume:** Random trigger (28s interval, 2% chance), 1300ms, 9 frames
- **Talk:** AI streaming trigger, 1200ms fast cycle → "talking" effect. Guards prevent concurrent animations.
- **Debug Panel:** `?debug=1` shows live sliders

## NEXUS System Prompt

**Server-side only** (`functions/api/mistral.js`). Key sections:
1. Identity: NEXUS = interface name, **maschke.ai** = agency name (never confuse)
2. Voice, Format (STRIKTE REGELN: no headings/lists/code/emojis/**no kursiv**)
3. Antwortlänge: 40-60 words standard, 80 max (hard-enforced via max_tokens=400)
4. Kern-Wissen: Teaser-level services as Fließtext, **NIEMALS Preise**
5. **Gesprächsführung**: Simple tone guidance, NO message counter awareness
6. YORI: Max 1x per conversation, never quote directly
7. UC-Bewusstsein, Guardrails (prompt injection, no code gen, context lock, role integrity)

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (§5 DDG)
2. **Same Mistral API key** as main project — `MISTRAL_API_KEY` env var on Cloudflare Pages
3. **Deploys auto-trigger** on push to `main` via Cloudflare Pages Git integration
4. **Reuse before recreate**: ALWAYS check main `maschkeai-chatbot` first
5. **YORI Y-position**: Desktop `bottom: 78px`, mobile `bottom: 68px`. NEVER use large `--astroY` offsets
6. **🚨 NO LOCAL DEV SERVER**: NEVER start `npm run dev`. Test ONLY on production after push. See `.agent/rules/NO_LOCAL_SERVER.md`
7. **Brand**: `maschke.ai` always lowercase, `YORI` always uppercase, **NEXUS** = interface only
8. **Message limit**: Technical enforcement only (in-memory counter in `chat.ts`). Model knows NOTHING about limits.
9. **max_tokens**: 400 (both client and server). Keeps responses tight (~80 words max).
10. **Dark mode default**: Site always starts dark. Light mode only if user explicitly toggles.

## Open Tasks

- **P1**: Verify glitch scanline visibility on production (may need tuning)
- **P1**: Welcome text review — Robert to confirm or iterate on "System initialisiert" text
- **P2**: Performance audit (bundle size, lighthouse score)
- **P2**: Consider mobile-specific visual polish pass
- **P3**: Further prompt iteration if Robert finds more pain points in real use

## Branch Status

- **Branch:** `main`
- **HEAD:** `631e25c`
- **Session commits (83aecd6e, Part 2):** 10
  - `f5965ab` feat: Gemini CLI-inspired polish — UC pulse after progress bar, separator, status bar
  - `d8e31dc` fix: UC inline with progress bar, borderless input, thicker separator, lighter prompt, matched statusbar font
  - `5759e51` fix: borderless input, inline UC text visibility, separator polish
  - `b8e17f7` fix: add second separator below input, remove stray tilde from status bar
  - `afba12e` feat: dark mode default, smaller status bar, terminal text tint, astronaut position
  - `2d9c20d` fix: apply proper background-clip gradient to terminal output lines
  - `e407518` fix: restore astronaut anchoring to input line, set --astroY: 7px
  - `ca19998` fix: astroY offset to -24px (tuned via debug panel)
  - `00a5bfe` feat: retro block cursor and periodic glitch scanline effect
  - `631e25c` fix: cursor position, dark mode persistence, scanline visibility, welcome text

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy (max_tokens=400)
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` — Astronaut state machine
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` — Debug panel
- `maschkeai-chatbot/components/TerminalBoard.tsx` — AstronautOverlay
- `maschkeai-chatbot/tailwind.css` — All CSS variables (terminal-grad, design tokens)
- `maschkeai-chatbot/functions/api/mistral.js` — Full system prompt reference
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` — sanitizeAiText() reference
