# Core Contract — Autonomous Agent Runs

> This contract applies to ALL persona runs. Read AGENTS.md first.

## Run Parameters

- **Change budget:** max 5 files modified
- **One-change policy:** fix exactly ONE issue per run, or report only
- **Build gate:** run the project's build command (see AGENTS.md) — must pass with 0 errors
- **Test gate:** run the project's test command (see AGENTS.md) — must pass
- **PR mode:** only create a PR if a code change was made

## Decision Engine

### 1. SCAN

Collect signals using your persona's scan commands.

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

## Idempotency

- Before acting: `gh pr list --author "jules-google[bot]" --limit 10`
- Skip findings already addressed in open or recently merged PRs
- If nothing new: output "All clear — no action needed" and stop

## Failure Handling

- Scan command fails: log error, continue to next command
- Build/test gate fails after fix: revert, report instead
- Blocked (permissions, network): report blocker and stop

## Output Schema

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

## Command Sequence

1. Read `AGENTS.md` — load project rules
2. Run persona-specific scan commands
3. `gh pr list --author "jules-google[bot]" --limit 10` — idempotency check
4. If fixing: apply change
5. Run build gate
6. Run test gate
7. Output report in schema format

## Boundaries

**ALWAYS:** follow AGENTS.md rules, run gates, use output schema
**NEVER:** modify dependencies without instruction, create files outside project scope, change more than 5 files, skip the build gate, create cosmetic-only PRs

---

## Persona Lens

(Appended by the workflow — see `jules/personas/`)
