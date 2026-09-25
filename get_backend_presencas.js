const fs = require('fs');
let code = fs.readFileSync('admin.js', 'utf8');
const presencas = code.substring(code.indexOf("else if (modulo === 'presencas')"), code.indexOf("else if (modulo === 'presencas'") + 500);
console.log(presencas);
