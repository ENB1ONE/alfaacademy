const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
code = code.replace(
  /<NavLink to="\/performance" icon=\{Activity\}>Central de Performance<\/NavLink>/,
  `<NavLink to="/performance" icon={Activity}>Central de Performance</NavLink>\n            <NavLink to="/relatorios" icon={Activity}>Central de Relatórios</NavLink>`
);
fs.writeFileSync('crm/src/components/Layout.jsx', code, 'utf8');
console.log('Layout updated');
