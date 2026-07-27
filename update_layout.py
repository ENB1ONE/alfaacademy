with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()

nav_find = """    return (
      <Link to={to} onClick={() => setIsMobileMenuOpen(false)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        color: isActive ? 'var(--ouro)' : 'var(--texto)',
        background: isActive ? 'rgba(248, 193, 70, 0.1)' : 'transparent',
        borderRadius: 8, transition: '0.2s', textDecoration: 'none'
      }}>"""

nav_replace = """    return (
      <Link to={to} onClick={() => setIsMobileMenuOpen(false)} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        color: isActive ? 'var(--ouro)' : 'var(--texto)',
        background: isActive ? 'linear-gradient(90deg, rgba(248, 193, 70, 0.15) 0%, transparent 100%)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--ouro)' : '3px solid transparent',
        borderRadius: '0 8px 8px 0', transition: 'var(--transition)', textDecoration: 'none',
        fontWeight: isActive ? '600' : '400'
      }} className="nav-link"
      onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.background = 'transparent'; }}>"""

text = text.replace(nav_find, nav_replace)

jogos_find = """        <div style={{ marginTop: 'auto', marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 15, border: '1px solid var(--linha)' }}>"""
jogos_replace = """        <div className="card interactive" style={{ marginTop: 'auto', marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.2)' }}>"""

text = text.replace(jogos_find, jogos_replace)

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)
