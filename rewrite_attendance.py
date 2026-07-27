with open("crm/src/pages/Attendance.jsx", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Add categories fetching
text = text.replace("const [categoriaFiltro, setCategoriaFiltro] = useState('Sub-11');", 
"const [categoriaFiltro, setCategoriaFiltro] = useState('');\n  const [categoriasDb, setCategoriasDb] = useState([]);")

use_effect = """  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategoriasDb(res.data.categorias);
      if(res.data.categorias.length > 0) {
        setCategoriaFiltro(res.data.categorias[0].id);
      }
    } catch(e) {}
  };

  useEffect(() => {
    if (categoriaFiltro) carregarAtletas();
  }, [categoriaFiltro]);
"""
text = re.sub(r'  useEffect\(\(\) => \{\n    carregarAtletas\(\);\n  \}, \[categoriaFiltro\]\);', use_effect, text)

# Update the payload mapping
text = text.replace("categoria: categoriaFiltro,", "categoria_id: categoriaFiltro,")

# Update select options
select_cat = """<select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
          {categoriasDb.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>"""
            
text = re.sub(r'<select value=\{categoriaFiltro\} onChange=\{e => setCategoriaFiltro\(e\.target\.value\)\}>.*?</select>', select_cat, text, flags=re.DOTALL)

with open("crm/src/pages/Attendance.jsx", "w", encoding="utf-8") as f:
    f.write(text)
