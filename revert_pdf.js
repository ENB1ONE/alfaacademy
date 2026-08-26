const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Revert exportDashboardPDF to simple version
const exportDashRegex = /const exportDashboardPDF = async \(\) => \{[\s\S]*?\}\n  \};\n/g;
const simpleExportDash = `const exportDashboardPDF = async () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    setExportingDashboard(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
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
code = code.replace(exportDashRegex, simpleExportDash);

// 2. Revert exportPDF to simple version + wrapper overflow fix
const exportPDFRegex = /const exportPDF = async \(\) => \{[\s\S]*?\}\n  \};\n/g;
const simpleExportPDF = `const exportPDF = async () => {
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
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
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
code = code.replace(exportPDFRegex, simpleExportPDF);

// 3. Set strict widths to 800px for the Dashboard Wrapper
code = code.replace(/<div style=\{\{ position: 'fixed', top: 0, left: 0, width: '900px', zIndex: -9999, opacity: 0\.001, pointerEvents: 'none' \}\}>/g,
    `<div style={{ position: 'fixed', top: 0, left: 0, width: '800px', zIndex: -9999, opacity: 0.001, pointerEvents: 'none' }}>`);

// 4. Set strict widths to 800px for Dashboard inner element
code = code.replace(/<div id="dashboard-a4-preview" style=\{\{/g,
    `<div id="dashboard-a4-preview" style={{ width: '800px', minWidth: '800px', maxWidth: '800px', `);

// 5. Add id to the BI Generator wrapper
code = code.replace(/<div style=\{\{\s*width: '100%',\s*maxWidth: '900px',\s*margin: '0 auto',\s*overflowX: 'auto',\s*background: '#1a1a1a'/g,
    `<div id="a4-preview-wrapper" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflowX: 'auto', background: '#1a1a1a'`);

// 6. Set strict width to 800px for BI Generator inner element
code = code.replace(/<div id="a4-preview" style=\{\{\s*minWidth: '800px',/g,
    `<div id="a4-preview" style={{ width: '800px', minWidth: '800px', maxWidth: '800px', `);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Reverted to simple PDF export with strict 800px widths.');
