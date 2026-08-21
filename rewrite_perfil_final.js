const fs = require('fs');

const componentCode = `import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Activity } from 'lucide-react';
import api from '../api';
import { exportElementToPDF } from '../utils/pdfExport';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function PerfilAtleta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pdfRef = useRef(null);
  
  const [atleta, setAtleta] = useState(null);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/api/admin/atletas');
        const list = res.data.atletas || res.data;
        const found = list.find(a => String(a.id) === String(id));
        if (found) {
            setAtleta(found);
            if (found.ai_score) {
              setAiData(found.aiData);
            } else {
              setAiData(null);
            }
        }
      } catch(e) { console.error(e); }
    };
    loadProfile();
  }, [id]);

  if (!atleta) return <div style={{ color: 'white', padding: 20 }}>Carregando Perfil...</div>;

  const idade = atleta.data_nascimento ? new Date().getFullYear() - new Date(atleta.data_nascimento).getFullYear() : '--';
  const username = atleta.nome ? atleta.nome.toLowerCase().replace(/\\s+/g, '') : 'atleta';
  const pos = (atleta.posicao || '').toLowerCase();
  let dotTop = '50%';
  if (pos.includes('ata')) dotTop = '20%';
  else if (pos.includes('zag')) dotTop = '80%';
  else if (pos.includes('gol')) dotTop = '92%';

  // Radar empty data fallback
  const radarData = aiData ? aiData.radar_tatico : [
      { subject: "Ofensivo", atual: 0 },
      { subject: "Defensivo", atual: 0 },
      { subject: "Físico", atual: 0 },
      { subject: "Mental", atual: 0 },
      { subject: "Técnico", atual: 0 }
  ];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '0', margin: '0', fontFamily: 'sans-serif' }} ref={pdfRef}>
      
      {/* HEADER SECTION (Stadium/Gradient style) */}
      <div style={{ 
        background: 'radial-gradient(circle at top, #1a2332 0%, #0a0a0a 100%)',
        padding: '30px 20px 20px',
        position: 'relative'
      }}>
        {/* Top Icons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: '50%', background: 'transparent', border: '1px solid var(--ouro)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} color="var(--ouro)" />
          </button>
        </div>

        {/* Avatar & Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '16px', background: 'var(--ouro)', overflow: 'hidden', border: '2px solid rgba(234, 179, 8, 0.5)' }}>
            {atleta.foto ? <img src={atleta.foto} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:30, color:'#000', display:'flex', height:'100%', justifyContent:'center', alignItems:'center', fontWeight:'bold'}}>{(atleta.nome||'').charAt(0).toUpperCase()}</span>}
            {/* Crown Icon mock */}
            <div style={{ position: 'absolute', top: -10, left: -10, background: 'var(--ouro)', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👑
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ background: 'var(--ouro)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>
              Atleta Alfa
            </div>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#111', border: '1px solid var(--ouro)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--ouro)' }}>
              BR
            </div>
          </div>
        </div>

        {/* Name and Info */}
        <div style={{ marginTop: 15 }}>
          <h1 style={{ margin: 0, color: 'var(--ouro)', fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>{atleta.nome}</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>@{username}</span>
            <div style={{ display: 'flex', gap: 15, color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
              <span>{idade} anos</span>
              <span>{atleta.peso ? atleta.peso + ' kg' : '--'}</span>
              <span>{atleta.altura ? atleta.altura + ' m' : '--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 20, padding: '0 20px', borderBottom: '1px solid #222' }}>
        <div onClick={() => setActiveTab('detalhes')} style={{ padding: '15px 0', borderBottom: activeTab === 'detalhes' ? '3px solid var(--ouro)' : '3px solid transparent', color: activeTab === 'detalhes' ? '#fff' : '#888', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          Detalhes
        </div>
        <div onClick={() => setActiveTab('analise')} style={{ padding: '15px 0', borderBottom: activeTab === 'analise' ? '3px solid var(--ouro)' : '3px solid transparent', color: activeTab === 'analise' ? '#fff' : '#888', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          Ficha Completa
        </div>
      </div>

      {/* CONTENT ZONE */}
      <div style={{ padding: '20px' }}>
        
        {/* Buttons Row */}
        <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
          <button onClick={() => exportElementToPDF(pdfRef.current, \`Perfil_\${atleta.nome.replace(/\\s+/g, '_')}.pdf\`)} style={{ flex: 1, background: 'transparent', border: '1px solid #444', color: '#fff', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            Baixar Relatório <Download size={16} />
          </button>
        </div>

        {activeTab === 'detalhes' && (
          <>
            {/* GRID LAYOUT (Responsive) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 15 }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                
                {/* Index Card */}
                <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: 'var(--ouro)', fontSize: '12px', fontWeight: 'bold' }}>Alfa Index &gt;</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '38px', fontWeight: '900', color: 'var(--ouro)', lineHeight: '1' }}>{aiData ? aiData.score + '%' : '--'}</span>
                    {/* Fake Progress Ring */}
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '4px solid #333', borderTopColor: aiData ? 'var(--ouro)' : '#333', borderRightColor: aiData ? 'var(--ouro)' : '#333', borderBottomColor: aiData ? 'var(--ouro)' : '#333' }}></div>
                  </div>
                </div>

                {/* Tactical Field Card */}
                <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                  {/* Field Drawing */}
                  <div style={{ width: '100%', maxWidth: '100px', height: '100%', border: '1px solid #333', borderRadius: '4px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #333' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30px', height: '30px', border: '1px solid #333', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', border: '1px solid #333', borderTop: 'none' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', border: '1px solid #333', borderBottom: 'none' }}></div>
                    
                    {/* Player Position Dot */}
                    <div style={{ position: 'absolute', top: dotTop, left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: 'var(--ouro)', borderRadius: '50%', boxShadow: '0 0 8px var(--ouro)' }}></div>
                  </div>
                </div>
              </div>

              {/* Right Column (Radar) */}
              <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--ouro)', fontSize: '12px' }}>Avaliação da IA {aiData ? '' : '(Sem Dados)'}</div>
                  <div style={{ background: '#333', width: 16, height: 16, borderRadius: '50%', color: '#aaa', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</div>
                </div>
                <div style={{ flex: 1, position: 'relative', marginTop: 10, minHeight: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--ouro)", fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Atual" dataKey="atual" stroke="var(--ouro)" strokeWidth={2} fill="var(--ouro)" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Clubes Row */}
            <div style={{ display: 'flex', gap: 15, marginTop: 15, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px', background: '#1a1a1a', borderRadius: '12px', padding: '15px' }}>
                <div style={{ color: '#06b6d4', fontSize: '12px', marginBottom: 10 }}>Clube atual</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>A</div>
                  <span style={{ color: '#fff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{atleta.clube_atual || 'Sem dados'}</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '140px', background: '#1a1a1a', borderRadius: '12px', padding: '15px' }}>
                <div style={{ color: '#06b6d4', fontSize: '12px', marginBottom: 10 }}>Categoria</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12, flexShrink: 0 }}>C</div>
                  <span style={{ color: '#fff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{atleta.categoria || 'Sem dados'}</span>
                </div>
              </div>
            </div>

            {/* Competicoes Row */}
            <div style={{ marginTop: 15, background: '#1a1a1a', borderRadius: '12px', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <div style={{ color: '#06b6d4', fontSize: '12px' }}>Competições</div>
                <div style={{ color: '#06b6d4', fontSize: '12px' }}>Todas &gt;</div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <span style={{ color: '#06b6d4', fontSize: '14px' }}>{atleta.competicoes || 'Sem dados'}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analise' && (
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
             <h3 style={{ color: 'var(--ouro)', margin: '0 0 15px 0' }}>Ficha Completa</h3>
             <p style={{color: 'var(--cinza)'}}>Pé Dominante: <strong style={{color: '#fff'}}>{atleta.pe_dominante || 'Sem dados'}</strong></p>
             <p style={{color: 'var(--cinza)'}}>Responsável: <strong style={{color: '#fff'}}>{atleta.nome_responsavel || 'Sem dados'}</strong></p>
             <p style={{color: 'var(--cinza)'}}>Telefone: <strong style={{color: '#fff'}}>{atleta.telefone_responsavel || 'Sem dados'}</strong></p>
             <p style={{color: 'var(--cinza)'}}>Status Médico: <strong style={{color: '#fff'}}>{atleta.status_medico || 'Apto'}</strong></p>
          </div>
        )}

      </div>
    </div>
  );
}
`;
fs.writeFileSync('crm/src/pages/PerfilAtleta.jsx', componentCode, 'utf8');
console.log('PerfilAtleta.jsx rewrited flawlessly.');
