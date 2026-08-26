const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const regex = /const opt = \{\s*margin:\s*\[10, 10, 15, 10\],\s*filename:\s*`Relatorio_\$\{modulo\}_\$\{new Date\(\)\.getTime\(\)\}\.pdf`,\s*image:\s*\{\s*type: 'jpeg', quality: 1\s*\},\s*html2canvas:\s*\{\s*scale: 2, useCORS: true, windowWidth: 900\s*\},\s*jsPDF:\s*\{\s*unit: 'mm', format: 'a4', orientation: 'portrait'\s*\},\s*pagebreak:\s*\{\s*mode: \['css', 'legacy'\]\s*\}\s*\};/g;

const replacement = `const opt = {
      margin:       [10, 10, 15, 10],
      filename:     \`Relatorio_\${modulo}_\${new Date().getTime()}.pdf\`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };`;

code = code.replace(regex, replacement);
code = code.replace(/hiddenContainer\.style\.width = '900px';/g, "hiddenContainer.style.width = '800px';");

fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
console.log('Mobile crop width adjusted to 800px.');
