with open("crm/src/pages/Athletes.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add categories fetching
import re

text = text.replace("const [form, setForm] = useState({ id: null, nome: '', categoria: 'Sub-11', posicao: 'Goleiro', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' });", 
"const [form, setForm] = useState({ id: null, nome: '', categoria_id: '', posicao: 'Goleiro', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' });\n  const [categoriasDb, setCategoriasDb] = useState([]);")

# Fetch categories inside useEffect
use_effect = """  useEffect(() => {
    carregarAtletas();
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategoriasDb(res.data.categorias);
    } catch(e) {}
  };
"""
text = re.sub(r'  useEffect\(\(\) => \{\n    carregarAtletas\(\);\n  \}, \[\]\);', use_effect, text)

# Update handleEditar
text = text.replace("categoria: a.categoria,", "categoria_id: a.categoria_id,")

# Update select options
select_cat = """<select value={form.categoria_id} onChange={e => setForm({...form, categoria_id: e.target.value})}>
              <option value="">Selecione...</option>
              {categoriasDb.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>"""
            
text = re.sub(r'<select value=\{form.categoria\} onChange=\{e => setForm\(\{\.\.\.form, categoria: e\.target\.value\}\)\}>.*?</select>', select_cat, text, flags=re.DOTALL)

with open("crm/src/pages/Athletes.jsx", "w", encoding="utf-8") as f:
    f.write(text)
