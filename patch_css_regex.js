const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const styleBlockRegex = /<style>[\s\S]*?<\/style>/;
let styles = code.match(styleBlockRegex)[0];

const cssToReplaceRegex = /\.bloco-partida\s*\{[^}]*\}\s*\/\*.*?\*\/\s*\.bloco-partida:not\(:first-of-type\)\s*\{[^}]*\}/;

const newBlocoCSS = `.bloco-partida {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
    display: block !important;
}

.nova-pagina {
    page-break-before: always !important;
    break-before: page !important;
}`;

styles = styles.replace(cssToReplaceRegex, newBlocoCSS);
code = code.replace(styleBlockRegex, styles);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Successfully replaced CSS.');
