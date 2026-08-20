const fs = require('fs');
let app = fs.readFileSync('crm/src/App.jsx', 'utf8');

if (!app.includes('<Route path="performance"')) {
    const target = `<Route path="equipe" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Staff /></PrivateRoute>} />`;
    const replaceWith = target + `\n            <Route path="performance" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><CentralPerformance /></PrivateRoute>} />`;
    
    app = app.replace(target, replaceWith);
    fs.writeFileSync('crm/src/App.jsx', app, 'utf8');
    console.log('App.jsx patched with performance route.');
}
