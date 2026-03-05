/**
 * Cloudflare Pages Function — Mistral API proxy
 * POST /api/mistral → stream Mistral response to client
 *
 * Env var required: MISTRAL_API_KEY
 */

// In-memory rate limiting (per-worker, resets on cold start)
const rateMap = new Map();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 60 seconds

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

        // Cap input
        if (messages.length > 14) {
            return new Response(JSON.stringify({ error: 'Too many messages' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Basic prompt injection check
        const lastUserMsg = messages.filter(m => m.role === 'user').pop();
        if (lastUserMsg && lastUserMsg.content.length > 2000) {
            return new Response(JSON.stringify({ error: 'Message too long' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || 'mistral-medium-latest',
                messages,
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
