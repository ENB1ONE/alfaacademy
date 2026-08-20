const fs = require('fs');
let overview = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

if (!overview.includes('v1.0.3')) {
    overview = overview.replace(
        '<h1 style={{ color: \'var(--ouro)\' }}>Dashboard Executivo</h1>',
        '<h1 style={{ color: \'var(--ouro)\' }}>Dashboard Executivo <span style={{ fontSize: 12, color: \'var(--cinza)\' }}>v1.0.3</span></h1>'
    );
    fs.writeFileSync('crm/src/pages/Overview.jsx', overview, 'utf8');
}
console.log('Version badge added');
