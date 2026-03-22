---
description: UC-Session sauber beenden — HANDOVER_CONTEXT.md aktualisieren, committen, Initialprompt fuer naechste Session
---

# UC Session End

## Zweck
Wird am Ende jeder Chat-Session fuer das **Under-Construction-Projekt** (`maschkeai-uc`) ausgefuehrt.

## Schritte

1. **Uncommitted Changes pruefen:**
```bash
git status --short
```
Falls uncommitted Changes vorhanden: Frage den User ob committen oder stashen.

2. **Session-Ueberblick:**
```bash
echo "=== Branch ===" && git branch --show-current && echo "=== Commits diese Session ===" && git log --oneline -10
```

3. **HANDOVER_CONTEXT.md aktualisieren** mit:
   - `Last updated` Timestamp (aktuelle Zeit)
   - **Recent Session Summary**: Was wurde gemacht? (kurz, mit Markierungen)
   - **Pending Tasks**: Was steht noch an? (priorisiert: P1/P2/P3/P4)
   - **Architecture Table**: Status-Spalte aktualisieren falls sich was geaendert hat
   - Alles andere (Invariants, Design System, Tech Stack) beibehalten

4. **Commit + Push:**
```bash
git add HANDOVER_CONTEXT.md && git commit -m "docs: update handover context — session end"
```

5. **Push zum Remote** (falls vorhanden):
```bash
if git remote | grep -q origin; then git push origin $(git branch --show-current); else echo "Kein Remote — nur lokal committed."; fi
```

6. **Initialprompt erstellen** — Kurzer Copy-Paste Block fuer die naechste Session:
   - Format: `/uc-session-start` — dann [naechster Task]
   - Dem User als Block bereitstellen
