const fs = require('fs');

let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// 1. Update form initial state
athletes = athletes.replace(
  "setForm({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' })",
  "setForm({ nome: '', categoria_id: '', posicao: '', pe_dominante: '', competicoes: '', clube_atual: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' })"
);
athletes = athletes.replace(
  "const [form, setForm] = useState({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '', peso: '', altura: '' });",
  "const [form, setForm] = useState({ nome: '', categoria_id: '', posicao: '', pe_dominante: '', competicoes: '', clube_atual: '', peso: '', altura: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' });"
);

// 2. Add inputs to the form UI
const oldFormUI = `<div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Peso (kg)</label>
                  <input type="number" step="0.1" value={form.peso} onChange={e => setForm({...form, peso: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Altura (m)</label>
                  <input type="number" step="0.01" value={form.altura} onChange={e => setForm({...form, altura: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }} />
                </div>
              </div>`;

const newFormUI = `<div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Peso (kg)</label>
                  <input type="number" step="0.1" value={form.peso || ''} onChange={e => setForm({...form, peso: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Altura (m)</label>
                  <input type="number" step="0.01" value={form.altura || ''} onChange={e => setForm({...form, altura: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Pé Dominante</label>
                  <select value={form.pe_dominante || ''} onChange={e => setForm({...form, pe_dominante: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }}>
                    <option value="">Selecione</option>
                    <option value="Destro">Destro</option>
                    <option value="Canhoto">Canhoto</option>
                    <option value="Ambidestro">Ambidestro</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>Clube Atual</label>
                  <input type="text" value={form.clube_atual || ''} onChange={e => setForm({...form, clube_atual: e.target.value})} placeholder="Ex: Alfa Academy" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: 5 }}>Competições</label>
                <input type="text" value={form.competicoes || ''} onChange={e => setForm({...form, competicoes: e.target.value})} placeholder="Ex: 2026 Campeonato Paulista" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--linha)', color: 'white', borderRadius: '4px' }} />
              </div>`;

if(athletes.includes('Peso (kg)')) {
    athletes = athletes.replace(oldFormUI, newFormUI);
} else {
    // If the old UI string didn't match perfectly, let's inject after posicao
    const posRegex = /<select value=\{form\.posicao\} onChange=\{e => setForm\(\{\.\.\.form, posicao: e\.target\.value\}\)\} style=\{\{ width: '100%', padding: '10px', background: 'rgba\(255,255,255,0\.05\)', border: '1px solid var\(--linha\)', color: 'white', borderRadius: '4px' \}\}>\n\s*<option value="">Selecione a Posição<\/option>\n\s*<option value="Goleiro">Goleiro<\/option>\n\s*<option value="Zagueiro">Zagueiro<\/option>\n\s*<option value="Lateral Direito">Lateral Direito<\/option>\n\s*<option value="Lateral Esquerdo">Lateral Esquerdo<\/option>\n\s*<option value="Volante">Volante<\/option>\n\s*<option value="Meia">Meia<\/option>\n\s*<option value="Atacante">Atacante<\/option>\n\s*<\/select>\n\s*<\/div>\n\s*<\/div>/;
    
    athletes = athletes.replace(posRegex, `$&
              ${newFormUI}`);
}

fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');
console.log('Athletes.jsx form patched!');
