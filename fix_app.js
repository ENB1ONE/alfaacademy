const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');
code = code.replace(/import PublicPortal from '\.\/pages\/PublicPortal';[\r\n]*/g, '');
fs.writeFileSync('crm/src/App.jsx', code, 'utf8');
