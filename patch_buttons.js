const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// 1. Add state variables for export loading
code = code.replace(
    /const \[generating, setGenerating\] = useState\(false\);/,
    `const [generating, setGenerating] = useState(false);
  const [exportingDashboard, setExportingDashboard] = useState(false);
  const [exportingA4, setExportingA4] = useState(false);`
);

// 2. Update exportDashboardPDF
const oldExportDashboard = /const exportDashboardPDF = \(\) => \{[\s\S]*?html2pdf\(\)\.from\(element\)\.set\(opt\)\.save\(\);\s*\};/;
const newExportDashboard = `const exportDashboardPDF = async () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    setExportingDashboard(true);
    // Allow React to render the loading state before html2canvas blocks the thread
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const opt = {
      margin:       [10, 10, 15, 10], // top, left, bottom, right
      filename:     \`Dashboard_Executivo_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        setExportingDashboard(false);
    }).catch(() => {
        setExportingDashboard(false);
    });
  };`;
code = code.replace(oldExportDashboard, newExportDashboard);

// 3. Update exportPDF
const oldExportPDF = /const exportPDF = \(\) => \{[\s\S]*?html2pdf\(\)\.from\(element\)\.set\(opt\)\.save\(\);\s*\};/;
const newExportPDF = `const exportPDF = async () => {
    const element = document.getElementById('a4-preview');
    if (!element) return;
    
    setExportingA4(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        setExportingA4(false);
    }).catch(() => {
        setExportingA4(false);
    });
  };`;
code = code.replace(oldExportPDF, newExportPDF);

// 4. Update the Dashboard button UI
const oldDashBtn = /<button className="btn primary" onClick=\{exportDashboardPDF\} style=\{\{ display: 'flex', gap: 8, alignItems: 'center', background: 'var\(--ouro\)', color: '#000', fontWeight: 'bold' \}\}>[\s\S]*?<\/button>/;
const newDashBtn = `<button className="btn primary" onClick={exportDashboardPDF} disabled={exportingDashboard} style={{ display: 'flex', gap: 8, alignItems: 'center', background: exportingDashboard ? '#666' : 'var(--ouro)', color: exportingDashboard ? '#ccc' : '#000', fontWeight: 'bold', cursor: exportingDashboard ? 'wait' : 'pointer' }}>
              <Download size={18} /> {exportingDashboard ? 'Processando PDF...' : 'Baixar Relatório Executivo'}
            </button>`;
code = code.replace(oldDashBtn, newDashBtn);

// 5. Update the A4 Preview button UI
const oldA4Btn = /<button className="btn primary" onClick=\{exportPDF\} style=\{\{ display: 'flex', alignItems: 'center', gap: 8, background: 'var\(--ouro\)', color: '#000' \}\}>[\s\S]*?<\/button>/;
const newA4Btn = `<button className="btn primary" onClick={exportPDF} disabled={exportingA4} style={{ display: 'flex', alignItems: 'center', gap: 8, background: exportingA4 ? '#666' : 'var(--ouro)', color: exportingA4 ? '#ccc' : '#000', cursor: exportingA4 ? 'wait' : 'pointer' }}>
                            <Download size={18} /> {exportingA4 ? 'Processando...' : 'Baixar PDF Executivo'}
                        </button>`;
code = code.replace(oldA4Btn, newA4Btn);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('PDF export loading states added.');
