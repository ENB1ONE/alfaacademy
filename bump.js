const fs = require('fs');
let overview = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

overview = overview.replace(
    "<h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>Dashboard Executivo <span style={{ fontSize: 12, color: 'var(--cinza)' }}>v1.0.4</span></h1>",
    "<h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>Dashboard Executivo <span style={{ fontSize: 12, color: 'var(--cinza)' }}>v1.0.5</span></h1>"
);

fs.writeFileSync('crm/src/pages/Overview.jsx', overview, 'utf8');
