const fs = require('fs');
let gam = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');

// 1. Fix Modal Overflow
gam = gam.replace(
    /width: '100%', maxWidth: 500, padding: 30, position: 'relative'/g,
    "width: '100%', maxWidth: 500, padding: 30, position: 'relative', maxHeight: '90vh', overflowY: 'auto'"
);

// 2. Remove Optional Fields
const oldFormContent = `<div>
                  <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Campeonato / Liga (Opcional)</label>
                  <input className="input" value={form.campeonato} onChange={e => setForm({...form, campeonato: e.target.value})} placeholder="Ex: Paulistão Sub-20" />
                </div>
                <div style={{ display: 'flex', gap: 15 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Horário (Opcional)</label>
                      <input type="time" className="input" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} />
                    </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Observações (Opcional)</label>
                  <textarea className="input" value={form.observacao} onChange={e => setForm({...form, observacao: e.target.value})} placeholder="Instruções, local da partida, etc..." rows={3} />
                </div>`;

gam = gam.replace(oldFormContent, "");

fs.writeFileSync('crm/src/pages/Games.jsx', gam, 'utf8');
