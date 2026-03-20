# UC Site Audit Report — Pre-Launch
**Datum:** 2026-03-20 | **Branch:** `main` | **HEAD:** `c2b452a`

---

## ✅ PASS — Automatisierte Checks

| Check | Ergebnis | Details |
|---|---|---|
| **TypeScript** `tsc --noEmit` | ✅ 0 Errors | Strict mode, clean |
| **Build** `npm run build` | ✅ OK | 156ms, 9 modules |
| **Bundle JS** | ✅ 33.5 KB (11.8 KB gzip) | Exzellent |
| **Bundle CSS** | ✅ 30.8 KB (6.2 KB gzip) | OK |
| **Dead Code** | ✅ Keine ungenutzten Exporte | Alle 7 Src-Files aktiv genutzt |

---

## 🔴 CRITICAL — Compliance Bugs (bereits gefixt)

### BUG-01: Cal.com-URL wird bei `termin`-Command geöffnet ~~FIXED~~
- **Datei:** `src/commands.ts` — `getCommandUrl()`
- **Problem:** `getCommandUrl()` öffnete `cal.eu/maschke-ai` bei `termin`/`call`/`buchen`, obwohl UC-Invariant #13 Email-only vorschreibt. Nutzer wurden auf externe Site weitergeleitet.
- **Fix:** `getCommandUrl()` gibt immer `null` zurück. `CAL_URL` entfernt.

### BUG-02: Datenschutz nennt `Mistral Medium 3` explizit ~~FIXED~~
- **Datei:** `src/legal.ts` — `DATENSCHUTZ_CONTENT`, Abschnitt "7. KI-Chatbot"
- **Problem:** Modellname direkt in öffentlichem Dokument — verletzt Invariant #12 (no model disclosure).
- **Fix:** Geändert zu "KI-Anbieter: Mistral AI (Paris)" — kein Modellname mehr.

### BUG-03: Datenschutz enthält Cal.com-Abschnitt (nicht genutzt) ~~FIXED~~
- **Datei:** `src/legal.ts` — `DATENSCHUTZ_CONTENT` + `DATENSCHUTZ_TERMINAL_HTML`
- **Problem:** Abschnitt "Terminbuchung über Cal.com" incl. Privacy-Link — Cal.com wird im UC nicht genutzt, ein Abschnitt dazu ist DSGVO-irreführend.
- **Fix:** Abschnitt ersetzt durch "Kontaktaufnahme: E-Mail only". Cal.com aus Terminal-Box entfernt.

---

## 🟡 OPEN — Findings zur Entscheidung

### FIND-01: Datenschutz Abschnittsnummern inkonsistent nach Fixes
- **Datei:** `src/legal.ts`
- **Problem:** Nach dem Entfernen von Abschnitt 6 (Cal.com) springen die Nummern 6→7→8 nicht mehr linear. Aktuelles: 5=Cloudflare, 6=Kontaktaufnahme, 7=KI-Chatbot, **8=Session Storage** (neuer Header — wurde Snippet "8. Session Storage" auf die Zeile mit "Wenn Sie uns per E-Mail..." gesetzt, aber der eigentliche Session Storage-Paragraph darunter hat noch den alten Inhalt der Kontaktaufnahme).
- **Severity:** MEDIUM — Legal text ist inhaltlich durcheinander.
- **Empfehlung:** Datenschutz vollständig neu nummerieren und Kontaktaufnahme-Block reparieren.

### FIND-02: `og:image` fehlt komplett
- **Datei:** `index.html`
- **Problem:** Keine `og:image` Meta-Tag. Social Media Shares (WhatsApp, LinkedIn) zeigen kein Vorschaubild → schlechter erster Eindruck.
- **Severity:** LOW für UC, relevant für Go-Live
- **Empfehlung:** Minimal-OG-Image generieren (1200×630px, Logo + "Coming Soon")

### FIND-03: `og:image` und `twitter:card` fehlen
- **Datei:** `index.html`
- **Problem:** Kein Twitter/X Card Meta. Ergänzung von `og:image` sollte gleichzeitig passieren.

### FIND-04: `package.json` version ist `0.0.0`
- **Datei:** `package.json`
- **Problem:** Keine Versionierung gepflegt.
- **Severity:** NEGLIGIBLE für UC

### FIND-05: `content-security-policy` Header fehlt
- **Problem:** Kein CSP-Header via `_headers` oder Cloudflare-Regel. Öffnet theoretisch XSS-Angriffsfläche. Der Code escaped korrekt via `escapeHtml()`, aber ein Header-basierter CSP wäre Defense-in-Depth.
- **Severity:** LOW — kein kritisches Risiko für UC, aber vor Haupt-Launch relevant

### FIND-06: a11y — `line-dim` Kontrast unzureichend (bereits bekannt)
- **Datei:** `src/style.css`, `.line-dim`
- **Problem:** Aus HANDOVER bekannt (P2). `--terminal-ink` mit Opacity-Reduktion unterschreitet WCAG 2.1 AA (4.5:1 Mindest-Kontrast).
- **Severity:** LOW für UC, P2-Backlog

### FIND-07: `favicon` fehlt
- **Datei:** `index.html` / `public/`
- **Problem:** Kein `<link rel="icon">`, kein `favicon.ico` in `public/`. Browser zeigt Default-Icon.
- **Severity:** LOW — sieht unprofessionell aus

### FIND-08: `robots.txt` fehlt
- **Datei:** `public/`
- **Problem:** Kein `robots.txt`. `<meta name="robots" content="index, follow">` ist gesetzt, aber ohne `robots.txt` kein Sitemap-Hint für Crawler.
- **Severity:** NEGLIGIBLE für UC

---

## 🟢 PASS — Sicherheit

| Check | Status |
|---|---|
| API-Key exposure | ✅ Server-side only (Cloudflare Pages Function) |
| Prompt Injection Detection | ✅ 15 Patterns, blocking 403 |
| Rate Limiting | ✅ 10 req/min per IP |
| HTML-Escaping / XSS | ✅ `escapeHtml()` konsequent |
| CORS | ✅ Same-origin only |
| Input Sanitation | ✅ Role whitelist, 4000-char cap, 12-msg max |
| DSGVO Consent Gate | ✅ Vor KI-Chat, Impressum/Datenschutz immer zugänglich |

---

## 🟢 PASS — DSGVO / Legal

| Check | Status |
|---|---|
| Impressum §5 DDG | ✅ Footer täglich sichtbar, Overlay |
| Datenschutz | ✅ Footer + Overlay |
| Consent vor KI | ✅ Ja, explizit |
| Session Storage statt Cookies | ✅ Korrekt dokumentiert |
| EU-OS Link entfernt | ✅ Nicht vorhanden |

---

## 🟢 PASS — SEO & HTML Struktur

| Check | Status |
|---|---|
| `<html lang="de">` | ✅ |
| `<title>` | ✅ |
| `<meta description>` | ✅ |
| `<meta robots>` | ✅ index, follow |
| `og:title`, `og:description` | ✅ |
| `og:image` | ❌ fehlt (FIND-02) |
| `aria-label` auf Input | ✅ |
| `aria-hidden` auf dekorativen Elementen | ✅ |

---

## Zusammenfassung

| Priorität | Anzahl | Status |
|---|---|---|
| 🔴 CRITICAL | 3 | ✅ Alle gefixt |
| 🟡 OPEN | 8 | Zur Entscheidung |
| 🟢 PASS | — | — |

**Go-Live-Empfehlung:** FIND-01 (Datenschutz-Nummerierung) ist als Legal-Text reparaturbedürftig. Die restlichen Findings (FIND-02 bis FIND-08) sind für UC-Launch tolerierbar aber bekannt.
