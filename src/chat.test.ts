// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert';
import { sendMessage } from './chat.ts';

test('sendMessage handles network failure correctly', async () => {
    const originalFetch = global.fetch;
    const originalConsoleError = console.error;

    try {
        global.fetch = async () => {
            throw new Error('Network error simulation');
        };

        let errorLogged = false;
        console.error = () => {
            errorLogged = true;
        };

        let chunkCalled = false;
        let doneCalled = false;
        let errorMsg = '';

        await sendMessage(
            'Test message',
            () => { chunkCalled = true; },
            () => { doneCalled = true; },
            (err) => { errorMsg = err; }
        );

        assert.strictEqual(chunkCalled, false, 'onChunk should not be called');
        assert.strictEqual(doneCalled, false, 'onDone should not be called');
        assert.strictEqual(errorMsg, 'Verbindung zu NEXUS fehlgeschlagen. Ist das Internet da?');
        assert.strictEqual(errorLogged, true, 'console.error should be called');
    } finally {
        global.fetch = originalFetch;
        console.error = originalConsoleError;
    }
});
