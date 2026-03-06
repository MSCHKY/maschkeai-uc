---
description: UC:Initialize a new chat session for the Under-Construction site by loading project context and checking git status
---

# /uc-session-start - UC-Session initialisieren

// turbo-all

## Zweck
Wird am Anfang jeder neuen Chat-Session für das **Under-Construction-Projekt** (`maschkeai-uc`) ausgeführt.

## Schritte

1. Lies das Handover-Dokument:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && cat HANDOVER_CONTEXT.md
```

2. Lies die Cross-Referenz-Regeln (was vom Hauptprojekt wiederverwendet werden soll):
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && cat .agent/rules/REUSE_MAIN_PROJECT.md
```

3. Prüfe den aktuellen Git-Status:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && echo "=== Branch ===" && git branch --show-current && echo "=== Status ===" && git status --short && echo "=== Last 5 Commits ===" && git log --oneline -5 && echo "=== Remote ===" && git remote -v
```

4. Fasse dem User zusammen:
   - Aktueller Branch + letzter Commit
   - Uncommitted Changes (besonders wichtig: aus unterbrochenen Sessions!)
   - Remote-Status (GitHub verbunden?)
   - Pending Tasks aus HANDOVER_CONTEXT.md
   - Frage: **Womit soll es weitergehen?**
