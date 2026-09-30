const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');

// Move Atletas out of isAdmin block
code = code.replace('<NavLink to="/app/jogos" icon={Trophy}>Jogos / Convocações</NavLink>', '<NavLink to="/app/jogos" icon={Trophy}>Jogos / Convocações</NavLink>\n          <NavLink to="/app/atletas" icon={Users}>Atletas</NavLink>');
code = code.replace('<NavLink to="/app/atletas" icon={Users}>Atletas</NavLink>\n              \n          {isAdmin && (', '{isAdmin && (');

fs.writeFileSync('crm/src/components/Layout.jsx', code, 'utf8');
console.log("Layout.jsx updated.");
