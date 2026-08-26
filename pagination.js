const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const exportDashRegex = /pdf\.addImage\(imgData, 'PNG', 0, 0, imgWidth, imgHeight\);\n\s*pdf\.save\(`Dashboard_Executivo_\$\{new Date\(\)\.getTime\(\)\}\.pdf`\);/g;

const multiPage = `        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(\`Dashboard_Executivo_\${new Date().getTime()}.pdf\`);`;

code = code.replace(exportDashRegex, multiPage);
fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Multi-page logic added to Dashboard export.');
