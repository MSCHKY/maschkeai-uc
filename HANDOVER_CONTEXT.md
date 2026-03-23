# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-24T00:20 (Session 4cfdf04)

## Project Status: FEATURE-COMPLETE (Under Construction)

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
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (typewriter boot text, dynamic claim rotation) |
| Commands | `src/commands.ts` | ✅ Done (box-based output, contact form trigger, 6 Easter Eggs) |
| Contact Form | `src/contact-form.ts` | ✅ Done (state machine: NAME→EMAIL→MESSAGE→CONFIRM) |
| Contact API | `functions/api/contact.js` | ✅ Done (Brevo EU, honeypot, rate limiting, HTML email) |
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

## Recent Session Changes (246a2260 — 2026-03-21)

### Terminal Contact Form (Brevo EU)
- ✅ **Backend**: `functions/api/contact.js` — Cloudflare Pages Function, Brevo API (EU/Paris)
  - Input validation, honeypot spam protection, rate limiting (3/min/IP)
  - HTML email template (clean table layout, readable German timestamp)
  - Reply-To set to sender's email for easy response
- ✅ **Frontend**: `src/contact-form.ts` — State machine (IDLE→NAME→EMAIL→MESSAGE→CONFIRM)
  - Step-by-step terminal flow, client-side validation
  - Cancel at any step (`abbrechen`, `exit`, `quit`)
  - Summary box with SENDEN/ABBRECHEN buttons (click or type)
- ✅ **Integration**: `commands.ts` (`contact`/`termin` trigger form), `main.ts` (intercept + render + submit)
- ✅ **CSS**: Contact form styles in `style.css` (summary box, action buttons, honeypot hiding)
- ✅ **DNS**: Brevo DKIM (2x CNAME), DMARC (with Brevo reporting), SPF (`include:sendinblue.com`)
- ✅ **Env var**: `BREVO_API_KEY` set on Cloudflare Pages
- ✅ **Live tested**: 2x send test — emails arrive in inbox (not spam), HTML template renders correctly

### Test Suite
- ✅ **36/36 tests passing** (18 new contact form tests + 16 existing)
- ✅ Contact form validation (name, email, message — boundaries, edge cases)
- ✅ Contact form state machine (full flow, cancel at every step, confirm variants)

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

### NEXUS Prompt Live Test
- ✅ Persona verified: German, ~60-80 words, no headings/lists/code
- ✅ No model disclosure (Mistral not mentioned)
- ✅ Clickable chips (`services`, `about`, `contact`) work correctly
- ⚠️ ~~**Known cosmetic issue**: During typewriter rendering, `**bold**` markers briefly visible as raw asterisks (finalize() renders correctly)~~ ✅ Fixed

## Recent Session Changes (3aa9e8b5 — 2026-03-21)

### Jules PRs (Nacht-Batch)
- ✅ Checked GitHub — **0 open PRs**, no new batch from Jules

### Bold-Rendering Typewriter Fix
- ✅ **Root cause**: `formatAiText()` applied to partial substring during typewriter animation — incomplete `**bold**` markers flash as raw asterisks
- ✅ **Fix**: Added `typewriterText()` function that strips all Markdown markers (bold, italic, backtick) as plain text during animation
- ✅ Changed `startTypewriter()` to use `textContent` + `typewriterText()` instead of `innerHTML` + `formatAiText()`
- ✅ `finalize()` unchanged — still applies full `formatAiText()` for bold + clickable chips
- ✅ **36/36 tests pass**, build clean
- ✅ **Live verified**: No raw asterisks during animation, bold text and chips render correctly after finalization

## Recent Session Changes (5c9d641 — 2026-03-23)

### Visual Fixes
- ✅ **Light-mode scanlines**: Opacity 0.035 → 0.06 (+70% sichtbarer)
- ✅ **Input text color**: `--terminal-ink` (black/white) → `--terminal-grad-to` (blauer Terminal-Ton)
- ✅ **Mobile YORI position**: `--astroY: 0px` → `-6px` (6px hoch korrigiert)
- ✅ **Mobile prompt**: `nexus@maschke.ai ~ %` → `nexus >` auf <=480px (responsive CSS)
- ✅ **YORI blank frame**: `requestAnimationFrame` beim Entfernen der Fall-Klasse
- ✅ **format-detection**: Meta-Tag gegen Browser-Auto-Linking von E-Mails

### Easter Eggs (aufgewertet + neu)
- ✅ **matrix**: 16 Zeilen, 68ch breit, Depth-Effekt, "The Matrix has you…"
- ✅ **hack**: Hollywood-Style — 13 Schritte (Port-Scan, WAF-Bypass, ACCESS DENIED)
- ✅ **sudo**: Auth-Sequence mit Clearance Level 7
- ✅ **secret**: "HIDDEN LAYER DETECTED" + Markenvoice
- ✅ **origin** (NEU): Origin-Story Easter Egg (vDNA-aligned) + Alias `story`

### vDNA Text-Alignment
- ✅ **Services**: Problem-orientierter Rewrite ("Du stehst im KI-Nebel…")
- ✅ **Boot-Claim**: Dynamisch — 3 Claims rotieren pro Page Load
- ✅ **YORI Bubbles**: 5 Zeilen ersetzt (generisch → markenspezifisch, Raumlogik korrigiert)
- ✅ **Limit-Box**: "NEXUS hat dir einen Vorgeschmack gegeben. Für den Rest braucht es ein echtes Gespräch."
- ✅ **OG Meta-Tags**: "Keine alten Programme mit KI-Aufkleber. Systeme, die echte Arbeit mitdenken."
- ✅ **kontakt@maschke.ai in AI-Text**: Klick öffnet jetzt Kontaktformular statt mailto

### Kontaktformular
- ✅ Titel: "KONTAKTFORMULAR" → "DIREKTLEITUNG"
- ✅ Schritte kürzer, direkter, on-brand
- ✅ Abbruch-Text vereinfacht

### Tests
- ✅ 42/42 Tests (2 neue: origin-Command + story-Alias)

## Recent Session Changes (4cfdf04 — 2026-03-23/24)

### Go-Live-Checkliste — Vollständig durchgeführt
- ✅ **DSGVO**: Datenschutz §6 aktualisiert — Kontaktformular + Brevo (Sendinblue SAS, Paris) als Auftragsverarbeiter offengelegt
- ✅ **Mobile Drift Fix**: `position: fixed` auf `html`, `overscroll-behavior: none`, Astronaut translateX 120px→40px reduziert
- ✅ **Mobile Keyboard**: `visualViewport` API Handler — Terminal passt sich iOS-Tastatur an, YORI+Footer werden ausgeblendet
- ✅ **Mobile Viewport**: `interactive-widget=resizes-visual` Meta-Tag hinzugefügt
- ✅ **YORI Blank Frame Fix**: Timeout 1150→1100ms (match CSS exakt), Base idle `background-position: 0px 0px` als Fallback
- ✅ **Favicon**: Brand Mark (Impossible M) aus vDNA mit Gradient (#9b97d0 → #78aaff) auf #0b0f12
- ✅ **AI Search Vorbereitung**: `llms.txt` erstellt, `robots.txt` mit kommentierten AI-Crawler-Regeln (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended)
- ✅ **UX**: Klick irgendwo auf Seite fokussiert Terminal-Input (document-level statt terminal-only)
- ✅ **Tests**: 42/42 bestanden, Build clean

### Go-Live-Checkliste — Ergebnisse (alle 10 Bereiche geprüft)
- ✅ DSGVO & Rechtliches (Impressum, Datenschutz, Consent, Legal Links)
- ✅ SEO & Meta-Tags (Title, Description, OG, noindex korrekt für UC)
- ✅ Security (CSP, Headers, XSS, Prompt Injection, Rate Limiting)
- ✅ Texte & Copy (Boot, Services, About, YORI, Limit-Box, System Prompt)
- ✅ Funktionalität (Chat, Contact, Commands, Easter Eggs, Theme)
- ✅ Mobile & Responsive (3 Breakpoints, Keyboard, Drift-Fix)
- ✅ Accessibility (aria, reduced-motion, Kontraste WCAG AA)
- ✅ Performance (JS 14.59kB gzip, CSS 6.83kB gzip, 0 Dependencies)
- ✅ Tests (42/42)

## Open Tasks / Next Session

- **P1: Cloudflare Web Analytics aktivieren** — Im Dashboard: maschkeai-uc.pages.dev → Web Analytics → Enable (kein Code nötig, DSGVO-konform)
- **P1: Mobile testen** — iPhone 15 Pro Max: Drift-Fix + Keyboard-Handling verifizieren
- **P1: Favicon prüfen** — Browser-Tab prüfen ob Brand Mark korrekt rendert (32x32 SVG mit komplexem Path)
- P2: 9 offene Jules-PRs reviewen (#17–#25: Tests, Perf, TypeScript-Hygiene)
- P3: maschke-vdna Abgleich fortsetzen (About-Text Arbeitsthese dynamisch, Services-Text Feinschliff nach User-Feedback)
- P4: AI Search aktivieren — bei Main-Site-Launch `robots.txt` Kommentare entfernen, `noindex` → `index` in index.html

## Astronaut YORI — Positioning System

**Desktop/Tablet:** Anchored via `bottom: 78px`, `right: 24px`.
**Mobile (<=480px):** Anchored via `bottom: 68px`, `right: 10px` (matching card insets).

| Breakpoint | `--astroX` | `--astroY` | `--astroScale` | `--astroBubbleScale` |
|------------|-----------|-----------|---------------|---------------------|
| Desktop (>768px) | -52px | -24px | 0.61 | 1.4 |
| Tablet (<=768px) | -21px | 4px | 0.51 | 1.65 |
| Mobile (<=480px) | -26px | -6px | 0.44 | 1.9 |

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

## Jules AI Agent (Nacht-Batch Automation)

### API Access
- **API:** `https://jules.googleapis.com/v1alpha`
- **Auth:** Header `x-goog-api-key: <key>` (Keys in Jules Settings → API Key)
- **Endpoints:**
  - `GET /v1alpha/sessions?pageSize=10` — List all tasks
  - `GET /v1alpha/sessions/{id}/activities` — Task details
- **Quick check:** `curl -s -H "x-goog-api-key: <KEY>" "https://jules.googleapis.com/v1alpha/sessions?pageSize=10"`

### GitHub Auto-Merge (konfiguriert 21.03.2026)
- ✅ **Auto-Merge** aktiviert in Repo Settings → General → Pull Requests
- ✅ **Auto-delete head branches** aktiviert (räumt Jules-Branches auf)
- ✅ **Branch Ruleset "main"**: `Cloudflare Pages` Status Check required, Block force pushes, Restrict deletions
- **Flow:** Jules PR → Cloudflare Build → Check grün → Auto-Merge → Branch gelöscht
- ⚠️ Jules Tasks brauchen weiterhin manuelle Genehmigung in der Jules UI, erst dann wird der PR erstellt
- Jules Dashboard: https://jules.google.com → Repo `MSCHKY/maschkeai-uc`

### Hinweis für B-CONTENT
- Jules hat 8 Sessions (21.03.) auf `MSCHKY/B-CONTENT` abgearbeitet → 11 offene PRs (#58–#68)
- Review bei nächster B-CONTENT Session

## Branch Status

- **Branch:** `main`
- **HEAD:** `4cfdf04`
- **Session commits (4cfdf04 — 2026-03-23/24):** 1
  - `4cfdf04` fix: go-live checklist — DSGVO, mobile, YORI, favicon, AI search prep

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
