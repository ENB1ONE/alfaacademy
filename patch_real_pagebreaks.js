const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Inject the explicit 'nova-pagina' class for html2pdf to detect easily
const oldDiv = `<div className="bloco-partida" key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`;
const newDiv = `<div className={\`bloco-partida \${idx > 0 ? 'nova-pagina' : ''}\`} key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`;
code = code.replace(oldDiv, newDiv);

// Fix both pagebreak configurations
const badPageBreak = /pagebreak:\s*\{\s*mode:\s*\['css',\s*'legacy'\],\s*before:\s*\['\.bloco-partida'\],\s*avoid:\s*\['tr',\s*'h3',\s*'table',\s*'thead',\s*'tbody'\]\s*\}/g;
const goodPageBreak = "pagebreak: { mode: ['css', 'legacy'], before: ['.nova-pagina'], avoid: ['tr'] }";
code = code.replace(badPageBreak, goodPageBreak);

// Also remove page-break-inside: avoid from bloco-partida in the CSS block if it exists
const styleBlockRegex = /<style>[\s\S]*?<\/style>/;
let styles = code.match(styleBlockRegex)[0];

const oldCss = `page-break-inside: avoid !important;\n    break-inside: avoid !important;\n    page-break-before: auto !important;\n    background: #ffffff !important;\n    display: block !important;\n}`;
const newCss = `page-break-before: auto !important;\n    background: #ffffff !important;\n    display: block !important;\n}`;
styles = styles.replace(oldCss, newCss);

// And inject the nova-pagina CSS
if (!styles.includes('.nova-pagina')) {
    styles = styles.replace('</style>', `.nova-pagina {\n    page-break-before: always !important;\n    break-before: page !important;\n}\n</style>`);
}

code = code.replace(styleBlockRegex, styles);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Fixed page breaks.');
