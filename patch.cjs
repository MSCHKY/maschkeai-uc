const fs = require('fs');
const file = 'src/main.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}`;

const replacement = `function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched successfully");
} else {
    console.log("Target not found");
}
