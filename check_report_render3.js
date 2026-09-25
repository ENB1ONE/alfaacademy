const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let idx = code.indexOf('id="a4-preview"');
if(idx === -1) idx = code.indexOf('id="report-');
if(idx === -1) idx = code.indexOf('exportA4PDF');
console.log(code.substring(idx - 200, idx + 2000));
