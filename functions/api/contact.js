/**
 * Cloudflare Pages Function — Contact Form Handler
 * POST /api/contact → validate, send email via Brevo (EU), respond
 *
 * Env var required: BREVO_API_KEY
 *
 * Security: Honeypot field, rate limiting, input validation.
 * DSGVO: No data stored — transit only via Brevo (EU servers, Paris).
 */

// --- Constants ---
const CONTACT_RATE_LIMIT = 3; // max submissions per window per IP
const CONTACT_RATE_WINDOW = 60 * 1000; // 60 seconds

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Rate Limiting (in-memory, per-worker) ---
const contactRateMap = new Map();

function getContactRateCount(ip) {
    const now = Date.now();
    const entry = contactRateMap.get(ip);
    if (!entry || now - entry.start > CONTACT_RATE_WINDOW) {
        contactRateMap.set(ip, { start: now, count: 1 });
        return 1;
    }
    entry.count++;
    return entry.count;
}

// --- Request Handler ---
export async function onRequestPost(context) {
    const { request, env } = context;
    const apiKey = env.BREVO_API_KEY;

    if (!apiKey) {
        console.error('[contact] BREVO_API_KEY not configured');
        return new Response(JSON.stringify({ error: 'Mail service not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
    const count = getContactRateCount(ip);

    if (count > CONTACT_RATE_LIMIT) {
        return new Response(JSON.stringify({ error: 'Zu viele Anfragen. Bitte warte einen Moment.' }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': '60',
            },
        });
    }

    try {
        const body = await request.json();
        const { name, email, message, website } = body;

        // Honeypot — bots fill this hidden field, humans don't
        if (website && website.trim().length > 0) {
            // Silent success — don't reveal it's a trap
            console.warn('[contact] Honeypot triggered from', ip);
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- Input Validation ---
        if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
            return new Response(JSON.stringify({ error: 'Name muss zwischen 2 und 100 Zeichen lang sein.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return new Response(JSON.stringify({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
            return new Response(JSON.stringify({ error: 'Nachricht muss zwischen 10 und 2000 Zeichen lang sein.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();
        const timestamp = new Date().toISOString();

        // --- Send via Brevo API ---
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                sender: { name: 'NEXUS Kontaktform', email: 'noreply@maschke.ai' },
                to: [{ email: 'kontakt@maschke.ai', name: 'maschke.ai' }],
                replyTo: { email: cleanEmail, name: cleanName },
                subject: `[NEXUS] Kontaktanfrage von ${cleanName}`,
                textContent: [
                    `Neue Kontaktanfrage über NEXUS (UC-Site)`,
                    `────────────────────────────────────────`,
                    `Name:      ${cleanName}`,
                    `E-Mail:    ${cleanEmail}`,
                    `Zeitpunkt: ${timestamp}`,
                    `IP:        ${ip}`,
                    ``,
                    `Nachricht:`,
                    `${cleanMessage}`,
                    ``,
                    `────────────────────────────────────────`,
                    `Antworte direkt auf diese E-Mail (Reply-To ist gesetzt).`,
                ].join('\n'),
            }),
        });

        if (!brevoResponse.ok) {
            const errText = await brevoResponse.text();
            console.error('[contact] Brevo error:', brevoResponse.status, errText);
            return new Response(JSON.stringify({ error: 'Nachricht konnte nicht gesendet werden. Bitte versuche es später.' }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('[contact] Message sent successfully from', cleanEmail);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('[contact] Error:', err);
        return new Response(JSON.stringify({ error: 'Interner Fehler. Bitte versuche es später.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
