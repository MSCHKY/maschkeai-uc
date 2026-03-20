// Contact form state machine tests
// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';
import {
    isContactFormActive,
    startContactForm,
    handleContactInput,
    validateName,
    validateEmail,
    validateMessage,
    _resetContactFormForTesting,
} from './contact-form.ts';

test('Contact Form — Validation', async (t) => {
    await t.test('validateName rejects too short', () => {
        assert.ok(validateName('') !== null);
        assert.ok(validateName('A') !== null);
    });

    await t.test('validateName accepts valid names', () => {
        assert.equal(validateName('Jo'), null);
        assert.equal(validateName('Robert Maschke'), null);
    });

    await t.test('validateName rejects too long', () => {
        assert.ok(validateName('A'.repeat(101)) !== null);
    });

    await t.test('validateEmail rejects invalid formats', () => {
        assert.ok(validateEmail('') !== null);
        assert.ok(validateEmail('notanemail') !== null);
        assert.ok(validateEmail('@missing.com') !== null);
        assert.ok(validateEmail('missing@') !== null);
    });

    await t.test('validateEmail accepts valid formats', () => {
        assert.equal(validateEmail('test@example.com'), null);
        assert.equal(validateEmail('user@sub.domain.de'), null);
    });

    await t.test('validateMessage rejects too short', () => {
        assert.ok(validateMessage('') !== null);
        assert.ok(validateMessage('Kurz') !== null);
        assert.ok(validateMessage('123456789') !== null); // 9 chars
    });

    await t.test('validateMessage accepts valid messages', () => {
        assert.equal(validateMessage('Das ist eine Nachricht.'), null);
    });

    await t.test('validateMessage rejects too long', () => {
        assert.ok(validateMessage('X'.repeat(2001)) !== null);
    });
});

test('Contact Form — State Machine', async (t) => {
    t.beforeEach(() => {
        _resetContactFormForTesting();
    });

    await t.test('starts inactive', () => {
        assert.equal(isContactFormActive(), false);
    });

    await t.test('startContactForm activates the form', () => {
        const result = startContactForm();
        assert.equal(isContactFormActive(), true);
        assert.ok(result.lines !== undefined);
        assert.ok(result.lines.some(l => l.text.includes('KONTAKTFORMULAR')));
    });

    await t.test('full flow: NAME → EMAIL → MESSAGE → CONFIRM', () => {
        startContactForm();

        // Step 1: Name
        const nameResult = handleContactInput('Robert');
        assert.ok(nameResult.lines !== undefined);
        assert.ok(nameResult.lines.some(l => l.text.includes('Robert')));
        assert.equal(isContactFormActive(), true);

        // Step 2: Email
        const emailResult = handleContactInput('test@example.com');
        assert.ok(emailResult.lines !== undefined);
        assert.equal(isContactFormActive(), true);

        // Step 3: Message
        const msgResult = handleContactInput('Ich brauche KI-Beratung für mein Unternehmen');
        assert.ok(msgResult.html !== undefined);
        assert.ok(msgResult.html.includes('test@example.com'));
        assert.ok(msgResult.html.includes('Robert'));
        assert.equal(isContactFormActive(), true); // CONFIRM state

        // Step 4: Confirm via text
        const confirmResult = handleContactInput('senden');
        assert.ok(confirmResult.submitData !== undefined);
        assert.equal(confirmResult.submitData.name, 'Robert');
        assert.equal(confirmResult.submitData.email, 'test@example.com');
        assert.equal(confirmResult.done, true);
        assert.equal(isContactFormActive(), false);
    });

    await t.test('cancel aborts at any step', () => {
        startContactForm();
        const result = handleContactInput('abbrechen');
        assert.equal(result.done, true);
        assert.equal(isContactFormActive(), false);
    });

    await t.test('cancel works in EMAIL step', () => {
        startContactForm();
        handleContactInput('Robert');
        const result = handleContactInput('exit');
        assert.equal(result.done, true);
        assert.equal(isContactFormActive(), false);
    });

    await t.test('cancel works in MESSAGE step', () => {
        startContactForm();
        handleContactInput('Robert');
        handleContactInput('test@example.com');
        const result = handleContactInput('quit');
        assert.equal(result.done, true);
        assert.equal(isContactFormActive(), false);
    });

    await t.test('invalid input shows error and stays in state', () => {
        startContactForm();

        // Invalid name (too short)
        const nameErr = handleContactInput('A');
        assert.ok(nameErr.lines !== undefined);
        assert.ok(nameErr.lines.some(l => l.text.includes('[!]')));
        assert.equal(isContactFormActive(), true);
    });

    await t.test('invalid email shows error and stays in state', () => {
        startContactForm();
        handleContactInput('Robert');

        const emailErr = handleContactInput('not-an-email');
        assert.ok(emailErr.lines !== undefined);
        assert.ok(emailErr.lines.some(l => l.text.includes('[!]')));
        assert.equal(isContactFormActive(), true);
    });

    await t.test('CONFIRM state rejects random input', () => {
        startContactForm();
        handleContactInput('Robert');
        handleContactInput('test@example.com');
        handleContactInput('Eine ausführliche Nachricht für das Testen.');

        const randomResult = handleContactInput('blablabla');
        assert.ok(randomResult.lines !== undefined);
        assert.ok(randomResult.lines.some(l => l.text.includes('SENDEN oder ABBRECHEN')));
        assert.equal(isContactFormActive(), true);
    });

    await t.test('CONFIRM accepts "ja" and "ok"', () => {
        startContactForm();
        handleContactInput('Robert');
        handleContactInput('test@example.com');
        handleContactInput('Eine ausführliche Nachricht für das Testen.');

        const result = handleContactInput('ja');
        assert.ok(result.submitData !== undefined);
        assert.equal(result.done, true);
    });
});
