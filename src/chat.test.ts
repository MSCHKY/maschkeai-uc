import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
    isLimitReached,
    getRemainingMessages,
    incrementMessageCount,
    decrementMessageCount,
    _resetChatStateForTesting,
} from './chat.ts';

describe('Chat Limits', () => {
    beforeEach(() => {
        _resetChatStateForTesting();
    });

    it('should have correct initial state', () => {
        assert.strictEqual(isLimitReached(), false);
        assert.strictEqual(getRemainingMessages(), 5);
    });

    it('should track increments and decrements correctly', () => {
        incrementMessageCount();
        assert.strictEqual(getRemainingMessages(), 4);
        assert.strictEqual(isLimitReached(), false);

        incrementMessageCount();
        assert.strictEqual(getRemainingMessages(), 3);

        decrementMessageCount();
        assert.strictEqual(getRemainingMessages(), 4);
    });

    it('should not decrement below 0 messages', () => {
        assert.strictEqual(getRemainingMessages(), 5);
        decrementMessageCount();
        assert.strictEqual(getRemainingMessages(), 5);
    });

    it('should enforce the limit correctly', () => {
        // Increment 5 times (MAX_MESSAGES)
        for (let i = 0; i < 5; i++) {
            assert.strictEqual(isLimitReached(), false);
            incrementMessageCount();
        }

        assert.strictEqual(isLimitReached(), true);
        assert.strictEqual(getRemainingMessages(), 0);

        // Increment past the limit (simulating a bug or forced behavior)
        incrementMessageCount();
        assert.strictEqual(isLimitReached(), true);
        assert.strictEqual(getRemainingMessages(), 0); // Math.max(0, ...) protects this
    });
});
