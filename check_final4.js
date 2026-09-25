const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let idx = code.indexOf('<div className="card" key={a.id}');
console.log(code.substring(idx + 4700, idx + 5200));
