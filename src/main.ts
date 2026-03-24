/**
 * maschke.ai Under-Construction — Main entry
 * Orchestrates boot sequence, input handling, chat, and theme
 */

import './style.css';
import { renderNexusLogo } from './ascii-logo';
import { getBootSequence } from './boot-sequence';
import { handleCommand, isSpecialCommand } from './commands';
import { sendMessage, isLimitReached } from './chat';
import { sound } from './sounds';
import {
    isContactFormActive,
    startContactForm,
    handleContactInput,
    confirmSend,
    cancelForm,
    type ContactFormResult,
} from './contact-form';
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
const soundToggle = document.getElementById('sound-toggle');
const soundToggleMobile = document.getElementById('sound-toggle-mobile');
const themeStatusToggle = document.getElementById('theme-status-toggle');

let isProcessing = false;
let commandHistory: string[] = [];
let historyIndex = -1;

// ── Cursor Glow (desktop only) ──
if (window.matchMedia('(hover: hover)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let rafPending = false;
    terminal.addEventListener('mousemove', (e) => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const rect = terminal.getBoundingClientRect();
            terminal.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            terminal.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            rafPending = false;
        });
    });
    terminal.addEventListener('mouseleave', () => {
        terminal.style.setProperty('--mouse-x', '-999px');
        terminal.style.setProperty('--mouse-y', '-999px');
    });
}


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
    const label = resolved === 'dark' ? 'LIGHT' : 'DARK';
    themeToggle.textContent = label;
    if (themeStatusToggle) themeStatusToggle.textContent = label;
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('static-burst');
        sound.play('staticBurst');
        setTimeout(() => document.body.classList.remove('static-burst'), 250);
    }
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Initialize theme — default to dark (treat 'auto' as dark too)
const rawTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'auto' | null;
const savedTheme = (rawTheme === 'light') ? 'light' : 'dark';
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

// Optimization: Batch DOM insertions using DocumentFragment to minimize synchronous reflows.
// (PR #10 — Jules: ~1.4x speedup on rendering multiple lines)
function addLines(lines: {text: string, cls?: string}[]) {
    const fragment = document.createDocumentFragment();
    for (const line of lines) {
        const div = document.createElement('div');
        div.className = `line ${line.cls || ''}`.trim();
        div.textContent = line.text;
        fragment.appendChild(div);
    }
    output.appendChild(fragment);
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

// ── Typewriter effect for boot lines ──
async function typewriteLine(text: string, cls: string, charDelay = 15): Promise<void> {
    const div = document.createElement('div');
    div.className = `line ${cls}`.trim();
    div.textContent = '';
    output.appendChild(div);
    scrollToBottom();
    for (let i = 0; i < text.length; i++) {
        div.textContent += text[i];
        if (i % 5 === 0) sound.play('typeBleep');
        await sleep(charDelay);
    }
}

// ── Progress bar animation ──
async function animateProgressBar(): Promise<void> {
    const total = 24;
    const div = document.createElement('div');
    div.className = 'line progress-bar';
    output.appendChild(div);

    const maxFill = total - 1; // Stop at 95% — it's under construction after all
    for (let i = 0; i <= maxFill; i++) {
        const filled = '█'.repeat(i);
        const empty = '░'.repeat(total - i);
        const pct = Math.round((i / total) * 100);
        div.textContent = `[${filled}${empty}] ${pct}%`;
        if (i % 3 === 0) sound.play('progressTick');
        scrollToBottom();
        await sleep(30 + Math.random() * 40);
    }

    // Append UC text inline — stays at 95%
    div.innerHTML = `[${'█'.repeat(maxFill)}░] 95%  <span class="line-uc-pulse">UNDER CONSTRUCTION</span>`;
}

// ── Astronaut Speech Bubbles + Click-to-Fall (1:1 from main project) ──

// Click warnings (from useAstronaut.ts)
const ASTRO_CLICK_WARNINGS = [
    'HEY, VORSICHTIG!!!11!!',
    'NICHT ANFASSEN!!!',
    'LANGSAM, KAPITAEN!!!',
] as const;

const YORI_LINES = [
    // Meta-Humor (YORI's perspective as the floating mascot)
    'Wird noch gebaut…',
    'Bald™ fertig!',
    'Schöne Baustelle hier',
    'Vorsicht, nasser Lack!',
    'Ich schweb hier nur rum',
    'Gibt\'s hier WLAN?',
    'Ich warte hier schon seit v3…',
    'Null Bugs, null Stress',
    'Schweben ist mein Cardio',

    // Nudges (softer — curiosity over CTA)
    'Tippe einfach drauf los!',
    'NEXUS weiß mehr als ich',
    'Probier mal about oder services',
    'Die KI beißt nicht',

    // Brand
    'Weniger Reibung, mehr Richtung',
    'maschke.ai — bald komplett',
    'Systeme, die mitdenken. Bald.',

    // Tech-remixed German proverbs
    'Guter Code will Weile haben',
    'Nie den Deploy vor dem Test loben',
    'Viele Prompts verderben den Output',

    // Easter Egg hints
    'Psst… probier matrix',
    'Was passiert bei sudo?',
    'Geheimer Befehl: hack',
];

// Inactivity nudge lines (YORI prods user after 30s idle)
const YORI_NUDGE_LINES = [
    'Noch da? NEXUS wartet…',
    'Tippe hilfe für Ideen',
    'Trau dich, frag was!',
    'Hier passiert gerade nix…',
];

let bubblePool = [...YORI_LINES];
let bubbleTimers: { show?: number; hide?: number } = {};
let isFalling = false;
let isPerfuming = false;
let isTalking = false;
let isSleeping = false;
let inactivityTimer: number | null = null;
let sleepTimer: number | null = null;
let inactivityNudgeShown = false;

// ── Perfume animation (ported from main project's useAstronaut.ts) ──
const PERFUME_CHECK_MS = 28_000;  // check every 28 seconds
const PERFUME_CHANCE = 0.02;      // 2% chance per check
let perfumeTimeoutId: number | null = null;

function triggerPerfume(sprite: HTMLElement) {
    if (isPerfuming || isFalling || isTalking || isSleeping) return;

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
    const HIDE_MS = 25_000;

    function showNext() {
        showBubble(bubble, pickNextLine());
        bubbleTimers.hide = window.setTimeout(() => {
            hideBubble(bubble);
            bubbleTimers.show = window.setTimeout(showNext, HIDE_MS);
        }, SHOW_MS);
    }

    showNext();
}

// ── Sleep animation ──
function triggerSleep(sprite: HTMLElement, bubble: HTMLElement) {
    if (isSleeping || isFalling || isPerfuming || isTalking) return;
    isSleeping = true;

    if (bubbleTimers.show) window.clearTimeout(bubbleTimers.show);
    if (bubbleTimers.hide) window.clearTimeout(bubbleTimers.hide);

    sprite.classList.add('astro-sleep');
    sprite.addEventListener('animationend', () => {
        sprite.classList.remove('astro-sleep');
        sprite.classList.add('astro-sleep-hold');
    }, { once: true });

    showBubble(bubble, 'zZz...');
    bubble.classList.add('sleep-bubble');
}

function wakeUp(sprite: HTMLElement, bubble: HTMLElement) {
    if (!isSleeping) return;
    isSleeping = false;

    sprite.classList.remove('astro-sleep', 'astro-sleep-hold');
    bubble.classList.remove('sleep-bubble');
    hideBubble(bubble);
    sound.play('wakeBlip');

    bubbleTimers.show = window.setTimeout(() => startBubbleRotation(bubble), 3000);
}

// ── Inactivity nudge: YORI prods user after 30s idle, sleeps after 60s ──
function resetInactivityTimer(bubble: HTMLElement) {
    if (inactivityTimer) window.clearTimeout(inactivityTimer);
    if (sleepTimer) window.clearTimeout(sleepTimer);
    inactivityNudgeShown = false;

    // Wake up if sleeping
    const sprite = document.getElementById('astronaut-sprite');
    if (sprite && isSleeping) wakeUp(sprite, bubble);

    inactivityTimer = window.setTimeout(() => {
        if (inactivityNudgeShown) return;
        inactivityNudgeShown = true;
        const nudge = YORI_NUDGE_LINES[Math.floor(Math.random() * YORI_NUDGE_LINES.length)];
        if (bubbleTimers.show) window.clearTimeout(bubbleTimers.show);
        if (bubbleTimers.hide) window.clearTimeout(bubbleTimers.hide);
        showBubble(bubble, nudge);
        bubbleTimers.hide = window.setTimeout(() => {
            hideBubble(bubble);
            bubbleTimers.show = window.setTimeout(() => startBubbleRotation(bubble), 8_000);
        }, 6_000);
    }, 30_000);

    // Sleep after 60s total inactivity
    sleepTimer = window.setTimeout(() => {
        const spriteEl = document.getElementById('astronaut-sprite');
        if (spriteEl) triggerSleep(spriteEl, bubble);
    }, 60_000);
}

function triggerFall(sprite: HTMLElement, bubble: HTMLElement) {
    if (isFalling) return;
    isFalling = true;
    sound.play('woosh');

    // Clear sleep state if sleeping (prevents CSS class collision)
    if (isSleeping) {
        isSleeping = false;
        sprite.classList.remove('astro-sleep', 'astro-sleep-hold');
        bubble.classList.remove('sleep-bubble');
        if (sleepTimer) { window.clearTimeout(sleepTimer); sleepTimer = null; }
    }

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

    // Recovery sequence — timeout matches CSS animation duration exactly (1100ms)
    // rAF ensures class removal is frame-aligned (no blank frame between fall→idle)
    window.setTimeout(() => {
        sound.play('landingThud');
        requestAnimationFrame(() => {
            sprite.classList.remove('astro-fall');
            isFalling = false;
        });
    }, 1100);

    // Hide warning and resume rotation (long pause after warning)
    window.setTimeout(() => {
        hideBubble(bubble);
        window.setTimeout(() => startBubbleRotation(bubble), 15_000);
    }, 3000);
}

// ── YORI command reactions ──
function triggerYoriReaction(cmd: string) {
    const overlay = document.getElementById('astronaut-overlay');
    const bubble = document.getElementById('astronaut-bubble');
    if (!overlay || !bubble) return;

    if (cmd === 'hack' || cmd === 'hacking' || cmd === 'sudo') {
        overlay.classList.add('astro-shake');
        showBubble(bubble, '!!! WARNUNG !!!', true);
        setTimeout(() => {
            overlay.classList.remove('astro-shake');
            hideBubble(bubble);
        }, 2000);
    } else if (cmd === 'matrix') {
        overlay.classList.add('astro-matrix');
        showBubble(bubble, 'Was passiert hier?!');
        setTimeout(() => {
            overlay.classList.remove('astro-matrix');
            hideBubble(bubble);
        }, 5000);
    } else if (cmd === 'secret' || cmd === 'easteregg' || cmd === 'easter egg') {
        overlay.classList.add('astro-glow-pulse');
        showBubble(bubble, 'Psst... du hast mich gefunden!');
        setTimeout(() => {
            overlay.classList.remove('astro-glow-pulse');
            hideBubble(bubble);
        }, 3000);
    }
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
// ── Glitch Scanline — periodic CRT interference line ──
function startGlitchScanline(): void {
    const scheduleNext = () => {
        // Random interval between 4-8 seconds
        const delay = 4000 + Math.random() * 4000;
        setTimeout(() => {
            const lines = output.querySelectorAll('.line, .line-boot, .line-info, .line-version');
            if (lines.length === 0) { scheduleNext(); return; }

            // Pick a random position among existing lines
            const targetIndex = Math.floor(Math.random() * lines.length);
            const targetLine = lines[targetIndex];

            // Create the glitch scanline element
            const scanline = document.createElement('div');
            scanline.className = 'glitch-scanline';
            targetLine.parentNode?.insertBefore(scanline, targetLine);

            // Remove after animation completes (150ms)
            setTimeout(() => {
                scanline.remove();
            }, 150);

            scheduleNext();
        }, delay);
    };
    scheduleNext();
}

// ── Boot sequence ──
async function runBootSequence(): Promise<void> {
    const bootSequence = getBootSequence();
    for (let i = 0; i < bootSequence.length; i++) {
        const line = bootSequence[i];
        if (line.text === 'PROGRESS_BAR') {
            await animateProgressBar();
            continue;
        }

        if (line.text === 'ASCII_LOGO') {
            const logoEl = renderNexusLogo();
            output.appendChild(logoEl);
            sound.play('glitchNoise');
            scrollToBottom();
            await sleep(line.delay || 100);
            continue;
        }

        if (line.delay > 0) {
            await sleep(line.delay);
        }

        // Typewriter effect for BOOT: lines (lines 2-4 in sequence)
        if (line.text.startsWith('BOOT:')) {
            await typewriteLine(line.text, line.cls);
            sound.play('bootBlip');
        } else {
            addLine(line.text, line.cls);
        }
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
            // Start inactivity nudge timer
            resetInactivityTimer(bubble);
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

    // Periodic glitch scanline — random interference line (like reference terminal site)
    startGlitchScanline();

    // Random CRT flicker — every 30-60s
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const scheduleFlicker = () => {
            const delay = 30_000 + Math.random() * 30_000;
            setTimeout(() => {
                terminal.classList.add('crt-flicker');
                terminal.addEventListener('animationend', () => {
                    terminal.classList.remove('crt-flicker');
                }, { once: true });
                scheduleFlicker();
            }, delay);
        };
        scheduleFlicker();
    }
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
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

/**
 * Sanitize HTML to prevent XSS.
 * Removes dangerous tags and unsafe attributes.
 * (PR #13 — Jules: DOMParser-based, no external deps)
 */
function sanitizeHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'base', 'style', 'link', 'meta'];
    dangerousTags.forEach(tag => {
        doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    doc.querySelectorAll('*').forEach(el => {
        Array.from(el.attributes).forEach(attr => {
            if (attr.name.toLowerCase().startsWith('on') || attr.value.toLowerCase().includes('javascript:')) {
                el.removeAttribute(attr.name);
            }
        });
    });

    return doc.body.innerHTML;
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
    // **bold** → <strong>
    let formatted = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Strip remaining *kursiv* markers (Mistral ignores the ban) → plain text
    formatted = formatted.replace(/\*([^*]+?)\*/g, '$1');
    // `command` → clickable chip
    formatted = formatted.replace(/`([^`]+)`/g, '<span class="cmd-chip" data-cmd="$1">$1</span>');
    // kontakt@maschke.ai → clickable chip that triggers contact form (not mailto)
    formatted = formatted.replace(
        /(?:<strong>)?(kontakt@maschke\.ai)(?:<\/strong>)?/g,
        '<span class="cmd-chip" data-cmd="contact">$1</span>',
    );
    return formatted;
}

/**
 * Typewriter-safe text rendering:
 * Strips all Markdown markers (bold, italic, backtick) as plain text
 * so incomplete markers don't flash as raw asterisks during animation.
 * Full formatting (bold → <strong>, backtick → chip) is applied only in finalize().
 */
function typewriterText(raw: string): string {
    const sanitized = sanitizeAiText(raw);
    const escaped = escapeHtml(sanitized);
    // Strip complete **bold** pairs → show text only
    let text = escaped.replace(/\*\*(.+?)\*\*/g, '$1');
    // Strip any remaining lone ** markers
    text = text.replace(/\*\*/g, '');
    // Strip complete `command` pairs → show text only
    text = text.replace(/`([^`]+)`/g, '$1');
    // Strip any remaining lone backticks
    text = text.replace(/`/g, '');
    // Strip remaining *italic* markers
    text = text.replace(/\*([^*]+?)\*/g, '$1');
    text = text.replace(/\*/g, '');
    return text;
}



// ── Legal overlay ──
function showLegal(type: 'impressum' | 'datenschutz') {
    legalTitle.textContent = type === 'impressum' ? '§ Impressum' : '§ Datenschutzerklärung';
    legalContent.innerHTML = type === 'impressum' ? IMPRESSUM_CONTENT : DATENSCHUTZ_CONTENT;
    legalOverlay.classList.add('active');
    document.body.classList.add('legal-open');
}

function closeLegal() {
    legalOverlay.classList.remove('active');
    document.body.classList.remove('legal-open');
    input.focus();
}

// ── Contact form helpers ──

async function submitContactForm(data: { name: string; email: string; message: string }): Promise<void> {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                message: data.message,
                website: '', // honeypot — always empty for real users
            }),
        });

        if (response.ok) {
            addLine('', '');
            addLine('[OK] Nachricht gesendet. Wir melden uns.', 'line-success');
            addLine('', '');
        } else {
            const err = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
            addLine('', '');
            addLine(`[FEHLER] ${err.error || 'Nachricht konnte nicht gesendet werden.'}`, 'line-accent');
            addLine('Alternativ: kontakt@maschke.ai', 'line-dim');
            addLine('', '');
        }
    } catch {
        addLine('', '');
        addLine('[FEHLER] Verbindung fehlgeschlagen. Bitte versuche es später.', 'line-accent');
        addLine('Alternativ: kontakt@maschke.ai', 'line-dim');
        addLine('', '');
    }
    scrollToBottom();
}

async function renderContactResult(formResult: ContactFormResult): Promise<void> {
    if (formResult.lines) {
        for (const line of formResult.lines) {
            addLine(line.text, line.cls);
            await sleep(30);
        }
    }

    if (formResult.html) {
        const wrapper = document.createElement('div');
        wrapper.className = 'line';
        wrapper.innerHTML = sanitizeHtml(formResult.html);
        output.appendChild(wrapper);
        scrollToBottom();

        // Attach click handlers for SENDEN / ABBRECHEN buttons
        wrapper.querySelectorAll('[data-contact-action]').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const action = (btn as HTMLElement).dataset.contactAction;
                if (action === 'send') {
                    const sendResult = confirmSend();
                    if (sendResult.lines) {
                        for (const line of sendResult.lines) {
                            addLine(line.text, line.cls);
                        }
                    }
                    if (sendResult.submitData) {
                        await submitContactForm(sendResult.submitData);
                    }
                } else if (action === 'cancel') {
                    const cancelResult = cancelForm();
                    if (cancelResult.lines) {
                        for (const line of cancelResult.lines) {
                            addLine(line.text, line.cls);
                        }
                    }
                }
                scrollToBottom();
            });
        });
    }

    // If form completed with submitData (text-based confirm), trigger submit
    if (formResult.submitData) {
        await submitContactForm(formResult.submitData);
    }

    scrollToBottom();
}

// ── Input handling ──
async function processInput(text: string) {
    if (!text.trim() || isProcessing) return;

    isProcessing = true;
    const trimmed = text.trim();

    // Reset YORI inactivity timer on user input
    const yoriBubble = document.getElementById('astronaut-bubble');
    if (yoriBubble) resetInactivityTimer(yoriBubble);

    // Save to history
    commandHistory.unshift(trimmed);
    if (commandHistory.length > 50) commandHistory.pop();
    historyIndex = -1;

    // Clear input immediately (echo happens after consent check)
    input.value = '';
    input.style.width = '1ch';

    const cmd = trimmed.toLowerCase();

    // ── DSGVO Consent gate (pattern from main project) ──
    // Consent prompt appears on FIRST user input, not during boot
    if (!isConsented) {
        // Allow impressum/datenschutz even before consent (legal requirement: always accessible)
        if (cmd === 'impressum' || cmd === 'datenschutz') {
            echoInput(trimmed);
            const htmlContent = cmd === 'impressum' ? IMPRESSUM_TERMINAL_HTML : DATENSCHUTZ_TERMINAL_HTML;
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = sanitizeHtml(htmlContent);
            output.appendChild(wrapper);
            scrollToBottom();
            const footerLines = cmd === 'impressum' ? IMPRESSUM_TERMINAL : DATENSCHUTZ_TERMINAL;
            addLines(footerLines);
            isProcessing = false;
            return;
        }

        // Accept consent directly
        if (cmd === 'akzeptieren' || cmd === 'accept' || cmd === 'zustimmen' || cmd === 'einverstanden' || cmd === 'verstanden') {
            echoInput(trimmed);
            sessionStorage.setItem(CONSENT_KEY, 'true');
            isConsented = true;
            addLine('', '');
            addLine('[OK] NEXUS ist bereit.', 'line-success');
            addLine('', '');
            isProcessing = false;
            return;
        }

        // Any other input → save it, show consent, then auto-send after accept
        // NOTE: Do NOT echo the user's message here — it would look like data
        // was sent before consent was given. The message is held as pendingMessage
        // and only sent (with echo) AFTER the user accepts.
        const pendingMessage = trimmed;
        addLine('', '');
        addLine('Bevor wir loslegen: NEXUS antwortet mit KI.', 'line-dim');
        // Datenschutz hint with clickable command chip
        const hintLine = document.createElement('div');
        hintLine.className = 'line line-dim';
        hintLine.innerHTML = 'Deine Nachrichten werden verarbeitet, aber nicht gespeichert. Details: <span class="cmd-chip" data-cmd="datenschutz">datenschutz</span>';
        output.appendChild(hintLine);
        hintLine.querySelector('.cmd-chip')?.addEventListener('click', () => {
            processInput('datenschutz');
        });
        addLine('', '');
        const consentLine = document.createElement('div');
        consentLine.className = 'line';
        consentLine.innerHTML = `→ <button type="button" class="terminal-cmd" data-cmd="verstanden">VERSTANDEN</button>`;
        output.appendChild(consentLine);
        consentLine.querySelector('.terminal-cmd')?.addEventListener('click', () => {
            // Accept and then auto-send the original message
            sessionStorage.setItem(CONSENT_KEY, 'true');
            isConsented = true;
            echoInput('verstanden');
            addLine('', '');
            addLine('[OK] NEXUS ist bereit.', 'line-success');
            addLine('', '');
            scrollToBottom();
            isProcessing = false;
            // Defer to next tick so stack is clean before re-entering processInput
            setTimeout(() => processInput(pendingMessage), 50);
        });
        addLine('', '');
        scrollToBottom();
        isProcessing = false;
        return;
    }

    // User has consented — echo the input now
    echoInput(trimmed);

    // ── Contact form flow (intercepts input when active) ──
    if (isContactFormActive()) {
        const formResult = handleContactInput(trimmed);
        await renderContactResult(formResult);
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
            wrapper.innerHTML = sanitizeHtml(IMPRESSUM_TERMINAL_HTML);
            output.appendChild(wrapper);
            scrollToBottom();
            addLines(IMPRESSUM_TERMINAL);
            isProcessing = false;
            return;
        }
        if (cmd === 'datenschutz') {
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = sanitizeHtml(DATENSCHUTZ_TERMINAL_HTML);
            output.appendChild(wrapper);
            scrollToBottom();
            addLines(DATENSCHUTZ_TERMINAL);
            isProcessing = false;
            return;
        }
        if (cmd === 'dark' || cmd === 'light' || cmd === 'auto') {
            applyTheme(cmd as 'light' | 'dark' | 'auto');
            addLine(`[OK] Theme → ${cmd}`, 'line-success');
            isProcessing = false;
            return;
        }
        // Animated hack Easter Egg — Hollywood style
        if (cmd === 'hack' || cmd === 'hacking') {
            sound.play('hackSequence');
            triggerYoriReaction(cmd);
            addLine('', '');
            addLine('NEXUS INTRUSION FRAMEWORK v3.1.7', 'line-system');
            addLine('───────────────────────────', 'line-dim');
            const steps = [
                { text: '[*] Scanning target: maschke.ai (172.67.xxx.xxx)', cls: 'line-dim', delay: 400 },
                { text: '[*] Enumerating open ports… 443/tcp HTTPS ✓', cls: 'line-dim', delay: 900 },
                { text: '[*] Fingerprint: Cloudflare CDN / WAF detected', cls: 'line-dim', delay: 1400 },
                { text: '[+] Bypassing WAF layer… TUNNEL ESTABLISHED', cls: 'line-success', delay: 2100 },
                { text: '[*] Injecting payload into /api/mistral…', cls: 'line-dim', delay: 2800 },
                { text: '[!] PROMPT INJECTION BLOCKED — Guardian active', cls: 'line-warn', delay: 3500 },
                { text: '[*] Escalating privileges… sudo NEXUS override', cls: 'line-dim', delay: 4200 },
                { text: '[!] AUTH FAILED: Clearance Level 7 required', cls: 'line-warn', delay: 4800 },
                { text: '', cls: '', delay: 5200 },
                { text: '▓▓▓ ACCESS DENIED ▓▓▓', cls: 'line-warn', delay: 5600 },
                { text: '', cls: '', delay: 5800 },
                { text: 'Netter Versuch. Aber diese Infrastruktur ist kein Spielplatz.', cls: 'line-dim', delay: 6200 },
                { text: 'Wer hier reinwill, braucht Vertrauensbasis: kontakt@maschke.ai', cls: 'line-dim', delay: 6800 },
            ];
            steps.forEach(({ text, cls, delay }) => {
                setTimeout(() => {
                    addLine(text, cls);
                    if (delay === 6800) isProcessing = false;
                }, delay);
            });
            return;
        }
    }

    // Local commands
    const result = handleCommand(trimmed);
    if (result) {
        // Sound feedback for recognized commands
        if (cmd === 'sudo') sound.play('accessDenied');
        else if (cmd === 'secret' || cmd === 'easteregg' || cmd === 'easter egg') sound.play('discoveryChime');
        else if (cmd === 'matrix') {
            sound.play('matrixRain');
            setTimeout(() => sound.stopLoop('matrixRain'), 3200); // sync with 16 lines × 200ms
        } else sound.play('cmdAccept');

        // YORI reactions to easter egg commands
        triggerYoriReaction(cmd);

        // Contact form trigger
        if (result.startContactForm) {
            const formStart = startContactForm();
            await renderContactResult(formStart);
            isProcessing = false;
            return;
        }

        if (result.html) {
            // HTML block output (CSS-styled boxes)
            const wrapper = document.createElement('div');
            wrapper.className = 'line';
            wrapper.innerHTML = sanitizeHtml(result.html);
            output.appendChild(wrapper);
            scrollToBottom();

            // Attach click handlers to terminal-cmd buttons inside the box
            wrapper.querySelectorAll('.terminal-cmd').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const el = btn as HTMLElement;
                    // Copy-email button (CSP-safe — no inline onclick)
                    const email = el.dataset.copyEmail;
                    if (email) {
                        navigator.clipboard.writeText(email).then(() => {
                            el.textContent = '✓ kopiert';
                            setTimeout(() => { el.textContent = '📋 kopieren'; }, 2000);
                        });
                        return;
                    }
                    // Regular command button
                    const cmdName = el.dataset.cmd || '';
                    input.value = cmdName;
                    processInput(cmdName);
                });
            });
        } else if (result.lines) {
            // Line-by-line output — slower for matrix (cascading rain effect)
            const lineDelay = cmd === 'matrix' ? 200 : 30;
            for (const line of result.lines) {
                addLine(line.text, line.cls);
                await sleep(lineDelay);
            }
        }

        isProcessing = false;
        return;
    }

    // Chat with Mistral
    if (isLimitReached()) {
        addLine('', '');
        // Show conversion CTA box instead of dead-end message
        const ctaBox = document.createElement('div');
        ctaBox.className = 'line';
        ctaBox.innerHTML = `<div class="terminal-box terminal-cta-box">
  <div class="terminal-box-title">Nexus Limit</div>
  <div class="terminal-box-body">
    <p>5/5 Nachrichten — <strong>NEXUS</strong> hat dir einen Vorgeschmack gegeben.</p>
    <p>Für den Rest braucht es ein echtes Gespräch.</p>
    <div class="cta-actions">
      <a href="mailto:kontakt@maschke.ai" class="terminal-cmd cta-primary">✉ Schreib uns</a>
    </div>
    <p class="box-label">kontakt@maschke.ai — wir melden uns.</p>
  </div>
</div>`;
        output.appendChild(ctaBox);
        scrollToBottom();
        addLine('', '');
        isProcessing = false;
        return;
    }

    addLine('', '');

    const responseDiv = document.createElement('div');
    responseDiv.className = 'line line-ai';
    output.appendChild(responseDiv);

    let rawAiText = '';
    let displayedChars = 0;

    // Start talk animation when AI starts streaming
    const talkSprite = document.getElementById('astronaut-sprite');

    // Typewriter throttle: render AI text char-by-char at ~30 chars/sec
    // The key insight: onDone must NOT render immediately — it sets a flag,
    // and the typewriter drains to completion before finalizing.
    const TYPEWRITER_INTERVAL = 16; // ms per character (~60 chars/sec)
    let typewriterTimer: number | null = null;
    let streamingDone = false;

    function finalize() {
        // Final render with click handlers
        if (talkSprite) stopTalking(talkSprite);
        responseDiv.innerHTML = formatAiText(rawAiText);
        responseDiv.querySelectorAll('.cmd-chip').forEach((chip) => {
            chip.addEventListener('click', () => {
                const cmd = (chip as HTMLElement).dataset.cmd || '';
                input.value = cmd;
                processInput(cmd);
            });
        });
        addLine('', '');
        isProcessing = false;
    }

    function startTypewriter() {
        if (typewriterTimer) return;
        typewriterTimer = window.setInterval(() => {
            if (displayedChars < rawAiText.length) {
                displayedChars += 1;
                if (displayedChars % 5 === 0) sound.play('typeBleep');
                responseDiv.textContent = typewriterText(rawAiText.substring(0, displayedChars));
                scrollToBottom();
            } else if (streamingDone) {
                // Typewriter caught up and streaming is done — finalize
                window.clearInterval(typewriterTimer!);
                typewriterTimer = null;
                finalize();
            }
        }, TYPEWRITER_INTERVAL);
    }

    function stopTypewriter() {
        if (typewriterTimer) {
            window.clearInterval(typewriterTimer);
            typewriterTimer = null;
        }
    }

    await sendMessage(
        trimmed,
        // onChunk — accumulate raw text, typewriter renders it
        (chunk: string) => {
            // Start YORI talking on first chunk
            if (talkSprite && !isTalking) startTalking(talkSprite);
            rawAiText += chunk;
            startTypewriter();
        },
        // onDone — DON'T render immediately; let typewriter finish
        (_fullText: string) => {
            streamingDone = true;
            // If typewriter already caught up (very short response), finalize now
            if (displayedChars >= rawAiText.length) {
                stopTypewriter();
                finalize();
            }
            // Otherwise typewriter interval will handle finalization
        },
        // onError
        (error: string) => {
            stopTypewriter();
            // Stop YORI talking
            if (talkSprite) stopTalking(talkSprite);
            if (error === 'LIMIT_REACHED') {
                responseDiv.remove();
                const ctaBox = document.createElement('div');
                ctaBox.className = 'line';
                ctaBox.innerHTML = `<div class="terminal-box terminal-cta-box">
  <div class="terminal-box-title">Nexus Limit</div>
  <div class="terminal-box-body">
    <p>5/5 Nachrichten — <strong>NEXUS</strong> hat dir einen Vorgeschmack gegeben.</p>
    <p>Für den Rest braucht es ein echtes Gespräch.</p>
    <div class="cta-actions">
      <a href="mailto:kontakt@maschke.ai" class="terminal-cmd cta-primary">✉ Schreib uns</a>
    </div>
    <p class="box-label">kontakt@maschke.ai — wir melden uns.</p>
  </div>
</div>`;
                output.appendChild(ctaBox);
                scrollToBottom();
            } else {
                sound.play('cmdError');
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
        sound.play('keyReturn');
        e.preventDefault();
        processInput(input.value);
    } else if (e.key.length === 1 || e.key === 'Backspace') {
        sound.play('keyClick');
    }

    // Command history navigation
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
            // Update width so block cursor tracks correctly
            const len = input.value.length;
            input.style.width = len > 0 ? `${len}ch` : '1ch';
            input.size = Math.max(1, len);
        }
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
            const len = input.value.length;
            input.style.width = len > 0 ? `${len}ch` : '1ch';
            input.size = Math.max(1, len);
        } else {
            historyIndex = -1;
            input.value = '';
            input.style.width = '1ch';
            input.size = 1;
        }
    }
});

// Auto-size input so block cursor follows typed text
input.addEventListener('input', () => {
    // Use ch-based width for pixel-perfect cursor placement
    const len = input.value.length;
    input.style.width = len > 0 ? `${len}ch` : '1ch';
    input.size = Math.max(1, len);
});

// Click anywhere on page to focus input (not just inside terminal)
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // Don't steal focus from interactive elements (links, buttons, legal overlay)
    if (target.closest('a, button, #legal-overlay, #astro-debug, [data-contact-action]')) return;
    if (!isProcessing && inputLine.classList.contains('visible') && !legalOverlay.classList.contains('active')) {
        input.focus();
    }
});

// Theme toggle buttons (footer + status bar)
themeToggle.addEventListener('click', toggleTheme);
themeStatusToggle?.addEventListener('click', toggleTheme);

// Sound toggle buttons
function updateSoundButtons(muted: boolean) {
    const label = muted ? 'SOUND OFF' : 'SOUND ON';
    [soundToggle, soundToggleMobile].forEach(btn => {
        if (btn) { btn.textContent = label; btn.className = muted ? 'muted' : ''; }
    });
}
updateSoundButtons(sound.muted);
[soundToggle, soundToggleMobile].forEach(btn => {
    btn?.addEventListener('click', () => updateSoundButtons(sound.toggle()));
});

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
// Click backdrop (outside panel) to close
legalOverlay.addEventListener('click', (e) => {
    if (e.target === legalOverlay) closeLegal();
});

// ── Mobile keyboard handling (visualViewport API) ──
// When the iOS/Android keyboard opens, the visual viewport shrinks.
// We adjust terminal bottom offset so the input line stays visible.
if (window.visualViewport) {
    let wasKeyboardOpen = false;
    let driftResetTimer: ReturnType<typeof setTimeout> | null = null;

    const resetDrift = () => {
        // Aggressively reset all scroll positions
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        terminal.style.transform = '';

        // Compensate visualViewport offset if it persists after keyboard close
        const vv = window.visualViewport;
        if (vv && vv.offsetTop > 0) {
            window.scrollTo(0, 0);
        }
    };

    const onViewportResize = () => {
        const vv = window.visualViewport!;
        // Keyboard height ≈ difference between window height and visual viewport height
        const kbHeight = window.innerHeight - vv.height;
        const isKeyboardOpen = kbHeight > 100; // Threshold to distinguish from minor viewport changes

        // Adjust terminal bottom to sit above the keyboard
        terminal.style.bottom = isKeyboardOpen ? `${kbHeight + 4}px` : '';

        // Hide astronaut and footer when keyboard is open (declutter mobile)
        const astronaut = document.getElementById('astronaut-overlay');
        const footer = document.getElementById('legal-footer');
        if (astronaut) astronaut.style.display = isKeyboardOpen ? 'none' : '';
        if (footer) footer.style.display = isKeyboardOpen ? 'none' : '';

        if (isKeyboardOpen) {
            wasKeyboardOpen = true;
            // Clear any pending drift reset from rapid open/close
            if (driftResetTimer) { clearTimeout(driftResetTimer); driftResetTimer = null; }
            // Scroll input into view
            requestAnimationFrame(() => {
                input.scrollIntoView({ block: 'nearest' });
                scrollToBottom();
            });
        } else if (wasKeyboardOpen) {
            wasKeyboardOpen = false;
            // Keyboard closed — blur input to ensure keyboard fully dismisses
            input.blur();

            // Multi-stage reset: iOS keyboard close animation takes ~300ms
            // Stage 1: Immediate reset
            resetDrift();

            // Stage 2: After keyboard animation completes
            if (driftResetTimer) clearTimeout(driftResetTimer);
            driftResetTimer = setTimeout(() => {
                resetDrift();
                scrollToBottom();
                driftResetTimer = null;
            }, 350);
        }
    };

    window.visualViewport.addEventListener('resize', onViewportResize);

    // Also listen for scroll events on visualViewport to catch offset drift
    window.visualViewport.addEventListener('scroll', () => {
        const vv = window.visualViewport!;
        if (vv.offsetTop > 0 && !wasKeyboardOpen) {
            // Page drifted — snap back
            window.scrollTo(0, 0);
        }
    });
}

// ── Start ──
(async () => {
    const overlay = document.getElementById('crt-boot-overlay');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (overlay && !prefersReducedMotion) {
        await new Promise<void>(resolve => {
            overlay.addEventListener('animationend', () => {
                overlay.remove();
                resolve();
            }, { once: true });
        });
    } else if (overlay) {
        overlay.remove();
    }

    await runBootSequence();
})();
