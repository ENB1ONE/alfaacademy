const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let emptyIdx = code.indexOf('FileText size={48}');
console.log("Empty replaced:", emptyIdx !== -1);
if (emptyIdx !== -1) console.log(code.substring(emptyIdx - 200, emptyIdx + 400));
