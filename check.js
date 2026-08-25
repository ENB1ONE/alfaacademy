const fs = require('fs');
console.log(fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8').substring(0, 1000));
