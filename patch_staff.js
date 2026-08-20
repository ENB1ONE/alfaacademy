const fs = require('fs');

let staffFile = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

// Fix handleEditar to include foto
staffFile = staffFile.replace(
    "id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil,",
    "id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil, foto: t.foto || '',"
);

fs.writeFileSync('crm/src/pages/Staff.jsx', staffFile, 'utf8');
console.log('Staff.jsx patched');
