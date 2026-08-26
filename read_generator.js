const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const lines = code.split('\n');
const generatorIndex = lines.findIndex(l => l.includes('activeTab === \'generator\''));
console.log(lines.slice(generatorIndex, generatorIndex + 50).join('\n'));
