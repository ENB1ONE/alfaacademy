import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Activity } from 'lucide-react';
import api from '../api';
import { exportElementToPDF } from '../utils/pdfExport';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function PerfilAtleta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pdfRef = useRef(null);
  
  const [atleta, setAtleta] = useState(null);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    // Fetch athlete data
    const loadProfile = async () => {
      try {
        const res = await api.get('/api/admin/atletas');
        const list = res.data.atletas || res.data;
        const found = list.find(a => String(a.id) === String(id));
        if (found) setAtleta(found);
      } catch(e) {
        console.error(e);
      }
    };
    loadProfile();

    // Mock AI radar data
    setAiData({
        score: 82,
        radar_tatico: [
            { subject: "Leitura de jogo", atual: 85, anterior: 75 },
            { subject: "Controle", atual: 88, anterior: 80 },
            { subject: "Posicionamento", atual: 80, anterior: 82 },
            { subject: "Mobilidade", atual: 81, anterior: 78 },
            { subject: "Desarme", atual: 70, anterior: 65 }
        ]
    });
  }, [id]);

  if (!atleta) return <div style={{ color: 'white', padding: 20 }}>Carregando Perfil...</div>;

  return (
    <div style={{ color: 'var(--texto)', maxWidth: '900px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <button className="btn" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid var(--ouro)', color: 'var(--ouro)' }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <button className="btn primary" onClick={() => exportElementToPDF(pdfRef.current, `Perfil_${atleta.nome.replace(/\s+/g, '_')}.pdf`)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={16} /> Baixar Relatório
        </button>
      </div>

      <div ref={pdfRef} style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
        
        <div style={{ background: 'linear-gradient(135deg, #111 0%, #2a220a 100%)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--ouro)', flexShrink: 0, overflow: 'hidden', border: '3px solid #111', boxShadow: '0 0 15px rgba(234,179,8,0.5)' }}>
            {atleta.foto ? <img src={atleta.foto} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:40, color:'#000', display:'flex', height:'100%', justifyContent:'center', alignItems:'center', fontWeight:'bold'}}>{(atleta.nome||'').charAt(0).toUpperCase()}</span>}
          </div>
          <div style={{ zIndex: 1 }}>
            <h1 style={{ color: 'var(--ouro)', margin: 0, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{atleta.nome}</h1>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{color: 'var(--cinza)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: 5}}>Idade</span> <strong style={{color: '#fff'}}>{atleta.data_nascimento ? new Date().getFullYear() - new Date(atleta.data_nascimento).getFullYear() : 18}</strong></div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{color: 'var(--cinza)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: 5}}>Peso</span> <strong style={{color: '#fff'}}>{atleta.peso ? `${atleta.peso}kg` : '--'}</strong></div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{color: 'var(--cinza)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: 5}}>Altura</span> <strong style={{color: '#fff'}}>{atleta.altura ? `${atleta.altura}m` : '--'}</strong></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid var(--linha)', paddingBottom: '10px', marginBottom: '30px' }}>
          <button 
            style={{ background: 'none', border: 'none', color: activeTab === 'detalhes' ? 'var(--ouro)' : 'var(--cinza)', fontSize: '1.1rem', fontWeight: activeTab === 'detalhes' ? 'bold' : 'normal', cursor: 'pointer' }}
            onClick={() => setActiveTab('detalhes')}
          >
            Ficha Cadastral
          </button>
          <button 
            style={{ background: 'none', border: 'none', color: activeTab === 'analise' ? 'var(--ouro)' : 'var(--cinza)', fontSize: '1.1rem', fontWeight: activeTab === 'analise' ? 'bold' : 'normal', cursor: 'pointer' }}
            onClick={() => setActiveTab('analise')}
          >
            Análise de Performance (IA)
          </button>
        </div>

        {activeTab === 'detalhes' && (
          <div>
             <h3 style={{ color: 'var(--ouro)', marginBottom: 15 }}>Detalhes do Jogador</h3>
             <p style={{color: 'var(--cinza)'}}>Responsável: {atleta.nome_responsavel || 'N/A'}</p>
             <p style={{color: 'var(--cinza)'}}>Telefone: {atleta.telefone_responsavel || 'N/A'}</p>
             <p style={{color: 'var(--cinza)'}}>Status Médico: {atleta.status_medico || 'Apto'}</p>
          </div>
        )}

        {activeTab === 'analise' && aiData && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            <div className="card" style={{ flex: 1, minWidth: 250, padding: '20px', textAlign: 'center' }}>
               <h3 style={{ color: 'var(--ouro)' }}><Activity size={20} style={{marginRight: 8, verticalAlign: 'middle'}}/> Score IA</h3>
               <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white', marginTop: '10px' }}>{aiData.score}</div>
               <p style={{color: 'var(--cinza)', fontSize: 12}}>Baseado em 3 avaliações completas</p>
            </div>
            
            <div style={{ flex: 2, minWidth: 300, background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', height: '350px' }}>
               <h3 style={{ color: 'var(--cinza)', textAlign: 'center', marginBottom: 10 }}>Comparativo de Evolução (Atual x Anterior)</h3>
               <ResponsiveContainer width="100%" height="90%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={aiData.radar_tatico}>
                    <PolarGrid stroke="var(--linha)" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--cinza)", fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Avaliação Anterior" dataKey="anterior" stroke="rgba(255, 255, 255, 0.4)" fill="rgba(255, 255, 255, 0.1)" fillOpacity={0.6} />
                    <Radar name="Avaliação Atual" dataKey="atual" stroke="var(--ouro)" strokeWidth={2} fill="var(--ouro)" fillOpacity={0.5} />
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  </RadarChart>
                </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
