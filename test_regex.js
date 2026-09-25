const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const targetRegex = /(<div style=\{\{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' \}\}>[\s\S]*?)<button className="btn outline" onClick=\{limparFiltros\}/;

const match = code.match(targetRegex);
if(match) {
    console.log("MATCHED");
} else {
    console.log("NOT MATCHED");
}
