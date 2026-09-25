const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

let renderBlock = code.substring(code.indexOf('activeTab === \'generator\' && ('), code.indexOf(')}', code.indexOf('activeTab === \'generator\' && (')) + 1000);
console.log(renderBlock.substring(renderBlock.length - 1000));
