import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Activity, Plus, Edit, Trash2, Search, Filter, UserPlus } from 'lucide-react';
import Cropper from 'react-easy-crop';

export default function Athletes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [atletas, setAtletas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '', peso: '', altura: '' });

  // Crop States
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { user } = useContext(AuthContext);
  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);
  
  const [treinadores, setTreinadores] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTreinador, setFiltroTreinador] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');


  
  const loadTreinadores = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get('/api/admin/treinadores');
      setTreinadores(res.data.treinadores || []);
    } catch (e) { console.error(e); }
  };

  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias || res.data);
    } catch (e) { console.error(e); }
  };

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'dm') {
      setFiltroStatus('Departamento Médico');
    }
  }, [location.search]);

  const loadAtletas = async () => {
    try {
      const res = await api.get('/api/admin/atletas');
      setAtletas(res.data.atletas || res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAtletas(); loadCategorias(); loadTreinadores(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/api/admin/atletas/${editingId}`, form);
      } else {
        await api.post('/api/admin/atletas', form);
      }
      setShowForm(false);
      setEditMode(false);
      setEditingId(null);
      loadAtletas();
      setForm({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' });
    } catch (e) {
      alert('Erro ao salvar atleta');
    }
  };

  
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

  const handleEdit = (a) => {
    setForm(a);
    setEditingId(a.id);
    setEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este atleta?')) {
      try {
        await api.delete(`/api/admin/atletas/${id}`);
        loadAtletas();
      } catch (e) {
        alert('Erro ao excluir atleta');
      }
    }
  };

  const toggleDM = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Lesionado' ? 'Apto' : 'Lesionado';
    try {
      await api.put(`/api/admin/atletas/${id}/status`, { status_medico: newStatus });
      loadAtletas();
    } catch (e) {
      alert('Erro ao atualizar status');
    }
  };

  
  const tdStyle = { padding: '15px', borderBottom: '1px solid var(--linha)' };

  const rawList = Array.isArray(atletas) ? atletas : (atletas?.atletas || []);
  
  const list = rawList.filter(a => {
    let matchCat = true;
    let matchTreinador = true;
    let matchBusca = true;

    if (filtroCategoria) {
      matchCat = String(a.categoria_id) === String(filtroCategoria);
    }
    
    if (filtroTreinador && treinadores.length > 0) {
      const t = treinadores.find(tr => String(tr.id) === String(filtroTreinador));
      if (t && t.categorias) {
        matchTreinador = t.categorias.some(c => String(c.id) === String(a.categoria_id));
      } else {
        matchTreinador = false;
      }
    }

    if (busca) {
      matchBusca = (a.nome || '').toLowerCase().includes(busca.toLowerCase());
    }

    return matchCat && matchTreinador && matchBusca;
  });


  return (
    <div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ color: 'var(--ouro)' }}>Gestão de Atletas</h1>
        <button onClick={() => { setShowForm(!showForm); setEditMode(false); setForm({ nome: '', categoria_id: '', posicao: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' }); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Atleta
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 30 }}>
          <h3>{editMode ? 'Editar Atleta' : 'Cadastrar Novo Atleta'}</h3>
          <form onSubmit={handleSubmit} className="responsive-grid">
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--linha)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserPlus size={40} color="var(--cinza)" />}
                </div>
                <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  Escolher Imagem
                </label>
              </div>
            <div style={{ gridColumn: '1 / -1' }}><label>Nome Completo</label><input type="text" value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} required /></div>
            <div><label>Categoria</label><select value={form.categoria_id || ""} onChange={e=>setForm({...form, categoria_id: e.target.value})}><option value="">Selecione...</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            <div><label>Posição</label><input type="text" value={form.posicao} onChange={e=>setForm({...form, posicao: e.target.value})} placeholder="Ex: Atacante" /></div>
            <div><label>Nome do Responsável</label><input type="text" value={form.nome_responsavel} onChange={e=>setForm({...form, nome_responsavel: e.target.value})} /></div>
            <div><label>Telefone</label><input type="text" value={form.telefone_responsavel} onChange={e=>setForm({...form, telefone_responsavel: e.target.value})} /></div>
            <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn">{editMode ? 'Atualizar Atleta' : 'Salvar Atleta'}</button></div>
          </form>
        </div>
      )}


      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, color: 'var(--ouro)' }}><Filter size={18} /> Filtros de Pesquisa</h4>
        <div className="filter-grid">
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Buscar por Nome</label>
            <div style={{ position: 'relative' }}>
               <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
               <input type="text" placeholder="Nome do atleta..." value={busca} onChange={e => setBusca(e.target.value)} style={{ marginTop: 0, paddingLeft: 35, marginBottom: 0 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Filtrar Categoria</label>
            <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
              <option value="">Todas as Categorias</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          {isAdmin && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Filtrar Professor</label>
              <select value={filtroTreinador} onChange={e => setFiltroTreinador(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todos os Professores</option>
                {treinadores.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {list.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '20px', color: 'var(--cinza)' }}>Nenhum atleta encontrado.</div>
        ) : (
          list.map(a => (
            <div className="card" key={a.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/perfil/${a.id}`)}>
                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (a.nome ? a.nome.charAt(0) : '')}
                  </div>
                  <div>
                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => navigate(`/perfil/${a.id}`)}>{a.nome}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{a.posicao || 'Sem posição'}</span>
                </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" className="btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><Activity size={16} /></button>
                  <button onClick={() => handleEdit(a)} title="Editar" className="btn" style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(a.id)} title="Excluir" className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--linha)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--cinza)' }}>Categoria:</span>
                  <strong>{a.categoria}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ color: 'var(--cinza)' }}>Status Médico:</span>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500', background: a.status_medico === 'Lesionado' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: a.status_medico === 'Lesionado' ? '#ef4444' : '#22c55e' }}>
                    {a.status_medico || 'Apto'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
