const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf("<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>");
console.log(code.substring(idx + 9400, idx + 9800));
