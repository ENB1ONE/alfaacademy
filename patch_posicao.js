const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const oldInput = `<div><label>Posição</label><input type="text" value={form.posicao || ''} onChange={e=>setForm({...form, posicao: e.target.value})} placeholder="Ex: Atacante" /></div>`;

// Note: I have to match the encoded version from the previous output. Let's just use a regex.
const regex = /<div><label>Posi.{1,4}o<\/label><input type="text" value=\{form\.posicao \|\| ''\} onChange=\{e=>setForm\(\{\.\.\.form, posicao: e\.target\.value\}\)\} placeholder="Ex: Atacante" \/><\/div>/g;

const dropdown = `<div><label>Posição</label>
    <select value={form.posicao || ''} onChange={e=>setForm({...form, posicao: e.target.value})}>
        <option value="">Selecione...</option>
        <option value="Goleiro (GK)">Goleiro (GK)</option>
        <option value="Zagueiro (ZAG)">Zagueiro (ZAG)</option>
        <option value="Lateral Direito (LD)">Lateral Direito (LD)</option>
        <option value="Lateral Esquerdo (LE)">Lateral Esquerdo (LE)</option>
        <option value="Ala">Ala</option>
        <option value="Volante / Meio-Campista Defensivo (VOL)">Volante / Meio-Campista Defensivo (VOL)</option>
        <option value="Meia Central (MC)">Meia Central (MC)</option>
        <option value="Meia Armador / Meia Ofensivo (MEI)">Meia Armador / Meia Ofensivo (MEI)</option>
        <option value="Ponta Direita (PD)">Ponta Direita (PD)</option>
        <option value="Ponta Esquerda (PE)">Ponta Esquerda (PE)</option>
        <option value="Segundo Atacante (SA)">Segundo Atacante (SA)</option>
        <option value="Centroavante (CA)">Centroavante (CA)</option>
    </select>
</div>`;

if(regex.test(code)) {
    code = code.replace(regex, dropdown);
    fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
    console.log('Dropdown applied to Athletes.jsx');
} else {
    console.log('Regex failed to match Athletes.jsx');
}

let codeRel = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

// Also update the column css to prevent the breaks:
const oldCssRegex = /#dashboard-a4-preview th, #a4-preview th \{[\s\S]*?\}/;
const newCss = `#dashboard-a4-preview th, #a4-preview th {
                      background-color: #111111;
                      color: #eab308;
                      padding: 10px 4px;
                      font-size: 11px;
                      font-weight: bold;
                      text-transform: uppercase;
                      border: 1px solid #000;
                      letter-spacing: -0.2px;
                      white-space: normal;
                  }`;

if(oldCssRegex.test(codeRel)) {
    codeRel = codeRel.replace(oldCssRegex, newCss);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', codeRel, 'utf8');
    console.log('CSS fixed in CentralRelatorios.jsx');
} else {
    console.log('CSS regex failed.');
}

