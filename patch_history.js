const fs = require('fs');
let code = fs.readFileSync('C:\\\\Users\\\\eabc\\\\Projects\\\\alfaacademy\\\\crm\\\\src\\\\pages\\\\AttendanceHistory.jsx', 'utf8');

if (!code.includes('viewingConvocadosId')) {
    code = code.replace(
        /const \\\[viewingTreinoId, setViewingTreinoId\\\] = useState\\(null\\);/,
        const [viewingTreinoId, setViewingTreinoId] = useState(null);\n  const [viewingConvocadosId, setViewingConvocadosId] = useState(null);\n  const [convocadosDetail, setConvocadosDetail] = useState([]);
    );

    code = code.replace(
        /const loadPresencas = async/,
        const loadConvocados = async (treino_ids, eventId) => {
    try {
        const res = await api.post('/api/admin/jogos/multi-convocados', { treino_ids });
        setConvocadosDetail(res.data.filter(a => a.convocado));
        setViewingConvocadosId(eventId);
        setViewingTreinoId(null);
    } catch (e) {
        alert("Erro ao carregar convocados");
    }
  };\n\n  const loadPresencas = async
    );

    const oldButtons = \            {viewingTreinoId !== gEvt.id ? (
                <button onClick={() => loadPresencas(gEvt.id, gEvt.sub_events)} className="btn outline" style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap', marginLeft: 10 }}>
                    Ver Presenças
                </button>
            ) : (
                <button onClick={() => setViewingTreinoId(null)} className="btn outline" style={{ padding: '6px 12px', fontSize: 12, border: 'none', whiteSpace: 'nowrap', marginLeft: 10 }}>
                    Ocultar
                </button>
            )}\;

    const newButtons = \            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 10 }}>
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
            </div>\;
    
    code = code.replace(oldButtons, newButtons);

    const presencasView = \{viewingTreinoId === gEvt.id && (\;
    const convocadosView = \{viewingConvocadosId === gEvt.id && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, marginTop: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h4 style={{ margin: 0, color: 'var(--ouro)' }}>Lista de Convocados</h4>
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
        
        \;
    
    code = code.replace(presencasView, convocadosView + presencasView);

    fs.writeFileSync('C:\\\\Users\\\\eabc\\\\Projects\\\\alfaacademy\\\\crm\\\\src\\\\pages\\\\AttendanceHistory.jsx', code, 'utf8');
    console.log("Patched!");
}
