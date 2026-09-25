const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/PublicPortal.jsx', 'utf8');
code = code.replace("api.get('/api/admin/jogos')", "api.get('/api/public/jogos')");
fs.writeFileSync('crm/src/pages/PublicPortal.jsx', code, 'utf8');
console.log("PublicPortal updated.");
