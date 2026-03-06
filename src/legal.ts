/**
 * Legal content for Impressum and Datenschutz
 * Will be displayed in the overlay and via terminal commands
 */

export const IMPRESSUM_CONTENT = `
<h2>Impressum</h2>
<p><strong>Angaben gemäß § 5 DDG</strong></p>

<p>
Robert Maschke<br>
Maschke.ai — Kreativ-Agentur für Künstliche Intelligenz<br>
Kirchstr. 7<br>
52391 Vettweiß<br>
Deutschland
</p>

<h2>Kontakt</h2>
<p>
E-Mail: hello@maschke.ai
</p>

<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>
Robert Maschke<br>
Kirchstr. 7, 52391 Vettweiß
</p>
`;

export const DATENSCHUTZ_CONTENT = `
<h2>Datenschutzerklärung</h2>

<h2>1. Verantwortlicher</h2>
<p>Robert Maschke, Maschke.ai — hello@maschke.ai</p>

<h2>2. Hosting</h2>
<p>Diese Website wird bei Cloudflare, Inc. gehostet. Beim Besuch der Seite werden automatisch Server-Log-Dateien erfasst (IP-Adresse, Zeitpunkt, aufgerufene Seite). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>

<h2>3. KI-Chat (NEXUS)</h2>
<p>Der integrierte Chat nutzt Mistral AI (Mistral AI, Paris, Frankreich) zur Verarbeitung von Nachrichten. Ihre Eingaben werden an die Mistral-API übermittelt und nicht dauerhaft gespeichert. Die Verarbeitung erfolgt auf EU-Servern. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Nutzung).</p>

<h2>4. Cookies & Speicher</h2>
<p>Diese Seite verwendet ausschließlich technisch notwendige Session-Storage-Einträge (Nachrichtenzähler). Es werden keine Tracking-Cookies eingesetzt.</p>

<h2>5. Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontakt: hello@maschke.ai</p>

<h2>6. Beschwerderecht</h2>
<p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.</p>
`;

export const IMPRESSUM_TERMINAL = [
    { text: '', cls: '' },
    { text: ' ┌─ IMPRESSUM ─────────────────────────┐', cls: 'line-system' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  Angaben gemäß § 5 DDG              │', cls: 'line-dim' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  Robert Maschke                       │', cls: 'line-primary' },
    { text: ' │  Maschke.ai                           │', cls: 'line-primary' },
    { text: ' │  Kreativ-Agentur für KI               │', cls: 'line-primary' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  Kirchstr. 7                          │', cls: 'line-dim' },
    { text: ' │  52391 Vettweiß                       │', cls: 'line-dim' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  ✉  hello@maschke.ai                │', cls: 'line-link' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' └──────────────────────────────────────┘', cls: 'line-system' },
    { text: '', cls: '' },
];

export const DATENSCHUTZ_TERMINAL = [
    { text: '', cls: '' },
    { text: ' ┌─ DATENSCHUTZ ───────────────────────┐', cls: 'line-system' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  Hosting: Cloudflare (Server-Logs)   │', cls: 'line-dim' },
    { text: ' │  Chat-AI: Mistral AI (EU, DSGVO ok)  │', cls: 'line-dim' },
    { text: ' │  Cookies: Keine Tracking-Cookies      │', cls: 'line-dim' },
    { text: ' │  Storage: Nur Session (Zähler)        │', cls: 'line-dim' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  Details: Klick auf "Datenschutz"     │', cls: 'line-dim' },
    { text: ' │  im Footer für die volle Version.     │', cls: 'line-dim' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' │  ✉  hello@maschke.ai                │', cls: 'line-link' },
    { text: ' │                                      │', cls: 'line-system' },
    { text: ' └──────────────────────────────────────┘', cls: 'line-system' },
    { text: '', cls: '' },
];
