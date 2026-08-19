const fs = require('fs');
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

ath = ath.replace(/capture="environment" /g, "");

fs.writeFileSync('crm/src/pages/Athletes.jsx', ath, 'utf8');
