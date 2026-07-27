with open("crm/src/pages/Attendance.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("const [presencas, setPresencas] = useState({});", "const [presencas, setPresencas] = useState({});\n  const [titulo, setTitulo] = useState('Treino Regular');\n  const [tipo, setTipo] = useState('TREINO');")

old_save = """await api.post('/api/admin/chamadas', { categoria_id: categoria, presencas: payload });"""
new_save = """await api.post('/api/admin/chamadas', { categoria_id: categoria, presencas: payload, titulo, tipo });"""
text = text.replace(old_save, new_save)

old_jsx = """      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {categorias.map(cat => (<button key={cat.id} onClick={() => setCategoria(cat.id)} style={btnStyle(cat.id)}>{cat.nome}</button>))}
      </div>

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>"""

new_jsx = """      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {categorias.map(cat => (<button key={cat.id} onClick={() => setCategoria(cat.id)} style={btnStyle(cat.id)}>{cat.nome}</button>))}
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Título do Evento</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Treino Tático" style={{ margin: 0 }} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ margin: 0 }}>
                  <option value="TREINO">Treino</option>
                  <option value="JOGO">Jogo Oficial</option>
                  <option value="AVALIACAO">Avaliação Física</option>
              </select>
          </div>
      </div>

      <div className="card" style={{ padding: '0 20px 20px 20px' }}>"""

text = text.replace(old_jsx, new_jsx)

with open("crm/src/pages/Attendance.jsx", "w", encoding="utf-8") as f:
    f.write(text)
