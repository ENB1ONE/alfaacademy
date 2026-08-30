import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Download, Search, Filter, Activity, Users, FileText, PieChart as PieIcon, LayoutTemplate, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#a855f7', '#f97316', '#06b6d4'];

export default function CentralRelatorios() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'generator'
  
  // ==========================================
  // DASHBOARD STATE
  // ==========================================
  const [loading, setLoading] = useState(true);
  const [atletas, setAtletas] = useState([]);
  const [faltosos, setFaltosos] = useState([]);
  const [distCategoria, setDistCategoria] = useState([]);
  const [distPosicao, setDistPosicao] = useState([]);
  const [distPe, setDistPe] = useState([]);
  const [distMedico, setDistMedico] = useState([]);

  // ==========================================
  // GENERATOR STATE
  // ==========================================
  const [modulo, setModulo] = useState('');
  const [filtros, setFiltros] = useState({});
  const [reportData, setReportData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [exportingDashboard, setExportingDashboard] = useState(false);
  const [exportingA4, setExportingA4] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAtletas, resMetricas] = await Promise.all([
          api.get('/api/admin/atletas'),
          api.get('/api/admin/metricas')
        ]);
        
        const list = Array.isArray(resAtletas.data) ? resAtletas.data : (resAtletas.data?.atletas || []);
        setAtletas(list);
        setFaltosos(resMetricas.data.top_faltosos || []);

        const catCounts = {};
        const posCounts = {};
        const peCounts = {};
        const medCounts = {};

        list.forEach(a => {
            const cat = a.categoria_nome || a.categoria || 'Sem Cat.';
            catCounts[cat] = (catCounts[cat] || 0) + 1;
            const pos = a.posicao || 'Sem Pos.';
            posCounts[pos] = (posCounts[pos] || 0) + 1;
            const pe = a.pe_dominante || 'Não Informado';
            peCounts[pe] = (peCounts[pe] || 0) + 1;
            const med = a.status_medico || 'Apto';
            medCounts[med] = (medCounts[med] || 0) + 1;
        });

        setDistCategoria(Object.keys(catCounts).map(k => ({ name: k, total: catCounts[k] })));
        setDistPosicao(Object.keys(posCounts).map(k => ({ name: k, total: posCounts[k] })));
        setDistPe(Object.keys(peCounts).map(k => ({ name: k, value: peCounts[k] })));
        setDistMedico(Object.keys(medCounts).map(k => ({ name: k, value: medCounts[k] })));
        
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGerarRelatorio = async () => {
    if (!modulo) return alert('Selecione um módulo');
    setGenerating(true);
    try {
        const res = await api.post('/api/admin/relatorios/gerador', { modulo, filtros });
        if (res.data.success) {
            setReportData(res.data.dados);
        } else {
            alert('Erro ao gerar dados');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao gerar relatório');
    }
    setGenerating(false);
  };

  
  const exportDashboardPDF = async () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    setExportingDashboard(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const opt = {
      margin:       [10, 10, 15, 10], // margin in mm
      filename:     `Dashboard_Executivo_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, width: 794, windowWidth: 794 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr'] }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        setExportingDashboard(false);
    }).catch(() => {
        setExportingDashboard(false);
    });
  };

  const exportPDF = async () => {
    const element = document.getElementById('a4-preview');
    const wrapper = document.getElementById('a4-preview-wrapper');
    if (!element) return;
    
    setExportingA4(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const origOverflow = wrapper ? wrapper.style.overflowX : 'auto';
    if (wrapper) wrapper.style.overflowX = 'visible';

    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     `Relatorio_${modulo}_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, width: 794, windowWidth: 794 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr'] }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        if (wrapper) wrapper.style.overflowX = origOverflow;
        setExportingA4(false);
    }).catch(() => {
        if (wrapper) wrapper.style.overflowX = origOverflow;
        setExportingA4(false);
    });
  };

  return (
    <div style={{ color: 'var(--texto)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ color: 'var(--ouro)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={28} /> Central de Relatórios
          </h1>
          <p style={{ color: 'var(--cinza)', marginTop: 5 }}>Visão analítica completa e exportação de documentos</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 15, marginBottom: 30, borderBottom: '1px solid var(--linha)', paddingBottom: 10 }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'dashboard' ? 'var(--ouro)' : 'var(--cinza)', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <PieIcon size={18}/> Dashboard Analítico
        </button>
        <button 
          onClick={() => setActiveTab('generator')} 
          style={{ background: 'transparent', border: 'none', color: activeTab === 'generator' ? 'var(--ouro)' : 'var(--cinza)', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <LayoutTemplate size={18}/> Gerador A4 (BI)
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button className="btn primary" onClick={exportDashboardPDF} disabled={exportingDashboard} style={{ display: 'flex', gap: 8, alignItems: 'center', background: exportingDashboard ? '#666' : 'var(--ouro)', color: exportingDashboard ? '#ccc' : '#000', fontWeight: 'bold', cursor: exportingDashboard ? 'wait' : 'pointer' }}>
              <Download size={18} /> {exportingDashboard ? 'Processando PDF...' : 'Baixar Relatório Executivo'}
            </button>
          </div>
          {loading ? (
            <p style={{ color: 'var(--cinza)' }}>Carregando dados estatísticos...</p>
          ) : (
            <div style={{ display: 'block', gap: 20 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
                <div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>Distribuição por Categoria</h3>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={distCategoria} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={120} stroke="var(--cinza)" fontSize={11} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: 'var(--ouro)' }} />
                        <Bar dataKey="total" fill="var(--ouro)" radius={[0, 4, 4, 0]} barSize={25} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ color: '#fff', margin: 0 }}>Top Atletas Faltosos</h3>
                  </div>
                  <div style={{ height: 250 }}>
                    {faltosos.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={faltosos} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="nome" type="category" width={120} stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} />
                          <Bar dataKey="faltas" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={25} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p style={{ color: 'var(--cinza)', textAlign: 'center', marginTop: 100 }}>Nenhuma falta registrada.</p>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                <div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>Status MÃ©dico</h3>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distMedico} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                          {distMedico.map((entry, index) => <Cell key={"cell-" + index} fill={entry.name === 'Apto' ? '#22c55e' : entry.name === 'Lesionado' ? '#ef4444' : COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>PÃ© Dominante</h3>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distPe} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {distPe.map((entry, index) => <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>Distribuição por Posição</h3>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distPosicao} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="var(--cinza)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--cinza)" fontSize={11} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: '#06b6d4' }} />
                        <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {activeTab === 'generator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 30 }}>
            {/* Construtor Visual */}
            <div className="card" style={{ padding: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ color: 'var(--ouro)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><Search size={20} /> Construtor de Relatório</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Módulo do Relatório</label>
                        <select className="input" value={modulo} onChange={(e) => { setModulo(e.target.value); setFiltros({}); }} style={{ width: '100%' }}>
                            <option value="">Selecione o módulo...</option>
                            <option value="elenco">Elenco Completo</option>
                            <option value="presencas">Histórico de Presenças</option>
                            <option value="jogos">Partidas / Jogos</option>
                        </select>
                    </div>

                    {/* Filtros Dinâmicos */}
                    {(modulo === 'elenco' || modulo === 'presencas' || modulo === 'jogos') && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Filtrar Categoria</label>
                            <select className="input" value={filtros.categoria || ''} onChange={(e) => setFiltros({...filtros, categoria: e.target.value})} style={{ width: '100%' }}>
                                <option value="">Todas as Categorias</option>
                                {[...new Set(distCategoria.map(c => c.name))].map((c, i) => (
                                    <option key={i} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {modulo === 'elenco' && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Status MÃ©dico</label>
                            <select className="input" value={filtros.status_medico || ''} onChange={(e) => setFiltros({...filtros, status_medico: e.target.value})} style={{ width: '100%' }}>
                                <option value="">Todos</option>
                                <option value="Apto">Apto</option>
                                <option value="Lesionado">Lesionado</option>
                            </select>
                        </div>
                    )}

                    {modulo === 'presencas' && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico</label>
                            <select className="input" value={filtros.atleta_id || ''} onChange={(e) => setFiltros({...filtros, atleta_id: e.target.value})} style={{ width: '100%' }}>
                                <option value="">Todos os Atletas</option>
                                {atletas
                                  .filter(a => !filtros.categoria || a.categoria_nome === filtros.categoria || a.categoria === filtros.categoria)
                                  .sort((a,b) => a.nome.localeCompare(b.nome))
                                  .map(a => (
                                    <option key={a.id} value={a.id}>{a.nome}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(modulo === 'presencas' || modulo === 'jogos') && (
                        <>
                            <div style={{ flex: '1 1 140px' }}>
                                <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Data Inicial</label>
                                <input type="date" className="input" value={filtros.data_inicio || ''} onChange={(e) => setFiltros({...filtros, data_inicio: e.target.value})} style={{ width: '100%', colorScheme: 'dark' }} />
                            </div>
                            <div style={{ flex: '1 1 140px' }}>
                                <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Data Final</label>
                                <input type="date" className="input" value={filtros.data_fim || ''} onChange={(e) => setFiltros({...filtros, data_fim: e.target.value})} style={{ width: '100%', colorScheme: 'dark' }} />
                            </div>
                        </>
                    )}
                    
                    <div style={{ flex: '1 1 150px' }}>
                        <button className="btn primary" onClick={handleGerarRelatorio} disabled={!modulo || generating} style={{ width: '100%' }}>
                            {generating ? 'Processando...' : 'Gerar Visualização'}
                        </button>
                    </div>
                </div>
            </div>

            {/* A4 Preview */}
            <div style={{ display: 'block', gap: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ color: 'var(--texto)' }}>Preview A4</h3>
                    {reportData && (
                        <button className="btn primary" onClick={exportPDF} disabled={exportingA4} style={{ display: 'flex', alignItems: 'center', gap: 8, background: exportingA4 ? '#666' : 'var(--ouro)', color: exportingA4 ? '#ccc' : '#000', cursor: exportingA4 ? 'wait' : 'pointer' }}>
                            <Download size={18} /> {exportingA4 ? 'Processando...' : 'Baixar PDF Executivo'}
                        </button>
                    )}
                </div>
                
                <div id="a4-preview-wrapper" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflowX: 'auto', background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div id="a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', 
                        background: '#ffffff',
                        padding: '20px 40px',
                        boxSizing: 'border-box'
                    }}>
                        {/* A4 Header */}
                        <div style={{ borderBottom: '3px solid #eab308', paddingBottom: '15px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ flex: '0 0 100px' }}>
                                    <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                        {modulo === 'elenco' ? 'Relatório de Elenco' : modulo === 'presencas' ? 'Histórico de Presenças' : modulo === 'jogos' ? 'Relatório de Partidas' : 'Relatório Dinâmico'}
                                    </h2>
                                </div>
                                <div style={{ flex: '0 0 100px' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ textAlign: 'left', color: '#555' }}>
                                    {filtros.atleta_id && (
                                        <h3 style={{ margin: '0 0 4px 0', color: '#111', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {atletas.find(a => a.id.toString() === filtros.atleta_id.toString())?.nome || filtros.atleta_id}
                                        </h3>
                                    )}
                                    {filtros.categoria && (
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#666' }}>
                                            Categoria: {filtros.categoria}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '10px', lineHeight: '1.4' }}>
                                    {filtros.data_inicio && filtros.data_fim && (
                                        <div style={{ marginBottom: 4 }}>
                                            Período:<br/>
                                            <strong style={{ color: '#333', fontSize: '12px' }}>
                                                {new Date(filtros.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(filtros.data_fim + 'T12:00:00').toLocaleDateString('pt-BR')}
                                            </strong>
                                        </div>
                                    )}
                                    Gerado em:<br/>
                                    <strong style={{ color: '#333', fontSize: '11px' }}>
                                        {new Date().toLocaleDateString('pt-BR')} Ã s {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards for Presence */}
                        {modulo === 'presencas' && reportData && reportData.length > 0 && filtros.atleta_id && (
                            <div className="section-card" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                {(() => {
                                    const total = reportData.length;
                                    const p = reportData.filter(r => r.status === 'P' || r.status === 'Presente').length;
                                    const f = reportData.filter(r => r.status === 'F' || r.status === 'Falta').length;
                                    const freq = total > 0 ? ((p / total) * 100).toFixed(1) : 0;
                                    return (
                                        <>
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
                                            <div style={{ flex: 1, padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#334155', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>% Frequência</div>
                                                <div style={{ fontSize: '24px', color: freq >= 70 ? '#15803d' : freq >= 50 ? '#b45309' : '#b91c1c', fontWeight: '900' }}>{freq}%</div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {/* A4 Body (Table) */}
                        {!reportData ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>
                                Configure os filtros acima e clique em "Gerar Visualização"
                            </div>
                        ) : reportData.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: 100, fontStyle: 'italic' }}>
                                Nenhum dado encontrado para os filtros selecionados.
                            </div>
                        ) : (
                            modulo === 'jogos' ? (
                            <div className="jogos-report">
                                {/* Tabela de Resumo */}
                                <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Resumo de Partidas</h3>
                                <table style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '15%', textAlign: 'center' }}>Data</th>
                                            <th style={{ width: '35%' }}>Adversário</th>
                                            <th style={{ width: '25%' }}>Categoria</th>
                                            <th style={{ width: '25%' }}>Campeonato</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, idx) => {
                                            const dt = row.data_jogo ? new Date(row.data_jogo).toLocaleDateString('pt-BR') : '-';
                                            return (
                                                <tr key={idx}>
                                                    <td className="num-cell" style={{ textAlign: 'center' }}>{dt}</td>
                                                    <td className="text-cell"><strong>{row.adversario || '-'}</strong></td>
                                                    <td className="text-cell">{row.categoria || '-'}</td>
                                                    <td className="text-cell">{row.campeonato || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Detalhamento por Jogo */}
                                {reportData.map((row, idx) => {
                                    const dt = row.data_jogo ? new Date(row.data_jogo).toLocaleDateString('pt-BR') : '-';
                                    const detalhes = row.detalhes || [];
                                    
                                    const totalConvocados = detalhes.filter(d => d.convocado).length;
                                    const totalCompareceram = detalhes.filter(d => d.compareceu).length;

                                    if (detalhes.length === 0) return null;

                                    return (
                                        <div className="bloco-jogo" key={`det-${idx}`} style={{ marginTop: '25px' }}>
                                            <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 10, fontSize: 14, textTransform: 'uppercase', backgroundColor: '#f8f9fa', padding: '8px' }}>
                                                {dt} - {row.adversario || 'Jogo'}
                                            </h3>
                                            <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px', fontWeight: 'bold' }}>
                                                Convocados: {totalConvocados} | Compareceram: {totalCompareceram}
                                            </p>
                                            <table style={{ tableLayout: 'fixed', width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '60%' }}>Nome do Atleta</th>
                                                        <th style={{ width: '20%', textAlign: 'center' }}>Convocado</th>
                                                        <th style={{ width: '20%', textAlign: 'center' }}>Compareceu</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detalhes.map((det, i) => (
                                                        <tr key={i}>
                                                            <td className="text-cell">{det.nome || '-'}</td>
                                                            <td className="num-cell" style={{ textAlign: 'center', color: det.convocado ? '#16a34a' : '#666' }}>
                                                                {det.convocado ? 'Sim' : 'Não'}
                                                            </td>
                                                            <td className="num-cell" style={{ textAlign: 'center', color: det.compareceu ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                                                                {det.compareceu ? 'Presente' : 'Ausente'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(reportData[0]).map(key => (
                                            <th key={key}>
                                                {key.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.entries(row).map(([key, val], i) => {
                                                let displayVal = val;
                                                
                                                if (key === 'status') {
                                                    if (val === 'P') displayVal = 'Presente';
                                                    else if (val === 'F') displayVal = 'Falta';
                                                }

                                                if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
                                                    displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                }
                                                displayVal = (displayVal && displayVal.toString().trim() !== '') ? displayVal : '-';
                                                const emptyClass = displayVal === '-' ? 'empty-cell' : '';
                                                
                                                // Center numbers and dates, left-align text
                                                const isNumOrDate = !isNaN(displayVal) || (typeof displayVal === 'string' && displayVal.includes('/'));
                                                
                                                return (
                                                    <td key={i} className={emptyClass} style={{ textAlign: isNumOrDate ? 'center' : 'left' }}>
                                                        {displayVal}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                        )}
                        
                        {/* A4 Footer */}
                        <div style={{ width: '100%', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #EAEAEA', textAlign: 'center', color: '#6C757D', fontSize: '10px' }}>
                  <strong style={{ fontWeight: 'bold' }}>Alfa Academy â€“ Formando Atletas e Cidadãos.</strong><br/>
                  Documento de uso interno e confidencial gerado automaticamente. É vedado o compartilhamento com terceiros sem autorização prÃ©via da coordenação esportiva.
              </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* HIDDEN EXECUTIVE DASHBOARD REPORT */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '794px', zIndex: -9999, opacity: 0.001, pointerEvents: 'none' }}>
          <div id="dashboard-a4-preview" className="pdf-export-container" style={{ width: '794px', minWidth: '794px', maxWidth: '794px', 
              width: '100%',
              
              background: '#ffffff',
              padding: '20px 40px',
              boxSizing: 'border-box'
          }}>
              <style>
{`
/* REGRAS RIGOROSAS DE IMPRESSÃO (PDF E CTRL+P) - MÉTODO SEGURO */
@media print {
    @page { size: A4 portrait; margin: 15mm; }
    
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    body * { visibility: hidden; }
    
    #a4-preview-wrapper, #a4-preview-wrapper * { 
        visibility: visible; 
    }
    
    #a4-preview-wrapper {
        position: absolute; 
        left: 0; 
        top: 0; 
        width: 100%; 
        margin: 0; 
        padding: 0; 
        background: white;
    }

    .btn, button, nav, .sidebar, .menu, header, footer, ::-webkit-scrollbar {
        display: none !important;
    }

    /* FIX 4: CORRIGIR A TABELA DE RESUMO (E OUTRAS TABELAS GERAIS) */
    .pdf-export-container table, #a4-preview table {
        display: table !important;
        width: 100% !important;
        table-layout: auto !important; /* Corrigido de fixed para auto */
        border-collapse: collapse !important;
        margin-bottom: 20px !important;
        background: #ffffff !important;
    }

    /* REDUZIR FONTE E PADDING DA TABELA PARA CABER */
    .pdf-export-container td, .pdf-export-container th,
    #a4-preview td, #a4-preview th {
        display: table-cell !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        padding: 4px !important;
        margin: 0 !important;
        line-height: 1.2 !important;
        height: auto !important;
        font-size: 11px !important; /* Reduzido levemente para caber horizontalmente */
        border: 1px solid #dee2e6 !important;
        color: #111111;
    }

    .pdf-export-container thead, #a4-preview thead { 
        display: table-header-group !important; 
    }
    .pdf-export-container tfoot, #a4-preview tfoot { 
        display: table-row-group !important; 
    }

    /* FIX 2: RESTAURAR BLOCO (REMOVER INLINE-BLOCK QUE CAUSOU TELA BRANCA) */
    .bloco-jogo {
        display: block !important;
        width: 100% !important;
        margin-bottom: 20px !important;
        background: #ffffff !important;
    }

    /* UM JOGO POR PÁGINA */
    .bloco-jogo:not(:first-of-type) {
        page-break-before: always !important;
        break-before: page !important;
    }

    /* FIX 3: EVITAR TÍTULOS ÓRFÃOS (MÉTODO SEGURO DE AMARRAÇÃO) */
    .bloco-jogo h2, 
    .bloco-jogo h3, 
    .bloco-jogo p, 
    .bloco-jogo .resumo-convocados {
        page-break-after: avoid !important;
        break-after: avoid !important;
        margin-bottom: 5px !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .bloco-jogo table {
        page-break-before: avoid !important;
        break-before: avoid !important;
    }

    /* PROTEGER AS LINHAS DA TABELA (SEM CORTAR AO MEIO) */
    .pdf-export-container tr, #a4-preview tr, tr {
        display: table-row !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: auto !important;
    }

    /* CABEÇALHOS PRETOS NA IMPRESSÃO */
    .pdf-export-container th {
        background-color: #111111 !important;
        color: #eab308 !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    /* CORES ZEBRADAS E UTILITÁRIOS */
    .pdf-export-container tr:nth-child(even) td {
        background-color: #f8f9fa !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
}

/* --------------------------------------------------- */
/* REGRAS GERAIS DE PREVIEW (TELA)                     */
/* --------------------------------------------------- */
.pdf-export-container, #a4-preview, #dashboard-a4-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #111111 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    padding: 0 !important;
    background: #ffffff !important;
    display: block !important; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.pdf-export-container table, #a4-preview table {
    display: table !important;
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
    table-layout: auto !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
}

.pdf-export-container thead, #a4-preview thead { display: table-header-group !important; }
.pdf-export-container tfoot, #a4-preview tfoot { display: table-row-group !important; }

.pdf-export-container tr, #a4-preview tr, tr {
    display: table-row !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-after: auto !important;
}

.pdf-export-container th, .pdf-export-container td, #a4-preview th, #a4-preview td {
    display: table-cell !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    padding: 4px !important;
    font-size: 11px !important;
    border: 1px solid #dee2e6 !important;
    color: #111111; 
}

.pdf-export-container th {
    background-color: #111111 !important;
    color: #eab308 !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.bloco-jogo {
    display: block !important;
    width: 100% !important;
    margin-bottom: 20px !important;
    background: #ffffff !important;
}

.bloco-jogo h3 {
    background-color: #f8f9fa !important;
    padding: 8px !important;
    margin-bottom: 5px !important;
    margin-top: 0 !important;
    break-after: avoid !important;
    page-break-after: avoid !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.bloco-jogo p {
    margin-bottom: 5px !important;
    margin-top: 0 !important;
    break-after: avoid !important;
    page-break-after: avoid !important;
}

.bloco-jogo table {
    page-break-before: avoid !important;
    break-before: avoid !important;
}

.pdf-export-container tr:nth-child(even) td {
    background-color: #f8f9fa !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.text-cell { text-align: left !important; color: #111111; }
.num-cell { text-align: center !important; }
.empty-cell { color: #999 !important; font-style: italic !important; }
`}
</style>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '10px', marginBottom: '15px' }}>
                  <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                  <div style={{ flex: 1, paddingLeft: '20px', paddingTop: '5px' }}>
                      <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                          Dashboard de Performance e Gestão de Atletas
                      </h2>
                      <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Relatório Analítico Executivo</p>
                  </div>
                  <div style={{ flex: '0 0 180px', minWidth: '180px', textAlign: 'right', color: '#6c757d', fontSize: '10px', lineHeight: '1.4', paddingTop: '5px' }}>
                      Gerado em:<br/>
                      <strong style={{ color: '#333', fontSize: '13px' }}>
                          {new Date().toLocaleDateString('pt-BR')} Ã s {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </strong>
                  </div>
              </div>

              {/* Distribuição por Categoria */}
              <div>
                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Distribuição por Categoria</h3>
                  <table>
                      <thead>
                          <tr>
                              <th style={{ width: '25%' }}>Categoria</th>
                              <th style={{ textAlign: "center", width: '15%' }}>Total</th>
                              <th style={{ textAlign: "center", width: '20%' }}>Novos (30 dias)</th>
                              <th style={{ textAlign: "center", width: '20%' }}>Desligamentos</th>
                              <th style={{ textAlign: "center", width: '20%' }}>Saldo</th>
                          </tr>
                      </thead>
                      <tbody>
                          {distCategoria.map((cat, i) => {
                              const catAtletas = atletas.filter(a => (a.categoria_nome || a.categoria || '') === cat.name);
                              const novos = catAtletas.filter(a => {
                                  if(!a.criado_em) return false;
                                  const diffDays = Math.ceil(Math.abs(new Date() - new Date(a.criado_em)) / (1000 * 60 * 60 * 24)); 
                                  return diffDays <= 30;
                              }).length;
                              
                              const displayCat = cat.name && cat.name.trim() !== '' ? cat.name : '-';
                              const emptyClass = displayCat === '-' ? ' empty-cell' : '';

                              return (
                                  <tr key={i}>
                                      <td className={`text-cell cap-text${emptyClass}`} title={displayCat}><strong>{displayCat}</strong></td>
                                      <td className="num-cell">{cat.total}</td>
                                      <td className="num-cell" style={{ color: novos > 0 ? '#16a34a' : '#333', fontWeight: novos > 0 ? 'bold' : 'normal' }}>
                                          {novos > 0 ? `â†‘ ${novos}` : '0'}
                                      </td>
                                      <td className="num-cell empty-cell">-</td>
                                      <td className="num-cell" style={{ fontWeight: 'bold' }}>{cat.total}</td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>

              {/* Status MÃ©dico (Lesionados) */}
              <div>
                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Departamento MÃ©dico (Lesionados)</h3>
                  {atletas.filter(a => a.status_medico === 'Lesionado').length > 0 ? (
                      <table>
                          <thead>
                              <tr>
                                  <th style={{ width: '25%' }}>Atleta</th>
                                  <th style={{ width: '15%' }}>Categoria</th>
                                  <th style={{ width: '15%' }}>Posição</th>
                                  <th style={{ textAlign: "center", width: '15%' }}>Data Registro</th>
                                  <th style={{ width: '15%' }}>Tipo Lesão</th>
                                  <th style={{ textAlign: "center", width: '10%' }}>Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {atletas.filter(a => a.status_medico === 'Lesionado').map((a, i) => {
                                  const nome = (a.nome && a.nome.trim() !== '') ? a.nome : '-';
                                  const cat = (a.categoria_nome || a.categoria || '').trim() !== '' ? (a.categoria_nome || a.categoria) : '-';
                                  const pos = (a.posicao && a.posicao.trim() !== '') ? a.posicao : '-';
                                  const dt = a.criado_em ? new Date(a.criado_em).toLocaleDateString('pt-BR') : '-';
                                  
                                  return (
                                      <tr key={i}>
                                          <td className={`text-cell${nome === '-' ? ' empty-cell' : ''}`}><strong>{nome}</strong></td>
                                          <td className={`text-cell cap-text${cat === '-' ? ' empty-cell' : ''}`}>{cat}</td>
                                          <td className={`text-cell cap-text${pos === '-' ? ' empty-cell' : ''}`}>{pos}</td>
                                          <td className={`num-cell${dt === '-' ? ' empty-cell' : ''}`}>{dt}</td>
                                          <td className="num-cell empty-cell">-</td>
                                          <td className="num-cell" style={{ color: '#dc2626', fontWeight: 'bold' }}>Lesionado</td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  ) : (
                      <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: 13, padding: '10px 0', marginBottom: 25 }}>Nenhum atleta lesionado no momento. DM Vazio.</p>
                  )}
              </div>

              {/* Mapeamento Tático & Top Faltosos (Side by side for better A4 usage) */}
              <div style={{ display: 'flex', gap: '30px' }}>
                  
                  {/* Mapeamento Tático */}
                  <div className="section-card" style={{ flex: 1 }}>
                      <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Mapeamento Tático</h3>
                      <table>
                          <thead>
                              <tr>
                                  <th style={{ width: '70%' }}>Posição</th>
                                  <th style={{ textAlign: "center", width: '30%' }}>Atletas</th>
                              </tr>
                          </thead>
                          <tbody>
                              {Array.from(new Set(atletas.map(a => (a.posicao && a.posicao.trim() !== '') ? a.posicao : '-'))).sort().map((pos, i) => {
                                  const qtd = atletas.filter(a => ((a.posicao && a.posicao.trim() !== '') ? a.posicao : '-') === pos).length;
                                  return (
                                      <tr key={i}>
                                          <td className={`text-cell cap-text${pos === '-' ? ' empty-cell' : ''}`}><strong>{pos}</strong></td>
                                          <td className="num-cell">{qtd}</td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>

                  {/* Faltosos */}
                  <div className="section-card" style={{ flex: 1 }}>
                      <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Índice de Ausências</h3>
                      {faltosos.length > 0 ? (
                          <table>
                              <thead>
                                  <tr>
                                      <th style={{ width: '75%' }}>Atleta</th>
                                      <th style={{ textAlign: "center", width: '25%' }}>Faltas</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {faltosos.map((f, i) => {
                                      const nome = (f.nome && f.nome.trim() !== '') ? f.nome : '-';
                                      return (
                                          <tr key={i}>
                                              <td className={`text-cell${nome === '-' ? ' empty-cell' : ''}`}><strong>{nome}</strong></td>
                                              <td className="num-cell" style={{ color: '#dc2626', fontWeight: 'bold' }}>{f.faltas}</td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      ) : (
                          <p style={{ color: '#6c757d', fontSize: 13, fontStyle: 'italic', padding: '10px 0' }}>Nenhum registro de falta.</p>
                      )}
                  </div>
              </div>

              {/* Footer */}
              <div style={{ width: '100%', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #EAEAEA', textAlign: 'center', color: '#6C757D', fontSize: '10px' }}>
                  <strong style={{ fontWeight: 'bold' }}>Alfa Academy â€“ Formando Atletas e Cidadãos.</strong><br/>
                  Documento de uso interno e confidencial gerado automaticamente. É vedado o compartilhamento com terceiros sem autorização prÃ©via da coordenação esportiva.
              </div>
          </div>
      </div>
    </div>
  );
}



