# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-11T00:18 (Session d8fc894b, continued)

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
| HTML Shell | `index.html` | ✅ Done (block-cursor span, separators, status bar, `&nbsp;` prompt spacing) |
| Main Orchestrator | `src/main.ts` | ✅ Done (consent auto-send, 95% progress bar, formatAiText, glitch scanline) |
| Terminal CSS | `src/style.css` | ✅ Done (floating legal panel, Gemini CLI polish, borderless input, block cursor) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (new creative welcome text) |
| Commands | `src/commands.ts` | ✅ Done (line-based output, no boxes) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, max_tokens=400) |
| Legal Content | `src/legal.ts` | ✅ Done (§5 DDG minimum, EU-OS-Link removed, floating panel) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, max_tokens=400) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |

## Recent Session Changes (d8fc894b -- 2026-03-10/11)

### Legal Content Overhaul
- ✅ Impressum + Datenschutz rechtlich vollständig finalisiert (DDG, VSBG, MStV, DSGVO)
- ✅ Impressum auf gesetzliches Minimum reduziert (§ 5 DDG):
  - Entfernt: Unternehmensform, Tätigkeitsbeschreibung, Kammer-Negation, Website-URL
  - **EU-OS-Plattform-Link entfernt** (Plattform eingestellt seit 20.07.2025!)
  - Haftungs-/Urheberrechtsklauseln gekürzt
- ✅ Legal Overlay: Fullscreen → **Floating Panel** mit backdrop-blur
  - `#legal-overlay-panel` wrapper div, max-width 680px, max-height 80vh
  - Schriftgrad 0.78em, kompakte Abstände
  - Click-to-close Backdrop + ESC + Close-Button

### UX Verbesserungen
- ✅ **Progress bar bleibt bei 95%** — passt zum "Under Construction" Konzept
- ✅ **Consent-Flow komplett überarbeitet**: User-Nachricht wird in `pendingMessage` gespeichert und nach AKZEPTIEREN-Click via `setTimeout(50)` automatisch an die KI gesendet — kein Doppel-Tippen mehr
- ✅ **Prompt-Leerzeichen**: `&nbsp;` nach `%` im HTML verhindert Whitespace-Collapse

### Cursor & Scanline (aus erster Session-Hälfte)
- ✅ ch-based cursor positioning, flex gap entfernt
- ✅ Glitch scanline: 3px, 0.8 opacity, 0.15s flash

### Terminal Layout Experiment (OFFEN)
- `feature/terminal-layout` Branch: max-width 960px, zentriert, 32px Padding
- Preview: https://feature-terminal-layout.maschkeai-uc.pages.dev
- **Robert überlegt noch** — erst abgetörnt, dann "je länger ich draufgucke..."
- Reverted auf main, lebt nur in Feature-Branch

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
11. **EU-OS-Plattform**: Link ENTFERNT — Plattform eingestellt seit 20.07.2025. Nicht wieder hinzufügen!

## Open Tasks

- **P1**: Terminal Layout entscheiden (`feature/terminal-layout` Branch — Robert überlegt)
- **P1**: Astronaut YORI repositionieren falls Layout-Change kommt (ragt nach rechts raus)
- **P2**: Mobile-specific visual polish pass
- **P2**: Add `robots.txt` (Lighthouse flagged)
- **P2**: Fix contrast ratio for `.line-dim` text (a11y)
- **P3**: Prompt iteration if pain points found

## Branch Status

- **Branch:** `main`
- **HEAD:** `2117c39`
- **Feature Branches:** `feature/terminal-layout` (max-width 960px experiment)
- **Session commits (d8fc894b):** 8
  - `0218ccd` feat: rechtlich vollständiges Impressum + Datenschutz
  - `44e9269` feat: legal overlay als floating panel mit backdrop-blur
  - `fc0eaa7` refactor: Impressum auf gesetzliches Minimum (§5 DDG)
  - `11b8446` feat: progress bar stops at 95%
  - `da7a7c9` fix: consent flow auto-sendet + Prompt-Leerzeichen
  - `6e05430` style: terminal max-width (angewendet)
  - `2117c39` Revert terminal max-width (zurück auf edge-to-edge)

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
