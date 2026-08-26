const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

// Let's run a syntax check using Node.js's syntax checker (or just print the file and look for obvious runtime errors)
console.log(code.substring(code.indexOf('const [proximosJogos'), code.indexOf('const [proximosJogos') + 2000));
