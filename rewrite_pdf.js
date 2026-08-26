const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

if (!code.includes("import { jsPDF } from 'jspdf';")) {
    code = code.replace("import html2pdf from 'html2pdf.js';", "import html2pdf from 'html2pdf.js';\nimport { jsPDF } from 'jspdf';\nimport html2canvas from 'html2canvas';");
}

const exportDashRegex = /const exportDashboardPDF = async \(\) => \{[\s\S]*?\n  \};\n/g;
const newExportDash = `const exportDashboardPDF = async () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    setExportingDashboard(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, windowWidth: 794 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(\`Dashboard_Executivo_\${new Date().getTime()}.pdf\`);
    } catch (error) {
        console.error("PDF Export Error:", error);
    } finally {
        setExportingDashboard(false);
    }
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

    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, windowWidth: 794 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Multi-page logic if canvas is very tall
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(\`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`);
    } catch (error) {
        console.error("PDF Export Error:", error);
    } finally {
        if (wrapper) wrapper.style.overflowX = origOverflow;
        setExportingA4(false);
    }
  };
`;
code = code.replace(exportPDFRegex, newExportPDF);

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('PDF export functions updated with direct jsPDF + html2canvas scaling logic.');
