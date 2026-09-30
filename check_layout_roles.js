const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
let idx = code.indexOf('const isAdmin');
console.log(code.substring(idx, idx + 100));

let atletasIdx = code.indexOf('to="/app/atletas"');
if (atletasIdx !== -1) console.log(code.substring(atletasIdx - 200, atletasIdx + 200));
