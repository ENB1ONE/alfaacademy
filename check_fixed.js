const fs = require('fs');
let code = fs.readFileSync('clean_admin_fixed.js', 'utf8');
console.log(code.substring(0, 100));
