import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import {  Activity, Plus, Edit, Trash2, Search, Filter, UserPlus , ClipboardCheck } from 'lucide-react';
import Cropper from 'react-easy-crop';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';

export default function Athletes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [atletas, setAtletas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', categoria_id: '', posicao: '', posicao_secundaria: '', pe_dominante: '', competicoes: '', clube_atual: '', peso: '', altura: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' });
  const [historyModal, setHistoryModal] = useState({ show: false, loading: false, atleta: null, data: null });
  const [exportingHistory, setExportingHistory] = useState(false);


  
  const openHistoryModal = async (atleta) => {
      setHistoryModal({ show: true, loading: true, atleta: atleta, data: null });
      try {
          const res = await api.post('/api/admin/relatorios/gerador', {
              modulo: 'presencas',
              filtros: { atleta_id: atleta.id }
          });
          if (res.data.success) {
              setHistoryModal({ show: true, loading: false, atleta: atleta, data: res.data.dados });
          } else {
              alert('Erro ao carregar histórico');
              setHistoryModal({ show: false, loading: false, atleta: null, data: null });
          }
      } catch (err) {
          console.error(err);
          alert('Erro ao buscar histórico');
          setHistoryModal({ show: false, loading: false, atleta: null, data: null });
      }
  };

  const exportHistoryPDF = async () => {
      const element = document.getElementById('history-a4-preview');
      if (!element) return;
      setExportingHistory(true);
      await new Promise(resolve => setTimeout(resolve, 100)); // wait for render
      const opt = {
          margin:       [10, 10, 15, 10],
          filename:     `Historico_Presenca_${historyModal.atleta.nome.replace(/\s+/g, '_')}.pdf`,
          image:        { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, useCORS: true, width: 794, windowWidth: 794 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], avoid: ['tr'] }
      };
      html2pdf().set(opt).from(element).save().then(() => {
          setExportingHistory(false);
      });
  };
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
      setFiltroStatus('Lesionado');
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
      setForm({ nome: '', categoria_id: '', posicao: '', posicao_secundaria: '', pe_dominante: '', competicoes: '', clube_atual: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' });
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
      let matchStatus = true;


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

    
      if (filtroStatus) {
        matchStatus = a.status_medico === filtroStatus;
      }

      return matchCat && matchTreinador && matchBusca && matchStatus;
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
        <button onClick={() => { setShowForm(!showForm); setEditMode(false); setForm({ nome: '', categoria_id: '', posicao: '', posicao_secundaria: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' }); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <div><label>Posição</label>
      <select value={form.posicao || ''} onChange={e=>setForm({...form, posicao: e.target.value})}>
          <option value="">Selecione...</option>
          <option value="Goleiro (GK)">Goleiro (GK)</option>
          <option value="Zagueiro (ZAG)">Zagueiro (ZAG)</option>
          <option value="Lateral Direito (LD)">Lateral Direito (LD)</option>
          <option value="Lateral Esquerdo (LE)">Lateral Esquerdo (LE)</option>
          <option value="Volante / Meio-Campista Defensivo (VOL)">Volante / Meio-Campista Defensivo (VOL)</option>
          <option value="Meia Central (MC)">Meia Central (MC)</option>
          <option value="Meia Armador / Meia Ofensivo (MEI)">Meia Armador / Meia Ofensivo (MEI)</option>
          <option value="Ponta Direita (PD)">Ponta Direita (PD)</option>
          <option value="Ponta Esquerda (PE)">Ponta Esquerda (PE)</option>
          <option value="Centroavante (CA)">Centroavante (CA)</option>
      </select>
  </div>
  <div><label>Posição Secundária (Opcional)</label>
      <select value={form.posicao_secundaria || ''} onChange={e=>setForm({...form, posicao_secundaria: e.target.value})}>
          <option value="">Nenhuma</option>
          <option value="Goleiro (GK)">Goleiro (GK)</option>
          <option value="Zagueiro (ZAG)">Zagueiro (ZAG)</option>
          <option value="Lateral Direito (LD)">Lateral Direito (LD)</option>
          <option value="Lateral Esquerdo (LE)">Lateral Esquerdo (LE)</option>
          <option value="Volante / Meio-Campista Defensivo (VOL)">Volante / Meio-Campista Defensivo (VOL)</option>
          <option value="Meia Central (MC)">Meia Central (MC)</option>
          <option value="Meia Armador / Meia Ofensivo (MEI)">Meia Armador / Meia Ofensivo (MEI)</option>
          <option value="Ponta Direita (PD)">Ponta Direita (PD)</option>
          <option value="Ponta Esquerda (PE)">Ponta Esquerda (PE)</option>
          <option value="Centroavante (CA)">Centroavante (CA)</option>
      </select>
  </div>
              <div><label>Pé Dominante</label><select value={form.pe_dominante || ''} onChange={e=>setForm({...form, pe_dominante: e.target.value})}><option value="">Selecione...</option><option value="Destro">Destro</option><option value="Canhoto">Canhoto</option><option value="Ambidestro">Ambidestro</option></select></div>
              <div><label>Peso (kg)</label><input type="number" step="0.1" value={form.peso || ''} onChange={e=>setForm({...form, peso: e.target.value})} placeholder="Ex: 75.5" /></div>
              <div><label>Altura (m)</label><input type="number" step="0.01" value={form.altura || ''} onChange={e=>setForm({...form, altura: e.target.value})} placeholder="Ex: 1.82" /></div>
              <div><label>Clube Atual</label><input type="text" value={form.clube_atual || ''} onChange={e=>setForm({...form, clube_atual: e.target.value})} placeholder="Ex: Alfa Academy" /></div>
              <div><label>Competições</label><input type="text" value={form.competicoes || ''} onChange={e=>setForm({...form, competicoes: e.target.value})} placeholder="Ex: Paulistão 2026" /></div>
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
            <div>
              <label style={{ fontSize: 12, color: 'var(--cinza)' }}>Status Médico</label>
              <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ marginTop: 0, marginBottom: 0 }}>
                <option value="">Todos</option>
                <option value="Apto">Apto</option>
                <option value="Lesionado">Lesionado</option>
                <option value="Transição">Transição</option>
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
            <div className="card" key={a.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Header Row: Avatar + Name + Position */}
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: 20, flexShrink: 0, overflow: 'hidden', cursor: 'pointer', border: '2px solid rgba(234,179,8,0.3)' }} onClick={() => navigate(`/perfil/${a.id}`)}>
                    {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (a.nome ? String(a.nome).charAt(0).toUpperCase() : '')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={() => navigate(`/perfil/${a.id}`)} title={a.nome}>{a.nome}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cinza)', fontWeight: '500', marginTop: 4, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={a.posicao ? (a.posicao + (a.posicao_secundaria ? ' / ' + a.posicao_secundaria : '')) : 'SEM POSIÇÃO'}>{a.posicao ? (a.posicao + (a.posicao_secundaria ? ' / ' + a.posicao_secundaria : '')) : 'SEM POSIÇÃO'}</span>
                  </div>
                </div>
                
                {/* Body Row: Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--cinza)' }}>Categoria</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%', textAlign: 'right' }}>{a.categoria || 'Sem Categoria'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 0', paddingBottom: 0 }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--cinza)' }}>Status Médico</span>
                    <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', background: a.status_medico === 'Lesionado' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: a.status_medico === 'Lesionado' ? '#ef4444' : '#22c55e', border: `1px solid ${a.status_medico === 'Lesionado' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                      {a.status_medico || 'Apto'}
                    </span>
                  </div>
                </div>

                {/* Footer Row: Actions */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', justifyContent: 'space-between' }}>
                    <button onClick={() => openHistoryModal(a)} title="Histórico de Presença" className="btn" style={{ padding: '8px 12px', background: 'rgba(248, 193, 70, 0.05)', color: 'var(--ouro)', border: '1px solid rgba(248, 193, 70, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}><ClipboardCheck size={16} /> <span style={{fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Histórico</span></button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" className="btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', flexShrink: 0 }}><Activity size={16} /></button>
                        <button onClick={() => handleEdit(a)} title="Editar" className="btn" style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(a.id)} title="Excluir" className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Trash2 size={16} /></button>
                    </div>
                </div>
              </div>
            ))
          )}
      </div>
    
      {/* HISTORY MODAL */}
      {historyModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', overflowY: 'auto' }}>
              <div style={{ width: '100%', maxWidth: '850px', background: '#111', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a' }}>
                      <div>
                          <h2 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>Histórico de Presença</h2>
                          <span style={{ color: 'var(--cinza)', fontSize: '0.85rem' }}>{historyModal.atleta?.nome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                          {!historyModal.loading && historyModal.data && (
                              <button className="btn" onClick={exportHistoryPDF} disabled={exportingHistory} style={{ background: 'var(--ouro)', color: '#000', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                                  {exportingHistory ? 'Gerando PDF...' : <><Download size={16} /> Baixar PDF</>}
                              </button>
                          )}
                          <button className="btn" onClick={() => setHistoryModal({ show: false, loading: false, atleta: null, data: null })} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Fechar</button>
                      </div>
                  </div>
                  
                  <div style={{ padding: '20px', overflowX: 'auto', background: '#1a1a1a' }}>
                      {historyModal.loading ? (
                          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ouro)' }}>Carregando histórico...</div>
                      ) : historyModal.data ? (
                          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                              <div id="history-a4-preview" style={{ width: '794px', minWidth: '794px', background: '#ffffff', padding: '20px 40px', boxSizing: 'border-box', color: '#111' }}>
                                  
                                  {/* A4 Header */}
                                  <div style={{ borderBottom: '3px solid #eab308', paddingBottom: '15px', marginBottom: '20px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                          <div style={{ flex: '0 0 100px' }}>
                                              <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                                          </div>
                                          <div style={{ flex: 1, textAlign: 'center' }}>
                                              <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                                  Histórico de Presenças
                                              </h2>
                                          </div>
                                          <div style={{ flex: '0 0 100px' }}></div>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                          <div style={{ textAlign: 'left', color: '#555' }}>
                                              <h3 style={{ margin: '0 0 4px 0', color: '#111', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                  {historyModal.atleta?.nome}
                                              </h3>
                                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#666' }}>
                                                  Categoria: {historyModal.atleta?.categoria || 'Sem Categoria'}
                                              </p>
                                          </div>
                                          <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '10px', lineHeight: '1.4' }}>
                                              Gerado em:<br/>
                                              <strong style={{ color: '#333', fontSize: '11px' }}>
                                                  {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                              </strong>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Summary Cards */}
                                  {(() => {
                                      const total = historyModal.data.length;
                                      const p = historyModal.data.filter(r => r.status === 'P' || r.status === 'Presente').length;
                                      const f = historyModal.data.filter(r => r.status === 'F' || r.status === 'Falta').length;
                                      const freq = total > 0 ? ((p / total) * 100).toFixed(1) : 0;
                                      return (
                                          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                              <div style={{ flex: 1, padding: '15px', background: '#f8f9fa', border: '1px solid #eaeaea', borderRadius: '8px', textAlign: 'center' }}>
                                                  <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Total de Treinos</div>
                                                  <div style={{ fontSize: '24px', color: '#111', fontWeight: '900' }}>{total}</div>
                                              </div>
                                              <div style={{ flex: 1, padding: '15px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center' }}>
                                                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Presenças</div>
                                                  <div style={{ fontSize: '24px', color: '#15803d', fontWeight: '900' }}>{p}</div>
                                              </div>
                                              <div style={{ flex: 1, padding: '15px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' }}>
                                                  <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Faltas</div>
                                                  <div style={{ fontSize: '24px', color: '#b91c1c', fontWeight: '900' }}>{f}</div>
                                              </div>
                                              <div style={{ flex: 1, padding: '15px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', textAlign: 'center' }}>
                                                  <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Frequência</div>
                                                  <div style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900' }}>{freq}%</div>
                                              </div>
                                          </div>
                                      );
                                  })()}

                                  {/* Table */}
                                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase', marginTop: '20px' }}>Detalhamento de Frequência</h3>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '30px' }}>
                                      <thead>
                                          <tr style={{ background: '#f8f9fa' }}>
                                              <th style={{ padding: '8px', borderBottom: '2px solid #dee2e6', textAlign: 'left', color: '#495057' }}>Data</th>
                                              <th style={{ padding: '8px', borderBottom: '2px solid #dee2e6', textAlign: 'center', color: '#495057' }}>Status</th>
                                              <th style={{ padding: '8px', borderBottom: '2px solid #dee2e6', textAlign: 'left', color: '#495057' }}>Justificativa</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {historyModal.data.map((row, idx) => {
                                              const st = row.status;
                                              const isF = st === 'F' || st === 'Falta';
                                              const stColor = isF ? '#ef4444' : '#22c55e';
                                              // Fallback date formatting
                                              let dstr = row.data_treino;
                                              if (dstr && !dstr.includes('T')) dstr += 'T12:00:00';
                                              return (
                                                  <tr key={idx}>
                                                      <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#111' }}>{row.data_treino ? new Date(dstr).toLocaleDateString('pt-BR') : '-'}</td>
                                                      <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: 'bold', color: stColor }}>{st}</td>
                                                      <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#666' }}>{row.justificativa || '-'}</td>
                                                  </tr>
                                              );
                                          })}
                                          {historyModal.data.length === 0 && (
                                              <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#999' }}>Nenhum registro encontrado.</td></tr>
                                          )}
                                      </tbody>
                                  </table>
                                  
                                  {/* A4 Footer */}
                                  <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#999', paddingBottom: '20px' }}>
                                      Alfa Academy - Formando Atletas e Cidadãos.<br/>
                                      Documento de uso interno e confidencial gerado automaticamente. É vedado o compartilhamento com terceiros sem autorização prévia da coordenação esportiva.
                                  </div>
                              </div>
                          </div>
                      ) : null}
                  </div>
              </div>
          </div>
      )}
</div>
  );
}
