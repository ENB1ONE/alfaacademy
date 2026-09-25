const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let startIdx = code.indexOf("<div id=\"athlete-dropdown\"");
console.log(code.substring(startIdx, startIdx + 800));
