const fs = require('fs');
let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

athletes = athletes.replace(
    "import { useLocation } from 'react-router-dom';",
    "import { useLocation, useNavigate } from 'react-router-dom';"
);

fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');
console.log('useNavigate imported');
