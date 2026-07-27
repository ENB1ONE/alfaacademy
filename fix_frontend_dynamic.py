import re

# ====================
# 1. Update Attendance
# ====================
with open("crm/src/pages/Attendance.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Replace states and add categorias fetch
if "const [categorias, setCategorias] = useState([]);" not in text:
    text = text.replace("const [categoria, setCategoria] = useState('Sub-15');", 
                        "const [categoria, setCategoria] = useState('');\n  const [categorias, setCategorias] = useState([]);")

# Add fetch for categories
load_cats = """
  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      const cats = res.data.categorias || res.data;
      setCategorias(cats);
      if (cats.length > 0 && !categoria) setCategoria(cats[0].id);
    } catch (e) { console.error(e); }
  };
"""
if "loadCategorias" not in text:
    text = text.replace("const loadAtletas", load_cats + "\n  const loadAtletas")

# Call both in useEffect
text = text.replace("useEffect(() => { loadAtletas(); }, [categoria]);", 
                    "useEffect(() => { loadCategorias(); }, []);\n  useEffect(() => { if(categoria) loadAtletas(); }, [categoria]);")

# Filter logic update (using categoria_id instead of string)
text = text.replace("a.categoria === categoria", "a.categoria_id === categoria")

# Post logic update
text = text.replace("await api.post('/api/admin/chamadas', { categoria, presencas: payload });",
                    "await api.post('/api/admin/chamadas', { categoria_id: categoria, presencas: payload });")

# Buttons dynamic generation
btn_hardcoded = r"\{?\['Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'\]\.map\(cat => \(\s*<button key=\{cat\} onClick=\{.*?\} style=\{btnStyle\(cat\)\}>\{cat\}</button>\s*\)\)\}?"
btn_dynamic = "{categorias.map(cat => (<button key={cat.id} onClick={() => setCategoria(cat.id)} style={btnStyle(cat.id)}>{cat.nome}</button>))}"
text = re.sub(btn_hardcoded, btn_dynamic, text)

# Chamada do {categoria} string
text = text.replace("Salvar Chamada do {categoria}", "Salvar Chamada")

with open("crm/src/pages/Attendance.jsx", "w", encoding="utf-8") as f:
    f.write(text)

# ====================
# 2. Update Overview
# ====================
with open("crm/src/pages/Overview.jsx", "r", encoding="utf-8") as f:
    over = f.read()

# Fix counts by categoria
# The chart data groups by a.categoria which might be string "Sub-15" OR now it's null because we only have a.categoria_nome
over = over.replace("list.forEach(a => { counts[a.categoria] = (counts[a.categoria] || 0) + 1; });",
                    "list.forEach(a => { const cat = a.categoria_nome || a.categoria || 'Sem Categoria'; counts[cat] = (counts[cat] || 0) + 1; });")

with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f:
    f.write(over)

