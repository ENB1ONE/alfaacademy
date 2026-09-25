const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');
code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, ClipboardCheck } from 'lucide-react';");
fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Import fixed!');
