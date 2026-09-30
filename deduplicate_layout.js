const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');

code = code.replace('<NavLink to="/app/relatorios" icon={Activity}>Central de Relatórios</NavLink>\n              <NavLink to="/app/atletas" icon={Users}>Atletas</NavLink>', '<NavLink to="/app/relatorios" icon={Activity}>Central de Relatórios</NavLink>');

fs.writeFileSync('crm/src/components/Layout.jsx', code, 'utf8');
console.log("Layout.jsx deduplicated.");
