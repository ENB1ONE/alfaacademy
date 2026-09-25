const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(60, 70).join('\n'));
