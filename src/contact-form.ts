/**
 * Contact Form State Machine — Step-by-step terminal flow
 * ─────────────────────────────────────────────────────────
 * States: IDLE → NAME → EMAIL → MESSAGE → CONFIRM → SENDING → DONE
 * User can abort at any step with 'abbrechen', 'exit', or 'quit'.
 *
 * Pattern: Similar to Compliance Checker in main maschkeai-chatbot project.
 * ─────────────────────────────────────────────────────────
 */

// ── Types ──

export interface ContactFormResult {
    /** Line-by-line output */
    lines?: { text: string; cls: string }[];
    /** HTML block output (for summary box) */
    html?: string;
    /** True when the flow is complete (success or abort) */
    done?: boolean;
    /** Collected form data — only set when ready to submit */
    submitData?: { name: string; email: string; message: string };
}

type ContactState = 'IDLE' | 'NAME' | 'EMAIL' | 'MESSAGE' | 'CONFIRM';

// ── State ──

let state: ContactState = 'IDLE';
let formData = { name: '', email: '', message: '' };

// ── Validation ──

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CANCEL_WORDS = new Set(['abbrechen', 'exit', 'quit', 'cancel', 'zurück']);

export function validateName(name: string): string | null {
    const trimmed = name.trim();
    if (trimmed.length < 2) return 'Mindestens 2 Zeichen, bitte.';
    if (trimmed.length > 100) return 'Maximal 100 Zeichen, bitte.';
    return null;
}

export function validateEmail(email: string): string | null {
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) return 'Das sieht nicht nach einer gültigen E-Mail aus.';
    return null;
}

export function validateMessage(message: string): string | null {
    const trimmed = message.trim();
    if (trimmed.length < 10) return 'Ein bisschen mehr darfs schon sein — mindestens 10 Zeichen.';
    if (trimmed.length > 2000) return 'Maximal 2000 Zeichen, bitte. Für den Roman schreib uns direkt.';
    return null;
}

// ── Public API ──

export function isContactFormActive(): boolean {
    return state !== 'IDLE';
}

export function startContactForm(): ContactFormResult {
    state = 'NAME';
    formData = { name: '', email: '', message: '' };
    return {
        lines: [
            { text: '', cls: '' },
            { text: 'KONTAKTFORMULAR', cls: 'line-system' },
            { text: '───────────────────────────', cls: 'line-dim' },
            { text: 'Drei kurze Fragen, dann geht deine Nachricht raus.', cls: 'line-dim' },
            { text: 'Jederzeit abbrechen mit: abbrechen', cls: 'line-dim' },
            { text: '', cls: '' },
            { text: '① Wie darf ich dich vorstellen?', cls: '' },
            { text: '', cls: '' },
        ],
    };
}

export function handleContactInput(input: string): ContactFormResult {
    const trimmed = input.trim();

    // Cancel check — works in every state
    if (CANCEL_WORDS.has(trimmed.toLowerCase())) {
        state = 'IDLE';
        formData = { name: '', email: '', message: '' };
        return {
            lines: [
                { text: '', cls: '' },
                { text: '[ABGEBROCHEN] Kein Problem — die Nachricht wurde nicht gesendet.', cls: 'line-dim' },
                { text: '', cls: '' },
            ],
            done: true,
        };
    }

    switch (state) {
        case 'NAME': {
            const error = validateName(trimmed);
            if (error) {
                return {
                    lines: [
                        { text: `[!] ${error}`, cls: 'line-accent' },
                        { text: '', cls: '' },
                    ],
                };
            }
            formData.name = trimmed;
            state = 'EMAIL';
            return {
                lines: [
                    { text: '', cls: '' },
                    { text: `Hallo ${formData.name}.`, cls: '' },
                    { text: '', cls: '' },
                    { text: '② Unter welcher E-Mail können wir dich erreichen?', cls: '' },
                    { text: '', cls: '' },
                ],
            };
        }

        case 'EMAIL': {
            const error = validateEmail(trimmed);
            if (error) {
                return {
                    lines: [
                        { text: `[!] ${error}`, cls: 'line-accent' },
                        { text: '', cls: '' },
                    ],
                };
            }
            formData.email = trimmed.toLowerCase();
            state = 'MESSAGE';
            return {
                lines: [
                    { text: '', cls: '' },
                    { text: '③ Was beschäftigt dich? (Kurz oder ausführlich — beides okay)', cls: '' },
                    { text: '', cls: '' },
                ],
            };
        }

        case 'MESSAGE': {
            const error = validateMessage(trimmed);
            if (error) {
                return {
                    lines: [
                        { text: `[!] ${error}`, cls: 'line-accent' },
                        { text: '', cls: '' },
                    ],
                };
            }
            formData.message = trimmed;
            state = 'CONFIRM';

            // Build summary box
            const escapedName = escapeForHtml(formData.name);
            const escapedEmail = escapeForHtml(formData.email);
            const escapedMsg = escapeForHtml(formData.message);

            return {
                html: `<div class="terminal-box contact-summary">
<div class="terminal-box-title">Nachricht an maschke.ai</div>
<div class="terminal-box-body">
<p><span class="box-label">Name:</span> ${escapedName}</p>
<p><span class="box-label">E-Mail:</span> ${escapedEmail}</p>
<p><span class="box-label">Nachricht:</span> ${escapedMsg}</p>
<div class="contact-actions">
<button type="button" class="terminal-cmd contact-btn-send" data-contact-action="send">SENDEN</button>
<button type="button" class="terminal-cmd contact-btn-cancel" data-contact-action="cancel">ABBRECHEN</button>
</div>
</div>
</div>`,
            };
        }

        case 'CONFIRM': {
            // Text-based confirm: user typed instead of clicking buttons
            const lower = trimmed.toLowerCase();
            if (lower === 'senden' || lower === 'ja' || lower === 'send' || lower === 'ok') {
                return confirmSend();
            }
            if (lower === 'abbrechen' || lower === 'nein' || lower === 'no') {
                state = 'IDLE';
                formData = { name: '', email: '', message: '' };
                return {
                    lines: [
                        { text: '', cls: '' },
                        { text: '[ABGEBROCHEN] Kein Problem — die Nachricht wurde nicht gesendet.', cls: 'line-dim' },
                        { text: '', cls: '' },
                    ],
                    done: true,
                };
            }
            return {
                lines: [
                    { text: '[!] Bitte SENDEN oder ABBRECHEN wählen.', cls: 'line-accent' },
                    { text: '', cls: '' },
                ],
            };
        }

        default:
            state = 'IDLE';
            return { done: true };
    }
}

/** Called when user confirms submission (click or text) */
export function confirmSend(): ContactFormResult {
    const data = { ...formData };
    state = 'IDLE';
    formData = { name: '', email: '', message: '' };
    return {
        lines: [
            { text: '', cls: '' },
            { text: 'Wird gesendet…', cls: 'line-system' },
        ],
        submitData: data,
        done: true,
    };
}

/** Called when user cancels from confirm step (via button click) */
export function cancelForm(): ContactFormResult {
    state = 'IDLE';
    formData = { name: '', email: '', message: '' };
    return {
        lines: [
            { text: '', cls: '' },
            { text: '[ABGEBROCHEN] Kein Problem — die Nachricht wurde nicht gesendet.', cls: 'line-dim' },
            { text: '', cls: '' },
        ],
        done: true,
    };
}

/** Reset state (for testing) */
export function _resetContactFormForTesting(): void {
    state = 'IDLE';
    formData = { name: '', email: '', message: '' };
}

// ── Helpers ──

function escapeForHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
