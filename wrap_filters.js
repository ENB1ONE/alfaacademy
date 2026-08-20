const fs = require('fs');
let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const oldFilter = `
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

const safeFilter = `
    let list = [];
    try {
      list = rawList.filter(a => {
        let matchCat = true;
        let matchTreinador = true;
        let matchBusca = true;
        let matchStatus = true;
    
        if (filtroCategoria) matchCat = String(a.categoria_id) === String(filtroCategoria);
        if (filtroTreinador && treinadores.length > 0) {
          const t = treinadores.find(tr => String(tr.id) === String(filtroTreinador));
          if (t && t.categorias && Array.isArray(t.categorias)) {
            matchTreinador = t.categorias.some(c => {
               if (typeof c === 'object') return String(c.id) === String(a.categoria_id);
               return String(c) === String(a.categoria_id);
            });
          } else {
            matchTreinador = false;
          }
        }
        if (busca) matchBusca = (a.nome || '').toLowerCase().includes(busca.toLowerCase());
        if (filtroStatus) matchStatus = a.status_medico === filtroStatus;
    
        return matchCat && matchTreinador && matchBusca && matchStatus;
      });
    } catch(e) {
      console.error("Filter error:", e);
      list = rawList; // fallback
    }`;

athletes = athletes.replace(oldFilter.trim(), safeFilter.trim());
fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');

// Ensure Staff.jsx also has a safe filter
let staff = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');
const oldStaffFilter = `
    const treinadoresFiltrados = treinadores.filter(t => {
      const matchBusca = (t.nome || '').toLowerCase().includes(busca.toLowerCase()) || (t.usuario_lc && (t.usuario_lc || 
'').toLowerCase().includes(busca.toLowerCase()));
      const matchPerfil = filtroPerfil ? t.perfil === filtroPerfil : true;
      return matchBusca && matchPerfil;
    });`;
const safeStaffFilter = `
    let treinadoresFiltrados = [];
    try {
      treinadoresFiltrados = treinadores.filter(t => {
        const matchBusca = (t.nome || '').toLowerCase().includes(busca.toLowerCase()) || (t.usuario_lc && (t.usuario_lc || '').toLowerCase().includes(busca.toLowerCase()));
        const matchPerfil = filtroPerfil ? t.perfil === filtroPerfil : true;
        return matchBusca && matchPerfil;
      });
    } catch(e) {
      console.error(e);
      treinadoresFiltrados = treinadores;
    }`;
staff = staff.replace(oldStaffFilter.trim(), safeStaffFilter.trim());
// fallback in case of newline differences
if (!staff.includes('try {')) {
    staff = staff.replace(
        /const treinadoresFiltrados = treinadores\.filter.*?return matchBusca && matchPerfil;\n    }\);/s,
        safeStaffFilter
    );
}

fs.writeFileSync('crm/src/pages/Staff.jsx', staff, 'utf8');
console.log('Filters wrapped in try/catch');
