# Patch App.jsx
with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("import AttendanceHistory from './pages/AttendanceHistory';", "import AttendanceHistory from './pages/AttendanceHistory';\nimport AttendanceReport from './pages/AttendanceReport';")
text = text.replace("<Route path=\"historico-chamadas\" element={<AttendanceHistory />} />", "<Route path=\"historico-chamadas\" element={<AttendanceHistory />} />\n            <Route path=\"frequencia\" element={<AttendanceReport />} />")

with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(text)

# Patch Layout.jsx
with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()
import_find = "import { LayoutDashboard, Menu, X, Users, UserCog, ClipboardCheck, BookOpen, LogOut, Folders } from 'lucide-react';"
import_replace = "import { LayoutDashboard, Menu, X, Users, UserCog, ClipboardCheck, BookOpen, LogOut, Folders, ActivitySquare } from 'lucide-react';"
text = text.replace(import_find, import_replace)

link_find = "<NavLink to=\"/historico-chamadas\" icon={BookOpen}>Histórico de Presenças</NavLink>"
link_replace = "<NavLink to=\"/historico-chamadas\" icon={BookOpen}>Histórico de Presenças</NavLink>\n          <NavLink to=\"/frequencia\" icon={ActivitySquare}>Frequência Geral</NavLink>"
text = text.replace(link_find, link_replace)

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)

# Patch Overview.jsx
with open("crm/src/pages/Overview.jsx", "r", encoding="utf-8") as f:
    text = f.read()

card_find = """        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Top Atletas Faltosos</h3>"""
card_replace = """        <div className="card" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => navigate('/frequencia')} title="Ver Relatório Completo">
          <h3 style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>Top Atletas Faltosos <span style={{fontSize: 12, color: 'var(--ouro)', fontWeight: 'normal'}}>Ver Todos &rarr;</span></h3>"""
text = text.replace(card_find, card_replace)

with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f:
    f.write(text)
