const fs = require('fs');
['crm/src/pages/Games.jsx', 'crm/src/pages/Athletes.jsx'].forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace('import { X, useState', 'import { useState');
    if (!code.includes(' X,') && !code.includes(', X') && !code.includes('{ X }')) {
        code = code.replace('lucide-react";', 'lucide-react";'); // Just finding lucide
        code = code.replace(/import\s*\{\s*(.*)\s*\}\s*from\s*['"]lucide-react['"];?/, "import { X, $1 } from 'lucide-react';");
    }
    fs.writeFileSync(file, code, 'utf8');
});
console.log("Imports fixed.");
