/**
 * maschke.ai Under-Construction — Main entry
 * Orchestrates boot sequence, input handling, chat, and theme
 */

import './style.css';
import { renderNexusLogo } from './ascii-logo';
import { BOOT_SEQUENCE } from './boot-sequence';
import { handleCommand, isSpecialCommand, getCommandUrl } from './commands';
import { sendMessage, isLimitReached } from './chat';
import {
    IMPRESSUM_CONTENT,
    DATENSCHUTZ_CONTENT,
    IMPRESSUM_TERMINAL,
    IMPRESSUM_TERMINAL_HTML,
    DATENSCHUTZ_TERMINAL,
    DATENSCHUTZ_TERMINAL_HTML,
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

// ── DSGVO Consent (pattern from main project: useTerminalControllerV2.ts) ──
const CONSENT_KEY = 'nexus_uc_consent_v1';
let isConsented = sessionStorage.getItem(CONSENT_KEY) === 'true';

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
    output.scrollTop = output.scrollHeight;
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

// ── Astronaut Speech Bubbles + Click-to-Fall (1:1 from main project) ──

// Click warnings (from useAstronaut.ts)
const ASTRO_CLICK_WARNINGS = [
    'HEY, VORSICHTIG!!!11!!',
    'NICHT ANFASSEN!!!',
    'LANGSAM, KAPITAEN!!!',
] as const;

const YORI_LINES = [
    // Under-construction meta humor
    'Wird noch gebaut…',
    'Bald™ fertig!',
    'Coming Soon*ish',
    'Noch 99 Bugs…',
    'Schöne Baustelle hier',
    'Vorsicht, nasser Lack!',
    'KI braucht Kaffee',
    'Ich schweb hier nur rum',

    // Tech-remixed German proverbs
    'Des Devs Website ist immer UC',
    'Auch GPT wurde nicht in einem Sprint trainiert',
    'Guter Code will Weile haben',
    'Was lange trainiert, wird endlich gut',
    'Wer API sagt, muss auch Doku sagen',
    'Kein LLM ist vom Himmel gefallen',
    'Training macht das Model',
    'Viele Prompts verderben den Output',
    'Nie den Deploy vor dem Test loben',
    'In der Latenz liegt die Kraft',

    // Easter Egg hints
    'Tippe mal hilfe',
    'Psst… probier matrix',
    'Geheimer Befehl: hack',
    'Was passiert bei sudo?',
];

let bubblePool = [...YORI_LINES];
let bubbleTimers: { show?: number; hide?: number } = {};
let isFalling = false;
let isPerfuming = false;
let isTalking = false;

// ── Perfume animation (ported from main project's useAstronaut.ts) ──
const PERFUME_CHECK_MS = 28_000;  // check every 28 seconds
const PERFUME_CHANCE = 0.02;      // 2% chance per check
let perfumeTimeoutId: number | null = null;

function triggerPerfume(sprite: HTMLElement) {
    if (isPerfuming || isFalling || isTalking) return;

    if (perfumeTimeoutId != null) {
        window.clearTimeout(perfumeTimeoutId);
        perfumeTimeoutId = null;
    }

    isPerfuming = true;
    sprite.classList.add('astro-perfume');

    perfumeTimeoutId = window.setTimeout(() => {
        sprite.classList.remove('astro-perfume');
        isPerfuming = false;
        perfumeTimeoutId = null;
    }, 1350);
}

// ── Talk animation (triggers during AI streaming) ──
function startTalking(sprite: HTMLElement) {
    if (isFalling || isPerfuming || isTalking) return;
    isTalking = true;
    sprite.classList.add('astro-talk');
}

function stopTalking(sprite: HTMLElement) {
    if (!isTalking) return;
    isTalking = false;
    sprite.classList.remove('astro-talk');
}

function pickNextLine(): string {
    if (bubblePool.length === 0) bubblePool = [...YORI_LINES];
    const idx = Math.floor(Math.random() * bubblePool.length);
    return bubblePool.splice(idx, 1)[0];
}

function showBubble(bubble: HTMLElement, text: string, isWarning = false) {
    bubble.textContent = text;
    bubble.classList.toggle('warning', isWarning);
    bubble.classList.add('visible');
}

function hideBubble(bubble: HTMLElement) {
    bubble.classList.remove('visible', 'warning');
}

function startBubbleRotation(bubble: HTMLElement) {
    const SHOW_MS = 10_000;
    const HIDE_MS = 15_000;

    function showNext() {
        showBubble(bubble, pickNextLine());
        bubbleTimers.hide = window.setTimeout(() => {
            hideBubble(bubble);
            bubbleTimers.show = window.setTimeout(showNext, HIDE_MS);
        }, SHOW_MS);
    }

    showNext();
}

function triggerFall(sprite: HTMLElement, bubble: HTMLElement) {
    if (isFalling) return;
    isFalling = true;

    // Clear any pending bubble timers
    if (bubbleTimers.show) window.clearTimeout(bubbleTimers.show);
    if (bubbleTimers.hide) window.clearTimeout(bubbleTimers.hide);

    // Show click warning
    const warning = ASTRO_CLICK_WARNINGS[Math.floor(Math.random() * ASTRO_CLICK_WARNINGS.length)];
    showBubble(bubble, warning, true);

    // Stop talk if active
    stopTalking(sprite);

    // Fall animation
    sprite.classList.add('astro-fall');

    // Recovery sequence
    window.setTimeout(() => {
        sprite.classList.remove('astro-fall');
        isFalling = false;
    }, 1150);

    // Hide warning and resume rotation
    window.setTimeout(() => {
        hideBubble(bubble);
        window.setTimeout(() => startBubbleRotation(bubble), 2000);
    }, 2300);
}

// ── Astronaut Debug Panel (enabled via ?debug=1) ──

function initAstroDebug() {
    if (!new URLSearchParams(location.search).has('debug')) return;

    const panel = document.getElementById('astro-debug');
    if (!panel) return;
    panel.classList.add('open');

    const root = document.documentElement;
    const style = getComputedStyle(root);

    const vars = [
        { name: '--astroX', label: 'X', min: -200, max: 200, unit: 'px', initial: parseInt(style.getPropertyValue('--astroX')) || 10 },
        { name: '--astroY', label: 'Y', min: -300, max: 100, unit: 'px', initial: parseInt(style.getPropertyValue('--astroY')) || -70 },
        { name: '--astroScale', label: 'S', min: 20, max: 120, unit: '%', initial: Math.round((parseFloat(style.getPropertyValue('--astroScale')) || 0.52) * 100) },
        { name: '--astroBubbleX', label: 'bX', min: -100, max: 50, unit: 'px', initial: parseInt(style.getPropertyValue('--astroBubbleX')) || -8 },
        { name: '--astroBubbleY', label: 'bY', min: -100, max: 50, unit: 'px', initial: parseInt(style.getPropertyValue('--astroBubbleY')) || -4 },
    ];

    let html = '<div class="debug-title">🧑‍🚀 Astronaut Controls</div>';

    for (const v of vars) {
        html += `<label>
            <span>${v.label}</span>
            <input type="range" min="${v.min}" max="${v.max}" value="${v.initial}" data-var="${v.name}" data-unit="${v.unit}">
            <span class="val">${v.initial}${v.unit}</span>
        </label>`;
    }

    panel.innerHTML = html;

    panel.querySelectorAll('input[type="range"]').forEach((slider) => {
        slider.addEventListener('input', (e) => {
            const el = e.target as HTMLInputElement;
            const varName = el.dataset.var!;
            const unit = el.dataset.unit!;
            const val = parseInt(el.value);
            const valDisplay = el.nextElementSibling as HTMLElement;
            valDisplay.textContent = `${val}${unit}`;

            if (unit === '%') {
                root.style.setProperty(varName, String(val / 100));
            } else {
                root.style.setProperty(varName, `${val}px`);
            }
        });
    });
}

// ── Boot sequence ──
async function runBootSequence(): Promise<void> {
    for (const line of BOOT_SEQUENCE) {
        if (line.text === 'PROGRESS_BAR') {
            await animateProgressBar();
            continue;
        }

        if (line.text === 'ASCII_LOGO') {
            const logoEl = renderNexusLogo();
            output.appendChild(logoEl);
            scrollToBottom();
            await sleep(line.delay || 100);
            continue;
        }

        if (line.delay > 0) {
            await sleep(line.delay);
        }

        addLine(line.text, line.cls);
    }

    // Consent is NOT shown here — it appears on first user input
    // (matching main project's pattern: boot → user types → consent gate)

    // Show input
    inputLine.classList.add('visible');
    input.focus();

    // Reveal astronaut after a short delay + start speech bubbles
    const astronaut = document.getElementById('astronaut-overlay');
    const bubble = document.getElementById('astronaut-bubble');
    const sprite = document.getElementById('astronaut-sprite');
    if (astronaut && bubble && sprite) {
        setTimeout(() => {
            astronaut.classList.add('visible');
            // Click-to-fall Easter egg (1:1 from main project)
            sprite.addEventListener('click', () => triggerFall(sprite, bubble));
            // Start speech bubble rotation after astronaut slides in
            setTimeout(() => startBubbleRotation(bubble), 3000);
            // Start random perfume check (28s interval, 2% chance)
            setInterval(() => {
                if (!isFalling && !isPerfuming) {
                    if (Math.random() < PERFUME_CHANCE) triggerPerfume(sprite);
                }
            }, PERFUME_CHECK_MS);
        }, 600);
    }
    // Initialize debug panel if ?debug=1 is in the URL
    initAstroDebug();
}

// ── Echo user input ──
function echoInput(text: string) {
    addHTML(
        `<span class="terminal-prompt">&gt; </span><span>${escapeHtml(text)}</span>`,
    );
}

function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Sanitize raw AI text — strip Markdown artifacts that Mistral
 * occasionally outputs despite system prompt instructions.
 * Ported 1:1 from main project's sanitizeAiText().
 */
function sanitizeAiText(raw: string): string {
    let text = raw;
    // Strip Markdown headings (# Heading)
    text = text.replace(/^\s*#{1,6}\s+/gm, '');
    // Strip blockquotes (> text)
    text = text.replace(/^\s*> ?/gm, '');
    // Strip numbered lists (1. item) — convert to plain text
    text = text.replace(/^\s*\d+[.)]\s+/gm, '');
    // Strip bullet lists (- item, * item) but preserve **bold** markers
    text = text.replace(/^\s*[-+]\s+/gm, '');
    text = text.replace(/^\s*\*\s+(?!\*)/gm, ''); // single * followed by space (not **)
    // Strip code blocks (```...```)
    text = text.replace(/```[\s\S]*?```/g, '');
    // Strip horizontal rules (---, ***, ___)
    text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');
    // Collapse excessive newlines
    text = text.replace(/\n{3,}/g, '\n\n');
    return text;
}

/**
 * Format AI response text:
 * 1. Sanitize (strip unwanted Markdown artifacts)
 * 2. Escape HTML (XSS prevention)
 * 3. Render **bold** → <strong> and `command` → clickable chip
 */
function formatAiText(raw: string): string {
    const sanitized = sanitizeAiText(raw);
    const escaped = escapeHtml(sanitized);
    let formatted = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/`([^`]+)`/g, '<span class="cmd-chip" data-cmd="$1">$1</span>');
    return formatted;
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

    // ── DSGVO Consent gate (pattern from main project) ──
    // Consent prompt appears on FIRST user input, not during boot
    if (!isConsented) {
        if (cmd === 'akzeptieren' || cmd === 'accept' || cmd === 'zustimmen' || cmd === 'einverstanden') {
            sessionStorage.setItem(CONSENT_KEY, 'true');
            isConsented = true;
            addLine('', '');
            addLine('[OK] Datenschutz akzeptiert. NEXUS ist bereit.', 'line-success');
            addLine('', '');
            addLine("Tippe 'hilfe' für Befehle, oder sprich einfach mit NEXUS.", 'line-dim');
            addLine('', '');
            isProcessing = false;
            return;
        }
        // Allow impressum/datenschutz even before consent (legal requirement: always accessible)
        if (cmd === 'impressum' || cmd === 'datenschutz') {
            const htmlContent = cmd === 'impressum' ? IMPRESSUM_TERMINAL_HTML : DATENSCHUTZ_TERMINAL_HTML;
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = htmlContent;
            output.appendChild(wrapper);
            scrollToBottom();
            const footerLines = cmd === 'impressum' ? IMPRESSUM_TERMINAL : DATENSCHUTZ_TERMINAL;
            for (const line of footerLines) {
                addLine(line.text, line.cls);
            }
            isProcessing = false;
            return;
        }
        // First input that isn't consent/legal → show consent prompt with clickable button
        addLine('', '');
        addLine('KI-gestützt (Mistral) · Keine Daten gespeichert.', 'line-dim');
        addLine('Keine sensiblen Daten teilen.', 'line-dim');
        addLine('', '');
        const consentLine = document.createElement('div');
        consentLine.className = 'line';
        consentLine.innerHTML = `→ <button type="button" class="terminal-cmd" data-cmd="akzeptieren">AKZEPTIEREN</button> um fortzufahren.`;
        output.appendChild(consentLine);
        consentLine.querySelector('.terminal-cmd')?.addEventListener('click', () => {
            input.value = 'akzeptieren';
            processInput('akzeptieren');
        });
        addLine('', '');
        scrollToBottom();
        isProcessing = false;
        return;
    }

    // Special commands
    if (isSpecialCommand(trimmed)) {
        if (cmd === 'clear') {
            output.innerHTML = '';
            isProcessing = false;
            return;
        }
        if (cmd === 'impressum') {
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = IMPRESSUM_TERMINAL_HTML;
            output.appendChild(wrapper);
            scrollToBottom();
            for (const line of IMPRESSUM_TERMINAL) {
                addLine(line.text, line.cls);
            }
            isProcessing = false;
            return;
        }
        if (cmd === 'datenschutz') {
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = DATENSCHUTZ_TERMINAL_HTML;
            output.appendChild(wrapper);
            scrollToBottom();
            for (const line of DATENSCHUTZ_TERMINAL) {
                addLine(line.text, line.cls);
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
        // Animated hack Easter Egg
        if (cmd === 'hack' || cmd === 'hacking') {
            addLine('', '');
            addLine('Accessing mainframe…', 'line-system');
            const steps = [
                { text: 'Bypassing firewall… OK', delay: 600 },
                { text: 'Decrypting payload… OK', delay: 1200 },
                { text: 'Injecting exploit… FAILED', delay: 1800 },
                { text: '', delay: 2000 },
                { text: 'Just kidding. Das ist eine Website, kein Supercomputer.', delay: 2400 },
            ];
            steps.forEach(({ text, delay }) => {
                setTimeout(() => {
                    addLine(text, text ? 'line-system' : '');
                    if (delay === 2400) isProcessing = false;
                }, delay);
            });
            return;
        }
    }

    // Local commands
    const result = handleCommand(trimmed);
    if (result) {
        // Check if this command should also open a URL (e.g. termin → Cal)
        const url = getCommandUrl(trimmed);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }

        if (result.html) {
            // HTML block output (CSS-styled boxes)
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = result.html;
            output.appendChild(wrapper);
            scrollToBottom();

            // Attach click handlers to terminal-cmd buttons inside the box
            wrapper.querySelectorAll('.terminal-cmd').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const cmdName = (btn as HTMLElement).dataset.cmd || '';
                    input.value = cmdName;
                    processInput(cmdName);
                });
            });
        } else if (result.lines) {
            // Legacy line-by-line output (Easter eggs, simple responses)
            for (const line of result.lines) {
                addLine(line.text, line.cls);
                await sleep(30);
            }
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

    addLine('', '');

    const responseDiv = document.createElement('div');
    responseDiv.className = 'line line-ai';
    output.appendChild(responseDiv);

    let rawAiText = '';

    // Start talk animation when AI starts streaming
    const talkSprite = document.getElementById('astronaut-sprite');

    let renderFrameId = 0;

    await sendMessage(
        trimmed,
        // onChunk — accumulate raw text and render with formatting
        (chunk: string) => {
            // Start YORI talking on first chunk
            if (talkSprite && !isTalking) startTalking(talkSprite);
            rawAiText += chunk;

            // ⚡ Bolt: Batch rapid DOM updates and layout recalcs during streaming
            // This prevents main-thread blocking by debouncing innerHTML assignments
            // and synchronous scrollToBottom() to the display refresh rate (max 60fps)
            if (!renderFrameId) {
                renderFrameId = requestAnimationFrame(() => {
                    responseDiv.innerHTML = formatAiText(rawAiText);
                    scrollToBottom();
                    renderFrameId = 0;
                });
            }
        },
        // onDone — final format pass + attach click handlers
        (_fullText: string) => {
            // ⚡ Bolt: Prevent race condition by cancelling any pending frame
            // before the final synchronous render pass and event listeners
            if (renderFrameId) {
                cancelAnimationFrame(renderFrameId);
                renderFrameId = 0;
            }
            // Stop YORI talking
            if (talkSprite) stopTalking(talkSprite);
            responseDiv.innerHTML = formatAiText(rawAiText);
            // Make command chips clickable
            responseDiv.querySelectorAll('.cmd-chip').forEach((chip) => {
                chip.addEventListener('click', () => {
                    const cmd = (chip as HTMLElement).dataset.cmd || '';
                    input.value = cmd;
                    processInput(cmd);
                });
            });
            addLine('', '');
            isProcessing = false;
        },
        // onError
        (error: string) => {
            if (renderFrameId) {
                cancelAnimationFrame(renderFrameId);
                renderFrameId = 0;
            }
            // Stop YORI talking
            if (talkSprite) stopTalking(talkSprite);
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
