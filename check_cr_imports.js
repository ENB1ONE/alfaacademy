const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// I want to see the imports and state declarations to know what variables I have to work with.
let idx = code.indexOf('export default function CentralRelatorios()');
console.log(code.substring(0, idx + 500));
