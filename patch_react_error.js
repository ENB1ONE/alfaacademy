const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const regex = /displayVal = \(displayVal && displayVal\.toString\(\)\.trim\(\) !== ''\) \? displayVal : '-';/g;

const replacement = `if (typeof displayVal === 'object' && displayVal !== null) {
                                                    displayVal = Array.isArray(displayVal) ? '' : JSON.stringify(displayVal);
                                                }
                                                displayVal = (displayVal !== null && displayVal !== undefined && displayVal.toString().trim() !== '') ? displayVal : '-';`;

if(code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Fixed React object render bug.');
} else {
    console.log('Could not find the target string to replace.');
}
