const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
const lines = code.split('\n');

const handleGerarIndex = lines.findIndex(l => l.includes('const handleGerarRelatorio'));
if (handleGerarIndex !== -1) {
    console.log("Found handleGerarRelatorio:");
    console.log(lines.slice(handleGerarIndex, handleGerarIndex + 20).join('\n'));
}

const handleExportIndex = lines.findIndex(l => l.includes('const exportDashboardPDF'));
if (handleExportIndex !== -1) {
    console.log("\nFound exportDashboardPDF:");
    console.log(lines.slice(handleExportIndex, handleExportIndex + 20).join('\n'));
}
