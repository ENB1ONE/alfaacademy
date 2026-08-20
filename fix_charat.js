const fs = require('fs');

let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// Fix a.nome.charAt(0) which throws if a.nome is an integer
athletes = athletes.replace(
    "(a.nome ? a.nome.charAt(0) : '')",
    "(a.nome ? String(a.nome).charAt(0) : '')"
);

fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');

let staff = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');
staff = staff.replace(
    "(t.nome ? t.nome.charAt(0) : '')",
    "(t.nome ? String(t.nome).charAt(0) : '')"
);
fs.writeFileSync('crm/src/pages/Staff.jsx', staff, 'utf8');
console.log('charAt fixed');
