const fs = require('fs');

let adminFile = fs.readFileSync('/opt/alfa-api/routes/admin.js', 'utf8');

// Find the line for PUT /treinadores/:id
// const { nome, usuario_lc, senha, perfil, categorias } = req.body;
adminFile = adminFile.replace(
    "const { nome, usuario_lc, senha, perfil, categorias } = req.body;",
    "const { nome, usuario_lc, senha, perfil, categorias, foto } = req.body;"
);

fs.writeFileSync('/opt/alfa-api/routes/admin.js', adminFile, 'utf8');
console.log('admin.js patched');
