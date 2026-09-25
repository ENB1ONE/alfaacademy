const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('<ClipboardCheck size={16} />');
console.log(code.substring(idx - 400, idx + 100));
