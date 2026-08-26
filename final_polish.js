const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Restore robust html2pdf.js generation so page-break CSS is actually parsed
const exportDashRegex = /const exportDashboardPDF = async \(\) => \{[\s\S]*?\n  \};\n/g;
const newExportDash = `const exportDashboardPDF = async () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    setExportingDashboard(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const opt = {
      margin:       [10, 10, 15, 10], // margin in mm
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        setExportingDashboard(false);
    }).catch(() => {
        setExportingDashboard(false);
    });
  };
`;
code = code.replace(exportDashRegex, newExportDash);

const exportPDFRegex = /const exportPDF = async \(\) => \{[\s\S]*?\n  \};\n/g;
const newExportPDF = `const exportPDF = async () => {
    const element = document.getElementById('a4-preview');
    const wrapper = document.getElementById('a4-preview-wrapper');
    if (!element) return;
    
    setExportingA4(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const origOverflow = wrapper ? wrapper.style.overflowX : 'auto';
    if (wrapper) wrapper.style.overflowX = 'visible';

    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        if (wrapper) wrapper.style.overflowX = origOverflow;
        setExportingA4(false);
    }).catch(() => {
        if (wrapper) wrapper.style.overflowX = origOverflow;
        setExportingA4(false);
    });
  };
`;
code = code.replace(exportPDFRegex, newExportPDF);

// 2. Adjust CSS Page Breaks, padding, and margins
const oldCssRegex = /#dashboard-a4-preview tr:nth-child\(even\) td/g;
const pageBreakCss = `
                  #dashboard-a4-preview tr, #a4-preview tr {
                      break-inside: avoid;
                      page-break-inside: avoid;
                  }
                  #dashboard-a4-preview .section-card, #a4-preview .section-card {
                      break-inside: avoid;
                      page-break-inside: avoid;
                      page-break-before: auto;
                  }
                  #dashboard-a4-preview tr:nth-child(even) td`;
code = code.replace(oldCssRegex, pageBreakCss);

// Reduce Table Padding
code = code.replace(/padding: 9px 12px;/g, "padding: 4px 8px;");

// 3. Fix "Departamento Médico" Column Widths & Status NoWrap
// Find the exact headers
const oldMedHeadersRegex = /<th style=\{\{ textAlign: "center", width: '15%' \}\}>Posição<\/th>\s*<th style=\{\{ textAlign: "center", width: '15%' \}\}>Data Registro<\/th>\s*<th style=\{\{ textAlign: "center", width: '15%' \}\}>Tipo Lesão<\/th>\s*<th style=\{\{ textAlign: "center", width: '10%' \}\}>Status<\/th>/g;
const newMedHeaders = `<th style={{ textAlign: "center", width: '10%' }}>Posição</th>
                                <th style={{ textAlign: "center", width: '15%' }}>Data Registro</th>
                                <th style={{ textAlign: "center", width: '10%' }}>Tipo Lesão</th>
                                <th style={{ textAlign: "center", width: '15%', minWidth: '90px' }}>Status</th>`;
code = code.replace(oldMedHeadersRegex, newMedHeaders);

// Add nowrap to the Status column specifically. 
// We can do this safely by looking at the td mapped for Status.
// The easiest way is to inject a specific class or style into the TD mapping or just globally for the 6th column of that specific table.
const cssForStatus = `
                  #dashboard-a4-preview table th:nth-child(6),
                  #dashboard-a4-preview table td:nth-child(6) {
                      white-space: nowrap !important;
                  }`;
code = code.replace(/#dashboard-a4-preview td, #a4-preview td \{/g, cssForStatus + "\n                  #dashboard-a4-preview td, #a4-preview td {");

// 4. Reduce section margins and header paddings
code = code.replace(/padding: '40px'/g, "padding: '20px 40px'");
code = code.replace(/marginBottom: '30px'/g, "marginBottom: '15px'");
code = code.replace(/paddingBottom: '20px'/g, "paddingBottom: '10px'");

// Make sure the main wrappers have class "section-card" to prevent breaking inside
code = code.replace(/<div style=\{\{ marginBottom: 30 \}\}>/g, `<div className="section-card" style={{ marginBottom: 15 }}>`);
code = code.replace(/<div style=\{\{ flex: 1 \}\}>/g, `<div className="section-card" style={{ flex: 1 }}>`);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Final polish: Print CSS, DOM-aware pagebreaks, reduced padding, nowrap status.');
