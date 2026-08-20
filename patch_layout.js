const fs = require('fs');
let layout = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');

if (!layout.includes('to="/performance"')) {
    layout = layout.replace(
        '<NavLink to="/atletas" icon={Users}>Atletas</NavLink>',
        '<NavLink to="/performance" icon={Activity}>Central Performance</NavLink>\n              <NavLink to="/atletas" icon={Users}>Atletas</NavLink>'
    );
    fs.writeFileSync('crm/src/components/Layout.jsx', layout, 'utf8');
    console.log('Layout patched successfully.');
} else {
    console.log('Performance already in Layout.');
}
