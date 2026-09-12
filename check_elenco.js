const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');
console.log(code.substring(code.indexOf("if (modulo === 'elenco')"), code.indexOf("if (modulo === 'elenco'") + 600));
