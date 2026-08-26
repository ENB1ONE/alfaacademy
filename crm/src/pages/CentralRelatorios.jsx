import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Download, Search, Filter, Activity, Users, FileText, PieChart as PieIcon, LayoutTemplate, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import html2pdf from 'html2pdf.js';

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

  
  const exportDashboardPDF = () => {
    const element = document.getElementById('dashboard-a4-preview');
    if (!element) return;
    
    // Temporarily make it block for html2canvas to render
    // Using off-screen rendering
    
    const opt = {
      margin:       [10, 10, 15, 10], // top, left, bottom, right
      filename:     `Dashboard_Executivo_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().from(element).set(opt).save();
  };

  const exportPDF = () => {
    const element = document.getElementById('a4-preview');
    if (!element) return;
    const opt = {
      margin:       [10, 10, 15, 10],
      filename:     `Relatorio_${modulo}_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 900 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    html2pdf().from(element).set(opt).save();
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
            <button className="btn primary" onClick={exportDashboardPDF} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--ouro)', color: '#000', fontWeight: 'bold' }}>
              <Download size={18} /> Baixar Relatório Executivo
            </button>
          </div>
          {loading ? (
            <p style={{ color: 'var(--cinza)' }}>Carregando dados estatísticos...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
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
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>Status Médico</h3>
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
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>Pé Dominante</h3>
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
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Status Médico</label>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ color: 'var(--texto)' }}>Preview A4</h3>
                    {reportData && (
                        <button className="btn primary" onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ouro)', color: '#000' }}>
                            <Download size={18} /> Baixar PDF Executivo
                        </button>
                    )}
                </div>
                
                <div style={{
                    width: '100%',
                    maxWidth: '900px',
                    margin: '0 auto',
                    overflowX: 'auto',
                    background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div id="a4-preview" style={{
                        minWidth: '800px',
                        background: '#ffffff',
                        padding: '40px',
                        boxSizing: 'border-box'
                    }}>
                        {/* A4 Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '20px', marginBottom: '30px' }}>
                            <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                            <div style={{ flex: 1, paddingLeft: '20px', paddingTop: '5px', textAlign: 'center' }}>
                                <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                    {modulo === 'elenco' ? 'Relatório de Elenco' : modulo === 'presencas' ? 'Histórico de Presenças' : modulo === 'jogos' ? 'Relatório de Partidas' : 'Relatório Dinâmico'}
                                </h2>
                                {filtros.categoria && <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Filtro Categoria: {filtros.categoria}</p>}
                                {filtros.data_inicio && filtros.data_fim && <p style={{ margin: '2px 0 0 0', color: '#555', fontSize: '12px', fontWeight: 500 }}>Período: {new Date(filtros.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(filtros.data_fim + 'T12:00:00').toLocaleDateString('pt-BR')}</p>}
                            </div>
                            <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px', minWidth: '150px' }}>
                                Gerado em:<br/>
                                <strong style={{ color: '#333', fontSize: '13px' }}>
                                    {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                            </div>
                        </div>

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
                                            {Object.values(row).map((val, i) => {
                                                let displayVal = val;
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
                        )}
                        
                        {/* A4 Footer */}
                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd', textAlign: 'center', color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Documento Confidencial • Gerado automaticamente via Alfa Academy BI
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* HIDDEN EXECUTIVE DASHBOARD REPORT */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '900px', zIndex: -9999, opacity: 0.001, pointerEvents: 'none' }}>
          <div id="dashboard-a4-preview" style={{
              width: '100%',
              
              background: '#ffffff',
              padding: '40px',
              boxSizing: 'border-box'
          }}>
              <style>
                  {`
                  #dashboard-a4-preview, #a4-preview {
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      color: #333333;
                  }
                  #dashboard-a4-preview table, #a4-preview table {
                      width: 100%;
                      border-collapse: collapse;
                      table-layout: fixed;
                      margin-bottom: 25px;
                  }
                  #dashboard-a4-preview th, #a4-preview th {
                      background-color: #111111;
                      color: #eab308;
                      padding: 10px 12px;
                      font-size: 13px;
                      font-weight: bold;
                      text-transform: uppercase;
                      border: 1px solid #000;
                      white-space: normal; word-wrap: break-word; overflow: visible;
                  }
                  #dashboard-a4-preview td, #a4-preview td {
                      padding: 9px 12px;
                      font-size: 12px;
                      color: #333333 !important;
                      border-bottom: 1px solid #dee2e6;
                      border-left: 1px solid #dee2e6;
                      border-right: 1px solid #dee2e6;
                  }
                  #dashboard-a4-preview tr:nth-child(even) td, #a4-preview tr:nth-child(even) td {
                      background-color: #f8f9fa;
                  }
                  #dashboard-a4-preview tr, #a4-preview tr { page-break-inside: avoid; page-break-after: auto; }
                  #dashboard-a4-preview thead, #a4-preview thead { display: table-header-group; }
                  #dashboard-a4-preview tfoot, #a4-preview tfoot { display: table-row-group; }
                  
                  #dashboard-a4-preview {
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      color: #333333;
                  }
                  #dashboard-a4-preview table {
                      width: 100%;
                      border-collapse: collapse;
                      table-layout: fixed;
                      margin-bottom: 25px;
                  }
                  #dashboard-a4-preview th {
                      background-color: #111111;
                      color: #eab308;
                      padding: 10px 12px;
                      font-size: 13px;
                      font-weight: bold;
                      text-transform: uppercase;
                      border: 1px solid #000;
                  }
                  #dashboard-a4-preview td {
                      padding: 9px 12px;
                      font-size: 12px;
                      color: #333333 !important;
                      border-bottom: 1px solid #dee2e6;
                      border-left: 1px solid #dee2e6;
                      border-right: 1px solid #dee2e6;
                  }
                  #dashboard-a4-preview tr:nth-child(even) td {
                      background-color: #f8f9fa;
                  }
                  #dashboard-a4-preview .text-cell {
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      text-align: left;
                  }
                  #dashboard-a4-preview .num-cell {
                      text-align: center;
                  }
                  #dashboard-a4-preview .cap-text {
                      text-transform: capitalize;
                  }
                  .empty-cell {
                      color: #999 !important;
                      font-style: italic;
                  }
                  /* Fix Page Breaks for PDF */
                  #dashboard-a4-preview tr { page-break-inside: avoid; page-break-after: auto; }
                  #dashboard-a4-preview thead { display: table-header-group; }
                  #dashboard-a4-preview tfoot { display: table-row-group; }
                  .avoid-break { page-break-inside: avoid; }
                  /* Ensure headers wrap normally */
                  #dashboard-a4-preview th { white-space: normal; word-wrap: break-word; overflow: visible; }
                  `}
              </style>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #eab308', paddingBottom: '20px', marginBottom: '30px' }}>
                  <img src="/alfaacademy/admin/alfa_logo.png" alt="Logo" style={{ width: 65, objectFit: 'contain' }} />
                  <div style={{ flex: 1, paddingLeft: '20px', paddingTop: '5px' }}>
                      <h2 style={{ margin: 0, color: '#111', fontSize: '22px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '-0.5px' }}>
                          Dashboard de Performance e Gestão de Atletas
                      </h2>
                      <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '13px', fontWeight: 500 }}>Relatório Analítico Executivo</p>
                  </div>
                  <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '11px', lineHeight: '1.5', paddingTop: '5px', minWidth: '150px' }}>
                      Gerado em:<br/>
                      <strong style={{ color: '#333', fontSize: '13px' }}>
                          {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
                                          {novos > 0 ? `↑ ${novos}` : '0'}
                                      </td>
                                      <td className="num-cell empty-cell">-</td>
                                      <td className="num-cell" style={{ fontWeight: 'bold' }}>{cat.total}</td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>

              {/* Status Médico (Lesionados) */}
              <div>
                  <h3 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6, marginBottom: 15, fontSize: 16, textTransform: 'uppercase' }}>Departamento Médico (Lesionados)</h3>
                  {atletas.filter(a => a.status_medico === 'Lesionado').length > 0 ? (
                      <table>
                          <thead>
                              <tr>
                                  <th style={{ width: '30%' }}>Atleta</th>
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
                  <div style={{ flex: 1 }}>
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
                  <div style={{ flex: 1 }}>
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
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd', textAlign: 'center', color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Documento Confidencial • Gerado automaticamente via Alfa Academy BI
              </div>
          </div>
      </div>
    </div>
  );
}
