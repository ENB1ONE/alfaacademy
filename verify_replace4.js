const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
console.log("btnWrapNew found:", code.includes('justifyContent: \'flex-end\', marginTop: 10'));
console.log("formMidNew found:", code.includes('gridTemplateColumns'));
console.log("emptyNew found:", code.includes('<FileText size={48}'));
