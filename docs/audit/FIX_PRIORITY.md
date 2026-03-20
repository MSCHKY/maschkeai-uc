# Fix Priority: maschkeai-uc

Stand: 2026-03-20

Ziel:
- die Seite schnell von auditierbar auf weitergabefähig bringen
- zuerst Vertrauen, Gesprächsökonomie und Conversion-Risiken schließen

## P0

### 1. Consent-Führung reparieren

Ziel:
- keine Wahrnehmung von „erst senden, dann fragen“

Maßnahmen:
- erste Nutzereingabe vor Consent nicht normal ins Terminal schreiben
- Consent als echte vorgeschaltete Entscheidung inszenieren
- nach Zustimmung die ursprüngliche Nachricht nur einmal ausspielen
- sprachlich klarer machen, was lokal passiert und was erst nach Zustimmung an die KI geht

Erfolgskriterium:
- der erste Kontakt wirkt sauber, kontrolliert und vertrauenswürdig

## P0

### 2. Antwortlänge und Typewriter drastisch straffen

Ziel:
- in 5 Nachrichten echte Orientierung und Qualifizierung ermöglichen

Maßnahmen:
- Ziel-Länge der Antworten deutlich senken
- Typewriter-Geschwindigkeit erhöhen oder für längere Passagen anders lösen
- frühe Antworten stärker auf Bedarfsschärfung statt Markenprosa trimmen
- CTA erst einsetzen, wenn genug Kontext da ist

Erfolgskriterium:
- 2 bis 3 Nachrichten reichen für ein klares Gefühl von Kompetenz und Richtung

## P0

### 3. Datenschutzerklärung formal bereinigen

Ziel:
- sichtbare Trust-Brüche eliminieren

Maßnahmen:
- fehlerhafte Abschnittsnummerierung korrigieren
- Overlay- und Terminalfassung auf Konsistenz prüfen
- rechtliche Aussagen gegen aktuellen tatsächlichen Produktzustand gegenlesen

Erfolgskriterium:
- keine offen sichtbaren formalen Fehler mehr im Legal-Bereich

## P1

### 4. NEXUS Gesprächsführung enger an die gewünschte Mikro-Journey binden

Ziel:
- weniger frühes Pitchen, mehr präzise Führung

Maßnahmen:
- Prompts auf kürzere, schärfere erste Antworten trimmen
- klare Regeln gegen frühe Service-Erklärung und frühe E-Mail-Nennung verschärfen
- Bedarf früher in Problem-, Reibungs- oder Projektlogik übersetzen
- Live-Verhalten gegen reale Beispielprompts testen, nicht nur gegen Wunsch-Prompt

Erfolgskriterium:
- NEXUS wirkt zuerst klärend und souverän, erst später konvertierend

## P1

### 5. CTA- und Kontaktführung robuster machen

Ziel:
- nicht alles in `mailto:` enden lassen

Maßnahmen:
- wenigstens einen frictionarmen Sekundärpfad ergänzen
- klar kommunizieren, was nach Kontakt passiert
- Limit-CTA weniger generisch und stärker qualifizierend formulieren
- prüfen, ob ein minimales In-Terminal-Kontaktformat sinnvoller ist als nur Mailto

Erfolgskriterium:
- der nächste Schritt wirkt konkret, leicht und glaubwürdig

## P1

### 6. YORI im Frühkontakt zurücknehmen

Ziel:
- weniger Gimmick, mehr gezielte Unterstützung der Hauptführung

Maßnahmen:
- Bubble-Frequenz reduzieren
- direkte CTA-/Command-Nudges von YORI entschärfen
- Easter-Egg-Energie später oder seltener einsetzen
- prüfen, ob YORI erst nach erster Interaktion stärker sichtbar werden sollte

Erfolgskriterium:
- YORI ergänzt die Experience, ohne Seriosität oder Fokus zu verwässern

## P1

### 7. Chat-Limit technisch fair machen

Ziel:
- Fehler sollen keine Nachrichten kosten

Maßnahmen:
- Zähler erst nach erfolgreichem Request/Response erhöhen oder bei Fehlern zurückrollen
- Error-Zustände sauber unterscheiden
- bei Upstream-/Rate-Limit-Problemen bessere Recovery-Kommunikation anzeigen

Erfolgskriterium:
- Nutzer verlieren keine begrenzten Turns ohne Gegenwert

## P1

### 8. Terminal-UX-Bug bei Command-History beheben

Ziel:
- Terminal-Gefühl nicht durch kleine Inkonsistenzen beschädigen

Maßnahmen:
- Input-Breite bei `ArrowUp`/`ArrowDown` nachziehen
- Cursor-Position und Darstellung danach prüfen

Erfolgskriterium:
- History-Navigation wirkt sauber und absichtlich gebaut

## P2

### 9. Mobile Dichte reduzieren

Ziel:
- untenrum mehr Ruhe und Lesbarkeit

Maßnahmen:
- Zusammenspiel aus langem Text, YORI, Status-Bar und Footer entschärfen
- vertikale Hierarchie auf kleinen Screens vereinfachen
- prüfen, ob einzelne UI-Elemente auf Mobile weniger präsent sein sollten

Erfolgskriterium:
- Mobile wirkt kontrolliert statt gedrängt

## P2

### 10. Indexierung und Metadaten bewusst entscheiden

Ziel:
- keine halbgar indexierte UC-Seite

Maßnahmen:
- entscheiden, ob die Seite jetzt schon indexiert werden soll
- `canonical`, Favicon, `og:image` und saubere Social-Metadaten ergänzen
- Snippet-Text stärker an tatsächlicher Positionierung ausrichten

Erfolgskriterium:
- Such- und Share-Vorschau wirken absichtlich statt placeholderhaft

## Empfohlene Reihenfolge

1. Consent-Führung
2. Antwortlänge und Typewriter
3. Legal-Korrektur
4. NEXUS-Mikro-Journey
5. CTA-/Kontaktpfad
6. Chat-Limit-Fairness
7. YORI-Reduktion
8. History-Bug
9. Mobile-Polish
10. Metadaten/Indexierung
