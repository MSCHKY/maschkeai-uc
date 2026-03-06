# HANDOVER_CONTEXT.md — maschkeai-uc

> Last updated: 2026-03-06T04:32 (Session 22a88477)

## Project Status: IN DEVELOPMENT

Under-construction holding page for `maschke.ai`. Fullscreen terminal experience with scripted boot sequence and limited Mistral AI chat (5 messages/session).

## Architecture

| Component | File | Status |
|-----------|------|--------|
| HTML Shell | `index.html` | ✅ Done |
| Main Orchestrator | `src/main.ts` | ✅ Done |
| Terminal CSS | `src/style.css` | ✅ Done (1:1 from main project) |
| NEXUS Logo | `src/ascii-logo.ts` | ✅ Done (2-layer + VHS glitch) |
| Boot Sequence | `src/boot-sequence.ts` | ⚠️ Needs content from main project |
| Commands | `src/commands.ts` | ⚠️ Needs content alignment |
| Chat Client | `src/chat.ts` | ✅ Done (SSE streaming, 5-msg limit) |
| Legal Content | `src/legal.ts` | ⚠️ Placeholder addresses |
| Mistral Proxy | `functions/api/mistral.js` | ✅ Done |

## Design System

**All CSS variables are 1:1 from the main `maschkeai-chatbot` project:**
- `--terminal-ink`, `--terminal-sub`, `--terminal-accent`, `--terminal-grad`
- SF Mono system font stack, `font-weight: 600`, `line-height: 1.35`
- NexusAscii 2-layer system (solid + dither) with animated gradient (8s scroll)
- VHS scan-line tear glitch (clip-path clones, 8s interval)
- Light/Dark mode via `[data-theme="dark"]` with `localStorage` persistence

## Invariants

1. **DSGVO**: Impressum + Datenschutz MUST be visible as footer links (§5 DDG). Terminal commands are a bonus, not a replacement.
2. **Same Mistral API key** as main project — set as `MISTRAL_API_KEY` env var.
3. **No GitHub repo yet** — local only, branch `main`.
4. **No Cloudflare Pages project yet**.

## Open Tasks (Priority Order)

### P1: Boot Sequence + Commands from Main Project
The boot text and command outputs currently use generic English placeholder text. They need to match the main project's German terminal style:
- Boot: "NEXUS OS v4.0.2", "BOOT: Secure Shell wird initialisiert…", etc.
- Reference: Main project `useTerminalControllerV2.ts` for boot messages
- Reference: Main project `commands.ts` / command handling for output style

### P2: GitHub Repo + Cloudflare Pages
1. `gh repo create maschkeai-uc --public --source=. --push`
2. Create Cloudflare Pages project (Git integration)
3. Set `MISTRAL_API_KEY` as env var
4. Custom domain later (once verified)

### P3: Impressum Addresses
Fill in placeholder addresses in `src/legal.ts` — Robert provides.

### P4: Visual Polish
- Verify glitch effect (VHS scan-line tear) works correctly
- Test theme toggle (light/dark/auto)
- Mobile testing

## Git History

```
5a955c1 fix: remove .line class from logo to fix animation conflict
4d7e773 feat: VHS scan-line tear glitch on NEXUS logo
d385362 fix: replicate exact NexusAscii 2-layer logo from main project
ddbb488 refactor: align design 1:1 with main project terminal
f438d49 feat: initial under-construction terminal site
```

## Tech Stack
- Vite (vanilla TypeScript)
- Vanilla CSS (no Tailwind)
- Mistral Medium 3 via Cloudflare Pages Function proxy
- Target: Cloudflare Pages deployment

## Key Files in Main Project (Reference)
- `maschkeai-chatbot/components/NexusAscii.tsx` — Logo component (already replicated)
- `maschkeai-chatbot/components/useTerminalControllerV2.ts` — Boot sequence + chat
- `maschkeai-chatbot/tailwind.css` — All CSS variables (already extracted)
- `maschkeai-chatbot/components/TerminalMessages.tsx` — Message rendering
