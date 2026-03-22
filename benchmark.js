import { performance } from 'perf_hooks';

class MockElement {
    constructor() {
        this.children = [];
        this.textContent = '';
        this.reflowCount = 0;
    }
    appendChild(child) {
        this.children.push(child);
    }
    get scrollHeight() {
        this.reflowCount++;
        return 100;
    }
    set scrollTop(val) {}
}

const outputOriginal = new MockElement();
const outputOptimized = new MockElement();

function runOriginal() {
    const total = 24;
    const div = new MockElement();
    outputOriginal.appendChild(div);
    const maxFill = total - 1;

    for (let i = 0; i <= maxFill; i++) {
        const filled = '█'.repeat(i);
        const empty = '░'.repeat(total - i);
        const pct = Math.round((i / total) * 100);
        div.textContent = `[${filled}${empty}] ${pct}%`;
        outputOriginal.scrollTop = outputOriginal.scrollHeight;
    }
    return outputOriginal.reflowCount;
}

function runOptimized() {
    const total = 24;
    const div = new MockElement();
    outputOptimized.appendChild(div);
    const maxFill = total - 1;

    outputOptimized.scrollTop = outputOptimized.scrollHeight;
    for (let i = 0; i <= maxFill; i++) {
        const filled = '█'.repeat(i);
        const empty = '░'.repeat(total - i);
        const pct = Math.round((i / total) * 100);
        div.textContent = `[${filled}${empty}] ${pct}%`;
    }
    return outputOptimized.reflowCount;
}

const originalReflows = runOriginal();
const optimizedReflows = runOptimized();

console.log(`Original reflow triggers: ${originalReflows}`);
console.log(`Optimized reflow triggers: ${optimizedReflows}`);
console.log(`Improvement: ${(((originalReflows - optimizedReflows) / originalReflows) * 100).toFixed(1)}% fewer reflows`);
