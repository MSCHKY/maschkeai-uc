# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-07T09:52 (Session ed39cf50)

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
| HTML Shell | `index.html` | ✅ Done |
| Main Orchestrator | `src/main.ts` | ✅ Done (consent gate, formatAiText, talk animation) |
| Terminal CSS | `src/style.css` | ✅ Done (terminal card, mobile breakpoints, YORI overlay, dark-mode glow) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (NEXUS OS v4.0.2, German) |
| Commands | `src/commands.ts` | ✅ Done (line-based output, no boxes) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg in-memory limit) |
| Legal Content | `src/legal.ts` | ✅ Done (maschke.ai lowercase everywhere) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, no message counter) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |

## Recent Session Changes (ed39cf50 — 2026-03-07)

Short session focused on P12 touch-target fix + dark-mode visual polish:

### ✅ P12: Consent Button Touch-Target
- `.terminal-cmd` min-height increased: **36px** desktop, **44px** mobile (Apple HIG)
- Padding bumped from `2px 8px` to `6px 12px` desktop / `8px 16px` mobile
- `box-shadow` transition added for smooth hover effects
- Verified on production via Playwright

### ✅ Dark-Mode Visual Polish
- Terminal card border glow: `rgba(120, 170, 255, 0.12)` accent + `40px` outer glow
- `.terminal-cmd:hover` glow: `8px` spread in dark mode
- `.terminal-grad-text` drop-shadow for gradient text glow
- Removed duplicate dark-mode `box-shadow` rule that would override glow

## Astronaut YORI — Positioning System

**Desktop/Tablet:** Anchored via `bottom: 78px`, `right: 24px`.
**Mobile (≤480px):** Anchored via `bottom: 68px`, `right: 10px` (matching card insets).

| Breakpoint | `--astroX` | `--astroY` | `--astroScale` | `--astroBubbleScale` |
|------------|-----------|-----------|---------------|---------------------|
| Desktop (>768px) | -52px | 0px | 0.61 | 1.4 |
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
1. Kontext, Voice, Format (STRIKTE REGELN: no headings/lists/code/emojis)
2. Antwortlänge: 50-80 words, max 100
3. Kern-Wissen: Teaser-level services as Fließtext
4. **Gesprächsführung**: Simple tone guidance, NO message counter awareness
5. UC-Bewusstsein, Guardrails (prompt injection, no code gen, context lock, role integrity)

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (§5 DDG)
2. **Same Mistral API key** as main project — `MISTRAL_API_KEY` env var on Cloudflare Pages
3. **Deploys auto-trigger** on push to `main` via Cloudflare Pages Git integration
4. **Reuse before recreate**: ALWAYS check main `maschkeai-chatbot` first
5. **YORI Y-position**: Desktop `bottom: 78px`, mobile `bottom: 68px`. NEVER use large `--astroY` offsets
6. **🚨 NO LOCAL DEV SERVER**: NEVER start `npm run dev`. Test ONLY on production after push. See `.agent/rules/NO_LOCAL_SERVER.md`
7. **Brand**: `maschke.ai` always lowercase, `YORI` always uppercase
8. **Message limit**: Technical enforcement only (in-memory counter in `chat.ts`). Model knows NOTHING about limits.

## Open Tasks

- **P13: Real-user prompt tuning** — Robert self-tests 10 min, notes 3-5 pain points, then tune system prompt accordingly. No telemetry exists — manual testing is the path.
- Consider: Performance audit (bundle size, lighthouse score)

## Branch Status

- **Branch:** `main`
- **HEAD:** `2b94c3c`
- **Session commits (ed39cf50):** 1
  - `2b94c3c` fix: consent button touch target 36px (44px mobile) + dark-mode glow polish

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` — Astronaut state machine
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` — Debug panel
- `maschkeai-chatbot/components/TerminalBoard.tsx` — AstronautOverlay
- `maschkeai-chatbot/tailwind.css` — All CSS variables
- `maschkeai-chatbot/functions/api/mistral.js` — Full system prompt reference
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` — sanitizeAiText() reference

