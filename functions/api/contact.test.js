import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { onRequestPost } from './contact.js';

describe('Contact API', () => {
    test('handles missing API key', async () => {
        const context = {
            request: new Request('http://localhost/api/contact', { method: 'POST' }),
            env: {}
        };
        const response = await onRequestPost(context);
        assert.strictEqual(response.status, 500);
        const data = await response.json();
        assert.strictEqual(data.error, 'Mail service not configured');
    });

    test('rate limits requests', async () => {
        // Mock fetch to prevent actual network calls during tests
        const originalFetch = global.fetch;
        global.fetch = async () => new Response(JSON.stringify({ success: true }), { status: 200 });

        try {
            const headers = new Headers({ 'CF-Connecting-IP': '127.0.0.1' });
            const createRequest = () => new Request('http://localhost/api/contact', {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: 'Test', email: 'test@test.com', message: 'Test message with enough length' })
            });

            const context = {
                request: createRequest(),
                env: { BREVO_API_KEY: 'test-key' }
            };

            let status;
            for (let i = 0; i < 4; i++) {
                context.request = createRequest();
                const res = await onRequestPost(context);
                status = res.status;
            }
            assert.strictEqual(status, 429);
        } finally {
            global.fetch = originalFetch;
        }
    });
});
