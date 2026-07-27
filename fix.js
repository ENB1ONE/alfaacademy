const fs = require('fs');
['/opt/alfa-api/routes/admin.js', '/opt/alfa-api/routes/chamada.js'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\uFEFF/g, '');
    fs.writeFileSync(file, content, 'utf8');
});
