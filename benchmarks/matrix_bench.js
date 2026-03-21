
const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789';

function original() {
    const matrixLines = [{ text: '', cls: '' }];
    for (let i = 0; i < 8; i++) {
        let line = '';
        for (let j = 0; j < 40; j++) {
            line += chars[Math.floor(Math.random() * chars.length)];
        }
        matrixLines.push({ text: line, cls: 'line-success' });
    }
    return matrixLines;
}

function optimizedArrayFrom() {
    const matrixLines = [{ text: '', cls: '' }];
    for (let i = 0; i < 8; i++) {
        const line = Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        matrixLines.push({ text: line, cls: 'line-success' });
    }
    return matrixLines;
}

function optimizedArrayJoin() {
    const matrixLines = [{ text: '', cls: '' }];
    for (let i = 0; i < 8; i++) {
        const arr = new Array(40);
        for (let j = 0; j < 40; j++) {
            arr[j] = chars[Math.floor(Math.random() * chars.length)];
        }
        const line = arr.join('');
        matrixLines.push({ text: line, cls: 'line-success' });
    }
    return matrixLines;
}

const ITERATIONS = 100000;

console.log(`Running ${ITERATIONS} iterations...`);

console.time('Original');
for (let i = 0; i < ITERATIONS; i++) {
    original();
}
console.timeEnd('Original');

console.time('Optimized (Array.from)');
for (let i = 0; i < ITERATIONS; i++) {
    optimizedArrayFrom();
}
console.timeEnd('Optimized (Array.from)');

console.time('Optimized (Array Join)');
for (let i = 0; i < ITERATIONS; i++) {
    optimizedArrayJoin();
}
console.timeEnd('Optimized (Array Join)');
