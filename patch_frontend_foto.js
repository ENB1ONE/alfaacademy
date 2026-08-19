const fs = require('fs');

// --- 1. Athletes.jsx ---
let ath = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// Add Image Processor
const imgProcessor = `
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setForm({ ...form, foto: dataUrl });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
`;
ath = ath.replace("const handleEdit = (a) => {", imgProcessor + "\n  const handleEdit = (a) => {");
ath = ath.replace(/{ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto' }/g, "{ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' }");

// Form layout
const oldForm = `<div style={{ gridColumn: '1 / -1' }}><label>Nome Completo</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>`;
const newForm = `
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 15, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--linha)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--cinza)' }}>Foto</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label>Foto do Atleta</label>
                <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ width: '100%', padding: '10px 0' }} />
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label>Nome Completo</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>`;
ath = ath.replace(oldForm, newForm);

// List layout
const oldCardInitials = `<div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>{a.nome.charAt(0)}</div>`;
const newCardInitials = `
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16, overflow: 'hidden' }}>
                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
                  </div>`;
ath = ath.replace(oldCardInitials, newCardInitials);

fs.writeFileSync('crm/src/pages/Athletes.jsx', ath, 'utf8');

// --- 2. Overview.jsx ---
let ov = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
const oldOvInitials = `<div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                    {a.nome.charAt(0)}
                                </div>`;
const newOvInitials = `<div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
                                </div>`;
ov = ov.replace(oldOvInitials, newOvInitials);
fs.writeFileSync('crm/src/pages/Overview.jsx', ov, 'utf8');

// --- 3. Games.jsx ---
let gam = fs.readFileSync('crm/src/pages/Games.jsx', 'utf8');
const oldGamInitials = `<div style={{ width: 24, height: 24, borderRadius: 6, border: '2px solid', borderColor: isConvocated ? 'var(--ouro)' : 'var(--cinza)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: isConvocated ? 'var(--ouro)' : 'transparent' }}>
                                        {isConvocated && <CheckSquare size={16} color="#000" />}
                                    </div>`;
const newGamInitials = `
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 24, height: 24, borderRadius: 6, border: '2px solid', borderColor: isConvocated ? 'var(--ouro)' : 'var(--cinza)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isConvocated ? 'var(--ouro)' : 'transparent' }}>
                                            {isConvocated && <CheckSquare size={16} color="#000" />}
                                        </div>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--linha)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--cinza)', fontSize: 12, fontWeight: 'bold' }}>
                                            {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
                                        </div>
                                    </div>`;
gam = gam.replace(oldGamInitials, newGamInitials);
fs.writeFileSync('crm/src/pages/Games.jsx', gam, 'utf8');

// --- 4. AttendanceHistory.jsx ---
let hist = fs.readFileSync('crm/src/pages/AttendanceHistory.jsx', 'utf8');
const oldHistInitials = `<div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: 12 }}>
                                    {a.nome.charAt(0)}
                                </div>`;
const newHistInitials = `<div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: 12, overflow: 'hidden' }}>
                                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : a.nome.charAt(0)}
                                </div>`;
hist = hist.replace(oldHistInitials, newHistInitials);
fs.writeFileSync('crm/src/pages/AttendanceHistory.jsx', hist, 'utf8');

console.log("All files patched!");
