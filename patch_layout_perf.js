const fs = require('fs');

let layout = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');

if (!layout.includes('/performance')) {
    layout = layout.replace("<Link to=\"/relatorios\" className=\"menu-item\" onClick={() => setOpen(false)}><BarChart2 size={20} /> Relatórios</Link>", "<Link to=\"/relatorios\" className=\"menu-item\" onClick={() => setOpen(false)}><BarChart2 size={20} /> Relatórios</Link>\n        <Link to=\"/performance\" className=\"menu-item\" onClick={() => setOpen(false)}><Activity size={20} /> Central Performance</Link>");
    fs.writeFileSync('crm/src/components/Layout.jsx', layout, 'utf8');
    console.log('Layout.jsx patched.');
}
