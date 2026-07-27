with open("crm/src/pages/Athletes.jsx", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Add state for categories
if "const [categorias, setCategorias] = useState([]);" not in text:
    text = text.replace("const [form, setForm] = useState(", "const [categorias, setCategorias] = useState([]);\n  const [form, setForm] = useState(")

# Fetch categories
load_cat = """
  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias || res.data);
    } catch (e) { console.error(e); }
  };
"""
if "loadCategorias = async" not in text:
    text = text.replace("const loadAtletas = async", load_cat + "\n  const loadAtletas = async")

# Call loadCategorias in useEffect
if "loadCategorias();" not in text:
    text = text.replace("loadAtletas(); }, []);", "loadAtletas(); loadCategorias(); }, []);")

# Fix form initial state to use categoria_id instead of string
text = text.replace("categoria: 'Sub-15'", "categoria_id: ''")

# Replace the hardcoded select with dynamic one
select_hardcoded = r'<select value=\{form\.categoria\} onChange=\{e=>setForm\(\{\.\.\.form, categoria: e\.target\.value\}\)\}>.*?</select>'
select_dynamic = '<select value={form.categoria_id || ""} onChange={e=>setForm({...form, categoria_id: e.target.value})}><option value="">Selecione...</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>'
text = re.sub(select_hardcoded, select_dynamic, text)

# Ensure the list uses categoria nome if available
text = text.replace("<td>{a.categoria}</td>", "<td>{a.categoria_nome || a.categoria || '-'}</td>")

with open("crm/src/pages/Athletes.jsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("crm/src/pages/Staff.jsx", "r", encoding="utf-8") as f:
    staff = f.read()

staff = staff.replace("ComissAo TAccnica", "Comissão Técnica")
staff = staff.replace("UsuArio", "Usuário")
staff = staff.replace("ResponsAveis", "Responsáveis")
staff = staff.replace("Acess restrito", "Acesso restrito")
staff = staff.replace("ProvisA3ria", "Provisória")
staff = staff.replace("AlteraA Aes", "Alterações")
staff = staff.replace("AA Aes", "Ações")

with open("crm/src/pages/Staff.jsx", "w", encoding="utf-8") as f:
    f.write(staff)

