// Combined from Jules PRs #9 (Chat Limits) and #5 (Network Failure)
// @ts-nocheck
import { test, beforeEach, describe } from 'node:test';
import * as assert from 'node:assert';
import {
    isLimitReached,
    getRemainingMessages,
    incrementMessageCount,
    _resetChatStateForTesting
} from './chat.ts';
import { sendMessage } from './chat.ts';

// ── PR #9: Chat Limits ──
describe('Chat Limits', () => {
    beforeEach(() => {
        _resetChatStateForTesting();
    });

    test('initial state: limit is not reached and all messages remain', () => {
        assert.strictEqual(isLimitReached(), false);
        assert.strictEqual(getRemainingMessages(), 5);
    });

    test('intermediate state: limit is not reached and remaining decreases', () => {
        incrementMessageCount();
        incrementMessageCount();

        assert.strictEqual(isLimitReached(), false);
        assert.strictEqual(getRemainingMessages(), 3);
    });

    test('limit reached: returns true when max messages hit', () => {
        for (let i = 0; i < 5; i++) {
            incrementMessageCount();
        }

        assert.strictEqual(isLimitReached(), true);
        assert.strictEqual(getRemainingMessages(), 0);
    });

    test('exceeding limit: remaining messages does not go below 0', () => {
        for (let i = 0; i < 6; i++) {
            incrementMessageCount();
        }

        assert.strictEqual(isLimitReached(), true);
        assert.strictEqual(getRemainingMessages(), 0);
    });
});

// ── PR #5: Network Failure ──
test('sendMessage handles network failure correctly', async () => {
    _resetChatStateForTesting();
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
