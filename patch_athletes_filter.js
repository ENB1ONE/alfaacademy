const fs = require('fs');

let css = fs.readFileSync('crm/src/index.css', 'utf8');

const responsiveFilter = `
.filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}
`;

if (!css.includes('.filter-grid')) {
    css += responsiveFilter;
    fs.writeFileSync('crm/src/index.css', css, 'utf8');
}

let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
code = code.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: isAdmin \? '1fr 1fr 1fr' : '1fr 1fr', gap: 15 \}\}>/g, '<div className="filter-grid">');
fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Athletes filter grid patched.');
