---
description: UC:End a session on the Under-Construction site by updating HANDOVER_CONTEXT.md with current state and committing
---

# /uc-session-end - UC-Session sauber beenden

## Zweck
Wird am Ende jeder Chat-Session für das **Under-Construction-Projekt** (`maschkeai-uc`) ausgeführt.

## Schritte

1. Prüfe ob uncommitted Changes existieren:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && git status --short
```
// turbo

⚠️ Falls uncommitted Changes: Frage den User ob committen oder stashen.

2. Zeige einen Überblick der Session-Arbeit:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && echo "=== Branch ===" && git branch --show-current && echo "=== Commits diese Session ===" && git log --oneline -10
```
// turbo

3. **Aktualisiere `HANDOVER_CONTEXT.md`** mit:
   - `Last updated` Timestamp (aktuelle Zeit + Session-ID)
   - **Recent Session Summary**: Was wurde gemacht? (kurz, mit ✅ Markierungen)
   - **Pending Tasks**: Was steht noch an? (priorisiert: P1/P2/P3/P4)
   - **Architecture Table**: Status-Spalte aktualisieren falls sich was geändert hat
   - Alles andere (Invariants, Design System, Tech Stack) beibehalten

4. Committe die Handover-Änderungen:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && git add HANDOVER_CONTEXT.md && git commit -m "docs: update handover context — session end"
```

5. Falls Remote existiert, pushe:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && git remote -v && if git remote | grep -q origin; then git push origin $(git branch --show-current); else echo "⚠️ Kein Remote — nur lokal committed."; fi
```
// turbo

6. Erstelle einen **Initialprompt** für den nächsten Chat:
   - Kurzer Satz was als nächstes ansteht
   - Format: `/uc-session-start` — dann [nächster Task]
   - Den Prompt dem User als Copy-Paste Block bereitstellen
