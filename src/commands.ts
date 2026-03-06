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

function cmd(label: string): string {
    return `<button type="button" class="terminal-cmd" data-cmd="${label}">${label}</button>`;
}

function link(url: string, label?: string): string {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="terminal-box-link">${label || url}</a>`;
}

// ── Commands ─────────────────────────────────────────────────────────

const COMMANDS: Record<string, () => CommandResult> = {
    hilfe: () => ({
        html: box('Hilfe :: Befehle', `
            <p><span class="box-highlight">Themen:</span></p>
            <p><span class="box-label">about</span> — Wer ist Maschke.ai?</p>
            <p><span class="box-label">services</span> — Was wir machen</p>
            <p><span class="box-label">contact</span> — Kontakt aufnehmen</p>
            <p><span class="box-label">termin</span> — Kostenloses Erstgespräch buchen</p>
            <p><span class="box-label">status</span> — Baustellen-Status</p>
            <div class="box-section">
                <p><span class="box-highlight">System:</span></p>
                <p><span class="box-label">dark · light</span> — Theme wechseln</p>
                <p><span class="box-label">impressum</span> — Impressum</p>
                <p><span class="box-label">datenschutz</span> — Datenschutzerklärung</p>
                <p><span class="box-label">clear</span> — Terminal leeren</p>
            </div>
            <div class="box-section">
                <p>Oder einfach lostippen — NEXUS antwortet.</p>
            </div>
        `),
    }),

    about: () => ({
        html: box('About', `
            <p><strong>Maschke.ai</strong> ist eine Kreativ-Agentur an der Schnittstelle von Künstlicher Intelligenz und menschlicher Kreativität.</p>
            <p>Wir denken KI nicht als Werkzeug, sondern als kreative Partnerin.</p>
            <div class="box-section">
                <p><span class="box-label">Gründer:</span> Robert Maschke</p>
                <p><span class="box-label">Standort:</span> Vettweiß, Deutschland</p>
            </div>
        `),
    }),

    services: () => ({
        html: box('Services', `
            <p><span class="box-highlight">◆ KI-Beratung & Strategie</span></p>
            <p class="box-label">Von der Idee zur Implementierung</p>
            <div class="box-section">
                <p><span class="box-highlight">◆ Workshops & Training</span></p>
                <p class="box-label">KI verstehen, anwenden, meistern</p>
            </div>
            <div class="box-section">
                <p><span class="box-highlight">◆ Kreative KI-Projekte</span></p>
                <p class="box-label">Wenn Maschine auf Muse trifft</p>
            </div>
            <div class="box-section">
                <p><span class="box-highlight">◆ AI-Act Compliance</span></p>
                <p class="box-label">EU-konforme KI-Implementierung</p>
            </div>
            <div class="box-section">
                <p>Interesse? ${cmd('contact')} ${cmd('termin')}</p>
            </div>
        `),
    }),

    contact: () => ({
        html: box('Kontakt', `
            <p>✉ ${link('mailto:kontakt@maschke.ai', 'kontakt@maschke.ai')}</p>
            <p class="box-label">Schreib uns — wir melden uns.</p>
            <div class="box-section">
                <p><span class="box-highlight">◆ Kostenloses Erstgespräch (15 min)</span></p>
                <p class="box-label">Tippe ${cmd('termin')} oder direkt buchen:</p>
                <p>${link(CAL_URL, 'cal.eu/maschke-ai')}</p>
            </div>
        `),
    }),

    termin: () => ({
        html: box('Erstgespräch buchen', `
            <p><span class="box-highlight">◆ 15 Min. kennenlernen — kostenlos</span></p>
            <p>Unverbindlich und ohne Verpflichtung.<br>
            Wir schauen gemeinsam, ob und wie KI in deinem Kontext Sinn macht.</p>
            <div class="box-section">
                <p>→ ${link(CAL_URL, 'cal.eu/maschke-ai')}</p>
            </div>
        `),
    }),

    status: () => {
        const bar = (filled: number, total: number) => {
            const f = '█'.repeat(filled);
            const e = '░'.repeat(total - filled);
            const pct = Math.round((filled / total) * 100);
            return `<span class="status-bar"><span class="status-bar-fill">${f}</span><span class="status-bar-empty">${e}</span> ${pct}%</span>`;
        };
        return {
            html: box('System Status', `
                <p><span class="box-label">NEXUS Core:</span>     ${bar(6, 10)}</p>
                <p><span class="box-label">UI Interface:</span>   ${bar(4, 10)}</p>
                <p><span class="box-label">AI Engine:</span>      ${bar(8, 10)}</p>
                <p><span class="box-label">Creative Suite:</span> ${bar(3, 10)}</p>
                <div class="box-section">
                    <p><span class="box-highlight">Overall: UNDER CONSTRUCTION</span></p>
                    <p class="box-label">ETA: Coming Soon™</p>
                </div>
            `),
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
