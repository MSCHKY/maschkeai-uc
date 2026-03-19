# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-19T23:45 (Session df2c45ba)

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
| HTML Shell | `index.html` | ✅ Done (block-cursor, status bar: nexus://uplink) |
| Main Orchestrator | `src/main.ts` | ✅ Done (typewriter AI rendering, consent auto-send, CTA flow) |
| Terminal CSS | `src/style.css` | ✅ Done (particles, spotlight+vignette, floating legal panel, scroll-fade) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (typewriter boot text) |
| Commands | `src/commands.ts` | ✅ Done (box-based output, email-only contact) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, max_tokens=400) |
| Legal Content | `src/legal.ts` | ✅ Done (§5 DDG minimum, floating panel) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, email-only, no model disclosure) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |
| Background Particles | `index.html` + `src/style.css` | ✅ Done (12 floating particles) |

## Recent Session Changes (b5160214 — 2026-03-19)

### AI Response Typewriter
- ✅ AI responses now render via typewriter throttle (30 chars/sec) instead of instant rAF dump
- ✅ **Fixed race condition**: `onDone` sets `streamingDone` flag, typewriter drains to completion before `finalize()` — no more instant full-render killing the effect

### CTA / Conversion Flow
- ✅ **Email-only CTA**: All CTA boxes now show only `kontakt@maschke.ai`, no cal.com
- ✅ **Mid-chat nudge removed**: The "Tippe termin" line after 3rd message was too pushy
- ✅ CTA box: compact styling, fade-in animation, buttons with forced visible text
- ✅ System prompt: NEXUS now mentions email max every 3rd response
- ✅ `termin` command still exists but redirects to email

### NEXUS OS Branding
- ✅ Status bar: `nexus://uplink (secure)` left, `NEXUS OS · UC` right
- ✅ **Model name (Mistral Medium 3) removed everywhere** — security: no free intel for attackers
- ✅ Stats Easter egg: `Engine: NEXUS OS` instead of model name

### About Text
- ✅ Removed Vettweiß address
- ✅ Added: Fokus, Erfahrung (15+ Jahre, neurodivers), Motto ("Bend the Reality")
- ✅ Punchline: "Wir bauen KI-Lösungen, die sich anfühlen, als hätte sie jemand mit Hirn gemacht."

### Visual Polish
- ✅ **Scroll-fade**: Bottom mask reduced 60px → 20px + 24px padding-bottom on output
- ✅ **Light mode**: Background brightened #9b9b9b → #c2c2c2
- ✅ **Background spotlight + vignette**: Light mode boosted 0.10→0.20 spotlight, 0.06→0.12 vignette (was invisible on #c2c2c2)
- ✅ **Ambient particles**: 12 floating dots with varied sizes, opacity, animation
- ✅ **Box text visibility**: Fixed gradient `background-clip: text` inheritance on `.terminal-box` — body text now explicitly reset to `--terminal-ink`

### YORI Bubble Content
- ✅ Rewritten to be persona-correct (YORI ≠ NEXUS)
- ✅ Meta-humor, brand reinforcement, easter egg hints
- ✅ Inactivity nudge after 30 seconds

### Other
- ✅ Added `robots.txt` (Allow all)

## Open Tasks / Next Session

- ~~**P1**: ⚠️ **Light mode background effect not visible**~~ — ✅ FIXED (opacity values too low, not specificity)
- **P1**: **Terminal contact form** — Robert wants an in-terminal contact form (email). Needs: (a) technical implementation (form inside terminal output), (b) DSGVO compliance (consent, data handling, Verarbeitungsverzeichnis), (c) backend (Cloudflare Function → email delivery via API like Resend/Postmark)
- ~~**P2**: Box styling~~ — ✅ FIXED (padding, font-weight 700, accent left-border)
- **P2**: Mobile-specific visual polish pass
- **P2**: Fix contrast ratio for `.line-dim` text (a11y)
- **P3**: Prompt iteration if pain points found

## Astronaut YORI — Positioning System

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
5. **Gespraechsfuehrung**: Subtle, email max every 3rd response, NO termin/cal.com pushing
6. YORI: Max 1x per conversation, never quote directly
7. UC-Bewusstsein, Guardrails (prompt injection, no code gen, context lock, role integrity)
8. **Model name NOT disclosed** — security decision

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
12. **No model disclosure**: Never reveal Mistral Medium 3 in UI, status bar, or system prompt hints.
13. **Email-only CTA**: UC site uses only email (kontakt@maschke.ai), no cal.com links.

## Branch Status

- **Branch:** `main`
- **HEAD:** `f0b9d39`
- **Feature Branches:** `feature/terminal-layout` (max-width 960px experiment — archived/dead)
- **Session commits (b5160214):** 6
  - `9928ecf..3e54cf0` fix: scroll-fade, CTA box visibility, light mode contrast, AI typewriter pacing
  - `2abbfb1` fix: typewriter race condition, bottom readability, email-only CTA, less pushy AI
  - `d718412` feat: NEXUS OS branding, about text rewrite, light mode polish, email-only CTA
  - `6e3686b` fix: box text visibility — reset gradient text-clip on .terminal-box
- **Session commits (df2c45ba):** 1
  - `f0b9d39` fix: light mode spotlight/vignette visibility + box styling polish

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy (max_tokens=400) — **model name not disclosed to users**
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` -- Astronaut state machine
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` -- Debug panel
- `maschkeai-chatbot/components/TerminalBoard.tsx` -- AstronautOverlay
- `maschkeai-chatbot/tailwind.css` -- All CSS variables (terminal-grad, design tokens)
- `maschkeai-chatbot/functions/api/mistral.js` -- Full system prompt reference
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` -- sanitizeAiText() reference
