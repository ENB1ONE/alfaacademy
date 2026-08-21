const fs = require('fs');

// --- Athletes.jsx Refactor ---
let athletes = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

const oldCardRegex = /<div className="card" key=\{a\.id\} style=\{\{ padding: '20px', display: 'flex', flexDirection: 'column', \s*gap: '15px' \}\}>[\s\S]*?<\/div>\s*<\/div>\s*\)\)\s*\)\}/;

const newCard = `<div className="card" key={a.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: 20, flexShrink: 0, overflow: 'hidden', cursor: 'pointer', border: '2px solid rgba(234,179,8,0.3)' }} onClick={() => navigate(\`/perfil/\${a.id}\`)}>
                      {a.foto ? <img src={a.foto} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (a.nome ? String(a.nome).charAt(0).toUpperCase() : '')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }} onClick={() => navigate(\`/perfil/\${a.id}\`)}>{a.nome}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--cinza)', fontWeight: '500', marginTop: 4 }}>{a.posicao || 'SEM POSIÇÃO'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" className="btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}><Activity size={16} /></button>
                    <button onClick={() => handleEdit(a)} title="Editar" className="btn" style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(a.id)} title="Excluir" className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--cinza)' }}>Categoria</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{a.categoria || 'Sem Categoria'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--cinza)' }}>Status Médico</span>
                    <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', background: a.status_medico === 'Lesionado' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: a.status_medico === 'Lesionado' ? '#ef4444' : '#22c55e', border: \`1px solid \${a.status_medico === 'Lesionado' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}\` }}>
                      {a.status_medico || 'Apto'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}`;

athletes = athletes.replace(oldCardRegex, newCard);
fs.writeFileSync('crm/src/pages/Athletes.jsx', athletes, 'utf8');

console.log("Athletes.jsx refactored");

// --- PerfilAtleta.jsx Refactor ---
let perfil = fs.readFileSync('crm/src/pages/PerfilAtleta.jsx', 'utf8');

// Replace Header Background and details
const oldHeaderRegex = /<div style=\{\{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px' \}\}>[\s\S]*?<div style=\{\{ display: 'flex', gap: '15px', borderBottom: '1px solid var\(--linha\)', paddingBottom: '10px', marginBottom: '20px' \}\}>/m;

const newHeader = `<div style={{ background: 'linear-gradient(135deg, #111 0%, #2a220a 100%)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--ouro)', flexShrink: 0, overflow: 'hidden', border: '3px solid #111', boxShadow: '0 0 15px rgba(234,179,8,0.5)' }}>
            {atleta.foto ? <img src={atleta.foto} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:40, color:'#000', display:'flex', height:'100%', justifyContent:'center', alignItems:'center', fontWeight:'bold'}}>{(atleta.nome||'').charAt(0).toUpperCase()}</span>}
          </div>
          <div style={{ zIndex: 1 }}>
            <h1 style={{ color: 'var(--ouro)', margin: 0, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{atleta.nome}</h1>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{color: 'var(--cinza)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: 5}}>Idade</span> <strong style={{color: '#fff'}}>{atleta.data_nascimento ? new Date().getFullYear() - new Date(atleta.data_nascimento).getFullYear() : 18}</strong></div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{color: 'var(--cinza)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: 5}}>Peso</span> <strong style={{color: '#fff'}}>{atleta.peso ? \`\${atleta.peso}kg\` : '--'}</strong></div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{color: 'var(--cinza)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: 5}}>Altura</span> <strong style={{color: '#fff'}}>{atleta.altura ? \`\${atleta.altura}m\` : '--'}</strong></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid var(--linha)', paddingBottom: '10px', marginBottom: '30px' }}>`;

perfil = perfil.replace(oldHeaderRegex, newHeader);

// Replace button name
perfil = perfil.replace("Exportar PDF", "Baixar Relatório");

// Replace Analise Tab
const oldAnaliseRegex = /\{activeTab === 'analise' && aiData && \([\s\S]*?\}\)\}\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const newAnalise = `{activeTab === 'analise' && aiData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
            <div className="card" style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ color: 'var(--ouro)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}><Activity size={18} style={{marginRight: 8, verticalAlign: 'middle', display: 'inline-block', marginBottom: 3}}/> Índice de Performance</h3>
               <div style={{ fontSize: '5rem', fontWeight: '900', color: '#fff', margin: '20px 0', textShadow: '0 0 20px rgba(234, 179, 8, 0.4)', lineHeight: '1' }}>{aiData.score}</div>
               <p style={{color: 'var(--cinza)', fontSize: '0.85rem', margin: 0}}>Score geral consolidado via Inteligência Artificial</p>
            </div>
            
            <div className="card" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ color: 'var(--ouro)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px', marginTop: 0 }}>Atuação Tática</h3>
               <div style={{ width: '160px', height: '220px', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '8px', position: 'relative', background: 'linear-gradient(180deg, #111 0%, #1a1a1a 100%)' }}>
                 <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '2px solid rgba(255,255,255,0.15)' }}></div>
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '50%' }}></div>
                 <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '30px', border: '2px solid rgba(255,255,255,0.15)', borderTop: 'none' }}></div>
                 <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '30px', border: '2px solid rgba(255,255,255,0.15)', borderBottom: 'none' }}></div>
                 
                 <div style={{ position: 'absolute', top: (atleta.posicao || '').toLowerCase().includes('ata') ? '20%' : (atleta.posicao || '').toLowerCase().includes('zag') ? '80%' : (atleta.posicao || '').toLowerCase().includes('gol') ? '95%' : '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: 'var(--ouro)', borderRadius: '50%', boxShadow: '0 0 12px var(--ouro)', border: '2px solid #fff' }}></div>
               </div>
               <p style={{ color: '#fff', marginTop: '20px', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{atleta.posicao || 'Não Definida'}</p>
            </div>

            <div className="card" style={{ gridColumn: '1 / -1', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ color: 'var(--ouro)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', marginTop: 0 }}>Radar de Habilidades</h3>
               <div style={{ width: '100%', height: '400px', maxWidth: '600px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={aiData.radar_tatico}>
                      <PolarGrid stroke="var(--linha)" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--cinza)", fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Avaliação Anterior" dataKey="anterior" stroke="rgba(255, 255, 255, 0.4)" fill="rgba(255, 255, 255, 0.1)" fillOpacity={0.6} />
                      <Radar name="Avaliação Atual" dataKey="atual" stroke="var(--ouro)" strokeWidth={3} fill="var(--ouro)" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`;

perfil = perfil.replace(oldAnaliseRegex, newAnalise);
fs.writeFileSync('crm/src/pages/PerfilAtleta.jsx', perfil, 'utf8');

console.log("PerfilAtleta.jsx refactored");
