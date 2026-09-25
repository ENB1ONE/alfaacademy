const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\eabc\\.gemini\\antigravity\\brain\\5977ef02-345f-4c01-b7c5-2141944ac4f8\\ux-implementation-tracker.md', 'utf8');

code = code.replace(/- \[ \] \*\*A/g, '- [x] **A');
code = code.replace(/- \[ \] \*\*B/g, '- [x] **B');
code = code.replace(/- \[ \] \*\*C/g, '- [x] **C');
code = code.replace(/- \[ \] \*\*D/g, '- [x] **D');

fs.writeFileSync('C:\\Users\\eabc\\.gemini\\antigravity\\brain\\5977ef02-345f-4c01-b7c5-2141944ac4f8\\ux-implementation-tracker.md', code, 'utf8');
console.log("Tracker updated.");
