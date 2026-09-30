const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Login.jsx', 'utf8');
let idx = code.indexOf('handleSubmit');
console.log(code.substring(idx, idx + 500));
