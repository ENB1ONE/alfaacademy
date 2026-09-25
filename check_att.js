const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Attendance.jsx', 'utf8');
let idx = code.indexOf('justificativa');
if (idx > -1) {
    console.log(code.substring(idx - 100, idx + 400));
} else {
    console.log("No justificativa found in Attendance.jsx");
}
