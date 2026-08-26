const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. FOOLPROOF CSS for TH to NEVER break words
const oldCssRegex = /#dashboard-a4-preview th, #a4-preview th \{[\s\S]*?\}/;
const newCss = `#dashboard-a4-preview th, #a4-preview th {
                      background-color: #111111 !important;
                      color: #eab308 !important;
                      padding: 10px 4px !important;
                      font-size: 11px !important;
                      font-weight: bold !important;
                      text-transform: uppercase !important;
                      border: 1px solid #000 !important;
                      white-space: nowrap !important;
                      word-break: keep-all !important;
                  }`;

if (oldCssRegex.test(code)) {
    code = code.replace(oldCssRegex, newCss);
}

// 2. Fix the export functions to use a foolproof iframe or body-expansion hack
const exportDashRegex = /const exportDashboardPDF = async \(\) => \{[\s\S]*?\}\)\.catch\(\(\) => \{[\s\S]*?\}\);\s*\};/;
const newExportDash = `const exportDashboardPDF = async () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    setExportingDashboard(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // FOOLPROOF HACK FOR HTML2CANVAS ON MOBILE
    const clone = element.cloneNode(true);
    clone.style.width = '800px';
    clone.style.minWidth = '800px';
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.margin = '0';
    clone.style.padding = '40px';
    
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '1200px';
    wrapper.style.height = '2000px';
    wrapper.style.overflow = 'visible';
    wrapper.style.zIndex = '-9999';
    wrapper.style.opacity = '0.001';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200, width: 800, scrollX: 0, scrollY: 0 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    try {
        await html2pdf().from(clone).set(opt).save();
    } finally {
        if(document.body.contains(wrapper)) document.body.removeChild(wrapper);
        setExportingDashboard(false);
    }
  };`;

if (exportDashRegex.test(code)) {
    code = code.replace(exportDashRegex, newExportDash);
}

const exportPDFRegex = /const exportPDF = async \(\) => \{[\s\S]*?\}\)\.catch\(\(\) => \{[\s\S]*?\}\);\s*\};/;
const newExportPDF = `const exportPDF = async () => {
    const element = document.getElementById('a4-preview');
    if (!element) return;
    
    setExportingA4(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // FOOLPROOF HACK FOR HTML2CANVAS ON MOBILE
    const clone = element.cloneNode(true);
    clone.style.width = '800px';
    clone.style.minWidth = '800px';
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.margin = '0';
    clone.style.padding = '40px';
    
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '1200px';
    wrapper.style.height = '2000px';
    wrapper.style.overflow = 'visible';
    wrapper.style.zIndex = '-9999';
    wrapper.style.opacity = '0.001';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200, width: 800, scrollX: 0, scrollY: 0 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    try {
        await html2pdf().from(clone).set(opt).save();
    } finally {
        if(document.body.contains(wrapper)) document.body.removeChild(wrapper);
        setExportingA4(false);
    }
  };`;

if (exportPDFRegex.test(code)) {
    code = code.replace(exportPDFRegex, newExportPDF);
}

// 3. Ensure the Dates area on the right has absolute nowrap protection
code = code.replace(/<div style=\{\{ flex: '0 0 170px', textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1\.5', paddingTop: '5px' \}\}>/g, 
    `<div style={{ flex: '0 0 220px', minWidth: '220px', textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px', whiteSpace: 'nowrap' }}>`);
    
// Dashboard side date protection
code = code.replace(/<div style=\{\{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1\.5', paddingTop: '5px', minWidth: '150px' \}\}>/g,
    `<div style={{ flex: '0 0 220px', minWidth: '220px', textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px', whiteSpace: 'nowrap' }}>`);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Absolute foolproof fixes applied.');
