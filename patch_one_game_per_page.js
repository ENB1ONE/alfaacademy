const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const styleBlockRegex = /<style>[\s\S]*?<\/style>/;
let styles = code.match(styleBlockRegex)[0];

// Update .bloco-partida in the CSS
const oldBlocoCSS = `.bloco-partida {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
    display: block !important;
}`;

const newBlocoCSS = `.bloco-partida {
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

styles = styles.replace(oldBlocoCSS, newBlocoCSS);

code = code.replace(styleBlockRegex, styles);
fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Successfully injected page-break-before: always logic for games.');
