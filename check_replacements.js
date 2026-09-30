const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
console.log("Novo Atleta replaced:", code.includes('{isAdmin && (\n        <button onClick={() => { setEditMode(false)'));
console.log("Card btns replaced:", code.includes('{isAdmin && (\n                    <div style={{ display: \'flex\', gap: \'8px\' }}>'));
