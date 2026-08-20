const fs = require('fs');
let app = fs.readFileSync('crm/src/App.jsx', 'utf8');

// I'll just regex replace the athletes route to append the missing routes
if (!app.includes('/perfil/:id')) {
    app = app.replace(
        `<Route path="atletas" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Athletes /></PrivateRoute>} />`,
        `<Route path="atletas" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><Athletes /></PrivateRoute>} />
            <Route path="perfil/:id" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><PerfilAtleta /></PrivateRoute>} />
            <Route path="relatorios" element={<PrivateRoute allowedRoles={['Administrador', 'admin', 'Admin']}><GeradorRelatorios /></PrivateRoute>} />`
    );
    
    // Add imports if missing
    if (!app.includes('PerfilAtleta')) {
        app = app.replace(
            "import Athletes from './pages/Athletes';",
            "import Athletes from './pages/Athletes';\nimport PerfilAtleta from './pages/PerfilAtleta';\nimport GeradorRelatorios from './pages/GeradorRelatorios';"
        );
    }
    
    fs.writeFileSync('crm/src/App.jsx', app, 'utf8');
}
console.log('App.jsx fixed');
