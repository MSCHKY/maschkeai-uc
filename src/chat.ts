/**
 * Mistral Chat Client — SSE streaming via /api/mistral
 * Limited to MAX_MESSAGES per page load (resets on reload).
 */

const MAX_MESSAGES = 5;

// System prompt is now injected server-side in functions/api/mistral.js
// This prevents the ALLOWED_ROLES filter from stripping it out.


interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

let chatHistory: ChatMessage[] = [];
let messageCount = 0;

function incrementMessageCount(): void {
    messageCount++;
}

export function isLimitReached(): boolean {
    return messageCount >= MAX_MESSAGES;
}

export function getRemainingMessages(): number {
    return Math.max(0, MAX_MESSAGES - messageCount);
}

/**
 * Send a message to Mistral and stream the response.
 * Calls onChunk for each text delta and onDone when complete.
 */
export async function sendMessage(
    userMessage: string,
    onChunk: (text: string) => void,
    onDone: (fullText: string) => void,
    onError: (error: string) => void
): Promise<void> {
    if (isLimitReached()) {
        onError('LIMIT_REACHED');
        return;
    }

    chatHistory.push({ role: 'user', content: userMessage });
    incrementMessageCount();

    const messages: ChatMessage[] = [
        ...chatHistory,
    ];

    try {
        const response = await fetch('/api/mistral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            if (response.status === 403) {
                onError('Deine Anfrage wurde aus Sicherheitsgründen blockiert. Bitte formuliere sie anders.');
                return;
            }
            if (response.status === 429) {
                onError('Rate limit — bitte warte einen Moment.');
                return;
            }
            onError(`Verbindungsfehler (${response.status})`);
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            onError('Stream nicht verfügbar.');
            return;
        }

        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                        fullText += delta;
                        onChunk(delta);
                    }
                } catch {
                    // skip malformed chunks
                }
            }
        }

        chatHistory.push({ role: 'assistant', content: fullText });
        onDone(fullText);
    } catch (err) {
        onError('Verbindung zu NEXUS fehlgeschlagen. Ist das Internet da?');
        console.error('[chat] Error:', err);
    }
}
