const fs = require('fs');
let code = fs.readFileSync('server_downloaded.js', 'utf8');

if (!code.includes("require('./routes/public')")) {
    code = code.replace("const adminRoutes = require('./routes/admin');", "const adminRoutes = require('./routes/admin');\nconst publicRoutes = require('./routes/public');");
    code = code.replace("app.use('/api/admin', adminRoutes);", "app.use('/api/admin', adminRoutes);\napp.use('/api/public', publicRoutes);");
    fs.writeFileSync('server_downloaded.js', code, 'utf8');
    console.log("Updated locally.");
}
