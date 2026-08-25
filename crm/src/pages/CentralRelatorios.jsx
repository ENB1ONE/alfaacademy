import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Download, Search, Filter, Activity, Users, FileText, PieChart as PieIcon, TrendingUp, HeartPulse } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#a855f7', '#f97316', '#06b6d4'];

export default function CentralRelatorios() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [atletas, setAtletas] = useState([]);
  const [faltosos, setFaltosos] = useState([]);
  
  // States for dynamic charts
  const [distCategoria, setDistCategoria] = useState([]);
  const [distPosicao, setDistPosicao] = useState([]);
  const [distPe, setDistPe] = useState([]);
  const [distMedico, setDistMedico] = useState([]);

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

        // Process Categoria
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

  return (
    <div style={{ color: 'var(--texto)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 style={{ color: 'var(--ouro)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={28} /> Central de Relatórios
          </h1>
          <p style={{ color: 'var(--cinza)', marginTop: 5 }}>Visão analítica completa da Alfa Academy</p>
        </div>
        <button className="btn primary" onClick={() => window.print()} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--cinza)' }}>Carregando dados estatísticos...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Linha 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 20, color: '#fff' }}>Distribuição por Categoria</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={distCategoria} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--cinza)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--cinza)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ background: '#1e1e24', border: 'none', borderRadius: 8, color: '#fff' }} itemStyle={{ color: 'var(--ouro)' }} />
                    <Line type="monotone" dataKey="total" stroke="var(--ouro)" strokeWidth={3} dot={{ r: 5, fill: 'var(--ouro)' }} activeDot={{ r: 8 }} />
                  </LineChart>
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

          {/* Linha 2 */}
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
    </div>
  );
}
