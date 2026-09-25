const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let start = code.indexOf('<div id="history-a4-preview"');
console.log(code.substring(start + 9300, start + 9800));
