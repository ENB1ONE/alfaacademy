const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');
console.log(code.substring(code.indexOf("else if (modulo === 'presencas')"), code.indexOf("else if (modulo === 'presencas'") + 500));
