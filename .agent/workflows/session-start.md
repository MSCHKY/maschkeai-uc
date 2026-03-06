---
description: Initialize a new chat session by loading project context and checking git status
---
# /session-start - Session initialisieren

// turbo-all

## Zweck
Wird am Anfang jeder neuen Chat-Session ausgeführt, um den vollen Projektkontext zu laden.

## Schritte

1. Lies das Handover-Dokument:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && cat HANDOVER_CONTEXT.md
```

2. Prüfe den aktuellen Git-Status:
```bash
cd /Volumes/Work/AI/__CODING/maschkeai-uc && echo "=== Branch ===" && git branch --show-current && echo "=== Status ===" && git status --short && echo "=== Last 5 Commits ===" && git log --oneline -5 && echo "=== Remote ===" && git remote -v
```

3. Fasse dem User zusammen:
   - Aktueller Branch + letzter Commit
   - Uncommitted Changes
   - Remote-Status (GitHub verbunden?)
   - Pending Tasks aus HANDOVER_CONTEXT.md
   - Frage: **Womit soll es weitergehen?**
