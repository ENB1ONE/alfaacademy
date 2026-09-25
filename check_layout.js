const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
console.log(code.substring(0, 1000));
console.log("...");
console.log(code.substring(code.length - 1000));
