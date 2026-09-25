const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Print the render block to see the current layout
let renderIdx = code.indexOf('return (');
if (renderIdx !== -1) {
    console.log(code.substring(renderIdx, renderIdx + 2000));
}
