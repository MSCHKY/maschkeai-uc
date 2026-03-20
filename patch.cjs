const fs = require('fs');

let content = fs.readFileSync('src/ascii-logo.test.ts', 'utf8');

// remove NEXUS_RAW import
content = content.replace(/import \{ renderNexusLogo, NEXUS_RAW \} from '\.\/ascii-logo\.ts';/, "import { renderNexusLogo } from './ascii-logo.ts';");

// add after hook
const hookStr = `
import { after } from 'node:test';

const originalDocument = globalThis.document;

after(() => {
    globalThis.document = originalDocument;
});
`;

content = content.replace("import assert from 'node:assert';", "import assert from 'node:assert';" + hookStr);

fs.writeFileSync('src/ascii-logo.test.ts', content);
