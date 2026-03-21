import { test } from 'node:test';
import assert from 'node:assert';
import { handleCommand } from './commands.ts';

test('handleCommand should return null for empty string', () => {
    assert.strictEqual(handleCommand(''), null);
});

test('handleCommand should return null for whitespace string', () => {
    assert.strictEqual(handleCommand('   '), null);
});

test('handleCommand should return CommandResult for valid command "hilfe"', () => {
    const result = handleCommand('hilfe');
    assert.notStrictEqual(result, null);
    assert.ok(result?.lines || result?.html);
});

test('handleCommand should return CommandResult for valid alias "help"', () => {
    const result = handleCommand('help');
    assert.notStrictEqual(result, null);
    assert.ok(result?.lines || result?.html);
});

test('handleCommand should return null for unknown command', () => {
    assert.strictEqual(handleCommand('unknown'), null);
});
