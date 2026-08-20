const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

const targetStr = `              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Categorias`;

const newFields = `              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Campeonato / Liga (Opcional)</label>
                <input className="input" value={form.campeonato || ''} onChange={e => setForm({...form, campeonato: e.target.value})} placeholder="Ex: Paulistão Sub-20" />
              </div>
              <div style={{ display: 'flex', gap: 15 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Horário (Opcional)</label>
                    <input type="time" className="input" value={form.horario || ''} onChange={e => setForm({...form, horario: e.target.value})} />
                  </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Observações (Opcional)</label>
                <textarea className="input" value={form.observacao || ''} onChange={e => setForm({...form, observacao: e.target.value})} placeholder="Instruções, local da partida, etc..." rows={3} />
              </div>
`;

if (!code.includes('Campeonato / Liga (Opcional)')) {
    code = code.replace(targetStr, newFields + targetStr);
}

fs.writeFileSync('crm/src/pages/Games.jsx', code, 'utf8');
console.log('Fields restored.');
