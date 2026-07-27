with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Add useEffect and fetch logic
import_find = "import { useState } from 'react';"
import_replace = "import { useState, useEffect } from 'react';\nimport api from '../api';"
text = text.replace(import_find, import_replace)

old_state = "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);"
new_state = """const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [proximosJogos, setProximosJogos] = useState([]);

  useEffect(() => {
    api.get('/api/admin/eventos/proximos').then(res => setProximosJogos(res.data)).catch(console.error);
  }, []);"""
text = text.replace(old_state, new_state)

# Add widget above logout button
old_logout = """<button onClick={handleLogout} className="btn outline" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>"""
new_logout = """
        <div style={{ marginTop: 'auto', marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 15, border: '1px solid var(--linha)' }}>
            <h4 style={{ color: 'var(--ouro)', margin: '0 0 10px 0', fontSize: 14 }}>Próximos Jogos (10 dias)</h4>
            {proximosJogos.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--cinza)', fontSize: 12 }}>Nenhum jogo agendado.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {proximosJogos.map(j => (
                        <li key={j.id} style={{ fontSize: 12, borderBottom: '1px solid var(--linha)', paddingBottom: 5 }}>
                            <strong style={{ color: '#EF4444' }}>{j.data_br}</strong>
                            <div style={{ color: 'var(--texto)' }}>{j.titulo}</div>
                            <div style={{ color: 'var(--cinza)', fontSize: 10 }}>{j.categoria_nome}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <button onClick={handleLogout} className="btn outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>"""

text = text.replace(old_logout, new_logout)

# Fix weird characters again just in case
text = text.replace("VisAo Geral", "Visão Geral")
text = text.replace("HistA3rico de PresenA as", "Histórico de Presenças")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)
