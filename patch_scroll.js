const fs = require('fs');
let staff = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

staff = staff.replace(
    /const handleEditar = \(t\) => \{\s*setIsEditing\(true\);\s*setForm\(\{([\s\S]*?)\}\);\s*\};/,
    "const handleEditar = (t) => {\n    setIsEditing(true);\n    setForm({$1});\n    window.scrollTo({ top: 0, behavior: 'smooth' });\n  };"
);

fs.writeFileSync('crm/src/pages/Staff.jsx', staff, 'utf8');
console.log('Added scrollTo to Staff.jsx');
