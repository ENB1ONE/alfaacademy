const fs = require('fs');
code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('<table className="a4-table"');
console.log(code.substring(idx + 1300, idx + 1800));
