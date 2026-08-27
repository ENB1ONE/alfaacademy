const fs = require('fs');
let code = fs.readFileSync('/opt/alfa-api/routes/admin.js', 'utf8');

const oldLine = "const data_chamada = new Date().toISOString().split('T')[0];";
const newLine = "const data_chamada = req.body.data || new Date().toISOString().split('T')[0];";

code = code.replace(oldLine, newLine);
fs.writeFileSync('/opt/alfa-api/routes/admin.js', code, 'utf8');
console.log('Backend /chamadas endpoint patched.');
