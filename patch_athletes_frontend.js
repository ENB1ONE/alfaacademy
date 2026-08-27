const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// 1. Update form initial state and reset handlers
code = code.replace(
    /posicao: '', pe_dominante:/g,
    "posicao: '', posicao_secundaria: '', pe_dominante:"
);
code = code.replace(
    /posicao: '', nome_responsavel:/g,
    "posicao: '', posicao_secundaria: '', nome_responsavel:"
);

// 2. Replace the Posição select block
// Currently it's:
/*
  <div><label>Posição</label>
      <select value={form.posicao || ''} onChange={e=>setForm({...form, posicao: e.target.value})}>
          <option value="">Selecione...</option>
          <option value="Goleiro (GK)">Goleiro (GK)</option>
          <option value="Zagueiro (ZAG)">Zagueiro (ZAG)</option>
          <option value="Centroavante (CA)">Centroavante (CA)</option>
      </select>
  </div>
*/
// Wait, is it? Let me check the exact regex for Posição block. 
// I will just find <div><label>Posição</label> and replace until </div>.
// Actually, earlier I saw the positions were limited to GK, ZAG, CA in my output... wait! Did someone revert it? Or was my context grep truncated?
// Ah, the grep truncated it!
// Let's use a safe replace using index.

let startIndex = code.indexOf('<div><label>PosiÃ§Ã£o</label>');
if (startIndex === -1) startIndex = code.indexOf('<div><label>Posição</label>');

let endIndex = code.indexOf('</div>', startIndex) + 6; // closes the div

const positionOptions = `
          <option value="Goleiro (GK)">Goleiro (GK)</option>
          <option value="Zagueiro (ZAG)">Zagueiro (ZAG)</option>
          <option value="Lateral Direito (LD)">Lateral Direito (LD)</option>
          <option value="Lateral Esquerdo (LE)">Lateral Esquerdo (LE)</option>
          <option value="Volante / Meio-Campista Defensivo (VOL)">Volante / Meio-Campista Defensivo (VOL)</option>
          <option value="Meia Central (MC)">Meia Central (MC)</option>
          <option value="Meia Armador / Meia Ofensivo (MEI)">Meia Armador / Meia Ofensivo (MEI)</option>
          <option value="Ponta Direita (PD)">Ponta Direita (PD)</option>
          <option value="Ponta Esquerda (PE)">Ponta Esquerda (PE)</option>
          <option value="Centroavante (CA)">Centroavante (CA)</option>`;

const newPosBlocks = `<div><label>Posição</label>
      <select value={form.posicao || ''} onChange={e=>setForm({...form, posicao: e.target.value})}>
          <option value="">Selecione...</option>${positionOptions}
      </select>
  </div>
  <div><label>Posição Secundária (Opcional)</label>
      <select value={form.posicao_secundaria || ''} onChange={e=>setForm({...form, posicao_secundaria: e.target.value})}>
          <option value="">Nenhuma</option>${positionOptions}
      </select>
  </div>`;

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + newPosBlocks + code.substring(endIndex);
    fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
    console.log("Athletes.jsx successfully patched!");
} else {
    console.log("Could not find Posição block.");
}
