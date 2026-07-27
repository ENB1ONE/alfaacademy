import re

with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = re.sub(
    r'(<NavLink to="/chamada"[^>]*>Lista de Chamada</NavLink>)',
    r'\1\n          <NavLink to="/historico-chamadas" icon={BookOpen}>Histórico de Presenças</NavLink>',
    text
)

# Ensure BookOpen is imported
if "BookOpen" not in text.split("from 'lucide-react'")[0]:
    text = text.replace("import { LayoutDashboard", "import { LayoutDashboard, BookOpen")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)
