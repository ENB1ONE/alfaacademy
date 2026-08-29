const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const styleBlockRegex = /<style>[\s\S]*?<\/style>/;

const cleanStyle = `<style>
{\`
/* REGRAS RIGOROSAS DE IMPRESSÃO (PDF E CTRL+P) */
@media print {
    @page { size: A4 portrait; margin: 15mm; }
    
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
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

    /* FORÇAR COMPORTAMENTO DE TABELA NATIVO */
    .pdf-export-container table, #a4-preview table {
        display: table !important;
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        margin-bottom: 20px !important;
        background: #ffffff !important;
    }

    .pdf-export-container thead, #a4-preview thead { 
        display: table-header-group !important; 
    }

    .pdf-export-container tfoot, #a4-preview tfoot { 
        display: table-row-group !important; 
    }

    .pdf-export-container tr, #a4-preview tr {
        display: table-row !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .pdf-export-container td, .pdf-export-container th,
    #a4-preview td, #a4-preview th {
        display: table-cell !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
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
    display: block !important; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

/* FORÇAR COMPORTAMENTO DE TABELA NATIVO (GERAL) */
.pdf-export-container table, #a4-preview table, #dashboard-a4-preview table {
    display: table !important;
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
}

.pdf-export-container thead, #a4-preview thead, #dashboard-a4-preview thead { 
    display: table-header-group !important; 
}

.pdf-export-container tfoot, #a4-preview tfoot, #dashboard-a4-preview tfoot { 
    display: table-row-group !important; 
}

.pdf-export-container tr, #a4-preview tr, #dashboard-a4-preview tr {
    display: table-row !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-after: auto !important;
}

/* QUEBRA DE TEXTO */
.pdf-export-container th, .pdf-export-container td,
#a4-preview th, #a4-preview td,
#dashboard-a4-preview th, #dashboard-a4-preview td {
    display: table-cell !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    padding: 5px 4px !important;
    font-size: 10px !important;
    border: 1px solid #dee2e6 !important;
    color: #111111; 
}

/* CABEÇALHOS - FORÇAR COR DE FUNDO PRETA */
.pdf-export-container th, #a4-preview th, #dashboard-a4-preview th {
    background-color: #111111 !important;
    color: #eab308 !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
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

/* CORES ZEBRADAS E UTILITÁRIOS */
.pdf-export-container tr:nth-child(even) td, #a4-preview tr:nth-child(even) td, #dashboard-a4-preview tr:nth-child(even) td {
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
console.log('Styles fully updated with strictly enforced table behavior.');
