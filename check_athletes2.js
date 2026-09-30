const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('<div className="skeleton"');
console.log(code.substring(idx + 100, idx + 2000));
