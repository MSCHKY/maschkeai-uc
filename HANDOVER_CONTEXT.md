# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-10T19:30 (Session d8fc894b)

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

## Recent Session Changes (d8fc894b -- 2026-03-10: Visual Fixes + Audit)

### Cursor Fix (3 iterations)
- Removed 8px flex gap + explicit `padding: 0` on input
- ch-based width tracking (`width: ${len}ch` in JS) for pixel-perfect cursor
- `flex: 0 0 auto` prevents flexbox expansion; width reset on submit
- Final gap: 8px (= 1ch, natural terminal cursor position)

### Glitch Scanline Tuned
- 5px -> 3px height, 0.6 -> 0.8 opacity, 0.2s -> 0.15s flash
- Added `pointer-events: none`; verified 2 triggers in 10s

### Impressum Verified
- Already in sync with main project (`maschke.ai` lowercase)

### Lighthouse Audit
| Category | Score |
|----------|-------|
| Performance | **99** |
| Accessibility | **96** |
| Best Practices | **100** |
| SEO | **91** |

FCP 1.0s, LCP 1.4s, TBT 0ms, CLS 0, Bundle: 15KB gzipped

## Astronaut YORI -- Positioning System

**Desktop/Tablet:** Anchored via `bottom: 78px`, `right: 24px`.
**Mobile (<=480px):** Anchored via `bottom: 68px`, `right: 10px` (matching card insets).

| Breakpoint | `--astroX` | `--astroY` | `--astroScale` | `--astroBubbleScale` |
|------------|-----------|-----------|---------------|---------------------|
| Desktop (>768px) | -52px | -24px | 0.61 | 1.4 |
| Tablet (<=768px) | -21px | 4px | 0.51 | 1.65 |
| Mobile (<=480px) | -26px | 0px | 0.44 | 1.9 |

**Speech Bubble Counter-Scale:** Bubble inherits parent's `scale()`, so `--astroBubbleScale` counteracts shrinkage to keep text readable. `transform-origin: right center`.

**Animations:**
- **Idle:** 8s cycle, 3x3 sprite sheet (9 frames)
- **Fall:** Click Yori -> 1100ms fall animation + red warning bubble
- **Perfume:** Random trigger (28s interval, 2% chance), 1300ms, 9 frames
- **Talk:** AI streaming trigger, 1200ms fast cycle -> "talking" effect. Guards prevent concurrent animations.
- **Debug Panel:** `?debug=1` shows live sliders

## NEXUS System Prompt

**Server-side only** (`functions/api/mistral.js`). Key sections:
1. Identity: NEXUS = interface name, **maschke.ai** = agency name (never confuse)
2. Voice, Format (STRIKTE REGELN: no headings/lists/code/emojis/**no kursiv**)
3. Antwortlaenge: 40-60 words standard, 80 max (hard-enforced via max_tokens=400)
4. Kern-Wissen: Teaser-level services as Fliesstext, **NIEMALS Preise**
5. **Gespraechsfuehrung**: Simple tone guidance, NO message counter awareness
6. YORI: Max 1x per conversation, never quote directly
7. UC-Bewusstsein, Guardrails (prompt injection, no code gen, context lock, role integrity)

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (Par.5 DDG)
2. **Same Mistral API key** as main project -- `MISTRAL_API_KEY` env var on Cloudflare Pages
3. **Deploys auto-trigger** on push to `main` via Cloudflare Pages Git integration
4. **Reuse before recreate**: ALWAYS check main `maschkeai-chatbot` first
5. **YORI Y-position**: Desktop `bottom: 78px`, mobile `bottom: 68px`. NEVER use large `--astroY` offsets
6. **NO LOCAL DEV SERVER**: NEVER start `npm run dev`. Test ONLY on production after push. See `.agent/rules/NO_LOCAL_SERVER.md`
7. **Brand**: `maschke.ai` always lowercase, `YORI` always uppercase, **NEXUS** = interface only
8. **Message limit**: Technical enforcement only (in-memory counter in `chat.ts`). Model knows NOTHING about limits.
9. **max_tokens**: 400 (both client and server). Keeps responses tight (~80 words max).
10. **Dark mode default**: Site always starts dark. Light mode only if user explicitly toggles.

## Open Tasks

- **P2**: Mobile-specific visual polish pass
- **P2**: Add `robots.txt` (Lighthouse flagged)
- **P2**: Fix contrast ratio for `.line-dim` text (a11y)
- **P3**: Prompt iteration if pain points found

## Branch Status

- **Branch:** `main`
- **HEAD:** `9e9cb47`
- **Session commits (d8fc894b):** 3
  - `f7aa917` fix: cursor gap removed, scanline tuned for better visibility
  - `4e0b5a6` fix: eliminate remaining cursor gap
  - `9e9cb47` fix: ch-based cursor positioning

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy (max_tokens=400)
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` -- Astronaut state machine
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` -- Debug panel
- `maschkeai-chatbot/components/TerminalBoard.tsx` -- AstronautOverlay
- `maschkeai-chatbot/tailwind.css` -- All CSS variables (terminal-grad, design tokens)
- `maschkeai-chatbot/functions/api/mistral.js` -- Full system prompt reference
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` -- sanitizeAiText() reference
