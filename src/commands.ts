/**
 * Local command handlers — processed without Mistral
 * German terminal style, aligned with main maschkeai-chatbot project
 * ─────────────────────────────────────────────────────────────────
 * PATTERN SOURCE: maschkeai-chatbot/components/useTerminalControllerV2.ts
 * Cal link & contact details must match main project.
 * ─────────────────────────────────────────────────────────────────
 * OUTPUT FORMAT: Commands can return either:
 *   - lines[] (legacy line-by-line rendering)
 *   - html (a single HTML string rendered via innerHTML — used for CSS boxes)
 * ─────────────────────────────────────────────────────────────────
 */

export interface CommandResult {
    /** Line-by-line output (legacy — Easter eggs, simple commands) */
    lines?: { text: string; cls: string }[];
    /** HTML block output (CSS-styled boxes — main info commands) */
    html?: string;
}

/** URL for the free 15-min intro call (shared with main project) */
export const CAL_URL = 'https://www.cal.eu/maschke-ai';

// ── Helper: Build a styled terminal box ──────────────────────────────
function box(title: string, body: string): string {
    return `<div class="terminal-box">
  <div class="terminal-box-title">${title}</div>
  <div class="terminal-box-body">${body}</div>
</div>`;
}

// ── Commands ─────────────────────────────────────────────────────────

const COMMANDS: Record<string, () => CommandResult> = {
    hilfe: () => ({
        lines: [
            { text: '', cls: '' },
            { text: 'BEFEHLE', cls: 'line-system' },
            { text: '───────────────────────────', cls: 'line-dim' },
            { text: '  about       Wer ist maschke.ai?', cls: 'line-dim' },
            { text: '  services    Was wir machen', cls: 'line-dim' },
            { text: '  contact     Kontakt aufnehmen', cls: 'line-dim' },
            { text: '  status      Baustellen-Status', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: '  dark/light  Theme wechseln', cls: 'line-dim' },
            { text: '  impressum   Impressum (§5 DDG)', cls: 'line-dim' },
            { text: '  datenschutz DSGVO-Hinweise', cls: 'line-dim' },
            { text: '  clear       Terminal leeren', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: 'Oder einfach lostippen — NEXUS antwortet.', cls: 'line-system' },
            { text: '', cls: '' },
        ],
    }),

    about: () => ({
        lines: [
            { text: '', cls: '' },
            { text: 'maschke.ai — Kreativ-Agentur für Künstliche Intelligenz.', cls: '' },
            { text: '', cls: '' },
            { text: '  Gründer:   Robert Maschke', cls: 'line-dim' },
            { text: '  Fokus:     KI als Werkzeug für echte Arbeit, nicht als Selbstzweck', cls: 'line-dim' },
            { text: '  Erfahrung: 15+ Jahre Kreativbranche, neurodiverse Perspektive', cls: 'line-dim' },
            { text: '  Motto:     "Bend the Reality"', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: '  Wir bauen keine alten Programme mit KI-Aufkleber, sondern', cls: '' },
            { text: '  Systeme, die sich anfühlen, als hätte sie jemand mit Hirn gemacht.', cls: '' },
            { text: '', cls: '' },
        ],
    }),

    services: () => ({
        lines: [
            { text: '', cls: '' },
            { text: '◆ KI-Beratung & Strategie', cls: 'line-accent' },
            { text: '  Von Nebel zu Richtung, Struktur und Entscheidung', cls: 'line-dim' },
            { text: '◆ Workshops & Training', cls: 'line-accent' },
            { text: '  KI verstehen, anwenden und sinnvoll in Arbeit übersetzen', cls: 'line-dim' },
            { text: '◆ Kreative KI-Projekte', cls: 'line-accent' },
            { text: '  Wenn kreative Idee, Systemdenken und Maschine sauber zusammenkommen', cls: 'line-dim' },
            { text: '◆ AI-Act Compliance', cls: 'line-accent' },
            { text: '  EU-konforme KI ohne Papierfriedhof', cls: 'line-dim' },
            { text: '', cls: '' },
        ],
    }),

    contact: () => ({
        html: box('Kontakt', `<p><a href="mailto:kontakt@maschke.ai" class="terminal-box-link">✉ kontakt@maschke.ai</a></p>
<p class="box-label">Wir melden uns. Versprochen.</p>`),
    }),

    termin: () => ({
        html: box('Erstgespräch', `<p>15 Min. kennenlernen — kostenlos, unverbindlich.</p>
<p>Schreib uns: <a href="mailto:kontakt@maschke.ai" class="terminal-box-link">kontakt@maschke.ai</a></p>`),
    }),

    status: () => {
        const bar = (filled: number, total: number) => {
            const f = '█'.repeat(filled);
            const e = '░'.repeat(total - filled);
            const pct = Math.round((filled / total) * 100);
            return `<span class="status-bar"><span class="status-bar-fill">${f}</span><span class="status-bar-empty">${e}</span> ${pct}%</span>`;
        };
        return {
            html: box('System Status', `<p><span class="box-label">NEXUS Core:</span>     ${bar(6, 10)}</p>
<p><span class="box-label">UI Interface:</span>   ${bar(4, 10)}</p>
<p><span class="box-label">AI Engine:</span>      ${bar(8, 10)}</p>
<p><span class="box-label">Creative Suite:</span> ${bar(3, 10)}</p>
<div class="box-section">
<p><span class="box-highlight">Overall: UNDER CONSTRUCTION</span></p>
<p class="box-label">ETA: Coming Soon™</p>
</div>`),
        };
    },

    // Easter Eggs (line-based — intentionally raw/simple)
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
                { text: 'Engine:    NEXUS OS', cls: 'line-dim' },
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
