const fs = require('fs');
let code = fs.readFileSync('crm/src/components/UploadVideo.jsx', 'utf8');

// Add the state for categoriaSelecionada
code = code.replace(
  /const \[atletaId, setAtletaId\] = useState\(""\);/,
  'const [atletaId, setAtletaId] = useState("");\n  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");'
);

// Inject the Categoria Select block right before the Atleta Select block
const oldAtletaBlock = `<label style={{ display: "block", marginBottom: "8px", color: "var(--cinza)" }}>
          Atleta
        </label>
        <select 
          className="input" 
          value={atletaId} 
          onChange={(e) => setAtletaId(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Selecione o atleta...</option>
          {atletas.map(a => (
            <option key={a.id} value={a.id}>{a.nome} ({a.categoria})</option>
          ))}
        </select>`;

const newBlocks = `{/* Dropdown Categoria */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--cinza)" }}>
          Categoria (Filtro)
        </label>
        <select 
          className="input" 
          value={categoriaSelecionada} 
          onChange={(e) => {
              setCategoriaSelecionada(e.target.value);
              setAtletaId(""); // Reseta o atleta ao mudar a categoria
          }}
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Todas as Categorias...</option>
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
        </select>`;

code = code.replace(oldAtletaBlock, newBlocks);

fs.writeFileSync('crm/src/components/UploadVideo.jsx', code, 'utf8');
console.log('UploadVideo component updated to include category filtering.');
