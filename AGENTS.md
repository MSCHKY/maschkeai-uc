# AGENTS.md — maschkeai-uc

## Project

Under-Construction Landing Page fuer maschke.ai. Fullscreen Terminal-Erlebnis mit YORI Astronaut-Maskottchen, Mistral AI Chat (5-Nachrichten-Limit) und Kontaktformular via Brevo EU.

## Tech Stack

- **Frontend:** Vanilla TypeScript + Vite 7
- **Styling:** Vanilla CSS (custom properties, kein Framework)
- **Backend:** Cloudflare Pages Function (Mistral AI Proxy)
- **Contact:** Brevo API (EU) fuer Kontaktformular
- **Hosting:** Cloudflare Pages (Git-Integration)

## Setup

```bash
npm install
npm run build    # tsc && vite build
npm test         # Node test runner
```

## Architecture

```
maschkeai-uc/
├── src/
│   ├── main.ts              # Entry point, boot sequence
│   ├── terminal.ts          # Terminal UI engine
│   ├── chat.ts              # Mistral AI chat integration
│   ├── contact.ts           # Contact form logic
│   ├── astronaut.ts         # YORI mascot animations
│   ├── theme.ts             # Light/dark mode
│   └── style.css            # All styles
├── functions/
│   └── api/
│       ├── mistral.ts       # Mistral AI proxy
│       └── contact.ts       # Brevo contact API
├── tests/
│   └── *.test.ts            # Node test runner tests (36 tests)
├── public/                  # Static assets
├── index.html               # Entry HTML
└── vite.config.ts           # Vite config
```

## Coding Rules

1. **Language:** UI labels in German, code + comments + commit messages in English.
2. **Anti-Patchwork:** Do NOT introduce new libraries, CSS classes, or patterns if equivalents already exist in the project.
3. **Types:** All new code must be fully typed. No `any` types.
4. **No Local Server:** NEVER start a local dev server. Test via push to main → Cloudflare auto-deploy.
5. **Reuse from Main Project:** Before creating new content, check if it exists in `maschkeai-chatbot` first (legal texts, CSS patterns, system prompts).
6. **No Frameworks:** This is a vanilla TS project. Do NOT add React, Vue, or any UI framework.

## Testing

- **Framework:** Node test runner (built-in, `--experimental-strip-types`)
- **Run tests:** `npm test`
- Follow existing test patterns. Do not introduce new test frameworks.

## Deployment

- **Platform:** Cloudflare Pages (Git integration)
- **Trigger:** Push to `main` triggers automatic deploy
- **URL:** https://maschkeai-uc.pages.dev
- NEVER deploy manually unless explicitly instructed.

## Git Hygiene

- One PR = one logical change. Don't mix features with refactoring or documentation.
- NEVER commit test artifacts, lock files (unless deps changed), or secrets.
- ALWAYS verify build passes before creating a PR.
- ALWAYS run existing tests after changes — fix any failures before creating a PR.
- Commit messages use conventional format: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.

## Task Boundaries [FEST]

- **Change budget:** max 5 files modified per task.
- **One-change policy:** fix exactly ONE issue per run, or report only.
- **Build gate:** `npm run build` must pass with 0 errors.
- **Test gate:** `npm test` must pass.
- Each task should touch as few files as possible.
- When writing tests: provide ONLY the test file — no side-effect changes to production code.
- When fixing bugs: explain the root cause in the PR description.
- Do NOT create "optimization" PRs that only reformat or restructure without measurable impact.
- Do NOT split a single logical change into multiple PRs.

## Decision Engine [FEST]

### 1. SCAN

Collect signals using your assigned scan commands (defined by persona or task).

### 2. ASSESS

Rate each finding:

| Dimension  | Values                                              |
|------------|-----------------------------------------------------|
| Severity   | Critical / High / Medium / Low                      |
| Confidence | High / Medium / Low                                 |
| Effort     | S (< 30 lines) / M (< 100 lines) / L (> 100 lines) |

### 3. DECIDE

```
IF finding.severity IN (Critical, High)
   AND finding.confidence >= Medium
   AND finding.effort <= M
   AND fix is safe (no breaking changes):
     -> FIX the issue. Create PR.

ELSE:
     -> REPORT only. No PR. Output patch plan for human review.
```

### 4. VERIFY

After any code change:
- Run build gate
- Run test gate
- If either fails -> revert change, switch to REPORT mode

## Idempotency [FEST]

- Before acting: check recent PRs (`gh pr list --author "jules-google[bot]" --limit 10`)
- Skip any finding already addressed in an open or recently merged PR
- If nothing new found: output "All clear — no action needed" and stop
- Do NOT create duplicate PRs for the same issue

## Output Schema [FEST]

Always use this format for task output:

```
## Summary
[1-2 sentences: what was scanned, what was found]

## Findings
| # | Issue | Severity | Confidence | Effort | Action |
|---|-------|----------|------------|--------|--------|
| 1 | ...   | ...      | ...        | ...    | FIX / REPORT / SKIP |

## Action Taken
[If FIX: exact files changed + why. If REPORT: patch plan for human.]

## Validation
- Build: PASS/FAIL
- Tests: PASS/FAIL (X passed, Y failed)

## Next Step
[Recommendation for next run or human follow-up]
```

## Boundaries [FEST]

**ALWAYS:**
- Follow the Coding Rules above
- Run build gate and test gate before creating a PR
- Use the Output Schema for all reports
- Check idempotency before acting

**NEVER:**
- Modify dependency files (package.json, requirements.txt) without explicit instruction
- Create files outside the project scope
- Change more than 5 files in a single task
- Skip the build gate
- Create PRs for cosmetic-only changes (formatting, whitespace, comment rewording)
- Create PRs that "optimize" code without measurable evidence of a problem
