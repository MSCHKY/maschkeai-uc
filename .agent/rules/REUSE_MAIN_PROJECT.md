# 🚨 MANDATORY: Reuse from Main Project (maschkeai-chatbot)

## Rule

**BEFORE creating, writing, or inventing ANY content, logic, or configuration that could already exist in the main project (`maschkeai-chatbot`), you MUST:**

1. **CHECK the main project first** at `/Volumes/Work/AI/__CODING/maschkeai-chatbot/`
2. **REUSE** existing content 1:1 whenever possible (legal texts, CSS, system prompts, commands, patterns)
3. **ASK Robert** if unsure whether to adapt or copy verbatim
4. **NEVER silently create a new version** of something that already exists in the main project

## Why

This UC (under-construction) site is a **temporary stand-in** for the full `maschke.ai` website. Both projects share:
- The same brand, legal entity, and contact details
- The same Mistral AI backend and system prompt patterns
- The same design system (CSS variables, fonts, terminal aesthetic)
- The same DSGVO/legal requirements
- The same deployment platform (Cloudflare Pages)

Robert has invested **months** into the main project. The dual-workspace setup exists precisely so we can reference and pull from it. Creating things from scratch wastes that investment.

## Applies to (non-exhaustive)

| Category | Main Project Source |
|---|---|
| **Impressum** | `public/impressum.md` |
| **Datenschutz** | `public/datenschutz.md` |
| **CSS variables** | `tailwind.css` (`:root` section) |
| **System prompt patterns** | `functions/api/mistral.js` |
| **Command patterns** | `components/useTerminalControllerV2.ts` |
| **Consent flow** | `components/useTerminalControllerV2.ts` (CONSENT_KEY, boot phase) |
| **Astronaut logic** | `hooks/useAstronaut.ts` |
| **Legal overlay** | `components/LegalOverlay.tsx` |
| **Contact info** | E-Mail: `kontakt@maschke.ai`, Cal: `cal.eu/maschke-ai` |

## Enforcement

- On **every session start**, mentally verify: "Is there something in the main project I should check first?"
- On **every new feature**, scan the main project for existing patterns before writing code
- On **every content change** (legal, copy, prompts), cross-reference with the main project
- **When in doubt → ASK**, don't invent
