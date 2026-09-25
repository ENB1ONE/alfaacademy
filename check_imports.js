const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(0, 15).join('\n'));
