const fs = require('fs');
let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const regexPos = /<div><label>PosiÃ§Ã£o<\/label><input type="text" value=\{form\.posicao\} onChange=\{e=>setForm\(\{\.\.\.form, posicao: e\.target\.value\}\)\} placeholder="Ex: Atacante" \/><\/div>/;

const newInputs = `<div><label>Posição</label><input type="text" value={form.posicao || ''} onChange={e=>setForm({...form, posicao: e.target.value})} placeholder="Ex: Atacante" /></div>
              <div><label>Pé Dominante</label><select value={form.pe_dominante || ''} onChange={e=>setForm({...form, pe_dominante: e.target.value})}><option value="">Selecione...</option><option value="Destro">Destro</option><option value="Canhoto">Canhoto</option><option value="Ambidestro">Ambidestro</option></select></div>
              <div><label>Peso (kg)</label><input type="number" step="0.1" value={form.peso || ''} onChange={e=>setForm({...form, peso: e.target.value})} placeholder="Ex: 75.5" /></div>
              <div><label>Altura (m)</label><input type="number" step="0.01" value={form.altura || ''} onChange={e=>setForm({...form, altura: e.target.value})} placeholder="Ex: 1.82" /></div>
              <div><label>Clube Atual</label><input type="text" value={form.clube_atual || ''} onChange={e=>setForm({...form, clube_atual: e.target.value})} placeholder="Ex: Alfa Academy" /></div>
              <div><label>Competições</label><input type="text" value={form.competicoes || ''} onChange={e=>setForm({...form, competicoes: e.target.value})} placeholder="Ex: Paulistão 2026" /></div>`;

athletes = athletes.replace(regexPos, newInputs);

fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');
