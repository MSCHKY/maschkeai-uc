/**
 * Local command handlers — processed without Mistral
 */

export interface CommandResult {
    lines: { text: string; cls: string }[];
}

const COMMANDS: Record<string, () => CommandResult> = {
    help: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' Available commands:', cls: 'line-system' },
            { text: ' ─────────────────────────────────', cls: 'line-dim' },
            { text: '  help       — Show this menu', cls: 'line-dim' },
            { text: '  about      — Who is Maschke.ai?', cls: 'line-dim' },
            { text: '  services   — What we do', cls: 'line-dim' },
            { text: '  contact    — Get in touch', cls: 'line-dim' },
            { text: '  status     — Construction status', cls: 'line-dim' },
            { text: '  impressum  — Legal notice', cls: 'line-dim' },
            { text: '  datenschutz — Privacy policy', cls: 'line-dim' },
            { text: '  clear      — Clear terminal', cls: 'line-dim' },
            { text: '  dark       — Dark mode', cls: 'line-dim' },
            { text: '  light      — Light mode', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: ' Or just type anything — NEXUS will respond.', cls: 'line-dim' },
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
            { text: ' │  Standort: Deutschland                │', cls: 'line-dim' },
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
        ],
    }),

    contact: () => ({
        lines: [
            { text: '', cls: '' },
            { text: ' ┌─ CONTACT ───────────────────────────┐', cls: 'line-system' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  ✉  hello@maschke.ai                │', cls: 'line-link' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' │  Wir melden uns.                      │', cls: 'line-dim' },
            { text: ' │  Versprochen.                         │', cls: 'line-dim' },
            { text: ' │                                      │', cls: 'line-system' },
            { text: ' └──────────────────────────────────────┘', cls: 'line-system' },
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
};

/**
 * Try to handle input as a local command.
 * Returns null if not a known command (→ send to Mistral).
 */
export function handleCommand(input: string): CommandResult | null {
    const cmd = input.trim().toLowerCase();
    if (cmd in COMMANDS) {
        return COMMANDS[cmd]();
    }
    return null;
}

export function isSpecialCommand(input: string): boolean {
    const cmd = input.trim().toLowerCase();
    return cmd === 'clear' || cmd === 'impressum' || cmd === 'datenschutz'
        || cmd === 'dark' || cmd === 'light' || cmd === 'auto';
}
