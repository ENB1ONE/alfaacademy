const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');
let idx = code.indexOf('searchTerm');
console.log(code.substring(idx + 400, idx + 1200));
