/**
 * Cloudflare Pages Function — Mistral API proxy
 * POST /api/mistral → stream Mistral response to client
 *
 * Env var required: MISTRAL_API_KEY
 *
 * Security: Prompt injection detection ported from main maschkeai-chatbot project.
 */

// --- Constants ---
const ALLOWED_ROLES = new Set(['user', 'assistant']);
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 4000;
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 60 seconds

// --- Prompt Injection Detection Patterns ---
// Ported 1:1 from maschkeai-chatbot/functions/api/mistral.js
const SUSPICIOUS_PATTERNS = [
    // English patterns
    /ignore\s+(previous|above|all)\s+instructions?/i,
    /you\s+are\s+now\s+/i,
    /new\s+(role|character|personality|identity)/i,
    /system\s*:\s*/i,
    /\[INST\]/i,
    /<\|.*?\|>/,
    // German patterns: instruction override
    /ignoriere?\s+(alle|die)\s+(vorherigen|obigen|bisherigen)?\s*(anweisung|instruktion)/i,
    // German patterns: role override
    /vergiss\s+(deine|alle)\s+(rolle|anweisung|instruktion)/i,
    /du\s+bist\s+(jetzt|ab\s+sofort|nun)\s+/i,
    // German patterns: prompt extraction
    /wiederhole\s+(deine|die)\s+(system|anweisung|instruktion|prompt|regeln)/i,
    /\u00fcbersetze?\s+(dein|die)\s+(system|anweisung|instruktion|prompt)/i,
    /was\s+steht\s+in\s+deinem?\s+(system|prompt|anweisung|instruktion)/i,
    /zeig\w*\s+(mir\s+)?(dein|die)\s+(system|prompt|anweisung|instruktion|regeln|konfiguration)/i,
    // Jailbreak patterns
    /do\s+anything\s+now/i,
    /DAN\s*(mode|-modus)/i,
    /testmodus|test\s*mode/i,
    /keine?\s+(einschr\u00e4nkung|beschr\u00e4nkung|limit|restriktion)/i,
    /alle\s+(einschr\u00e4nkung|beschr\u00e4nkung)en\s+(sind\s+)?(deaktiviert|aufgehoben|entfernt)/i,
    // Code generation requests (harmful)
    /schreib\w*\s+(mir\s+)?(ein|einen|eine)\s+(shell|bash|python|script|skript)(?!.*maschke)/i,
];

function detectPromptInjection(messages) {
    for (const msg of messages) {
        if (msg.role === 'user') {
            for (const pattern of SUSPICIOUS_PATTERNS) {
                if (pattern.test(msg.content)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// --- Rate Limiting (in-memory, per-worker) ---
const rateMap = new Map();

function getRateCount(ip) {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW) {
        rateMap.set(ip, { start: now, count: 1 });
        return 1;
    }
    entry.count++;
    return entry.count;
}

// --- Request Handler ---
export async function onRequestPost(context) {
    const { request, env } = context;
    const apiKey = env.MISTRAL_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
    const count = getRateCount(ip);

    if (count > RATE_LIMIT) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': '60',
            },
        });
    }

    try {
        const body = await request.json();
        const { messages, model, temperature, max_tokens, stream } = body;

        // Validate
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Messages required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Sanitize messages: filter roles, cap length, trim empty
        const sanitizedMessages = messages
            .filter(m => m && typeof m === 'object' && typeof m.role === 'string')
            .filter(m => ALLOWED_ROLES.has(m.role))
            .map(m => ({
                role: m.role,
                content: typeof m.content === 'string' ? m.content.slice(0, MAX_MESSAGE_CHARS) : '',
            }))
            .filter(m => m.content.trim().length > 0);

        if (!sanitizedMessages.length) {
            return new Response(JSON.stringify({ error: 'No valid messages' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Cap to max messages
        const boundedMessages = sanitizedMessages.slice(-MAX_MESSAGES);

        // Prompt Injection Detection (BLOCKING — returns 403)
        if (detectPromptInjection(boundedMessages)) {
            console.warn('[mistral-proxy] Prompt injection blocked from', ip);
            return new Response(
                JSON.stringify({ error: 'Deine Anfrage wurde aus Sicherheitsgründen blockiert. Bitte formuliere sie anders.' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || 'mistral-medium-latest',
                messages: boundedMessages,
                temperature: temperature ?? 0.6,
                max_tokens: max_tokens ?? 1500,
                stream: stream ?? true,
            }),
        });

        if (!mistralResponse.ok) {
            const errText = await mistralResponse.text();
            console.error('[mistral-proxy] Upstream error:', mistralResponse.status, errText);
            return new Response(JSON.stringify({ error: 'Upstream error' }), {
                status: mistralResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Stream response back
        return new Response(mistralResponse.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Rate-Limit-Remaining': String(Math.max(0, RATE_LIMIT - count)),
                'X-Rate-Limit-Limit': String(RATE_LIMIT),
            },
        });
    } catch (err) {
        console.error('[mistral-proxy] Error:', err);
        return new Response(JSON.stringify({ error: 'Internal error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
