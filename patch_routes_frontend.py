with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    text = f.read()

if "AttendanceHistory" not in text:
    text = text.replace("import Attendance from './pages/Attendance';", "import Attendance from './pages/Attendance';\nimport AttendanceHistory from './pages/AttendanceHistory';")
    text = text.replace("<Route path=\"/chamada\" element={<Attendance />} />", "<Route path=\"/chamada\" element={<Attendance />} />\n                <Route path=\"/historico-chamadas\" element={<AttendanceHistory />} />")

    with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
        f.write(text)

with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    sb = f.read()

if "/historico-chamadas" not in sb:
    if "BookOpen" not in sb:
        sb = sb.replace("ClipboardList", "ClipboardList, BookOpen")
    
    new_link = """          <li><Link to="/chamada" style={liStyle('/chamada')}><ClipboardList size={20} /> Lista de Chamada</Link></li>
          <li><Link to="/historico-chamadas" style={liStyle('/historico-chamadas')}><BookOpen size={20} /> Histórico de Presenças</Link></li>"""
    
    sb = sb.replace("<li><Link to=\"/chamada\" style={liStyle('/chamada')}><ClipboardList size={20} /> Lista de Chamada</Link></li>", new_link)

    with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
        f.write(sb)
