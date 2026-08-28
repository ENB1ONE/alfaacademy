const fs = require('fs');
const code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const startIndex = code.indexOf('<style>');
const endIndex = code.indexOf('</style>', startIndex) + 8;

if (startIndex !== -1 && endIndex !== -1) {
    console.log(code.substring(startIndex, endIndex));
} else {
    console.log('Style tag not found');
}
