const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Fix encoding globally
const encodingMap = {
    'Ã³': 'ó',
    'Ã¢': 'â',
    'Ã£': 'ã',
    'Ã§': 'ç',
    'Ã¡': 'á',
    'Ãª': 'ê',
    'Ã\xAD': 'í',
    'Ã‰': 'É',
    'Ã\x8D': 'Í',
    'Ã³': 'ó',
    'Ãµ': 'õ',
    'Ãº': 'ú',
    'Ã§': 'ç',
    'Ã£o': 'ão',
    'Ãµes': 'ões'
};

for (const [bad, good] of Object.entries(encodingMap)) {
    code = code.split(bad).join(good);
}

// 2. Rewrite the Style Block to match the user's SAFE exact requirements
const styleBlockRegex = /<style>[\s\S]*?<\/style>/;

const cleanStyle = `<style>
{\`
/* REGRAS RIGOROSAS DE IMPRESSÃO (PDF E CTRL+P) - MÉTODO SEGURO */
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

    .btn, button, nav, .sidebar, .menu, header, footer, ::-webkit-scrollbar {
        display: none !important;
    }

    /* FIX 4: CORRIGIR A TABELA DE RESUMO (E OUTRAS TABELAS GERAIS) */
    .pdf-export-container table, #a4-preview table {
        display: table !important;
        width: 100% !important;
        table-layout: auto !important; /* Corrigido de fixed para auto */
        border-collapse: collapse !important;
        margin-bottom: 20px !important;
        background: #ffffff !important;
    }

    /* REDUZIR FONTE E PADDING DA TABELA PARA CABER */
    .pdf-export-container td, .pdf-export-container th,
    #a4-preview td, #a4-preview th {
        display: table-cell !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        padding: 4px !important;
        margin: 0 !important;
        line-height: 1.2 !important;
        height: auto !important;
        font-size: 11px !important; /* Reduzido levemente para caber horizontalmente */
        border: 1px solid #dee2e6 !important;
        color: #111111;
    }

    .pdf-export-container thead, #a4-preview thead { 
        display: table-header-group !important; 
    }
    .pdf-export-container tfoot, #a4-preview tfoot { 
        display: table-row-group !important; 
    }

    /* FIX 2: RESTAURAR BLOCO (REMOVER INLINE-BLOCK QUE CAUSOU TELA BRANCA) */
    .bloco-jogo {
        display: block !important;
        width: 100% !important;
        margin-bottom: 20px !important;
        background: #ffffff !important;
    }

    /* UM JOGO POR PÁGINA */
    .bloco-jogo:not(:first-of-type) {
        page-break-before: always !important;
        break-before: page !important;
    }

    /* FIX 3: EVITAR TÍTULOS ÓRFÃOS (MÉTODO SEGURO DE AMARRAÇÃO) */
    .bloco-jogo h2, 
    .bloco-jogo h3, 
    .bloco-jogo p, 
    .bloco-jogo .resumo-convocados {
        page-break-after: avoid !important;
        break-after: avoid !important;
        margin-bottom: 5px !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .bloco-jogo table {
        page-break-before: avoid !important;
        break-before: avoid !important;
    }

    /* PROTEGER AS LINHAS DA TABELA (SEM CORTAR AO MEIO) */
    .pdf-export-container tr, #a4-preview tr, tr {
        display: table-row !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: auto !important;
    }

    /* CABEÇALHOS PRETOS NA IMPRESSÃO */
    .pdf-export-container th {
        background-color: #111111 !important;
        color: #eab308 !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    /* CORES ZEBRADAS E UTILITÁRIOS */
    .pdf-export-container tr:nth-child(even) td {
        background-color: #f8f9fa !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
}

/* --------------------------------------------------- */
/* REGRAS GERAIS DE PREVIEW (TELA)                     */
/* --------------------------------------------------- */
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

.pdf-export-container table, #a4-preview table {
    display: table !important;
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
    table-layout: auto !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
}

.pdf-export-container thead, #a4-preview thead { display: table-header-group !important; }
.pdf-export-container tfoot, #a4-preview tfoot { display: table-row-group !important; }

.pdf-export-container tr, #a4-preview tr, tr {
    display: table-row !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-after: auto !important;
}

.pdf-export-container th, .pdf-export-container td, #a4-preview th, #a4-preview td {
    display: table-cell !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    padding: 4px !important;
    font-size: 11px !important;
    border: 1px solid #dee2e6 !important;
    color: #111111; 
}

.pdf-export-container th {
    background-color: #111111 !important;
    color: #eab308 !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.bloco-jogo {
    display: block !important;
    width: 100% !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
}

.bloco-jogo h3 {
    background-color: #f8f9fa !important;
    padding: 8px !important;
    margin-bottom: 5px !important;
    margin-top: 0 !important;
    break-after: avoid !important;
    page-break-after: avoid !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.bloco-jogo p {
    margin-bottom: 5px !important;
    margin-top: 0 !important;
    break-after: avoid !important;
    page-break-after: avoid !important;
}

.bloco-jogo table {
    page-break-before: avoid !important;
    break-before: avoid !important;
}

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
console.log('Fixed CSS and Encoding in CentralRelatorios.jsx.');
