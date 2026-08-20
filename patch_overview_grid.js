const fs = require('fs');

let css = fs.readFileSync('crm/src/index.css', 'utf8');

const responsiveGrid2 = `
.responsive-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
@media (max-width: 820px) {
    .responsive-grid-2 {
        grid-template-columns: 1fr;
    }
}
`;

if (!css.includes('.responsive-grid-2')) {
    css += responsiveGrid2;
    fs.writeFileSync('crm/src/index.css', css, 'utf8');
}

let code = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
code = code.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 \}\}>/g, '<div className="responsive-grid-2">');
fs.writeFileSync('crm/src/pages/Overview.jsx', code, 'utf8');
console.log('Overview patched.');
