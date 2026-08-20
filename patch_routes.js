const fs = require('fs');

let app = fs.readFileSync('crm/src/App.jsx', 'utf8');

if (!app.includes('CentralPerformance')) {
    app = app.replace("import Staff from './pages/Staff';", "import Staff from './pages/Staff';\nimport CentralPerformance from './pages/CentralPerformance';");
    app = app.replace("<Route path=\"/staff\" element={<Staff />} />", "<Route path=\"/staff\" element={<Staff />} />\n            <Route path=\"/performance\" element={<CentralPerformance />} />");
    fs.writeFileSync('crm/src/App.jsx', app, 'utf8');
    console.log('App.jsx patched.');
}

let sidebar = fs.readFileSync('crm/src/components/Sidebar.jsx', 'utf8');
if (!sidebar.includes('/performance')) {
    // We insert it after Relatórios
    sidebar = sidebar.replace("to=\"/relatorios\"", "to=\"/relatorios\""); // just to find the place
    sidebar = sidebar.replace("<Link to=\"/relatorios\" className=\"menu-item\" onClick={() => setOpen(false)}><BarChart2 size={20} /> Relatórios</Link>", "<Link to=\"/relatorios\" className=\"menu-item\" onClick={() => setOpen(false)}><BarChart2 size={20} /> Relatórios</Link>\n        <Link to=\"/performance\" className=\"menu-item\" onClick={() => setOpen(false)}><Activity size={20} /> Central Performance</Link>");
    fs.writeFileSync('crm/src/components/Sidebar.jsx', sidebar, 'utf8');
    console.log('Sidebar.jsx patched.');
}
