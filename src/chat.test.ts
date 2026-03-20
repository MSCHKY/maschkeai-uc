// @ts-ignore
import { test, beforeEach, describe } from 'node:test';
// @ts-ignore
import * as assert from 'node:assert';
import {
    isLimitReached,
    getRemainingMessages,
    incrementMessageCount,
    _resetChatStateForTesting
} from './chat.ts';

describe('Chat Limits', () => {
    beforeEach(() => {
        _resetChatStateForTesting();
    });

    test('initial state: limit is not reached and all messages remain', () => {
        assert.strictEqual(isLimitReached(), false);
        assert.strictEqual(getRemainingMessages(), 5); // Assuming MAX_MESSAGES = 5
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
