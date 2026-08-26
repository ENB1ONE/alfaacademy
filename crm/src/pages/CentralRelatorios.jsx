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

  const exportPDF = () => {
    const element = document.getElementById('a4-preview');
    if (!element) return;
    const opt = {
      margin:       10,
      filename:     `Relatorio_${modulo}_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
            <button className="btn primary" onClick={() => window.print()} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Printer size={18} /> Imprimir Tela
            </button>
          </div>
          {loading ? (
            <p style={{ color: 'var(--cinza)' }}>Carregando dados estatísticos...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
                <div className="card" style={{ padding: 20 }}>
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

                <div className="card" style={{ padding: 20 }}>
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
                <div className="card" style={{ padding: 20 }}>
                  <h3 style={{ marginBottom: 20, color: '#fff' }}>Status Médico</h3>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distMedico} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                          {distMedico.map((entry, index) => <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8 }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="card" style={{ padding: 20 }}>
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

                <div className="card" style={{ padding: 20 }}>
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
            <div className="card" style={{ padding: 20 }}>
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

                    <div style={{ flex: '1 1 150px' }}>
                        <button className="btn primary" onClick={handleGerarRelatorio} disabled={!modulo || generating} style={{ width: '100%' }}>
                            {generating ? 'Processando...' : 'Gerar Visualização'}
                        </button>
                    </div>
                </div>
            </div>

            {/* A4 Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--texto)' }}>Preview A4</h3>
                    {reportData && (
                        <button className="btn primary" onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ouro)', color: '#000' }}>
                            <Download size={18} /> Baixar PDF Executivo
                        </button>
                    )}
                </div>
                
                <div style={{
                    width: '100%',
                    maxWidth: '794px', // A4 Width at 96 DPI
                    margin: '0 auto',
                    overflowX: 'auto',
                    background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div id="a4-preview" style={{
                        background: '#ffffff',
                        minHeight: '1123px', // A4 Height at 96 DPI
                        padding: '40px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        color: '#333333',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {/* A4 Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eab308', paddingBottom: '20px', marginBottom: '30px' }}>
                            <div>
                                <img src="/alfaacademy/admin/logo192.png" alt="Logo" style={{ width: 60 }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ margin: 0, color: '#111', fontSize: '24px', textTransform: 'uppercase' }}>
                                    {modulo === 'elenco' ? 'Relatório de Elenco' : modulo === 'presencas' ? 'Histórico de Presenças' : modulo === 'jogos' ? 'Relatório de Partidas' : 'Relatório Dinâmico'}
                                </h2>
                                {filtros.categoria && <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '14px' }}>Filtro: {filtros.categoria}</p>}
                            </div>
                            <div style={{ textAlign: 'right', color: '#666', fontSize: '12px' }}>
                                Emissão:<br/>
                                {new Date().toLocaleDateString('pt-BR')} <br/>
                                {new Date().toLocaleTimeString('pt-BR')}
                            </div>
                        </div>

                        {/* A4 Body (Table) */}
                        {!reportData ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
                                Configure os filtros acima e clique em "Gerar Visualização"
                            </div>
                        ) : reportData.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
                                Nenhum dado encontrado para os filtros selecionados.
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5', color: '#111' }}>
                                        {Object.keys(reportData[0]).map(key => (
                                            <th key={key} style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '2px solid #ccc', textTransform: 'capitalize' }}>
                                                {key.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            {Object.values(row).map((val, i) => {
                                                // format dates nicely if looks like ISO
                                                let displayVal = val;
                                                if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
                                                    displayVal = new Date(val).toLocaleDateString('pt-BR');
                                                }
                                                return (
                                                    <td key={i} style={{ padding: '8px', color: '#444' }}>
                                                        {displayVal || '-'}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                        {/* A4 Footer */}
                        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: '10px' }}>
                            Gerado automaticamente via Alfa Academy BI &bull; Confidencial
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
