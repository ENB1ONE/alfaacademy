const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const styleBlockRegex = /<style>[\s\S]*?<\/style>/;

const cleanStyle = `<style>
{\`
/* REGRAS RIGOROSAS DE IMPRESSÃO (PDF E CTRL+P) */
@media print {
    @page { size: A4 portrait; margin: 15mm; }
    
    html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: #ffffff !important;
    }
    
    body * { visibility: hidden; }
    
    #a4-preview-wrapper, #a4-preview-wrapper * { 
        visibility: visible; 
    }
    
    #a4-preview-wrapper {
        position: absolute; 
        left: 0; 
        top: 0; 
        width: 100%; 
        margin: 0; 
        padding: 0; 
        background: white;
    }

    /* OCULTAR UI */
    .btn, button, nav, .sidebar, .menu, header, footer, ::-webkit-scrollbar {
        display: none !important;
    }

    /* ESTRUTURA E DISPLAY (REMOVER FLEX/GRID) */
    .pdf-export-container, .section-card, .jogos-report, #a4-preview {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
    }

    /* MARGENS E ESPAÇOS - REDUZIDOS APENAS NA IMPRESSÃO */
    .pdf-export-container th, .pdf-export-container td {
        padding: 4px 2px !important;
        font-size: 9px !important;
    }
}

/* REGRAS GERAIS PARA O A4 PREVIEW (html2pdf e DOM) */
.pdf-export-container, #a4-preview, #dashboard-a4-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #111111 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    padding: 0 !important;
    background: #ffffff !important;
    display: block !important; /* FORÇAR BLOCK */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

/* TABELAS CONTIDAS */
.pdf-export-container table, #a4-preview table, #dashboard-a4-preview table {
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
}

/* QUEBRA DE TEXTO */
.pdf-export-container th, .pdf-export-container td {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    padding: 5px 4px !important;
    font-size: 10px !important;
    border: 1px solid #dee2e6 !important;
    color: #111111; 
}

/* CABEÇALHOS - FORÇAR COR DE FUNDO PRETA */
.pdf-export-container th {
    background-color: #111111 !important;
    color: #eab308 !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

/* PROTEÇÃO DE QUEBRA DE PÁGINA (CRÍTICO) */
.pdf-export-container tr, #a4-preview tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-after: auto !important;
}

.section-card, .jogos-report .section-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-before: auto !important;
    background: #ffffff !important;
    display: block !important;
}

.jogos-report h3, .jogos-report p {
    break-after: avoid !important;
    page-break-after: avoid !important;
    background-color: #f8f9fa !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.pdf-export-container thead { display: table-header-group !important; }
.pdf-export-container tfoot { display: table-row-group !important; }

/* CORES ZEBRADAS E UTILITÁRIOS */
.pdf-export-container tr:nth-child(even) td {
    background-color: #f8f9fa !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.text-cell { text-align: left !important; color: #111111; }
.num-cell { text-align: center !important; }
.empty-cell { color: #999 !important; font-style: italic !important; }
\`}
</style>`;

code = code.replace(styleBlockRegex, cleanStyle);
fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Styles fully updated with strict print rules.');
