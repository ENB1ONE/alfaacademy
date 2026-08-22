const fs = require('fs');
let code = fs.readFileSync('clean_admin.js', 'utf8');
const fixedCode = code.replace(/^[\s\S]*?(const express =)/, '$1');
fs.writeFileSync('clean_admin_fixed.js', fixedCode, 'utf8');
console.log('Fixed');
