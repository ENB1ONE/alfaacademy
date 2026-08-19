const fs = require('fs');
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
const targetStr = "<div>\n                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{a.nome}</h3>";
console.log("Index: " + ath.indexOf(targetStr));
