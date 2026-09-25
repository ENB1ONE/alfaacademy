const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/CentralRelatorios.jsx', 'utf8');

const target = `{modulo === 'presencas' && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
                                <input 
                                    type="text"
                                    className="input"
                                    placeholder="Nome do atleta..."
                                    value={filtros.nome_atleta || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const found = atletas.find(a => a.nome === val);
                                        setFiltros({
                                            ...filtros, 
                                            nome_atleta: val,
                                            atleta_id: found ? found.id : null
                                        });
                                    }}
                                    style={{ width: '100%', paddingLeft: 35, marginBottom: 0 }}
                                    list="lista-atletas"
                                />
                            </div>
                            <datalist id="lista-atletas">
                                {atletas && [...atletas]
                                    .filter(a => !filtros.categoria || a.categoria_nome === filtros.categoria || a.categoria === filtros.categoria)
                                    .map(a => a.nome)
                                    .filter((v, i, a) => a.indexOf(v) === i)
                                    .sort()
                                    .map((nome, i) => <option key={i} value={nome} />)}
                            </datalist>
                        </div>
                    )}`;

const replacement = `{modulo === 'presencas' && (
                        <div style={{ flex: '1 1 200px', position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: 8, color: 'var(--cinza)' }}>Atleta Específico</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', top: 12, left: 10, color: 'var(--cinza)' }} />
                                <input 
                                    type="text"
                                    className="input"
                                    placeholder="Buscar por nome..."
                                    value={filtros.nome_atleta || ''}
                                    onFocus={() => document.getElementById('athlete-dropdown').style.display = 'block'}
                                    onBlur={() => setTimeout(() => { const el = document.getElementById('athlete-dropdown'); if(el) el.style.display = 'none'; }, 200)}
                                    onChange={(e) => {
                                        setFiltros({...filtros, nome_atleta: e.target.value, atleta_id: null});
                                        document.getElementById('athlete-dropdown').style.display = 'block';
                                    }}
                                    style={{ width: '100%', paddingLeft: 35, marginBottom: 0 }}
                                    autoComplete="off"
                                />
                            </div>
                            <div id="athlete-dropdown" style={{ 
                                display: 'none', 
                                position: 'absolute', 
                                top: '100%', left: 0, right: 0, 
                                backgroundColor: 'var(--fundo-card)', 
                                border: '1px solid var(--borda)', 
                                borderRadius: '0 0 8px 8px',
                                maxHeight: 250, overflowY: 'auto', zIndex: 100,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                            }}>
                                {atletas && atletas
                                    .filter(a => (a.nome.toLowerCase().includes((filtros.nome_atleta || '').toLowerCase())))
                                    .slice(0, 50)
                                    .map((a, i) => (
                                        <div 
                                            key={i}
                                            style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevents input blur
                                                setFiltros({...filtros, nome_atleta: a.nome, atleta_id: a.id});
                                                document.getElementById('athlete-dropdown').style.display = 'none';
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ color: 'var(--texto)' }}>{a.nome}</span>
                                            <span style={{ fontSize: 12, color: 'var(--ouro)', background: 'rgba(248, 193, 70, 0.1)', padding: '2px 6px', borderRadius: 4 }}>{a.categoria_nome || a.categoria}</span>
                                        </div>
                                    ))
                                }
                                {atletas && atletas.filter(a => (a.nome.toLowerCase().includes((filtros.nome_atleta || '').toLowerCase()))).length === 0 && (
                                    <div style={{ padding: '10px 12px', color: 'var(--cinza)', fontStyle: 'italic', textAlign: 'center' }}>Nenhum atleta encontrado</div>
                                )}
                            </div>
                        </div>
                    )}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('crm/src/pages/CentralRelatorios.jsx', code, 'utf8');
    console.log('Successfully replaced datalist with custom autocomplete');
} else {
    console.log('Target string not found');
}
