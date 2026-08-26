const fs = require('fs');
const execSync = require('child_process').execSync;

try {
    const res = execSync('git grep -l "Posição" crm/src/', { encoding: 'utf8' });
    console.log(res);
} catch (e) {
    console.log("Error:", e.message);
}
