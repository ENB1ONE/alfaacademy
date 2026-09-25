const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Login.jsx', 'utf8');

code = code.replace("navigate('/');", "navigate('/app');");

fs.writeFileSync('crm/src/pages/Login.jsx', code, 'utf8');
console.log("Login updated.");
