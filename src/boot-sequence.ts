/**
 * Boot sequence lines for the terminal
 * Each entry: [text, cssClass, delayMs]
 *
 * Aligned with main maschkeai-chatbot project (NEXUS OS v4.0.2)
 */

export interface BootLine {
    text: string;
    cls: string;
    delay: number;
}

export const BOOT_SEQUENCE: BootLine[] = [
    { text: 'NEXUS OS v4.0.2', cls: 'line-system', delay: 0 },
    { text: '───────────────────────────', cls: 'line-system', delay: 80 },
    { text: 'BOOT: Secure Shell… OK', cls: 'line-system', delay: 320 },
    { text: 'BOOT: Uplink… OK', cls: 'line-system', delay: 200 },
    { text: 'BOOT: Protokoll-Stack… OK', cls: 'line-system', delay: 180 },
    { text: '', cls: '', delay: 200 }, // pause
    { text: 'PROGRESS_BAR', cls: 'progress-bar', delay: 0 }, // special: animated progress
    { text: '', cls: '', delay: 300 },
    { text: 'ASCII_LOGO', cls: 'line-logo', delay: 0 }, // special: render logo
    { text: '', cls: '', delay: 300 },
    { text: ' Kreativ-Agentur für Künstliche Intelligenz', cls: 'line-dim', delay: 60 },
    { text: ' ──────────────────────────────────────────', cls: 'line-dim', delay: 40 },
    { text: '', cls: '', delay: 200 },
    { text: ' Status: UNDER CONSTRUCTION', cls: 'line-warn', delay: 100 },
    { text: ' ETA:    Coming Soon™', cls: 'line-dim', delay: 80 },
    { text: '', cls: '', delay: 300 },
    { text: " Tippe 'hilfe' für Befehle, oder sprich einfach mit NEXUS.", cls: 'line-dim', delay: 60 },
    { text: '', cls: '', delay: 200 },
];
