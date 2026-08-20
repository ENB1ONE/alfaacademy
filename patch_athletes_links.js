const fs = require('fs');
let content = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// I need to add a click handler on the avatar or name to go to the profile.
// Actually, let's wrap the avatar and name in a Link, but we already have useLocation so we can just use navigate.
if (!content.includes('const navigate = useNavigate();')) {
    content = content.replace(
        "const location = useLocation();",
        "const location = useLocation();\n  const navigate = useNavigate();"
    );
    // make sure useNavigate is imported
    if (!content.includes('useNavigate')) {
        content = content.replace(
            "import { useLocation } from 'react-router-dom';",
            "import { useLocation, useNavigate } from 'react-router-dom';"
        );
    }
}

// In the render: <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{a.nome}</h3>
content = content.replace(
    `<h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{a.nome}</h3>`,
    `<h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => navigate(\`/perfil/\${a.id}\`)}>{a.nome}</h3>`
);

content = content.replace(
    `<div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>`,
    `<div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(\`/perfil/\${a.id}\`)}>`
);

fs.writeFileSync('crm/src/pages/Athletes.jsx', content, 'utf8');
console.log('Athletes linked to profile');
