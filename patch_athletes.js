const fs = require('fs');
let content = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// Import useLocation
if (!content.includes('useLocation')) {
    content = content.replace(
        "import { useState, useEffect, useContext } from 'react';",
        "import { useState, useEffect, useContext } from 'react';\nimport { useLocation } from 'react-router-dom';"
    );
}

// Read location
if (!content.includes('const location = useLocation();')) {
    content = content.replace(
        "export default function Athletes() {",
        "export default function Athletes() {\n  const location = useLocation();"
    );
}

// Add state for status filter
if (!content.includes('const [filtroStatus, setFiltroStatus] = useState')) {
    content = content.replace(
        "const [busca, setBusca] = useState('');",
        "const [busca, setBusca] = useState('');\n  const [filtroStatus, setFiltroStatus] = useState('');"
    );
}

// Add useEffect to read status=dm from URL query string
const effectCode = `
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'dm') {
      setFiltroStatus('Departamento Médico');
    }
  }, [location.search]);
`;
if (!content.includes("params.get('status') === 'dm'")) {
    content = content.replace(
        "const loadAtletas = async () => {",
        effectCode + "\n  const loadAtletas = async () => {"
    );
}

// Update filter logic
const filterLogic = `
  const list = rawList.filter(a => {
    let matchCat = true;
    let matchTreinador = true;
    let matchBusca = true;
    let matchStatus = true;
    
    if (filtroCategoria) matchCat = String(a.categoria_id) === String(filtroCategoria);
    if (filtroTreinador) matchTreinador = (a.treinadores && a.treinadores.some(t => String(t.id) === String(filtroTreinador)));
    if (busca) matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    if (filtroStatus) matchStatus = a.status_medico === filtroStatus;
    
    return matchCat && matchTreinador && matchBusca && matchStatus;
  });
`;
content = content.replace(/const list = rawList\.filter.*?return matchCat && matchTreinador && matchBusca;\n  }\);/s, filterLogic);

// Add the Status filter in the UI next to "Busca"
const filterUI = `
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--cinza)' }} />
              <input type="text" className="input" placeholder="Digite para buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', paddingLeft: 35 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Status Médico</label>
            <select className="input" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '100%' }}>
              <option value="">Todos</option>
              <option value="Apto">Apto</option>
              <option value="Departamento Médico">Departamento Médico</option>
              <option value="Transição">Transição</option>
            </select>
          </div>
`;
content = content.replace(
    `<div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--cinza)' }} />
              <input type="text" className="input" placeholder="Digite para buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', paddingLeft: 35 }} />
            </div>
          </div>`,
    filterUI
);

// Add peso and altura to form state
content = content.replace(
    "status_medico: 'Apto', foto: ''",
    "status_medico: 'Apto', foto: '', peso: '', altura: ''"
);

// Add peso and altura to handleEdit
content = content.replace(
    "status_medico: a.status_medico || 'Apto', foto: a.foto || ''",
    "status_medico: a.status_medico || 'Apto', foto: a.foto || '', peso: a.peso || '', altura: a.altura || ''"
);

// Add fields in the form UI
const formUI = `
              <div style={{ display: 'flex', gap: 15 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Status Médico</label>
                  <select className="input" value={form.status_medico} onChange={(e) => setForm({...form, status_medico: e.target.value})} style={{ width: '100%' }}>
                    <option value="Apto">Apto</option>
                    <option value="Departamento Médico">Departamento Médico</option>
                    <option value="Transição">Transição</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Peso (kg)</label>
                  <input type="number" step="0.01" className="input" value={form.peso} onChange={(e) => setForm({...form, peso: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Altura (m)</label>
                  <input type="number" step="0.01" className="input" value={form.altura} onChange={(e) => setForm({...form, altura: e.target.value})} style={{ width: '100%' }} />
                </div>
              </div>
`;
content = content.replace(
    `<label style={{ display: 'block', marginBottom: 5 }}>Status Médico</label>
              <select className="input" value={form.status_medico} onChange={(e) => setForm({...form, status_medico: e.target.value})} style={{ width: '100%' }}>
                <option value="Apto">Apto</option>
                <option value="Departamento Médico">Departamento Médico</option>
                <option value="Transição">Transição</option>
              </select>`,
    formUI
);


// Save the file
fs.writeFileSync('crm/src/pages/Athletes.jsx', content, 'utf8');
console.log('Athletes.jsx updated');
