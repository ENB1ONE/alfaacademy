const fs = require('fs');
let code = fs.readFileSync('crm/src/components/UploadVideo.jsx', 'utf8');

const regex = /<div style=\{\{ marginBottom: "20px" \}\}>\s*<label style=\{\{ display: "block", marginBottom: "8px", color: "var\(--cinza\)" \}\}>\s*Atleta\s*<\/label>\s*<select\s*className="input"\s*value=\{atletaId\}\s*onChange=\{\(e\) => setAtletaId\(e\.target\.value\)\}\s*style=\{\{ width: "100%", padding: "10px" \}\}\s*>\s*<option value="">Selecione o atleta...<\/option>\s*\{atletas\.map\(a => \(\s*<option key=\{a\.id\} value=\{a\.id\}>\{a\.nome\} \(\{a\.categoria\}\)<\/option>\s*\)\)\}\s*<\/select>\s*<\/div>/;

const newBlock = `<div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--cinza)" }}>
          Categoria (Opcional)
        </label>
        <select 
          className="input" 
          value={categoriaSelecionada} 
          onChange={(e) => {
              setCategoriaSelecionada(e.target.value);
              setAtletaId(""); 
          }}
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Todas as Categorias</option>
          {Array.from(new Set(atletas.map(a => a.categoria).filter(Boolean))).sort().map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--cinza)" }}>
          Atleta
        </label>
        <select 
          className="input" 
          value={atletaId} 
          onChange={(e) => setAtletaId(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
          disabled={categoriaSelecionada !== "" && !atletas.some(a => a.categoria === categoriaSelecionada)}
        >
          <option value="">Selecione o atleta...</option>
          {(categoriaSelecionada ? atletas.filter(a => a.categoria === categoriaSelecionada) : atletas).map(a => (
            <option key={a.id} value={a.id}>{a.nome} {categoriaSelecionada ? '' : \`(\${a.categoria})\`}</option>
          ))}
        </select>
      </div>`;

if (regex.test(code)) {
    code = code.replace(regex, newBlock);
    fs.writeFileSync('crm/src/components/UploadVideo.jsx', code, 'utf8');
    console.log('UploadVideo successfully patched.');
} else {
    console.log('Regex did not match!');
}
