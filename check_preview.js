const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('<div id="history-a4-preview"');
console.log(code.substring(idx, idx + 1000));
