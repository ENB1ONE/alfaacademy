const fs = require('fs');
let code = fs.readFileSync('server_downloaded.js', 'utf8');

code = code.replace("const publicRoutes = require('./routes/public');\n", "");
code = code.replace("app.use('/api/public', publicRoutes);\n", "");

fs.writeFileSync('server_downloaded.js', code, 'utf8');
console.log("Server reverted locally.");
