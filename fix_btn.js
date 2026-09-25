const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
code = code.replace(/onClick=\{\(\) => navigate\('\/relatorios',\s*\{\s*state:\s*\{\s*triggerPresencasId:\s*a\.id,\s*triggerPresencasNome:\s*a\.nome\s*\}\s*\}\)\}/g, "onClick={() => openHistoryModal(a)}");
fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Fixed button onClick!');
