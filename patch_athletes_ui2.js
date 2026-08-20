const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const regex = /<div style=\{\{ gridColumn: '1 \/ -1', display: 'flex', gap: 15, alignItems: 'center', marginBottom: 10 \}\}>[\s\S]*?<label>Foto do Atleta<\/label>[\s\S]*?<\/div>\s*<\/div>/;

const newUI = `<div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--linha)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserPlus size={40} color="var(--cinza)" />}
                </div>
                <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  Escolher Imagem
                </label>
              </div>`;

if (regex.test(code)) {
    code = code.replace(regex, newUI);
    fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
    console.log("Athletes UI replaced via regex.");
} else {
    console.log("Regex didn't match.");
}
