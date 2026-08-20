const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// 1. Update imports
if (!code.includes('UserPlus')) {
    code = code.replace("import { Activity, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';", "import { Activity, Plus, Edit, Trash2, Search, Filter, UserPlus } from 'lucide-react';");
}

// 2. Replace photo UI
const oldUI = `              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 15, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--linha)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--cinza)' }}>Foto</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label>Foto do Atleta</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '10px 0' }} />
                </div>
              </div>`;

const newUI = `              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--linha)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserPlus size={40} color="var(--cinza)" />}
                </div>
                <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  Escolher Imagem
                </label>
              </div>`;

// Account for Windows CRLF
const normalizedCode = code.replace(/\r\n/g, '\n');
const normalizedOldUI = oldUI.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedOldUI)) {
    code = normalizedCode.replace(normalizedOldUI, newUI);
} else {
    console.log("Could not find the UI block in Athletes.jsx");
}

// 3. Add autosave to confirmCrop
const oldCrop = `        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm({...form, foto: base64});
        setCropImageSrc(null);`;

const newCrop = `        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm({...form, foto: base64});
        
        if (editMode && editingId) {
            const payload = { ...form, foto: base64 };
            api.put(\`/api/admin/atletas/\${editingId}\`, payload).then(() => {
                loadAtletas();
            }).catch(e => console.error(e));
        }
        
        setCropImageSrc(null);`;

code = code.replace(oldCrop, newCrop);

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log('Athletes.jsx patched for UI and Auto-save.');
