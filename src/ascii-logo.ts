/**
 * NEXUS ASCII Art — exact replica of NexusAscii.tsx from main project
 * Uses ░ (dither) and █ (solid) characters in a 2-layer rendering system
 */

export const NEXUS_RAW = String.raw`
░██░░ ░█░░█░████░█░░█░█░░█░░███
░░██░ ░██░█░█   ░█░░█░█░░█░█
░░░██ ░█ ██░███░░ ██ ░█░░█░ ██░
░░░██ ░█░ █░█  ░░█  █░█░░█░░  █
░░██░ ░█░░█░████░█░░█░ ██ ░███
░██░░ ░ ░░ ░    ░ ░░ ░░  ░░   ░
`.trim();

/**
 * Renders the 2-layer NEXUS ASCII logo into the DOM
 * Solid layer: █ characters (gradient text, drop-shadow)
 * Dither layer: ░ characters (offset, semi-transparent, multiply blend)
 */
export function renderNexusLogo(): HTMLElement {
    const solidText = NEXUS_RAW.replaceAll('░', ' ');
    const ditherText = NEXUS_RAW.replaceAll('█', ' ').replaceAll(' ', '\u00A0');

    const stack = document.createElement('div');
    stack.className = 'terminal-nexus-stack';

    const solidPre = document.createElement('pre');
    solidPre.className = 'terminal-nexus terminal-nexus--solid terminal-grad-text';
    solidPre.setAttribute('aria-label', 'NEXUS');
    solidPre.setAttribute('role', 'img');
    solidPre.textContent = solidText;

    const ditherPre = document.createElement('pre');
    ditherPre.className = 'terminal-nexus terminal-nexus--dither terminal-grad-text';
    ditherPre.setAttribute('aria-hidden', 'true');
    ditherPre.textContent = ditherText;

    stack.appendChild(solidPre);
    stack.appendChild(ditherPre);

    return stack;
}
