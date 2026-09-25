const fs = require('fs');

function checkFile(name) {
    console.log(`\n=== ${name} ===`);
    let code = fs.readFileSync(`crm/src/pages/${name}`, 'utf8');
    let renderStart = code.indexOf('return (');
    if (renderStart !== -1) {
        console.log(code.substring(renderStart, renderStart + 1500));
    }
}

checkFile('Overview.jsx');
checkFile('Attendance.jsx');
checkFile('Games.jsx');
