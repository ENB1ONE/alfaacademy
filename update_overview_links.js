const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

code = code.replace(/link="\/atletas"/g, 'link="/app/atletas"');
code = code.replace(/link="\/equipe"/g, 'link="/app/equipe"');

fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log("Overview links updated.");
