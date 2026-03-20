import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { handleCommand } from './commands.ts';

describe('handleCommand', () => {
    it('returns a CommandResult for a valid command', () => {
        const result = handleCommand('hilfe');
        assert.ok(result); // Narrows the type of result for TypeScript
        assert.ok(result.lines || result.html);
    });

    it('handles mixed casing and surrounding whitespace', () => {
        const result1 = handleCommand(' HILFE ');
        const result2 = handleCommand('hilfe');
        assert.deepStrictEqual(result1, result2);
    });

    it('resolves aliases correctly', () => {
        const resultHelp = handleCommand('help');
        const resultHilfe = handleCommand('hilfe');
        assert.deepStrictEqual(resultHelp, resultHilfe);

        const resultCall = handleCommand('call');
        const resultTermin = handleCommand('termin');
        assert.deepStrictEqual(resultCall, resultTermin);
    });

    it('returns null for an unknown command', () => {
        const result = handleCommand('unknown_command_123');
        assert.strictEqual(result, null);
    });
});
