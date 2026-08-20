import re

with open('crm/src/pages/Athletes.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the filter logic
old_filter = r'''const list = rawList\.filter\(a => \{
      let matchCat = true;
      let matchTreinador = true;
      let matchBusca = true;

      if \(filtroCategoria\) \{
        matchCat = String\(a\.categoria_id\) === String\(filtroCategoria\);
      \}
      
      if \(filtroTreinador && treinadores\.length > 0\) \{
        const t = treinadores\.find\(tr => String\(tr\.id\) === String\(filtroTreinador\)\);
        if \(t && t\.categorias\) \{
          matchTreinador = t\.categorias\.some\(c => String\(c\.id\) === String\(a\.categoria_id\)\);
        \} else \{
          matchTreinador = false;
        \}
      \}

      if \(busca\) \{
        matchBusca = \(a\.nome \|\| ''\)\.toLowerCase\(\)\.includes\(busca\.toLowerCase\(\)\);
      \}

      return matchCat && matchTreinador && matchBusca;
    \}\);'''

new_filter = '''const list = rawList.filter(a => {
      let matchCat = true;
      let matchTreinador = true;
      let matchBusca = true;
      let matchStatus = true;

      if (filtroCategoria) {
        matchCat = String(a.categoria_id) === String(filtroCategoria);
      }
      
      if (filtroTreinador && treinadores.length > 0) {
        const t = treinadores.find(tr => String(tr.id) === String(filtroTreinador));
        if (t && t.categorias) {
          matchTreinador = t.categorias.some(c => String(c.id) === String(a.categoria_id));
        } else {
          matchTreinador = false;
        }
      }

      if (busca) {
        matchBusca = (a.nome || '').toLowerCase().includes(busca.toLowerCase());
      }
      
      if (filtroStatus) {
        matchStatus = a.status_medico === filtroStatus;
      }

      return matchCat && matchTreinador && matchBusca && matchStatus;
    });'''

content = re.sub(old_filter, new_filter, content, flags=re.MULTILINE)


# 2. Add Status Médico dropdown UI
old_ui = r'''            <div>
              <label style=\{\{ fontSize: 12, color: 'var\(--cinza\)' \}\}>Filtrar Categoria</label>
              <select value=\{filtroCategoria\} onChange=\{e => setFiltroCategoria\(e\.target\.value\)\} style=\{\{ marginTop: 0, marginBottom: 0 \}\}>
                <option value="">Todas as Categorias</option>
                \{categorias\.map\(c => <option key=\{c\.id\} value=\{c\.id\}>\{c\.nome\}</option>\)\}
              </select>
            </div>'''

new_ui = '''            <div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Filtrar Categoria</label>
              <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todas as Categorias</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Status Médico</label>
              <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todos</option>
                <option value="Apto">Apto</option>
                <option value="Lesionado">Lesionado</option>
                <option value="Transição">Transição</option>
              </select>
            </div>'''

content = re.sub(old_ui, new_ui, content, flags=re.MULTILINE)

# 3. Ensure useEffect uses "Lesionado" instead of "Departamento Médico"
content = content.replace("setFiltroStatus('Departamento Médico')", "setFiltroStatus('Lesionado')")
content = content.replace("setFiltroStatus('Departamento MÃ©dico')", "setFiltroStatus('Lesionado')")

with open('crm/src/pages/Athletes.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied.")
