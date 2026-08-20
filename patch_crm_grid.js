const fs = require('fs');

let css = fs.readFileSync('crm/src/index.css', 'utf8');

const responsiveGrid = `
.responsive-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
@media (max-width: 600px) {
    .responsive-grid {
        grid-template-columns: 1fr;
    }
}
`;

if (!css.includes('.responsive-grid')) {
    css += responsiveGrid;
    fs.writeFileSync('crm/src/index.css', css, 'utf8');
    console.log('Added .responsive-grid to index.css');
}

// Now patch JSX files to remove inline grid and use the class
const filesToPatch = [
    'crm/src/pages/Athletes.jsx',
    'crm/src/pages/Staff.jsx',
    'crm/src/pages/Categories.jsx'
];

filesToPatch.forEach(file => {
    if (fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        code = code.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15.*?\}\}/g, 'className="responsive-grid"');
        code = code.replace(/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15\}\}/g, 'className="responsive-grid"');
        fs.writeFileSync(file, code, 'utf8');
        console.log(`Patched ${file}`);
    }
});
