const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
let lastIdx = code.lastIndexOf('handleEdit');
console.log(code.substring(lastIdx - 800, lastIdx));
