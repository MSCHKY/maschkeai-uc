/**
 * NEXUS ASCII Art — exact replica of NexusAscii.tsx from main project
 * Uses ░ (dither) and █ (solid) characters in a 2-layer rendering system
 * + VHS-style glitch effect with clip-path slice clones
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
 * Renders the 2-layer NEXUS ASCII logo + 2 glitch clone layers
 * Solid layer: █ characters (gradient text, drop-shadow)
 * Dither layer: ░ characters (offset, semi-transparent, multiply blend)
 * Glitch-1: clip-path top slice, offset left, cyan tint
 * Glitch-2: clip-path bottom slice, offset right, red tint
 */
export function renderNexusLogo(): HTMLElement {
    const solidText = NEXUS_RAW.replaceAll('░', ' ');
    const ditherText = NEXUS_RAW.replaceAll('█', ' ').replaceAll(' ', '\u00A0');

    const stack = document.createElement('div');
    stack.className = 'terminal-nexus-stack';

    // Main solid layer
    const solidPre = document.createElement('pre');
    solidPre.className = 'terminal-nexus terminal-nexus--solid terminal-grad-text';
    solidPre.setAttribute('aria-label', 'NEXUS');
    solidPre.setAttribute('role', 'img');
    solidPre.textContent = solidText;

    // Dither layer (shadow/depth)
    const ditherPre = document.createElement('pre');
    ditherPre.className = 'terminal-nexus terminal-nexus--dither terminal-grad-text';
    ditherPre.setAttribute('aria-hidden', 'true');
    ditherPre.textContent = ditherText;

    // Glitch clone layers — two offset copies for the VHS tear effect
    const glitch1 = document.createElement('pre');
    glitch1.className = 'terminal-nexus terminal-nexus--glitch terminal-nexus--glitch-1';
    glitch1.setAttribute('aria-hidden', 'true');
    glitch1.textContent = solidText;

    const glitch2 = document.createElement('pre');
    glitch2.className = 'terminal-nexus terminal-nexus--glitch terminal-nexus--glitch-2';
    glitch2.setAttribute('aria-hidden', 'true');
    glitch2.textContent = solidText;

    stack.appendChild(solidPre);
    stack.appendChild(ditherPre);
    stack.appendChild(glitch1);
    stack.appendChild(glitch2);

    return stack;
}
