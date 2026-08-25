const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
const match = code.match(/<div className="card">[\s\S]*?Próximos Jogos[\s\S]*?<\/div>/i);
if (match) {
  console.log(match[0].substring(0, 800));
} else {
  const match2 = code.match(/Próximos Jogos[\s\S]{0,1000}/i);
  console.log(match2 ? match2[0] : 'Not found');
}
