# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-06T23:22 (Session af70a592)

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
| Terminal CSS | `src/style.css` | ✅ Done (terminal card with inset/shadow, page fade-in) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (NEXUS OS v4.0.2, German) |
| Commands | `src/commands.ts` | ✅ Done (line-based output, no boxes) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg in-memory limit) |
| Legal Content | `src/legal.ts` | ✅ Done (maschke.ai lowercase everywhere) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, no message counter) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |

## Recent Session Changes (af70a592 — 2026-03-06)

This was a long session covering P9 (content polish) plus significant UX and visual improvements:

### ✅ Terminal Content Polish (P9)
- System prompt moved server-side (was being stripped by ALLOWED_ROLES filter)
- `sanitizeAiText()` ported from main project (strips heading/list/code markdown artifacts)
- `formatAiText()` pipeline: sanitize → escape → format (bold + cmd-chips)
- System prompt tuned: 50-80 words, Fließtext (no lists), explicit forbidden-list

### ✅ Brand Naming Consistency
- `maschke.ai` always lowercase (title, meta, commands, legal texts, comments)
- `YORI` always uppercase (system prompt, code comments)
- Files changed: `index.html`, `commands.ts`, `style.css`, `main.ts`, `legal.ts`, `mistral.js`

### ✅ Consent Flow Redesign
- **Before:** Consent box shown immediately during boot sequence (as a terminal-box)
- **After:** No consent on boot. First user input triggers inline consent with **clickable AKZEPTIEREN button** (`.terminal-cmd` class, click handler attached)
- Typing `akzeptieren`/`accept`/`zustimmen`/`einverstanden` also works
- Legal commands (`impressum`, `datenschutz`) remain accessible before consent
- Consent stored in `sessionStorage` (persists across reloads, clears on tab close)

### ✅ Message Counter Cleanup
- **Removed visible counter** ("X Nachrichten verbleibend") from UI — was confusing users
- **Counter moved to in-memory** (`let messageCount = 0` in chat.ts) — resets on every reload
- **System prompt no longer mentions message limit** — replaced "STRATEGIE (5-Nachrichten-Limit)" with simple "GESPRÄCHSFÜHRUNG" section
- Technical enforcement stays in `chat.ts` (`MAX_MESSAGES = 5`, `isLimitReached()`)

### ✅ Terminal Card Design
- `#terminal` now floats with 24px inset (top/left/right), `border-radius: 8px`, `box-shadow`
- Background: `rgba(255,255,255,0.35)` light / `rgba(255,255,255,0.04)` dark
- Body background darkened 25% (`#cfcfcf` → `#9b9b9b`) for better card contrast
- Mobile breakpoint (≤480px): 10px insets, 6px radius

### ✅ Visual Polish
- **Input field**: Background opacity reduced to 8% (light) / 10% (dark) — looks like real terminal
- **Page fade-in**: `body` animates opacity 0→1 over 1.8s with 0.2s delay
- **Terminal boxes**: `contact` and `termin` converted to line-based output (no more boxes)
- **Compact consent**: Uses `.terminal-consent` class with max-width
- `.terminal-box` now has `max-width: 480px`

### ✅ YORI Position Fix
- `right: 0` → `right: 24px` and `bottom: 54px` → `bottom: 78px` to compensate for terminal card inset
- Was previously anchored to viewport edge; now anchored relative to card edge

## Astronaut YORI — Positioning System

**Anchored to input line via `bottom: 78px`** (54px original + 24px terminal card bottom inset). `--astroY` is a small fine-tune offset only.

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
5. **YORI Y-position**: Use `bottom: 78px` (input-line + card inset anchor). NEVER use large `--astroY` offsets
6. **🚨 NO LOCAL DEV SERVER**: NEVER start `npm run dev`. Test ONLY on production after push. See `.agent/rules/NO_LOCAL_SERVER.md`
7. **Brand**: `maschke.ai` always lowercase, `YORI` always uppercase
8. **Message limit**: Technical enforcement only (in-memory counter in `chat.ts`). Model knows NOTHING about limits.

## Open Tasks

- **P10: YORI mobile positioning check** — The terminal card inset may have shifted YORI on tablets/phones. Verify with Playwright mobile emulation and adjust breakpoint values if needed.
- **P11: Consent UX review** — Verify the clickable AKZEPTIEREN button works on mobile (touch targets, visibility)
- Consider: Additional prompt tuning based on real user feedback

## Branch Status

- **Branch:** `main`
- **HEAD:** `e9b1656`
- **Session commits (af70a592):** 10
  - `185a342` fix: sanitize AI responses
  - `aaecc22` fix: move system prompt server-side
  - `59191bb` docs: update handover context
  - `79cc665` refactor: compact boxes
  - `6ba8353` fix: brand naming + consent on first input
  - `59be594` style: terminal card
  - `adbf87d` fix: darker bg, equal insets, kill message counter
  - `1968cdb` fix: remove visible message counter
  - `878bae1` fix: message counter in-memory
  - `e9b1656` fix: clickable consent, YORI position, transparent input, page fade-in

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
