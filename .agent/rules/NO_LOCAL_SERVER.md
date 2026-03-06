# 🚨 ABSOLUTE RULE: NO LOCAL DEV SERVER FOR UC SITE

> **Scope: NUR maschkeai-uc!** Das Hauptprojekt (maschkeai-chatbot) nutzt weiterhin lokale Server (Port 3000/8788).

## Rule

**NEVER start a local dev server (`npm run dev`, `npm run pages:dev`, `vite`, etc.) for this project.**

This is NOT negotiable. Robert has stated this MULTIPLE TIMES.

## How to Test

1. **Commit + Push to `main`** → Cloudflare Pages auto-deploys
2. **Test on production URL:** `https://maschkeai-uc.pages.dev/`
3. **Use Playwright MCP** to navigate to `https://maschkeai-uc.pages.dev/` for visual verification

## Why

- The UC site is a simple Vite site deployed via Cloudflare Pages Git integration
- Push to `main` triggers an automatic production deploy (takes ~30 seconds)
- There is NO preview branch workflow — `main` IS the deploy branch
- Local servers are unnecessary overhead for a site this simple
- Robert does not want local servers cluttering his machine

## Enforcement

- On **every code change**, commit → push → verify on Cloudflare
- **NEVER run** `npm run dev`, `npm run pages:dev`, `npx vite`, or any variant
- **NEVER use** `localhost` URLs for testing this project
- If you catch yourself about to start a server → **STOP** → commit + push instead
