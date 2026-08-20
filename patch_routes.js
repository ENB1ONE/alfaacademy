const fs = require('fs');

let appFile = fs.readFileSync('crm/src/App.jsx', 'utf8');
if (!appFile.includes('PerfilAtleta')) {
    appFile = appFile.replace(
        "import Athletes from './pages/Athletes';",
        "import Athletes from './pages/Athletes';\nimport PerfilAtleta from './pages/PerfilAtleta';\nimport GeradorRelatorios from './pages/GeradorRelatorios';"
    );
    appFile = appFile.replace(
        `<Route path="/atletas" element={<Athletes />} />`,
        `<Route path="/atletas" element={<Athletes />} />\n            <Route path="/perfil/:id" element={<PerfilAtleta />} />\n            <Route path="/relatorios" element={<GeradorRelatorios />} />`
    );
    fs.writeFileSync('crm/src/App.jsx', appFile, 'utf8');
}

let layoutFile = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');
if (!layoutFile.includes('/relatorios')) {
    layoutFile = layoutFile.replace(
        "import { Users, Calendar, ClipboardList, Activity, LayoutDashboard, LogOut, FileText, Menu, X, CheckSquare, Target } from 'lucide-react';",
        "import { Users, Calendar, ClipboardList, Activity, LayoutDashboard, LogOut, FileText, Menu, X, CheckSquare, Target, Download } from 'lucide-react';"
    );
    layoutFile = layoutFile.replace(
        `<NavItem to="/frequencia" icon={<FileText size={20} />} text="Frequência" />`,
        `<NavItem to="/frequencia" icon={<FileText size={20} />} text="Frequência" />\n            <NavItem to="/relatorios" icon={<Download size={20} />} text="Gerar PDF" />`
    );
    fs.writeFileSync('crm/src/components/Layout.jsx', layoutFile, 'utf8');
}
console.log('Routes added');
