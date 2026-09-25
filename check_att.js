const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Attendance.jsx', 'utf8');
let btnIdx = code.indexOf('Salvar');
if (btnIdx !== -1) console.log(code.substring(btnIdx - 400, btnIdx + 400));
