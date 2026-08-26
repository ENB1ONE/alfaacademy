const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const oldExportPDF = /const exportPDF = async \(\) => \{[\s\S]*?\}\)\;\n  \}\;/;

const newExportPDF = `const exportPDF = async () => {
    const element = document.getElementById('a4-preview');
    if (!element) return;
    
    setExportingA4(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // TEMPORARY HACK FOR MOBILE SAFARI/CHROME
    // To prevent html2canvas from clipping the horizontally scrollable container,
    // we clone the element into a fixed, non-scrollable off-screen container.
    const clone = element.cloneNode(true);
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'fixed';
    hiddenContainer.style.top = '0';
    hiddenContainer.style.left = '0';
    hiddenContainer.style.width = '900px';
    hiddenContainer.style.zIndex = '-9999';
    hiddenContainer.style.opacity = '0.001';
    hiddenContainer.style.pointerEvents = 'none';
    hiddenContainer.appendChild(clone);
    document.body.appendChild(hiddenContainer);

    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(clone).set(opt).save().then(() => {
        document.body.removeChild(hiddenContainer);
        setExportingA4(false);
    }).catch(() => {
        if(document.body.contains(hiddenContainer)) document.body.removeChild(hiddenContainer);
        setExportingA4(false);
    });
  };`;

if (oldExportPDF.test(code)) {
    code = code.replace(oldExportPDF, newExportPDF);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Mobile crop fix implemented in exportPDF.');
} else {
    console.log('Regex did not match.');
}
