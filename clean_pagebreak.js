const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const badPageBreak = /pagebreak:\s*\{\s*mode:\s*\['css',\s*'legacy'\],\s*avoid:\s*\['tr',\s*'\.bloco-jogo'\]\s*\}/g;
const goodPageBreak = "pagebreak: { mode: ['css', 'legacy'], avoid: ['tr'] }";
code = code.replace(badPageBreak, goodPageBreak);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Cleaned pagebreak options.');
