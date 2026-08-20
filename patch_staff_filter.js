const fs = require('fs');
let staffFile = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

// Add Search, Filter imports
staffFile = staffFile.replace(
    "import { Edit2, Trash2, X, UserPlus } from 'lucide-react';",
    "import { Edit2, Trash2, X, UserPlus, Search, Filter } from 'lucide-react';"
);

// Add filter states right after `const [isEditing, setIsEditing] = useState(false);`
staffFile = staffFile.replace(
    "const [isEditing, setIsEditing] = useState(false);",
    "const [isEditing, setIsEditing] = useState(false);\n  const [busca, setBusca] = useState('');\n  const [filtroPerfil, setFiltroPerfil] = useState('');"
);

// Add window.scrollTo to handleEditar
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

staffFile = staffFile.replace(handleEditarOld, handleEditarNew);
// In case the indentation is different, let's just use string replace on the exact setForm block
if (!staffFile.includes("window.scrollTo")) {
    staffFile = staffFile.replace(
        "categorias: t.categorias ? t.categorias.map(c => c.id) : []\n    });",
        "categorias: t.categorias ? t.categorias.map(c => c.id) : []\n    });\n    window.scrollTo({ top: 0, behavior: 'smooth' });"
    );
}

// Compute filtrados just before return
const filtradosCode = `
  const treinadoresFiltrados = treinadores.filter(t => {
    const matchBusca = t.nome.toLowerCase().includes(busca.toLowerCase()) || (t.usuario_lc && t.usuario_lc.toLowerCase().includes(busca.toLowerCase()));
    const matchPerfil = filtroPerfil ? t.perfil === filtroPerfil : true;
    return matchBusca && matchPerfil;
  });
`;
staffFile = staffFile.replace(
    "if (user?.perfil !== 'Administrador'",
    filtradosCode + "\n  if (user?.perfil !== 'Administrador'"
);

// Add the filter UI above the `<div className="responsive-grid-2">` which holds the mapped trainers.
// Wait, I need to see where it renders `treinadores.map`
const listStart = `<div className="responsive-grid-2">
          {treinadores.length === 0 ?`;

const filterUI = `
      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Filter size={18} /> Filtros Inteligentes</h4>
        <div className="filter-grid">
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome/Usuário</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--cinza)' }} />
              <input type="text" className="input" placeholder="Digite para buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', paddingLeft: 35 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Perfil</label>
            <select className="input" value={filtroPerfil} onChange={(e) => setFiltroPerfil(e.target.value)} style={{ width: '100%' }}>
              <option value="">Todos os Perfis</option>
              <option value="Administrador">Administrador</option>
              <option value="Treinador">Treinador</option>
            </select>
          </div>
        </div>
      </div>

      <div className="responsive-grid-2">
          {treinadoresFiltrados.length === 0 ?`;

staffFile = staffFile.replace(listStart, filterUI);
staffFile = staffFile.replace("treinadores.map(t => (", "treinadoresFiltrados.map(t => (");

fs.writeFileSync('crm/src/pages/Staff.jsx', staffFile, 'utf8');
console.log('Staff.jsx search filter added');
