# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-06T11:23 (Session 0639df28)

## Project Status: LIVE (Under Construction)

Under-construction holding page for `maschke.ai`. Fullscreen terminal experience with scripted boot sequence and limited Mistral AI chat (5 messages/session).

**Live URL:** https://maschkeai-uc.pages.dev/
**GitHub:** https://github.com/MSCHKY/maschkeai-uc

## Architecture

| Component | File | Status |
|-----------|------|--------|
| HTML Shell | `index.html` | ✅ Done |
| Main Orchestrator | `src/main.ts` | ✅ Done (Easter Eggs included) |
| Terminal CSS | `src/style.css` | ✅ Done (1:1 from main project) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ✅ Done (NEXUS OS v4.0.2, German) |
| Commands | `src/commands.ts` | ✅ Done (hilfe, Easter Eggs, aliases) |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit) |
| Legal Content | `src/legal.ts` | ⚠️ Placeholder addresses |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done |
| Workflows | `.agent/workflows/` | ✅ session-start + session-end |

## Design System

**All CSS variables are 1:1 from the main `maschkeai-chatbot` project:**
- `--terminal-ink`, `--terminal-sub`, `--terminal-accent`, `--terminal-grad`
- SF Mono system font stack, `font-weight: 600`, `line-height: 1.35`
- NexusAscii 2-layer system (solid + dither) with animated gradient (8s scroll)
- VHS scan-line tear glitch (clip-path clones, 8s interval)
- Light/Dark mode via `[data-theme="dark"]` with `localStorage` persistence

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (§5 DDG). Terminal commands are a bonus, not a replacement.
2. **Same Mistral API key** as main project — set as `MISTRAL_API_KEY` env var on Cloudflare Pages.
3. **Deploys auto-trigger** on push to `main` branch via Cloudflare Pages Git integration.

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

## Open Tasks (Priority Order)

### P3: Impressum Addresses
Fill in placeholder addresses in `src/legal.ts` — Robert provides.

### P4: Visual Polish
- Verify glitch effect (VHS scan-line tear) works correctly
- Test theme toggle (light/dark/auto)
- Mobile testing

### P5: Custom Domain
- Point `maschke.ai` (or subdomain) to Cloudflare Pages
- Update OG meta tags in `index.html`

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy
- Cloudflare Pages deployment (auto-deploy from GitHub)

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/components/NexusAscii.tsx` — Logo component (already replicated)
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` — Boot sequence + chat
- `maschkeai-chatbot/tailwind.css` — All CSS variables (already extracted)
- `maschkeai-chatbot/components/TerminalMessages.tsx` — Message rendering
