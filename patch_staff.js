const fs = require('fs');

let code = fs.readFileSync('crm/src/pages/Staff.jsx', 'utf8');

// 1. Add import
code = code.replace("import { Edit2, Trash2, X } from 'lucide-react';", "import { Edit2, Trash2, X, UserPlus } from 'lucide-react';\nimport Cropper from 'react-easy-crop';");

// 2. Add crop state and update form initial state
const formStateOld = "  const [form, setForm] = useState({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [] });";
const formStateNew = `  const [form, setForm] = useState({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [], foto: '' });
  
  // Crop States
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
`;
code = code.replace(formStateOld, formStateNew);

// 3. Update handleSalvar form reset
code = code.replace(
  "setForm({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [] });",
  "setForm({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [], foto: '' });"
);

// 4. Update handleEditar
const editOld = `    setForm({
      id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil,
      categorias: t.categorias ? t.categorias.map(c => c.id) : []
    });`;
const editNew = `    setForm({
      id: t.id, nome: t.nome, usuario_lc: t.usuario_lc, senha: '', perfil: t.perfil,
      categorias: t.categorias ? t.categorias.map(c => c.id) : [], foto: t.foto || ''
    });`;
code = code.replace(editOld, editNew);

// 5. Update form Cancel button
code = code.replace(
  "setForm({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [] });",
  "setForm({ id: null, nome: '', usuario_lc: '', senha: '', perfil: 'Treinador', categorias: [], foto: '' });"
); // Should hit both if didn't work for the second one.

// 6. Add cropper logic functions
const cropperFunctions = `
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        setCropImageSrc(reader.result);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };
    reader.readAsDataURL(file);
  };
  
  const confirmCrop = () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            400,
            400
        );
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm({...form, foto: base64});
        setCropImageSrc(null);
    };
    img.src = cropImageSrc;
  };

  if (user?.perfil !== 'Administrador' && user?.perfil !== 'admin') {`;
code = code.replace("  if (user?.perfil !== 'Administrador' && user?.perfil !== 'admin') {", cropperFunctions);


// 7. Inject Modal UI in return
const modalUI = `
      {cropImageSrc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', zIndex: 9999 }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <Cropper 
                    image={cropImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                />
            </div>
            <div style={{ padding: '20px', background: '#111', display: 'flex', justifyContent: 'space-between', paddingBottom: '40px' }}>
                <button type="button" className="btn" style={{ background: '#333' }} onClick={() => setCropImageSrc(null)}>Cancelar</button>
                <button type="button" className="btn primary" onClick={confirmCrop}>Recortar e Usar</button>
            </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>`;
code = code.replace("      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>", modalUI);

// 8. Inject Foto Input into Form
const formFoto = `          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--linha)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserPlus size={40} color="var(--cinza)" />}
            </div>
            <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              Escolher Imagem
            </label>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Nome</label>`;
code = code.replace("          <div style={{ gridColumn: '1 / -1' }}>\n            <label>Nome</label>", formFoto);

// 9. Update the Card rendering
const cardOld = `              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{t.nome}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{t.perfil}</span>
                </div>`;
const cardNew = `              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                    {t.foto ? <img src={t.foto} alt={t.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (t.nome ? t.nome.charAt(0) : '')}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{t.nome}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{t.perfil}</span>
                  </div>
                </div>`;
code = code.replace(cardOld, cardNew);

fs.writeFileSync('crm/src/pages/Staff.jsx', code, 'utf8');
console.log('Staff.jsx patched successfully');
