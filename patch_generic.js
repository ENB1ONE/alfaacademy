const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Dictionary of double-encoded characters I see on the screen
const replacements = {
    'RelatÃ³rio': 'Relatório',
    'RelatÃ³rios': 'Relatórios',
    'MÃ³dulo': 'Módulo',
    'VisualizaÃ§Ã£o': 'Visualização',
    'PerÃodo': 'Período',
    'AdversÃ¡rio': 'Adversário',
    'FrequÃªncia': 'Frequência',
    'PresenÃ§as': 'Presenças',
    'NÃ£o': 'Não',
    'analÃtica': 'analítica',
    'exportaÃ§Ã£o': 'exportação',
    'GestÃ£o': 'Gestão',
    'Mapeamento TÃ¡tico': 'Mapeamento Tático',
    'Ã\x8Dndice de AusÃªncias': 'Índice de Ausências', // wait, let's just do a generic sweep of common chars
    'Ã³': 'ó',
    'Ã£': 'ã',
    'Ã§': 'ç',
    'Ã¡': 'á',
    'Ãª': 'ê',
    'Ã\x8D': 'Í', // Í
    'Ã-': 'Í' 
};

// Instead of replacing manually, there's a better way:
let tempCode = code;
for (const [bad, good] of Object.entries(replacements)) {
    tempCode = tempCode.split(bad).join(good);
}

// But actually, I'll just apply the page break fixes FIRST
const oldDiv = `<div className="bloco-partida" key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`;
const newDiv = `<div className={\`bloco-partida \${idx > 0 ? 'nova-pagina' : ''}\`} key={\`det-\${idx}\`} style={{ marginTop: '25px' }}>`;
tempCode = tempCode.replace(oldDiv, newDiv);

const badPageBreak = /pagebreak:\s*\{\s*mode:\s*\['css',\s*'legacy'\],\s*before:\s*\['\.bloco-partida'\],\s*avoid:\s*\['tr',\s*'h3',\s*'table',\s*'thead',\s*'tbody'\]\s*\}/g;
const goodPageBreak = "pagebreak: { mode: ['css', 'legacy'], before: ['.nova-pagina'], avoid: ['tr'] }";
tempCode = tempCode.replace(badPageBreak, goodPageBreak);

const styleBlockRegex = /<style>[\s\S]*?<\/style>/;
let styles = tempCode.match(styleBlockRegex)[0];
const oldCss = `page-break-inside: avoid !important;\n    break-inside: avoid !important;\n    page-break-before: auto !important;\n    background: #ffffff !important;\n    display: block !important;\n}`;
const newCss = `page-break-before: auto !important;\n    background: #ffffff !important;\n    display: block !important;\n}`;
styles = styles.replace(oldCss, newCss);

if (!styles.includes('.nova-pagina')) {
    styles = styles.replace('</style>', `.nova-pagina {\n    page-break-before: always !important;\n    break-before: page !important;\n}\n</style>`);
}
tempCode = tempCode.replace(styleBlockRegex, styles);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', tempCode, 'utf8');
console.log('Fixed text and pagebreaks.');
