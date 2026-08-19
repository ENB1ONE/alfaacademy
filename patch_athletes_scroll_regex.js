const fs = require('fs');
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

ath = ath.replace(
    /setShowForm\(true\);\s*\};/g,
    "setShowForm(true);\n    window.scrollTo({ top: 0, behavior: 'smooth' });\n  };"
);

fs.writeFileSync('crm/src/pages/Athletes.jsx', ath, 'utf8');
