const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Add html2canvas width and windowWidth
code = code.replace(/html2canvas:  \{ scale: 2, useCORS: true, windowWidth: 794 \}/g, "html2canvas: { scale: 2, useCORS: true, width: 794, windowWidth: 794 }");

// 2. Add `.pdf-export-container` class and CSS
if (!code.includes('.pdf-export-container')) {
    const cssToInject = `
                  .pdf-export-container {
                      width: 794px !important;
                      max-width: 794px !important;
                      box-sizing: border-box !important;
                      padding: 20px !important;
                      overflow: hidden !important;
                  }
                  .pdf-export-container table {
                      table-layout: fixed !important;
                      width: 100% !important;
                  }
                  .pdf-export-container th, .pdf-export-container td {
                      word-wrap: break-word !important;
                      white-space: normal !important;
                      padding: 4px !important;
                      font-size: 10px !important;
                  }`;
    code = code.replace(/#dashboard-a4-preview table, #a4-preview table \{/g, cssToInject + "\n                  #dashboard-a4-preview table, #a4-preview table {");
}

// 3. Add class to the preview containers
code = code.replace(/id="dashboard-a4-preview" style=\{\{ width: '100%', minWidth: '794px', maxWidth: '794px'/g, 'id="dashboard-a4-preview" className="pdf-export-container" style={{ width: \'794px\', minWidth: \'794px\', maxWidth: \'794px\'');
code = code.replace(/id="a4-preview" style=\{\{ width: '100%', minWidth: '794px', maxWidth: '794px'/g, 'id="a4-preview" className="pdf-export-container" style={{ width: \'794px\', minWidth: \'794px\', maxWidth: \'794px\'');

// 4. Update table headers for Departamento Medico to strict percentages matching the request:
// Atleta (25%), Categoria (15%), Posição (10%), Data Registro (15%), Tipo Lesão (20%), Status (15%)
const oldHeaders = /<th style=\{\{ textAlign: "center", width: '10%' \}\}>Posição<\/th>\s*<th style=\{\{ textAlign: "center", width: '15%' \}\}>Data Registro<\/th>\s*<th style=\{\{ textAlign: "center", width: '10%' \}\}>Tipo Lesão<\/th>\s*<th style=\{\{ textAlign: "center", width: '15%', minWidth: '90px' \}\}>Status<\/th>/g;
const newHeaders = `<th style={{ textAlign: "center", width: '10%' }}>Posição</th>
                                <th style={{ textAlign: "center", width: '15%' }}>Data Registro</th>
                                <th style={{ textAlign: "center", width: '20%' }}>Tipo Lesão</th>
                                <th style={{ textAlign: "center", width: '15%' }}>Status</th>`;
code = code.replace(/<th style=\{\{ width: '30%' \}\}>Atleta<\/th>/g, "<th style={{ width: '25%' }}>Atleta</th>");
code = code.replace(oldHeaders, newHeaders);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Strict 794px capture locks applied.');
