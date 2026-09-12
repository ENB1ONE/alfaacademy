const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

code = code.replace('<option value="elenco">Elenco Completo</option>', '<option value="elenco">Elenco Completo (Ativos)</option>\n                                    <option value="elenco_inativos">Atletas Excluídos / Inativos</option>');

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Added inativos to CentralRelatorios');
