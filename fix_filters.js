const fs = require('fs');

// ATHLETES PATCH
let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// 1. Fix the filter logic
const filterBlockOld = `
    const list = rawList.filter(a => {
      let matchCat = true;
      let matchTreinador = true;
      let matchBusca = true;
  
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
  
      return matchCat && matchTreinador && matchBusca;
    });`;

const filterBlockNew = `
    const list = rawList.filter(a => {
      let matchCat = true;
      let matchTreinador = true;
      let matchBusca = true;
      let matchStatus = true;
  
      if (filtroCategoria) matchCat = String(a.categoria_id) === String(filtroCategoria);
      if (filtroTreinador && treinadores.length > 0) {
        const t = treinadores.find(tr => String(tr.id) === String(filtroTreinador));
        if (t && t.categorias) {
          matchTreinador = t.categorias.some(c => String(c.id) === String(a.categoria_id));
        } else {
          matchTreinador = false;
        }
      }
      if (busca) matchBusca = (a.nome || '').toLowerCase().includes(busca.toLowerCase());
      if (filtroStatus) matchStatus = a.status_medico === filtroStatus;
  
      return matchCat && matchTreinador && matchBusca && matchStatus;
    });`;

athletes = athletes.replace(filterBlockOld.trim(), filterBlockNew.trim());
// Fallback if trim didn't work exactly
if (!athletes.includes('matchStatus = a.status_medico === filtroStatus')) {
    athletes = athletes.replace(
        /const list = rawList\.filter.*?return matchCat && matchTreinador && matchBusca;\n    }\);/s,
        filterBlockNew
    );
}

// 2. Add the Status filter UI if missing
if (!athletes.includes('<option value="Departamento Médico">Departamento Médico</option>')) {
    const uiOld = `          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome</label>
            <div style={{ position: 'relative' }}>
               <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
               <input type="text" placeholder="Nome do atleta..." value={busca} onChange={e => setBusca(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0 }} />
            </div>
          </div>`;
          
    const uiNew = `          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome</label>
            <div style={{ position: 'relative' }}>
               <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
               <input type="text" placeholder="Nome do atleta..." value={busca} onChange={e => setBusca(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Status Médico</label>
            <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
              <option value="">Todos</option>
              <option value="Apto">Apto</option>
              <option value="Departamento Médico">Departamento Médico</option>
              <option value="Transição">Transição</option>
            </select>
          </div>`;
          
    athletes = athletes.replace(uiOld, uiNew);
}

// Ensure UTF-8 issues are resolved (if any)
athletes = athletes.replace('Departamento MÃ©dico', 'Departamento Médico');

fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');

// STAFF PATCH
let staff = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');
if (!staff.includes('window.scrollTo')) {
    const handleEditarOld = `  const handleEditar = (t) => {
    setIsEditing(true);
    setForm({
      id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil, foto: t.foto || '',
      categorias: t.categorias ? t.categorias.map(c => c.id) : []
    });
  };`;
    const handleEditarNew = `  const handleEditar = (t) => {
    setIsEditing(true);
    setForm({
      id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil, foto: t.foto || '',
      categorias: t.categorias ? t.categorias.map(c => c.id) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };`;
    staff = staff.replace(handleEditarOld, handleEditarNew);
    fs.writeFileSync('crm/src/pages/Staff.jsx', staff, 'utf8');
}

console.log('Athletes and Staff double-checked');
