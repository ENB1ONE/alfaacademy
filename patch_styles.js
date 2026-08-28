const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const startIndex = code.indexOf('<style>');
const endIndex = code.indexOf('</style>', startIndex) + 8;

const cleanStyle = `<style>
{\`
/* ESTILOS DE IMPRESSÃO - PDF E CTRL+P */
@media print {
    @page { size: A4 portrait; margin: 10mm; }
    
    body * { visibility: hidden; }
    #a4-preview-wrapper, #a4-preview-wrapper * { visibility: visible; }
    #a4-preview-wrapper {
        position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white;
    }
    .btn, button, nav, .sidebar, .menu, header, footer, ::-webkit-scrollbar {
        display: none !important;
    }
}

/* REGRAS RÍGIDAS PARA O A4 PREVIEW (html2pdf e Impressão) */
.pdf-export-container, #a4-preview, #dashboard-a4-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333333;
    width: 794px !important;
    max-width: 794px !important;
    box-sizing: border-box !important;
    padding: 20px !important;
    overflow: hidden !important;
    background: #ffffff;
}

/* TABELAS CONTIDAS */
.pdf-export-container table, #a4-preview table, #dashboard-a4-preview table {
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin-bottom: 25px !important;
}

/* QUEBRA DE TEXTO E LIMITAÇÃO DE FONTE */
.pdf-export-container th, .pdf-export-container td,
#a4-preview th, #a4-preview td,
#dashboard-a4-preview th, #dashboard-a4-preview td {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    padding: 6px 4px !important;
    font-size: 10px !important;
    border: 1px solid #dee2e6 !important;
}

/* CABEÇALHOS */
.pdf-export-container th, #a4-preview th, #dashboard-a4-preview th {
    background-color: #111111 !important;
    color: #eab308 !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    font-size: 9px !important;
}

/* PROTEÇÃO DE QUEBRA DE PÁGINA (PAGE-BREAK) */
.pdf-export-container tr, #a4-preview tr, #dashboard-a4-preview tr {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    page-break-after: auto !important;
}

.section-card, .jogos-report .section-card {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    page-break-before: auto !important;
}

.pdf-export-container thead, #a4-preview thead, #dashboard-a4-preview thead {
    display: table-header-group !important;
}
.pdf-export-container tfoot, #a4-preview tfoot, #dashboard-a4-preview tfoot {
    display: table-row-group !important;
}

/* CORES ZEBRADAS E UTILITÁRIOS */
#dashboard-a4-preview tr:nth-child(even) td, #a4-preview tr:nth-child(even) td {
    background-color: #f8f9fa !important;
}

.text-cell { text-align: left !important; }
.num-cell { text-align: center !important; }
.empty-cell { color: #999 !important; font-style: italic !important; }
\`}
</style>`;

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + cleanStyle + code.substring(endIndex);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Styles cleaned and updated safely!');
} else {
    console.log('Could not find style block.');
}
