# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-10T12:25 (Session 83aecd6e)

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
| Main Orchestrator | `src/main.ts` | ✅ Done (consent gate, formatAiText + kursiv sanitizer, talk animation) |
| Terminal CSS | `src/style.css` | ✅ Done (terminal card, mobile breakpoints, YORI overlay, dark-mode glow) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (NEXUS OS v4.0.2, German) |
| Commands | `src/commands.ts` | ✅ Done (line-based output, no boxes) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, max_tokens=400) |
| Legal Content | `src/legal.ts` | ✅ Done (maschke.ai lowercase everywhere) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, max_tokens=400) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |

## Recent Session Changes (83aecd6e — 2026-03-10)

### ✅ P13: System Prompt Tuning
Tested 4 live AI responses, identified 6 issues, applied 2 rounds of fixes:

**Round 1 — Prompt fixes (`mistral.js`):**
- **NEXUS ≠ Agency**: Clear instruction that NEXUS is the interface name, **maschke.ai** is the agency. Bot now says "wir bei maschke.ai" not "wir bei NEXUS"
- **Word limit tightened**: 40-60 words standard, 80 max (was 50-80/100)
- **Prices banned**: "NIEMALS Preise oder Stundensätze nennen — auch nicht 'ab X€'" (was leaking 190€/h)
- **Kursiv banned**: Explicit `*text*` prohibition added to VERBOTEN list
- **Anti-pseudo-lists**: "Jeden Service als eigenen Absatz = versteckte Liste. Max 2 Absätze pro Antwort"
- **YORI throttle**: Max 1x per conversation, never quote directly

**Round 2 — Frontend + API fixes:**
- **Kursiv sanitizer** (`main.ts`): `formatAiText` now strips remaining `*text*` → `text` after `**bold**` conversion
- **max_tokens 1500→400** (`mistral.js` + `chat.ts`): Hard API-level enforcement of shorter responses

**Verification results (3 tests on production):**
- ✅ NEXUS/maschke.ai differentiation working
- ✅ No raw `*kursiv*` markers visible
- ✅ No prices mentioned
- ✅ Fließtext (no pseudo-lists)
- ⚠️ Word count 66-96 (improved from 100-150, services still slightly over 80)

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

## Open Tasks

- Consider: Performance audit (bundle size, lighthouse score)
- Consider: Further prompt iteration if Robert finds more pain points in real use

## Branch Status

- **Branch:** `main`
- **HEAD:** `d84b122`
- **Session commits (83aecd6e):** 2
  - `e956bc9` fix: sharpen system prompt — shorter answers, no prices, no pseudo-lists, NEXUS≠agency
  - `d84b122` fix: strip raw *kursiv* markers in sanitizer + reduce max_tokens 1500→400

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy (max_tokens=400)
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` — Astronaut state machine
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` — Debug panel
- `maschkeai-chatbot/components/TerminalBoard.tsx` — AstronautOverlay
- `maschkeai-chatbot/tailwind.css` — All CSS variables
- `maschkeai-chatbot/functions/api/mistral.js` — Full system prompt reference
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` — sanitizeAiText() reference

