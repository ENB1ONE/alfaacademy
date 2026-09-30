const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const oldCall = `const res = await api.post('/api/admin/relatorios/gerador', {
              modulo: 'presencas',
              filtros: { atleta_id: atleta.id }
          });`;
const newCall = `const res = await api.get('/api/admin/atletas/' + atleta.id + '/historico');`;

code = code.replace(oldCall, newCall);
fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log("Athletes.jsx history endpoint updated:", code.includes(newCall));
