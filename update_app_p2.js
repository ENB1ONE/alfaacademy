const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');

if (!code.includes('PublicPortal')) {
    code = code.replace("import Login from './pages/Login';", "import Login from './pages/Login';\nimport PublicPortal from './pages/PublicPortal';");

    // Change <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}> to /app
    code = code.replace('<Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>', '<Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>');
    
    // Add <Route path="/" element={<PublicPortal />} /> just before <Route path="/app"
    code = code.replace('<Route path="/app"', '<Route path="/" element={<PublicPortal />} />\n          <Route path="/app"');

    fs.writeFileSync('crm/src/App.jsx', code, 'utf8');
    console.log("App.jsx updated.");
} else {
    console.log("App.jsx already updated.");
}
