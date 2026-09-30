const fs = require('fs');
let code = fs.readFileSync('crm/src/App.jsx', 'utf8');
let lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('path="atletas"')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
    }
});
