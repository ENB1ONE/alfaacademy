const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('borderBottom: \'1px solid rgba(255,255,255,0.05)\'');
console.log(code.substring(idx - 600, idx + 1000));
