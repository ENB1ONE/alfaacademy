const fs = require('fs');

let content = fs.readFileSync('crm/src/pages/PerfilAtleta.jsx', 'utf8');
content = content.replace(
    /background: 'transparent', border: '1px solid var\(--ouro\)' \}\}>/,
    "background: 'transparent', border: '1px solid var(--ouro)', color: 'var(--ouro)' }}>"
);

fs.writeFileSync('crm/src/pages/PerfilAtleta.jsx', content, 'utf8');
