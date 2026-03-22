---
description: UC-Session initialisieren — Projektkontext laden, Git-Status pruefen, Pending Tasks zusammenfassen
---

# UC Session Start

## Zweck
Wird am Anfang jeder neuen Chat-Session fuer das **Under-Construction-Projekt** (`maschkeai-uc`) ausgefuehrt.

## Schritte

1. **Handover laden:**
```bash
cat HANDOVER_CONTEXT.md
```

2. **Cross-Referenz-Regeln laden** (was vom Hauptprojekt wiederverwendet werden soll):
```bash
if [ -f .agent/rules/REUSE_MAIN_PROJECT.md ]; then cat .agent/rules/REUSE_MAIN_PROJECT.md; fi
```

3. **Server-Regel laden** (KEIN lokaler Dev-Server!):
```bash
if [ -f .agent/rules/NO_LOCAL_SERVER.md ]; then cat .agent/rules/NO_LOCAL_SERVER.md; fi
```

4. **Git-Status pruefen:**
```bash
echo "=== Branch ===" && git branch --show-current && echo "=== Status ===" && git status --short && echo "=== Letzte 5 Commits ===" && git log --oneline -5 && echo "=== Remote ===" && git remote -v
```

5. **Zusammenfassung** — Fasse dem User zusammen:
   - Aktueller Branch + letzter Commit
   - Uncommitted Changes (besonders wichtig aus unterbrochenen Sessions!)
   - Remote-Status (GitHub verbunden?)
   - Pending Tasks aus HANDOVER_CONTEXT.md
   - Frage: **Womit soll es weitergehen?**
