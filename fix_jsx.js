const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Fix the syntax error: <th className="" style={{ textAlign: "center",  style={{ width: '15%' }}>
// We need to merge them into a single style object.
code = code.replace(/<th className="" style=\{\{ textAlign: "center",  style=\{\{ (.*?) \}\}>/g, '<th style={{ textAlign: "center", $1 }}>');
// Also remove className="" to keep it clean
code = code.replace(/<th className="" /g, '<th ');

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('JSX syntax fixed.');
