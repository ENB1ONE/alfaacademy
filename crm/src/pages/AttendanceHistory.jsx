import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Plus, X, Users } from 'lucide-react';

export default function AttendanceHistory() {
  const { user } = useContext(AuthContext);
  const isAdmin = ['Administrador', 'admin', 'Admin'].includes(user?.perfil);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [treinos, setTreinos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null); // { date: string, events: [] }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleCat, setScheduleCat] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('Jogo Oficial');
  
  // Detalhes do treino selecionado para ver presenças
  const [viewingTreinoId, setViewingTreinoId] = useState(null);
  const [viewingConvocadosId, setViewingConvocadosId] = useState(null);
  const [presencasDetail, setPresencasDetail] = useState([]);
  const [convocadosDetail, setConvocadosDetail] = useState([]);

  const loadConvocados = async (treino_ids, eventId) => {
    try {
        const res = await api.post('/api/admin/jogos/multi-convocados', { treino_ids });
        setConvocadosDetail(res.data.filter(a => a.convocado));
        setViewingConvocadosId(eventId);
        setViewingTreinoId(null);
    } catch (e) {
        alert("Erro ao carregar convocados");
    }
  };

  useEffect(() => {
    loadTreinos();
    loadCategorias();
  }, []);

  const loadTreinos = async () => {
    try {
      const res = await api.get('/api/admin/treinos');
      setTreinos(res.data.treinos || res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCategorias = async () => {
    try {
      const res = await api.get('/api/admin/categorias');
      setCategorias(res.data.categorias || res.data);
      if ((res.data.categorias || res.data).length > 0) {
          setScheduleCat((res.data.categorias || res.data)[0].id);
      }
    } catch (e) { console.error(e); }
  };

  const loadPresencas = async (viewId, subEventsArray) => {
    try {
      if (Array.isArray(subEventsArray)) {
          const promises = subEventsArray.map(subEvt => api.get(`/api/admin/treinos/${subEvt.id}/presencas`));
          const results = await Promise.all(promises);
          
          let combined = [];
          results.forEach((res, idx) => {
              const list = res.data.presencas || res.data || [];
              const subEvt = subEventsArray[idx];
              list.forEach(p => p.categoria_nome = subEvt.categoria_nome);
              combined = combined.concat(list);
          });
          
          combined.sort((a, b) => (a.atleta_nome || '').localeCompare(b.atleta_nome || ''));
          setPresencasDetail(combined);
          setViewingTreinoId(viewId);
      } else {
          const res = await api.get(`/api/admin/treinos/${viewId}/presencas`);
          setPresencasDetail(res.data.presencas || res.data || []);
          setViewingTreinoId(viewId);
      }
    } catch (e) { console.error(e); }
  };

  // Funções do Calendário
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const evts = treinos.filter(t => t.data.startsWith(dateStr));
    
    const grouped = evts.reduce((acc, evt) => {
        const isCustomEvent = evt.titulo && evt.titulo.trim() !== '' && evt.titulo !== 'Treino Regular';
        const key = isCustomEvent ? 'EVENTO_' + evt.titulo.trim().toLowerCase() : 'TREINO_' + evt.id;
        if (!acc[key]) acc[key] = { ...evt, sub_events: [evt] };
        else acc[key].sub_events.push(evt);
        return acc;
    }, {});
    
    return Object.values(grouped);
  };

  const openDay = (day) => {
    if (!day) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const evts = getEventsForDay(day);
    setSelectedDayEvents({ date: dateStr, day, events: evts });
    setViewingTreinoId(null);
    setIsModalOpen(true);
    setIsScheduleOpen(false);
  };

  const handleScheduleEvent = async () => {
    try {
      await api.post('/api/admin/eventos', {
        categoria_id: scheduleCat,
        data: selectedDayEvents.date,
        titulo: scheduleTitle,
        tipo: 'JOGO'
      });
      alert('Evento agendado com sucesso!');
      loadTreinos();
      setIsScheduleOpen(false);
      setIsModalOpen(false);
    } catch(e) {
      alert('Erro ao agendar evento.');
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--ouro)', marginBottom: 10 }}>Histórico & Agenda</h1>
      <p style={{ color: 'var(--cinza)', marginBottom: 20 }}>Navegue pelo calendário para ver presenças ou agendar jogos.</p>
      
      <div className="card" style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={handlePrevMonth} className="btn outline" style={{ padding: '8px 12px' }}><ChevronLeft size={20} /></button>
          <h2 style={{ margin: 0, color: 'var(--texto)' }}>{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={handleNextMonth} className="btn outline" style={{ padding: '8px 12px' }}><ChevronRight size={20} /></button>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, textAlign: 'center', marginBottom: 10 }}>
          {weekDays.map(wd => (
            <div key={wd} style={{ fontWeight: 'bold', color: 'var(--cinza)', fontSize: 14 }}>{wd}</div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {days.map((day, idx) => {
            const evts = getEventsForDay(day);
            const hasJogo = evts.some(e => e.tipo === 'JOGO' || (e.titulo && e.titulo !== 'Treino Regular'));
            
            return (
              <div 
                key={idx} 
                onClick={() => openDay(day)}
                style={{
                  minHeight: 90,
                  padding: '10px 5px',
                  background: hasJogo ? 'rgba(239, 68, 68, 0.15)' : (day ? 'rgba(255,255,255,0.03)' : 'transparent'), 
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  cursor: day ? 'pointer' : 'default',
                  border: day ? (isToday(day) ? '2px solid var(--ouro)' : (hasJogo ? '1px solid #EF4444' : '1px solid var(--linha)')) : 'none',
                  position: 'relative'
                }}
              >
                {day && (
                  <>
                    <span style={{ fontSize: 18, color: isToday(day) ? 'var(--ouro)' : 'var(--texto)', fontWeight: isToday(day) ? 'bold' : 'normal' }}>{day}</span>
                    <div style={{ display: 'flex', gap: 3, marginTop: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {evts.map(e => (
                         <div key={e.id} style={{ width: 6, height: 6, borderRadius: '50%', background: (e.tipo === 'JOGO' || (e.titulo && e.titulo !== 'Treino Regular')) ? '#EF4444' : 'var(--ouro)' }} title={e.titulo} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal do Dia */}
      {isModalOpen && selectedDayEvents && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', color: 'var(--cinza)' }}><X size={24} /></button>
            
            <h2 style={{ marginBottom: 5, color: 'var(--ouro)' }}>Dia {selectedDayEvents.day} de {monthNames[currentMonth]}</h2>
            
            {!isScheduleOpen ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ color: 'var(--cinza)' }}>{selectedDayEvents.events.length} evento(s) neste dia</span>
                        {isAdmin && (
                            <button onClick={() => setIsScheduleOpen(true)} className="btn" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', gap: 5, alignItems: 'center' }}><Plus size={16} /> Agendar Jogo Oficial</button>
                        )}
                    </div>

                    {selectedDayEvents.events.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: 40, color: 'var(--cinza)' }}>Nenhum evento registrado.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
{selectedDayEvents.events.map(gEvt => (
    <div key={gEvt.id} style={{ border: '1px solid var(--linha)', borderRadius: 8, padding: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h3 style={{ margin: 0, color: (gEvt.tipo === 'JOGO' || (gEvt.titulo && gEvt.titulo !== 'Treino Regular')) ? '#EF4444' : 'var(--texto)' }}>{gEvt.titulo || 'Treino'}</h3>
                <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                    {gEvt.sub_events.map(subEvt => (
                        <span key={subEvt.id} style={{ background: 'rgba(248,193,70,0.2)', border: '1px solid var(--ouro)', color: 'var(--ouro)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>
                            {subEvt.categoria_nome}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 10 }}>
                {(gEvt.tipo === 'JOGO' || (gEvt.titulo && gEvt.titulo !== 'Treino Regular')) && (
                    <button onClick={() => {
                        if (viewingConvocadosId === gEvt.id) setViewingConvocadosId(null);
                        else loadConvocados(gEvt.sub_events.map(s => s.id), gEvt.id);
                    }} className="btn outline" style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
                        {viewingConvocadosId === gEvt.id ? 'Ocultar Convocados' : 'Ver Convocados'}
                    </button>
                )}
                <button onClick={() => {
                    if (viewingTreinoId === gEvt.id) setViewingTreinoId(null);
                    else {
                        setViewingConvocadosId(null);
                        loadPresencas(gEvt.id, gEvt.sub_events);
                    }
                }} className="btn outline" style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap', border: viewingTreinoId === gEvt.id ? 'none' : '' }}>
                    {viewingTreinoId === gEvt.id ? 'Ocultar Presenças' : 'Ver Presenças'}
                </button>
            </div>
        </div>
        
        {viewingConvocadosId === gEvt.id && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, marginTop: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h4 style={{ margin: 0, color: 'var(--ouro)' }}>Lista de Convocados</h4>
                    {isAdmin && (
                        <button onClick={() => window.location.href = '#/jogos'} className="btn outline" style={{ padding: '4px 10px', fontSize: 12, border: 'none', background: 'rgba(248,193,70,0.1)', color: 'var(--ouro)' }}>
                            Gerenciar
                        </button>
                    )}
                </div>
                {convocadosDetail.length === 0 ? <p style={{ margin:0, color:'var(--cinza)' }}>Nenhum atleta convocado para este jogo.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 5 }}>
                        {convocadosDetail.map(a => (
                            <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, fontSize: 14 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: 12 }}>
                                    {a.nome.charAt(0)}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{a.nome}</div>
                                    <div style={{ fontSize: 11, color: 'var(--cinza)' }}>{a.categoria_nome || 'Categoria'}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
        
        {viewingTreinoId === gEvt.id && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, marginTop: 15 }}>
                {presencasDetail.length === 0 ? <p style={{ margin:0, color:'var(--cinza)' }}>Nenhum atleta na lista.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr', gap: 5 }}>
                        {presencasDetail.map(p => (
                            <li key={p.atleta_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, fontSize: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontWeight: 'bold' }}>{p.atleta_nome}</span>
                                    {p.categoria_nome && (
                                        <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 10, color: 'var(--cinza)' }}>
                                            {p.categoria_nome}
                                        </span>
                                    )}
                                </div>
                                <span style={{ color: p.status === 'P' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{p.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
    </div>
))}
                        </div>
                    )}
                </>
            ) : (
                <div style={{ marginTop: 20 }}>
                    <h3 style={{ marginBottom: 15 }}>Novo Jogo Oficial</h3>
                    <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Categoria</label>
                    <select value={scheduleCat} onChange={e => setScheduleCat(e.target.value)} style={{ marginBottom: 15 }}>
                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    
                    <label style={{ display: 'block', marginBottom: 5, color: 'var(--cinza)' }}>Título do Evento</label>
                    <input type="text" value={scheduleTitle} onChange={e => setScheduleTitle(e.target.value)} style={{ marginBottom: 20 }} />
                    
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={handleScheduleEvent} className="btn" style={{ flex: 1 }}>Confirmar Agendamento</button>
                        <button onClick={() => setIsScheduleOpen(false)} className="btn outline" style={{ flex: 1 }}>Cancelar</button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
