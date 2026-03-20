// Jules PR #7 — ASCII Logo unit tests
// @ts-nocheck
import test, { after } from 'node:test';
import assert from 'node:assert';
import { renderNexusLogo } from './ascii-logo.ts';

const originalDocument = globalThis.document;

after(() => {
    globalThis.document = originalDocument;
});

class MockHTMLElement {
    tagName: string;
    className: string = '';
    textContent: string = '';
    attributes: Record<string, string> = {};
    children: MockHTMLElement[] = [];

    constructor(tagName: string) {
        this.tagName = tagName;
    }

    setAttribute(name: string, value: string) {
        this.attributes[name] = value;
    }

    getAttribute(name: string) {
        return this.attributes[name];
    }

    appendChild(child: MockHTMLElement) {
        this.children.push(child);
    }
}

// @ts-ignore
globalThis.document = {
    createElement(tagName: string) {
        return new MockHTMLElement(tagName);
    }
};

test('renderNexusLogo creates correct DOM structure', () => {
    const el = renderNexusLogo() as any;
    assert.strictEqual(el.tagName, 'div');
    assert.strictEqual(el.className, 'terminal-nexus-stack');
    assert.strictEqual(el.children.length, 4);

    const [solid, dither, glitch1, glitch2] = el.children;

    assert.strictEqual(solid.tagName, 'pre');
    assert.strictEqual(solid.className, 'terminal-nexus terminal-nexus--solid terminal-grad-text');
    assert.strictEqual(solid.getAttribute('aria-label'), 'NEXUS');
    assert.strictEqual(solid.getAttribute('role'), 'img');
    assert.ok(solid.textContent.length > 0);

    assert.strictEqual(dither.tagName, 'pre');
    assert.strictEqual(dither.className, 'terminal-nexus terminal-nexus--dither terminal-grad-text');
    assert.strictEqual(dither.getAttribute('aria-hidden'), 'true');

    assert.strictEqual(glitch1.tagName, 'pre');
    assert.strictEqual(glitch1.className, 'terminal-nexus terminal-nexus--glitch terminal-nexus--glitch-1');
    assert.strictEqual(glitch1.getAttribute('aria-hidden'), 'true');
    assert.strictEqual(glitch1.textContent, solid.textContent);

    assert.strictEqual(glitch2.tagName, 'pre');
    assert.strictEqual(glitch2.className, 'terminal-nexus terminal-nexus--glitch terminal-nexus--glitch-2');
    assert.strictEqual(glitch2.getAttribute('aria-hidden'), 'true');
    assert.strictEqual(glitch2.textContent, solid.textContent);
});

test('renderNexusLogo correctly processes NEXUS_RAW characters', () => {
    const el = renderNexusLogo() as any;
    const [solid, dither] = el.children;

    assert.ok(!solid.textContent.includes('░'));

    assert.ok(!dither.textContent.includes('█'));
    assert.ok(!dither.textContent.includes(' '));
    assert.ok(dither.textContent.includes('\u00A0'));
});
