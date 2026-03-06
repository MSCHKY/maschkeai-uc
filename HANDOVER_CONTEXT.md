# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-06T20:57 (Session 7f7ee283)

## Project Status: LIVE (Under Construction)

Under-construction holding page for `maschke.ai`. Fullscreen terminal experience with scripted boot sequence, limited Mistral AI chat (5 messages/session), and astronaut mascot Yori.

**Live URL:** https://maschkeai-uc.pages.dev/
**GitHub:** https://github.com/MSCHKY/maschkeai-uc

## Architecture

| Component | File | Status |
|-----------|------|--------|
| HTML Shell | `index.html` | ✅ Done (+ astronaut overlay + debug panel) |
| Main Orchestrator | `src/main.ts` | ✅ Done (Easter Eggs, astronaut, click-to-fall, `formatAiText()`, HTML box rendering, compact consent) |
| Terminal CSS | `src/style.css` | ✅ Done (1:1 from main project + astronaut + AI text + compact terminal-box) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (NEXUS OS v4.0.2, German) |
| Commands | `src/commands.ts` | ✅ Done (static=box, dynamic=lines; compact spacing) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, full UC system prompt) |
| Legal Content | `src/legal.ts` | ✅ Done (HTML boxes, compact spacing) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (+ 20 injection regex patterns, 403 blocking) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, **talk**) |
| Workflows | `.agent/workflows/` | ✅ session-start + session-end |
| Agent Rules | `.agent/rules/` | ✅ REUSE_MAIN_PROJECT.md + NO_LOCAL_SERVER.md |

## Astronaut Yori — Positioning System

**CRITICAL: How positioning works (read this before touching astronaut CSS!)**

The astronaut uses `position: fixed; right: 0; bottom: 54px` — **anchored to the input line**, not the viewport edge. This was a deliberate redesign (session 5eeef88f) because `bottom: 28px` (footer edge) with transform Y-offsets caused different positions on real phones vs desktop-resized-small (phones have browser chrome that eats viewport height).

**Key insight:** `--astroY` is now just a **small fine-tune offset** (~0px), NOT the primary Y positioning mechanism. The base Y position comes from `bottom: 54px`.

### CSS Custom Properties per Breakpoint

| Breakpoint | `--astroX` | `--astroY` | `--astroScale` | `--astroBubbleScale` |
|------------|-----------|-----------|---------------|---------------------|
| Desktop (>768px) | -52px | 0px | 0.61 | 1.4 |
| Tablet (≤768px) | -21px | 4px | 0.51 | 1.65 |
| Mobile (≤480px) | -26px | 0px | 0.44 | 1.9 |

### Speech Bubble Counter-Scale

The bubble is a child of `#astronaut-overlay`, so it inherits the parent's `scale()` transform. Without counter-scaling, the bubble text would be unreadable on mobile (12px × 0.44 scale = ~5px effective). The `--astroBubbleScale` variable (applied via `transform: scale(var(--astroBubbleScale))` inside the bubble) counteracts the parent's shrinkage:
- Desktop: 12px × 1.4 / 0.61 ≈ 27px effective → very readable
- Mobile: 12px × 1.9 / 0.44 ≈ 52px effective → readable on small screens

`transform-origin: right center` keeps the bubble anchored near Yori's head while scaling up.

### Other Astronaut Details
- **Sprite sheets:** `sprite-256px-9.png` (idle, 3×3), `sprite_fall-256px-9.png` (fall, 3×3), `sprite_perfume-256px-9.png` (perfume, 3×3)
- **Speech Bubbles:** 22 rotating lines in 3 categories (10s visible, 15s hidden):
  - **Baustellenhumor** (8): "Noch 99 Bugs…", "Coming Soon*ish", etc.
  - **Tech-Redewendungen** (10): "Des Devs Website ist immer UC", "In der Latenz liegt die Kraft", "Viele Prompts verderben den Output", etc.
  - **Easter-Egg-Hints** (4): "Tippe mal hilfe", "Was passiert bei sudo?", etc.
- **Click-to-Fall Easter Egg:** Click Yori → fall animation + red warning bubble ("NICHT ANFASSEN!!!")
- **Perfume Animation:** Random trigger (28s interval, 2% chance), 1300ms 9-frame stepped animation. Wider sprite (127x130) centered via margin-left. Guards prevent concurrent fall+perfume.
- **Talk Animation:** Triggered by AI streaming responses. Same idle sprite but 1200ms cycle (vs 8s idle) — fast frame-flipping = "talking" effect. `startTalking()` on first chunk, `stopTalking()` on done/error. Guards: suppressed during fall/perfume; fall stops active talk.
- **Debug Panel:** `?debug=1` URL param shows live sliders for position tuning

## AI Text Rendering

**`formatAiText()` in `main.ts` processes AI responses during streaming:**
- `**bold**` → `<strong>bold</strong>` (rendered as bold text)
- `` `command` `` → clickable `.cmd-chip` span (executes command on click)
- HTML-escaped first to prevent XSS
- Applied on each streaming chunk for live formatting during typewriter effect
- On completion, click handlers are attached to all `.cmd-chip` elements

**CSS classes added in this session:**
- `.line-ai` — AI response text color
- `.line-ai strong` — Bold text inside AI responses (font-weight: 700)
- `.cmd-chip` — Clickable command chips (accent color, underline, hover opacity)
- `.line-accent` — Error/highlight color
- `.line-cyan` — Services box entries (accent + bold)

## NEXUS System Prompt (UC Version)

**Full rewrite of the system prompt for UC context** (`src/chat.ts` → `SYSTEM_PROMPT`):

### Structure (9 sections):
1. **Kontext** — "Du bist NEXUS auf der Under-Construction-Seite von maschke.ai"
2. **Voice** — Corporate-cool, informelles "Du", trockener Humor, kein Marketing-Sprech
3. **Format** — Short paragraphs, `**bold**` key terms, `` `backtick` `` commands, NO markdown
4. **Antwortlänge** — 80-150 Wörter default, 60-100 für Service-Commands
5. **Kern-Wissen** — Teaser-level: 4 services, founder info, philosophy, NO pricing
6. **Strategie (5-Nachrichten-Funnel)** — Neugier → Kompetenz → Konkret → CTA (E-Mail)
7. **UC-Bewusstsein** — "Die KI läuft schon, die Website holt noch auf"
8. **Guardrails** — Full set matching main site (prompt protection, no code, context lock, role integrity)
9. **Ton-Beispiel** — Concrete example response

### Key Design Decisions:
- Only CTA is `kontakt@maschke.ai` — NO booking links, NO prices
- 5-message limit creates urgency → funnel strategy guides to email
- Guardrails are identical to main site's `functions/api/mistral.js`

## Design System

**All CSS variables are 1:1 from the main `maschkeai-chatbot` project:**
- `--terminal-ink`, `--terminal-sub`, `--terminal-accent`, `--terminal-grad`
- SF Mono system font stack, `font-weight: 600`, `line-height: 1.35`
- NexusAscii 2-layer system (solid + dither) with animated gradient (8s scroll)
- VHS scan-line tear glitch (clip-path clones, 8s interval, 2 bursts per cycle — **amplified**)
- Light/Dark mode via `[data-theme="dark"]` with `localStorage` persistence
- Astronaut bubble styling adapted from main project's `.astro-bubble` (with counter-scale)

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (§5 DDG). Terminal commands are a bonus, not a replacement.
2. **Same Mistral API key** as main project — set as `MISTRAL_API_KEY` env var on Cloudflare Pages.
3. **Deploys auto-trigger** on push to `main` branch via Cloudflare Pages Git integration.
4. **Reuse before recreate**: Always check main `maschkeai-chatbot` project for existing patterns, CSS, and logic before building new ones.
5. **Astronaut Y-position**: Always use `bottom: 54px` (input-line anchor). NEVER go back to `bottom: 28px` with large `--astroY` offsets — that causes phone/desktop divergence.
6. **🚨 NO LOCAL DEV SERVER**: NEVER start `npm run dev` or any local server for this project. Test ONLY on `https://maschkeai-uc.pages.dev/` after push to `main`. See `.agent/rules/NO_LOCAL_SERVER.md`.

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
  - 9-section prompt: Kontext, Voice, Format, Antwortlänge, Kern-Wissen, Strategie, UC-Bewusstsein, Guardrails, Ton-Beispiel
  - 5-message funnel: Neugier → Kompetenz → Konkret → E-Mail CTA
  - Teaser-level knowledge (services without prices, kontakt@maschke.ai as only CTA)
  - Full guardrails matching main site
- **AI Text Rendering**: `formatAiText()` renders `**bold**` and `` `commands` `` live during streaming
  - Bold → `<strong>` tags, Commands → clickable `.cmd-chip` spans with click handlers
  - HTML-escaped first for XSS prevention
- **Yori Sprüche**: Expanded from 11 to 22 lines — 3 categories:
  - Baustellenhumor, Tech-remixed German proverbs, Easter-Egg-Hints
- **Contact Box**: Removed ✉ emoji (broke monospace alignment), tightened layout
- **Astronaut Positioning Overhaul**:
  - Changed from `bottom: 28px` + large Y-offsets → `bottom: 54px` (input-line anchor)
  - `--astroY` reduced to ~0px fine-tuning only
  - This fixed the phone/desktop positioning divergence
- **Speech Bubble Readability**:
  - Added `--astroBubbleScale` counter-scale (1.4x / 1.65x / 1.9x per breakpoint)
  - Compensates parent astronaut scale to keep bubble text at readable effective size
  - `transform-origin: right center` keeps bubble anchored near Yori's head
- **Missing CSS classes added**: `.line-ai`, `.line-cyan`, `.line-accent`, `.cmd-chip`

### ✅ Live Audit (Session 484ec42d + 099b16c4)
- All core features verified on `maschkeai-uc.pages.dev`:
  - Boot sequence, consent gate, commands (hilfe, termin, contact, impressum)
  - Yori positioning + speech bubbles, footer, mobile responsiveness
  - Live audit recording and screenshots captured
- **Workflow-Trennung**: Renamed workflows to `/uc-session-start` und `/uc-session-end`
- **Added**: `.agent/rules/REUSE_MAIN_PROJECT.md` rule for code reuse enforcement
- **DSGVO**: Consent gate + termin booking (Cal.com link) implemented

### ✅ P8.5: CSS Box Spacing + Command Refactoring (Session 5d33a030)
- **CSS tightened**: `.terminal-box` padding 8px 12px, line-height 1.35, margins reduced
- **Command output split**: Boxes reserved for **static content only** (contact, termin, status, impressum, datenschutz, consent). Info commands (`hilfe`, `about`, `services`) converted to terminal-native **line-based output**
- **Consent box condensed**: Fewer `<p>` tags, merged button hints into single line
- **Contact/Termin boxes condensed**: Merged paragraphs, fewer elements, tighter structure
- **NO_LOCAL_SERVER rule**: Created `.agent/rules/NO_LOCAL_SERVER.md` + added to session-start workflow
- **Files modified**: `src/style.css`, `src/commands.ts`, `src/main.ts`

### ✅ P8: Live Chat Testing (Session 9bae44bc)
- Bold rendering verified (`**text**` → `<strong>`, `font-weight: 700`)
- Command chips verified (`.cmd-chip`, blue, clickable, executes command)
- Guardrail finding: UC had NO server-side regex patterns → **fixed**
- Ported 20 injection regex patterns (EN+DE+jailbreak) from main project
- Added `detectPromptInjection()` with HTTP 403 blocking
- Added message sanitization (role whitelist, 4000 char cap, 12 msg max)
- Added 403 handling in `chat.ts` frontend with German security message
- 5-message funnel: Prompt-only strategy — no visible counter (bewusst)
- Fixed sticky input line: `overflow-y:auto` moved from `#terminal` to `#terminal-output`

### ✅ P7: Perfume Animation (Session 9bae44bc)
- Sprite `sprite_perfume-256px-9.png` ported from main project
- CSS class `.astro-perfume` (127x130 frame, centered via margin-left)
- `@keyframes astro-perfume` (1300ms, 9 frames, stepped)
- Random trigger: `setInterval` 28s, 2% chance (from `useAstronaut.ts`)
- Guards prevent concurrent fall + perfume animations

### ✅ Talk Animation (Session 7f7ee283)
- CSS: `.astro-talk` class with `@keyframes astro-talk` (1200ms, same idle sprite, fast cycle)
- JS: `startTalking()` / `stopTalking()` toggle `.astro-talk` on sprite element
- Trigger: First streaming chunk starts talk, `onDone`/`onError` stops talk
- Guards: Talk suppressed during fall/perfume; fall stops active talk
- Verified on production: idle → talk → idle animation transitions confirmed via JS 
- **Cooler than main project**: Main project triggers on bubble-text change; UC triggers on actual AI streaming

### 🟢 P6: Custom Domain (User handles separately)
- Point `maschke.ai` → `www.maschke.ai` to Cloudflare Pages
- Robert has this on his radar — no task item needed

## Open Tasks (Priority Order)

### 🟡 P9: Terminal Content Polish
- **Formatting**: AI responses sometimes output `###` headings, `-` lists — needs `formatAiText()` sanitization (strip `###`, convert `-` lists to sentence flow)
- **Layout**: Review overall terminal spacing, line heights, response area appearance
- **Mistral Output Quality**: Tune system prompt so responses are tighter, on-brand, no markdown artifacts
- **Reference**: Main project's `sanitizeAiText()` aggressively strips headings, lists, code blocks, blockquotes — port similar logic

## Branch Status

- **Branch:** `main`
- **HEAD:** `05ff313` — `feat: add talk animation — Yori reacts to AI streaming responses`
- **Session commits (7f7ee283):** 1
  - `05ff313` feat: add talk animation — Yori reacts to AI streaming responses

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
