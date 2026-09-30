const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');

code = code.replace('<Route path="atletas" element={<PrivateRoute allowedRoles={[\'Administrador\', \'admin\', \'Admin\']}><Athletes /></PrivateRoute>} />', '<Route path="atletas" element={<PrivateRoute><Athletes /></PrivateRoute>} />');

fs.writeFileSync('crm/src/App.jsx', code, 'utf8');
console.log("App.jsx updated.");
