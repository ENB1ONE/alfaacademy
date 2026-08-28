const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Fix html2pdf pagebreak options
code = code.replace(/pagebreak:\s*\{\s*mode:\s*\['css',\s*'legacy'\]\s*\}/g, "pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', 'h3'] }");

// Fix section-card avoid-break in CSS
const oldCss = `.section-card, .jogos-report .section-card {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    page-break-before: auto !important;
    background: #ffffff !important; /* Fix dark mode cards rendering white text */
}`;

const newCss = `.section-card, .jogos-report .section-card {
    page-break-before: auto !important;
    background: #ffffff !important; /* Fix dark mode cards rendering white text */
}
.jogos-report h3, .jogos-report p {
    break-after: avoid !important;
    page-break-after: avoid !important;
}`;

code = code.replace(oldCss, newCss);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Patched CentralRelatorios.jsx pagebreak logic and CSS.');
