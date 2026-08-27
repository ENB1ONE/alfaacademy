const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Attendance.jsx', 'utf8');

// Add State
code = code.replace(
    /const \[tipo, setTipo\] = useState\('TREINO'\);/,
    "const [tipo, setTipo] = useState('TREINO');\n  const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);"
);

// Add Data param to API call
code = code.replace(
    /return api\.post\('\/api\/admin\/chamadas', \{ categoria_id: catId, presencas: payload, titulo, tipo \}\);/g,
    "return api.post('/api/admin/chamadas', { categoria_id: catId, presencas: payload, titulo, tipo, data: dataChamada });"
);

// Inject Date Input
const inputRegex = /<div style=\{\{ flex: '1 1 200px' \}\}>\s*<label style=\{\{ display: 'block', marginBottom: 5, color: 'var\(--cinza\)', fontSize: 14 \}\}>Tipo<\/label>\s*<select value=\{tipo\} onChange=\{e => setTipo\(e\.target\.value\)\} style=\{\{ margin: 0 \}\}>\s*<option value="TREINO">Treino<\/option>\s*<option value="JOGO">Jogo Oficial<\/option>\s*<option value="AVALIACAO">Avalia[^<]+<\/option>\s*<\/select>\s*<\/div>/;

const newBlock = `<div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ margin: 0 }}>
                  <option value="TREINO">Treino</option>
                  <option value="JOGO">Jogo Oficial</option>
                  <option value="AVALIACAO">Avaliação Física</option>
              </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)', fontSize: 14 }}>Data da Chamada (Retroativa)</label>
              <input type="date" value={dataChamada} onChange={e => setDataChamada(e.target.value)} style={{ margin: 0 }} />
          </div>`;

if (inputRegex.test(code)) {
    code = code.replace(inputRegex, newBlock);
    fs.writeFileSync('crm/src/pages/Attendance.jsx', code, 'utf8');
    console.log('Attendance.jsx patched successfully.');
} else {
    console.log('Regex did not match in Attendance.jsx.');
}
