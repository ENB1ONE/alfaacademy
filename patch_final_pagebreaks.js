const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Inject the explicit 'nova-pagina' class for html2pdf to detect easily
const oldDiv = `<div className="bloco-partida" key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`;
const newDiv = `<div className={\`bloco-partida \${idx > 0 ? 'nova-pagina' : ''}\`} key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`;
if(code.includes(oldDiv)) {
    code = code.replace(oldDiv, newDiv);
} else {
    console.log("Could not find bloco-partida div");
}

// 2. Update html2pdf options to explicitly break before .nova-pagina
const oldPageBreak = /pagebreak:\s*\{\s*mode:\s*\['css',\s*'legacy'\],\s*avoid:\s*\['tr',\s*'h3'\]\s*\}/g;
const newPageBreak = "pagebreak: { mode: ['css', 'legacy'], before: '.nova-pagina', avoid: ['tr'] }";
code = code.replace(oldPageBreak, newPageBreak);

// 3. Fix the CSS block to remove the impossible page-break-inside: avoid from bloco-partida
const styleBlockRegex = /<style>[\s\S]*?<\/style>/;
let styles = code.match(styleBlockRegex)[0];

const oldBlocoCSS = `.bloco-partida {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-top: 20px !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
    display: block !important;
}

/* Força uma nova página antes de cada jogo, exceto o primeiro */
.bloco-partida:not(:first-of-type) {
    page-break-before: always !important;
    break-before: page !important;
}`;

const newBlocoCSS = `.bloco-partida {
    /* REMOVIDO page-break-inside: avoid para permitir que jogos muito longos quebrem naturalmente nas trs */
    margin-top: 20px !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
    display: block !important;
}

.nova-pagina {
    page-break-before: always !important;
    break-before: page !important;
}`;

if(styles.includes('page-break-inside: avoid !important;\n    break-inside: avoid !important;\n    margin-top: 20px !important;')) {
    styles = styles.replace(oldBlocoCSS, newBlocoCSS);
    code = code.replace(styleBlockRegex, styles);
} else {
    console.log("Could not find CSS to replace");
}

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Successfully patched page-break logic.');
