const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');
let match = code.match(/reportData\.map\(\(row, idx\).*?data_.*?toLocaleDateString/s);
if (match) {
    console.log("Found match but printing safe length:");
    console.log(code.substring(code.indexOf(match[0]) - 500, code.indexOf(match[0]) + 1500));
} else {
    // try to find just "toLocaleDateString" inside map
    let match2 = code.match(/reportData\.map\([\s\S]*?toLocaleDateString[\s\S]*?\)/);
    if(match2) console.log(match2[0]);
    else console.log("Still not found");
}
