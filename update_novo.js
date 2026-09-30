const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

code = code.replace(/<button onClick=\{\(\) => \{ setShowForm\(!showForm\);.*?Novo Atleta\s*<\/button>/s, '{isAdmin && ($&)}');

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log("Novo Atleta replaced via regex.");
