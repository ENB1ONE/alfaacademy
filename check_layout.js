const fs = require('fs');
console.log(fs.readFileSync('crm/src/components/Layout.jsx', 'utf8').substring(0, 1000));
