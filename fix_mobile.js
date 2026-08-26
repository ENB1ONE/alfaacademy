const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Fix CSS Grid auto min-width stretching the whole page on mobile
code = code.replace(
    /\{activeTab === 'generator' && \(\s*<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr', gap: 30 \}\}>/,
    `{activeTab === 'generator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 30 }}>`
); // this was already fine

code = code.replace(
    /<div className="card" style=\{\{ padding: 20 \}\}>/g,
    `<div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>`
);

code = code.replace(
    /\{\/\* A4 Preview \*\/\}\s*<div style=\{\{ display: 'flex', flexDirection: 'column', gap: 20 \}\}>/,
    `{/* A4 Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>`
);

// Ensure the #a4-preview itself has minWidth to act like a paper in the horizontal scroll area
code = code.replace(
    /<div id="a4-preview" style=\{\{\s*background: '#ffffff',/g,
    `<div id="a4-preview" style={{
                        minWidth: '800px',
                        background: '#ffffff',`
);

// Also let's fix the button header flex to wrap if needed
code = code.replace(
    /<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' \}\}>/g,
    `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>`
);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Mobile layout grid min-width bug fixed.');
