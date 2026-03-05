/**
 * Maschke.ai Under-Construction — Main entry
 * Orchestrates boot sequence, input handling, chat, and theme
 */

import './style.css';
import { ASCII_LOGO } from './ascii-logo';
import { BOOT_SEQUENCE } from './boot-sequence';
import { handleCommand, isSpecialCommand } from './commands';
import { sendMessage, isLimitReached, getRemainingMessages } from './chat';
import {
    IMPRESSUM_CONTENT,
    DATENSCHUTZ_CONTENT,
    IMPRESSUM_TERMINAL,
    DATENSCHUTZ_TERMINAL,
} from './legal';

// ── DOM refs ──
const output = document.getElementById('terminal-output')!;
const inputLine = document.getElementById('terminal-input-line')!;
const input = document.getElementById('terminal-input') as HTMLInputElement;
const terminal = document.getElementById('terminal')!;
const themeToggle = document.getElementById('theme-toggle')!;
const linkImpressum = document.getElementById('link-impressum')!;
const linkDatenschutz = document.getElementById('link-datenschutz')!;
const legalOverlay = document.getElementById('legal-overlay')!;
const legalTitle = document.getElementById('legal-overlay-title')!;
const legalContent = document.getElementById('legal-overlay-content')!;
const legalClose = document.getElementById('legal-overlay-close')!;

let isProcessing = false;
let commandHistory: string[] = [];
let historyIndex = -1;

// ── Theme Management ──
const THEME_KEY = 'nexus_uc_theme';

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark' | 'auto') {
    const resolved = theme === 'auto' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem(THEME_KEY, theme);
    themeToggle.textContent = resolved === 'dark' ? '☀' : '◐';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Initialize theme
const savedTheme = (localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'auto') || 'auto';
applyTheme(savedTheme);

// Listen for system theme changes when set to 'auto'
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem(THEME_KEY) === 'auto') {
        applyTheme('auto');
    }
});

// ── Output helpers ──
function addLine(text: string, cls: string = '') {
    const div = document.createElement('div');
    div.className = `line ${cls}`.trim();
    div.textContent = text;
    output.appendChild(div);
    scrollToBottom();
}

function addHTML(html: string, cls: string = '') {
    const div = document.createElement('div');
    div.className = `line ${cls}`.trim();
    div.innerHTML = html;
    output.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
}

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

// ── Progress bar animation ──
async function animateProgressBar(): Promise<void> {
    const total = 24;
    const div = document.createElement('div');
    div.className = 'line progress-bar';
    output.appendChild(div);

    for (let i = 0; i <= total; i++) {
        const filled = '█'.repeat(i);
        const empty = '░'.repeat(total - i);
        const pct = Math.round((i / total) * 100);
        div.textContent = `[${filled}${empty}] ${pct}%`;
        scrollToBottom();
        await sleep(30 + Math.random() * 40);
    }
}

// ── Boot sequence ──
async function runBootSequence(): Promise<void> {
    for (const line of BOOT_SEQUENCE) {
        if (line.text === 'PROGRESS_BAR') {
            await animateProgressBar();
            continue;
        }

        if (line.text === 'ASCII_LOGO') {
            for (const logoLine of ASCII_LOGO) {
                addLine(logoLine, 'line-logo');
            }
            await sleep(line.delay || 100);
            continue;
        }

        if (line.delay > 0) {
            await sleep(line.delay);
        }

        addLine(line.text, line.cls);
    }

    // Show input
    inputLine.classList.add('visible');
    input.focus();
}

// ── Echo user input ──
function echoInput(text: string) {
    addHTML(
        `<span class="line-prompt">nexus@maschke.ai ~ %</span> <span class="line-user">${escapeHtml(text)}</span>`,
    );
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}



// ── Legal overlay ──
function showLegal(type: 'impressum' | 'datenschutz') {
    legalTitle.textContent = type === 'impressum' ? '§ Impressum' : '§ Datenschutzerklärung';
    legalContent.innerHTML = type === 'impressum' ? IMPRESSUM_CONTENT : DATENSCHUTZ_CONTENT;
    legalOverlay.classList.add('active');
}

function closeLegal() {
    legalOverlay.classList.remove('active');
    input.focus();
}

// ── Input handling ──
async function processInput(text: string) {
    if (!text.trim() || isProcessing) return;

    isProcessing = true;
    const trimmed = text.trim();

    // Save to history
    commandHistory.unshift(trimmed);
    if (commandHistory.length > 50) commandHistory.pop();
    historyIndex = -1;

    // Echo
    echoInput(trimmed);
    input.value = '';

    const cmd = trimmed.toLowerCase();

    // Special commands
    if (isSpecialCommand(trimmed)) {
        if (cmd === 'clear') {
            output.innerHTML = '';
            isProcessing = false;
            return;
        }
        if (cmd === 'impressum') {
            // Show terminal-formatted version + hint to footer
            for (const line of IMPRESSUM_TERMINAL) {
                addLine(line.text, line.cls);
                await sleep(30);
            }
            isProcessing = false;
            return;
        }
        if (cmd === 'datenschutz') {
            for (const line of DATENSCHUTZ_TERMINAL) {
                addLine(line.text, line.cls);
                await sleep(30);
            }
            isProcessing = false;
            return;
        }
        if (cmd === 'dark' || cmd === 'light' || cmd === 'auto') {
            applyTheme(cmd as 'light' | 'dark' | 'auto');
            addLine(`[OK] Theme → ${cmd}`, 'line-success');
            isProcessing = false;
            return;
        }
    }

    // Local commands
    const result = handleCommand(trimmed);
    if (result) {
        for (const line of result.lines) {
            addLine(line.text, line.cls);
            await sleep(30);
        }
        isProcessing = false;
        return;
    }

    // Chat with Mistral
    if (isLimitReached()) {
        addLine('', '');
        addLine(' NEXUS ist noch in der Kalibrierung.', 'line-warn');
        addLine(' Die volle Version kommt bald. Stay tuned.', 'line-dim');
        addLine('', '');
        isProcessing = false;
        return;
    }

    const remaining = getRemainingMessages() - 1;
    addLine('', '');

    const responseDiv = document.createElement('div');
    responseDiv.className = 'line line-ai';
    output.appendChild(responseDiv);

    await sendMessage(
        trimmed,
        // onChunk — append streaming text
        (chunk: string) => {
            responseDiv.textContent += chunk;
            scrollToBottom();
        },
        // onDone
        (_fullText: string) => {
            addLine('', '');
            if (remaining <= 1) {
                addLine(` [${remaining} Nachricht${remaining === 1 ? '' : 'en'} verbleibend]`, 'line-dim');
            }
            isProcessing = false;
        },
        // onError
        (error: string) => {
            if (error === 'LIMIT_REACHED') {
                responseDiv.textContent = 'NEXUS ist noch in der Kalibrierung. Die volle Version kommt bald.';
                responseDiv.className = 'line line-warn';
            } else {
                responseDiv.textContent = `[FEHLER] ${error}`;
                responseDiv.className = 'line line-accent';
            }
            addLine('', '');
            isProcessing = false;
        },
    );
}

// ── Event listeners ──

// Input submit
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        processInput(input.value);
    }

    // Command history navigation
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        }
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;
            input.value = '';
        }
    }
});

// Click anywhere to focus input
terminal.addEventListener('click', () => {
    if (!isProcessing && inputLine.classList.contains('visible')) {
        input.focus();
    }
});

// Theme toggle button
themeToggle.addEventListener('click', toggleTheme);

// Legal footer links → overlay
linkImpressum.addEventListener('click', (e) => {
    e.preventDefault();
    showLegal('impressum');
});

linkDatenschutz.addEventListener('click', (e) => {
    e.preventDefault();
    showLegal('datenschutz');
});

// Close legal overlay
legalClose.addEventListener('click', closeLegal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalOverlay.classList.contains('active')) {
        closeLegal();
    }
});

// ── Start ──
runBootSequence();
