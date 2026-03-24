// Jules PR #6 — Commands test suite
// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';
import { handleCommand, isSpecialCommand } from './commands.ts';

test('handleCommand', async (t: any) => {
    await t.test('returns null for unknown commands', () => {
        assert.equal(handleCommand('unknown'), null);
        assert.equal(handleCommand('invalid'), null);
    });

    await t.test('handles empty and whitespace inputs', () => {
        assert.equal(handleCommand(''), null);
        assert.equal(handleCommand('   '), null);
        assert.equal(handleCommand('\t\n'), null);
    });

    await t.test('handles valid commands', () => {
        const hilfeResult = handleCommand('hilfe');
        assert.ok(hilfeResult !== null);
        assert.ok(hilfeResult.lines !== undefined);
        assert.equal(hilfeResult.lines[1].text, 'BEFEHLE');

        const aboutResult = handleCommand('about');
        assert.ok(aboutResult !== null);
        assert.ok(aboutResult.lines !== undefined);
        assert.ok(aboutResult.lines[1].text.includes('maschke.ai'));

        const servicesResult = handleCommand('services');
        assert.ok(servicesResult !== null);
        assert.ok(servicesResult.html !== undefined);
        assert.ok(servicesResult.html.includes('Leistungsfelder'));

        const statusResult = handleCommand('status');
        assert.ok(statusResult !== null);
        assert.ok(statusResult.html !== undefined);
        assert.ok(statusResult.html.includes('System Status'));
    });

    await t.test('handles contact and termin forms', () => {
        const contactResult = handleCommand('contact');
        assert.ok(contactResult !== null);
        assert.equal(contactResult.startContactForm, true);

        const terminResult = handleCommand('termin');
        assert.ok(terminResult !== null);
        assert.equal(terminResult.startContactForm, true);
    });

    await t.test('handles easter egg commands', () => {
        const pingResult = handleCommand('ping');
        assert.ok(pingResult !== null);
        assert.ok(pingResult.lines !== undefined);
        assert.ok(pingResult.lines[0].text.includes('PONG'));

        const sudoResult = handleCommand('sudo');
        assert.ok(sudoResult !== null);
        assert.ok(sudoResult.lines !== undefined);
        assert.equal(sudoResult.lines[1].text, '[sudo] password for nexus: ********');

        const statsResult = handleCommand('stats');
        assert.ok(statsResult !== null);
        assert.ok(statsResult.lines !== undefined);
        assert.equal(statsResult.lines[1].text, 'SYSTEM STATS');

        const matrixResult = handleCommand('matrix');
        assert.ok(matrixResult !== null);
        assert.ok(matrixResult.lines !== undefined);
        assert.ok(matrixResult.lines.some((l: { text: string }) => l.text.includes('The Matrix has you')));

        const secretResult = handleCommand('secret');
        assert.ok(secretResult !== null);
        assert.ok(secretResult.lines !== undefined);
        assert.equal(secretResult.lines[1].text, '▓▓▓ HIDDEN LAYER DETECTED ▓▓▓');
    });

    await t.test('handles case-insensitivity and whitespace', () => {
        const hilfe1 = handleCommand('hilfe');
        const hilfe2 = handleCommand(' HILFE ');
        assert.deepEqual(hilfe1, hilfe2);
    });

    await t.test('handles origin easter egg', () => {
        const result = handleCommand('origin');
        assert.ok(result !== null);
        assert.ok(result.lines !== undefined);
        assert.ok(result.lines.some((l: any) => l.text.includes('ORIGIN STORY')));
        assert.ok(result.lines.some((l: any) => l.text.includes('Bend the Reality')));
    });

    await t.test('handles aliases', () => {
        const hilfe = handleCommand('hilfe');
        const help = handleCommand('help');
        assert.deepEqual(hilfe, help);

        const contact = handleCommand('contact');
        const kontakt = handleCommand('kontakt');
        assert.deepEqual(contact, kontakt);

        const termin1 = handleCommand('termin');
        const termin2 = handleCommand('call');
        const termin3 = handleCommand('intro');
        const termin4 = handleCommand('cal');
        const termin5 = handleCommand('buchen');
        assert.deepEqual(termin1, termin2);
        assert.deepEqual(termin1, termin3);
        assert.deepEqual(termin1, termin4);
        assert.deepEqual(termin1, termin5);

        const secret1 = handleCommand('secret');
        const secret2 = handleCommand('easter egg');
        const secret3 = handleCommand('easteregg');
        assert.deepEqual(secret1, secret2);
        assert.deepEqual(secret1, secret3);

        const origin1 = handleCommand('origin');
        const origin2 = handleCommand('story');
        assert.deepEqual(origin1, origin2);
    });
});

test('isSpecialCommand', async (t: any) => {
    await t.test('identifies special commands', () => {
        assert.equal(isSpecialCommand('clear'), true);
        assert.equal(isSpecialCommand('impressum'), true);
        assert.equal(isSpecialCommand('datenschutz'), true);
        assert.equal(isSpecialCommand('dark'), true);
        assert.equal(isSpecialCommand('light'), true);
        assert.equal(isSpecialCommand('auto'), true);
        assert.equal(isSpecialCommand('hack'), true);
        assert.equal(isSpecialCommand('hacking'), true);
    });

    await t.test('handles case-insensitivity and whitespace', () => {
        assert.equal(isSpecialCommand(' CLEAR '), true);
        assert.equal(isSpecialCommand('imPressUm'), true);
    });

    await t.test('returns false for non-special commands', () => {
        assert.equal(isSpecialCommand('hilfe'), false);
        assert.equal(isSpecialCommand('about'), false);
        assert.equal(isSpecialCommand('services'), false);
        assert.equal(isSpecialCommand('contact'), false);
        assert.equal(isSpecialCommand('status'), false);
        assert.equal(isSpecialCommand('ping'), false);
        assert.equal(isSpecialCommand('sudo'), false);
        assert.equal(isSpecialCommand('stats'), false);
        assert.equal(isSpecialCommand('matrix'), false);
        assert.equal(isSpecialCommand('secret'), false);
        assert.equal(isSpecialCommand('help'), false);
        assert.equal(isSpecialCommand('kontakt'), false);
        assert.equal(isSpecialCommand('clear screen'), false);
        assert.equal(isSpecialCommand('dark mode'), false);
        assert.equal(isSpecialCommand('impressum und datenschutz'), false);
        assert.equal(isSpecialCommand('clea'), false);
        assert.equal(isSpecialCommand('impress'), false);
        assert.equal(isSpecialCommand('unknown'), false);
    });

    await t.test('handles empty and whitespace inputs', () => {
        assert.equal(isSpecialCommand(''), false);
        assert.equal(isSpecialCommand('   '), false);
        assert.equal(isSpecialCommand('\t\n'), false);
    });
});
