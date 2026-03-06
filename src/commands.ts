/**
 * Local command handlers — processed without Mistral
 * German terminal style, aligned with main maschkeai-chatbot project
 * ─────────────────────────────────────────────────────────────────
 * PATTERN SOURCE: maschkeai-chatbot/components/useTerminalControllerV2.ts
 * Cal link & contact details must match main project.
 * ─────────────────────────────────────────────────────────────────
 */

export interface CommandResult {
    lines: { text: string; cls: string }[];
}

/** URL for the free 15-min intro call (shared with main project) */
export const CAL_URL = 'https://www.cal.eu/maschke-ai';

const COMMANDS: Record<string, () => CommandResult> = {
    hilfe: () => ({
        lines: [
            { text: '', cls: '' },
            { text: 'HILFE :: BEFEHLE', cls: 'line-system' },
            { text: '─────────────────────────────────', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: 'Themen:', cls: 'line-system' },
            { text: '  about      — Wer ist Maschke.ai?', cls: 'line-dim' },
            { text: '  services   — Was wir machen', cls: 'line-dim' },
            { text: '  contact    — Kontakt aufnehmen', cls: 'line-dim' },
            { text: '  termin     — Kostenloses Erstgespräch buchen', cls: 'line-dim' },
            { text: '  status     — Baustellen-Status', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: 'System:', cls: 'line-system' },
            { text: '  dark · light — Theme wechseln', cls: 'line-dim' },
            { text: '  impressum    — Impressum', cls: 'line-dim' },
            { text: '  datenschutz  — Datenschutzerklärung', cls: 'line-dim' },
            { text: '  clear        — Terminal leeren', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: ' Oder einfach lostippen — NEXUS antwortet.', cls: 'line-dim' },
            { text: '', cls: '' },
        ],
    }),

    about: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' ┌─ ABOUT ─────────────────────────────┐', cls: 'line-system' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  Maschke.ai ist eine Kreativ-Agentur │', cls: 'line-primary' },
            { text: ' │  an der Schnittstelle von Künstlicher │', cls: 'line-primary' },
            { text: ' │  Intelligenz und menschlicher         │', cls: 'line-primary' },
            { text: ' │  Kreativität.                         │', cls: 'line-primary' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  Wir denken KI nicht als Werkzeug,   │', cls: 'line-primary' },
            { text: ' │  sondern als kreative Partnerin.      │', cls: 'line-primary' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  Gründer: Robert Maschke              │', cls: 'line-dim' },
            { text: ' │  Standort: Vettweiß, Deutschland      │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' └──────────────────────────────────────┘', cls: 'line-system' },
            { text: '', cls: '' },
        ],
    }),

    services: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' ┌─ SERVICES ──────────────────────────┐', cls: 'line-system' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  ◆ KI-Beratung & Strategie           │', cls: 'line-cyan' },
            { text: ' │    Von der Idee zur Implementierung   │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  ◆ Workshops & Training              │', cls: 'line-cyan' },
            { text: ' │    KI verstehen, anwenden, meistern   │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  ◆ Kreative KI-Projekte              │', cls: 'line-cyan' },
            { text: ' │    Wenn Maschine auf Muse trifft      │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  ◆ AI-Act Compliance                 │', cls: 'line-cyan' },
            { text: ' │    EU-konforme KI-Implementierung     │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' └──────────────────────────────────────┘', cls: 'line-system' },
            { text: '', cls: '' },
            { text: ' Interesse? Tippe `contact` oder `termin`.', cls: 'line-dim' },
            { text: '', cls: '' },
        ],
    }),

    contact: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' ┌─ KONTAKT ─────────────────────────────┐', cls: 'line-system' },
            { text: ' │                                        │', cls: 'line-system' },
            { text: ' │  ✉  kontakt@maschke.ai                │', cls: 'line-link' },
            { text: ' │     Schreib uns — wir melden uns.      │', cls: 'line-dim' },
            { text: ' │                                        │', cls: 'line-system' },
            { text: ' │  ◆  Kostenloses Erstgespräch (15 min)  │', cls: 'line-cyan' },
            { text: ' │     Tippe `termin` oder direkt buchen:  │', cls: 'line-dim' },
            { text: ' │     cal.eu/maschke-ai                   │', cls: 'line-link' },
            { text: ' │                                        │', cls: 'line-system' },
            { text: ' └─────────────────────────────────────────┘', cls: 'line-system' },
            { text: '', cls: '' },
        ],
    }),

    termin: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' ┌─ ERSTGESPRÄCH BUCHEN ──────────────────┐', cls: 'line-system' },
            { text: ' │                                         │', cls: 'line-system' },
            { text: ' │  ◆  15 Min. kennenlernen — kostenlos    │', cls: 'line-cyan' },
            { text: ' │                                         │', cls: 'line-system' },
            { text: ' │  Unverbindlich und ohne Verpflichtung.  │', cls: 'line-dim' },
            { text: ' │  Wir schauen gemeinsam, ob und wie      │', cls: 'line-dim' },
            { text: ' │  KI in deinem Kontext Sinn macht.       │', cls: 'line-dim' },
            { text: ' │                                         │', cls: 'line-system' },
            { text: ' │  → cal.eu/maschke-ai                    │', cls: 'line-link' },
            { text: ' │                                         │', cls: 'line-system' },
            { text: ' └──────────────────────────────────────────┘', cls: 'line-system' },
            { text: '', cls: '' },
            { text: ' Link wird geöffnet…', cls: 'line-dim' },
            { text: '', cls: '' },
        ],
    }),

    status: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' ┌─ SYSTEM STATUS ─────────────────────┐', cls: 'line-system' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  NEXUS Core:     ██████░░░░  60%     │', cls: 'line-warn' },
            { text: ' │  UI Interface:   ████░░░░░░  40%     │', cls: 'line-warn' },
            { text: ' │  AI Engine:      ████████░░  80%     │', cls: 'line-success' },
            { text: ' │  Creative Suite: ███░░░░░░░  30%     │', cls: 'line-accent' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  Overall:        UNDER CONSTRUCTION  │', cls: 'line-warn' },
            { text: ' │  ETA:            Coming Soon™        │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' └──────────────────────────────────────┘', cls: 'line-system' },
            { text: '', cls: '' },
        ],
    }),

    // Easter Eggs (from main project)
    ping: () => ({
        lines: [
            { text: `PONG. Latenz: ${Math.floor(Math.random() * 42) + 3}ms`, cls: 'line-system' },
        ],
    }),

    sudo: () => ({
        lines: [
            { text: 'Permission denied. Nice try.', cls: 'line-system' },
        ],
    }),

    stats: () => {
        const uptime = Math.floor(Math.random() * 720) + 60;
        const mem = (Math.random() * 256 + 128).toFixed(1);
        const sessions = Math.floor(Math.random() * 1337) + 42;
        return {
            lines: [
                { text: '', cls: '' },
                { text: 'SYSTEM STATS', cls: 'line-system' },
                { text: '───────────────────────────', cls: 'line-dim' },
                { text: `Uptime:    ${uptime} min`, cls: 'line-dim' },
                { text: `Memory:    ${mem} MB / 512 MB`, cls: 'line-dim' },
                { text: `Sessions:  ${sessions}`, cls: 'line-dim' },
                { text: 'Model:     Mistral Medium 3', cls: 'line-dim' },
                { text: 'Status:    Under Construction', cls: 'line-warn' },
                { text: '', cls: '' },
            ],
        };
    },

    matrix: () => {
        const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789';
        const matrixLines: { text: string; cls: string }[] = [{ text: '', cls: '' }];
        for (let i = 0; i < 8; i++) {
            let line = '';
            for (let j = 0; j < 40; j++) {
                line += chars[Math.floor(Math.random() * chars.length)];
            }
            matrixLines.push({ text: line, cls: 'line-success' });
        }
        matrixLines.push({ text: '', cls: '' });
        matrixLines.push({ text: 'Wake up, Neo…', cls: 'line-dim' });
        matrixLines.push({ text: '', cls: '' });
        return { lines: matrixLines };
    },

    secret: () => ({
        lines: [
            { text: '', cls: '' },
            { text: 'Du hast das Easter Egg gefunden.', cls: 'line-system' },
            { text: '', cls: '' },
            { text: "Versuch auch: 'matrix' · 'ping' · 'hack' · 'stats' · 'sudo'", cls: 'line-dim' },
            { text: '', cls: '' },
        ],
    }),
};

// Aliases — multiple names for the same command
const ALIASES: Record<string, string> = {
    help: 'hilfe',
    kontakt: 'contact',
    call: 'termin',
    intro: 'termin',
    cal: 'termin',
    buchen: 'termin',
    'easter egg': 'secret',
    easteregg: 'secret',
};

/**
 * Try to handle input as a local command.
 * Returns null if not a known command (→ send to Mistral).
 */
export function handleCommand(input: string): CommandResult | null {
    const cmd = input.trim().toLowerCase();

    // Direct match
    if (cmd in COMMANDS) {
        return COMMANDS[cmd]();
    }

    // Alias match
    if (cmd in ALIASES) {
        return COMMANDS[ALIASES[cmd]]();
    }

    return null;
}

/**
 * Check if command needs to open an external URL.
 * Returns the URL to open, or null.
 */
export function getCommandUrl(input: string): string | null {
    const cmd = input.trim().toLowerCase();
    if (cmd === 'termin' || cmd === 'call' || cmd === 'intro' || cmd === 'cal' || cmd === 'buchen') {
        return CAL_URL;
    }
    return null;
}

/**
 * Commands that are handled specially in main.ts
 * (clear, impressum, datenschutz, theme, hack)
 */
export function isSpecialCommand(input: string): boolean {
    const cmd = input.trim().toLowerCase();
    return cmd === 'clear' || cmd === 'impressum' || cmd === 'datenschutz'
        || cmd === 'dark' || cmd === 'light' || cmd === 'auto'
        || cmd === 'hack' || cmd === 'hacking';
}
