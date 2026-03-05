/**
 * Boot sequence lines for the terminal
 * Each entry: [text, cssClass, delayMs]
 */

export interface BootLine {
    text: string;
    cls: string;
    delay: number;
}

export const BOOT_SEQUENCE: BootLine[] = [
    { text: '[BOOT] Initializing NEXUS Core v0.1...', cls: 'line-system', delay: 100 },
    { text: '[BOOT] Loading maschke.ai kernel modules...', cls: 'line-system', delay: 80 },
    { text: '', cls: '', delay: 200 }, // pause
    { text: 'PROGRESS_BAR', cls: 'progress-bar', delay: 0 }, // special: animated progress
    { text: '', cls: '', delay: 300 },
    { text: '[OK] AI Engine mounted (Mistral Medium 3)', cls: 'line-success', delay: 120 },
    { text: '[OK] Encryption layer active', cls: 'line-success', delay: 90 },
    { text: '[OK] Creative protocols loaded', cls: 'line-success', delay: 90 },
    { text: '', cls: '', delay: 400 },
    { text: 'ASCII_LOGO', cls: 'line-logo', delay: 0 }, // special: render logo
    { text: '', cls: '', delay: 300 },
    { text: ' Kreativ-Agentur für Künstliche Intelligenz', cls: 'line-dim', delay: 60 },
    { text: ' ──────────────────────────────────────────', cls: 'line-dim', delay: 40 },
    { text: '', cls: '', delay: 200 },
    { text: ' Status: UNDER CONSTRUCTION', cls: 'line-warn', delay: 100 },
    { text: ' ETA:    Coming Soon™', cls: 'line-dim', delay: 80 },
    { text: '', cls: '', delay: 300 },
    { text: " Type 'help' for available commands, or just talk to NEXUS.", cls: 'line-dim', delay: 60 },
    { text: '', cls: '', delay: 200 },
];
