# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-20T12:52 (Session 2e5b0d65)

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
| Terminal CSS | `src/style.css` | ✅ Done (CRT scanlines, plasma gradient blobs, spotlight+vignette, floating legal panel, scroll-fade) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (typewriter boot text) |
| Commands | `src/commands.ts` | ✅ Done (box-based output, email-only contact) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit, max_tokens=250, error rollback) |
| Legal Content | `src/legal.ts` | ✅ Done (§5 DDG, sauber nummeriert 1-13) |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done (server-side prompt, email-only, no model disclosure) |
| Astronaut Assets | `public/gfx/yori_anim/` | ✅ Done (idle + fall + perfume sprites) |
| Astronaut Animations | `src/main.ts` + `src/style.css` | ✅ Done (idle, fall, perfume, talk) |
| Background Particles | `index.html` + `src/style.css` | ✅ Done (12 particles dark-only, CRT scanlines light-only) |
| Plasma Gradient | `index.html` + `src/style.css` | ✅ Done (3 animated blobs behind terminal, GPU-only) |
| Security Headers | `public/_headers` | ✅ Done (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) |

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

## Recent Session Changes (df2c45ba — 2026-03-20)

### Visual Polish — Box Styling
- ✅ **Light mode spotlight/vignette**: Opacity boosted 0.10→0.20 / 0.06→0.12 (was invisible on #c2c2c2)
- ✅ **Font-weight**: `--terminal-font-weight: 400` → `600` (root cause of thin text + weak gradient)
- ✅ **Box title height**: Fixed `white-space: pre-wrap` inheritance from `#terminal-output` inflating boxes
- ✅ **Box width**: `width: fit-content` + `max-width: 68ch` (matches AI text width)
- ✅ **Box body text**: Now uses gradient like all terminal text (was solid `--terminal-ink`)
- ✅ **terminal-cmd buttons**: 1:1 from main project (`padding: 2px 8px`, no `min-height`)
- ✅ **Template whitespace**: `box()` helper collapsed to single line, no stray whitespace nodes

### NEXUS Persona & System Prompt Overhaul
- ✅ **NEXUS_PERSONA.md**: Created persona brief with Denke, Negativliste, Gesprächsführung-Philosophie
- ✅ **System Prompt rewritten** in `functions/api/mistral.js`:
  - Mikro-Journey (Msg 1-2: Orientierung, Msg 3: Kompetenz, Msg 4-5: Kontaktübergang)
  - "Die Denke von maschke.ai" — KI als Werkzeug, kein Hype
  - "Wie NEXUS nicht spricht" — explizite Negativliste
  - Kontextabhängige CTA-Logik (direkt vs. weich)
  - Antwortlänge: 40–60 Wörter (max 80)
  - Gesprächsführung statt nur coole Antworten

## Recent Session Changes (bb9141c0 continued — 2026-03-20)

### Security Hardening
- ✅ **CSP Header**: Full Content-Security-Policy via `public/_headers` for Cloudflare Pages
- ✅ **CSP Compliance**: Removed inline `onclick` from copy button, implemented event delegation
- ✅ **Security Headers**: X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- ✅ **API Injection Fix**: Server-side hardcoded model/temp/max_tokens/stream — client can't override
- ✅ **Jules PR #4**: Cherry-picked, max_tokens kept at 250 (not 400), PR auto-closed

### Light Mode Visual Effects
- ✅ **Atmospheric gradient**: 3-layer background (radial glow + sky gradient + vignette)
- ✅ **CRT scanlines**: Subtle horizontal lines in light mode body::before
- ✅ **Particles**: Hidden in light mode (display:none), dark mode only
- ✅ **Plasma gradient**: 3 animated blobs behind terminal (body-level, position:fixed)
  - GPU-only (transform), no blur, no JS, 22-28s drift cycles
  - Light 25% opacity, Dark 35% opacity
  - Disabled on mobile ≤480px and prefers-reduced-motion

### Accessibility
- ✅ **line-dim contrast**: Opacity 0.6 → 0.72 for WCAG AA
- ✅ **prefers-reduced-motion**: All animations disabled (page fade, glitches, cursor blink, plasma)
- ✅ **Mobile density**: Status bar hidden on ≤480px

### Jules PR Review
- ✅ Reviewed all 9 new Jules PRs (#5-#13)
- 📋 6 recommended (XSS fix, DOM reflow, 4 test suites), 3 skip (duplicates, micro-opt)
- 📄 Review matrix saved → `pr_review.md` artifact

## Recent Session Changes (2e5b0d65 — 2026-03-20)

### Jules PR Integration (6 of 9)
- ✅ **#13 XSS Fix**: `sanitizeHtml()` — DOMParser-based, strips `<script>`, `<iframe>`, `on*`, `javascript:`
- ✅ **#10 DOM Reflow**: `addLines()` — DocumentFragment batch insert, eliminates O(N) reflows
- ✅ **#9 Chat Exports**: `incrementMessageCount`, `decrementMessageCount`, `getRemainingMessages`, `_resetChatStateForTesting` exported
- ✅ **#5 Network Test**: Network failure test for `sendMessage`
- ✅ **#6 Commands Tests**: 90 LOC test suite for `handleCommand` + `isSpecialCommand`
- ✅ **#7 Logo Tests**: ASCII logo unit tests with MockHTMLElement DOM mocking
- ❌ **#8, #11, #12**: Closed without merge (duplicates / irrelevant micro-opt)
- ✅ **All 9 PRs closed** on GitHub

### Test Suite
- ✅ **Test runner**: `node --experimental-strip-types --test` (node:test, no deps)
- ✅ **16/16 tests passing** — chat limits, network failure, commands, logo
- ✅ **`npm test`** script added to package.json

### NEXUS Prompt Live Test
- ✅ Persona verified: German, ~60-80 words, no headings/lists/code
- ✅ No model disclosure (Mistral not mentioned)
- ✅ Clickable chips (`services`, `about`, `contact`) work correctly
- ⚠️ **Known cosmetic issue**: During typewriter rendering, `**bold**` markers briefly visible as raw asterisks (finalize() renders correctly)

## Open Tasks / Next Session

- **P1**: **Terminal contact form** — in-terminal form → email, DSGVO-konform, "richtig" (mit Backend)
- **P2**: Bold-Rendering im Typewriter fixen (Sternchen kurz sichtbar während Streaming)
- ~~P1: Jules PRs integrieren~~ ✅ Done
- ~~P1: NEXUS Prompt live testen~~ ✅ Done
- ~~P2: Reduced-Motion~~ ✅ Done
- ~~P2: `line-dim` Kontrast~~ ✅ Done
- ~~P2: CSP-Header~~ ✅ Done

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
3. Antwortlaenge: 40-60 words standard, 80 max (hard-enforced via max_tokens=250)
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
9. **max_tokens**: 250 (server-side only since API injection fix). Client sends no model params.
10. **Dark mode default**: Site always starts dark. Light mode only if user explicitly toggles.
11. **EU-OS-Plattform**: Link ENTFERNT — Plattform eingestellt seit 20.07.2025. Nicht wieder hinzufügen!
12. **No model disclosure**: Never reveal Mistral Medium 3 in UI, status bar, or system prompt hints.
13. **Email-only CTA**: UC site uses only email (kontakt@maschke.ai), no cal.com links.
14. **noindex**: UC site is noindex/nofollow + robots.txt Disallow. Switch to index when main site launches.

## Branch Status

- **Branch:** `main`
- **HEAD:** `88d14bf`
- **Session commits (2e5b0d65):** 1
  - `88d14bf` feat: integrate 6 Jules PRs — XSS sanitizer, DOM reflow, test suite
- **Previous session (bb9141c0):** 6 commits
  - `724f410` → `8c180a1` (see previous HANDOVER entries)

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy (max_tokens=250) — **model name not disclosed to users**
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/hooks/useAstronaut.ts` -- Astronaut state machine
- `maschkeai-chatbot/components/debug/AstronautControls.tsx` -- Debug panel
- `maschkeai-chatbot/components/TerminalBoard.tsx` -- AstronautOverlay
- `maschkeai-chatbot/tailwind.css` -- All CSS variables (terminal-grad, design tokens)
- `maschkeai-chatbot/functions/api/mistral.js` -- Full system prompt reference
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` -- sanitizeAiText() reference
