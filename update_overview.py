with open("crm/src/pages/Overview.jsx", "r", encoding="utf-8") as f:
    text = f.read()

card_find = """  const Card = ({ title, value, icon: Icon, color, link }) => (
    <div className="card" onClick={() => navigate(link)} style={{ display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: '0.2s' }}>
      <div style={{ background: color, padding: 16, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>"""

card_replace = """  const Card = ({ title, value, icon: Icon, color, link }) => (
    <div className="card interactive" onClick={() => navigate(link)} style={{ display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}>
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(0,0,0,0.5) 150%)`, padding: 16, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 15px ${color}40` }}>"""

text = text.replace(card_find, card_replace)

colors_find = """const COLORS = ['#3b82f6', '#eab308', '#ef4444', '#10b981', '#8b5cf6'];"""
colors_replace = """const COLORS = ['#F8C146', '#C99520', '#3b82f6', '#10b981', '#ef4444']; // More premium chart colors matching the theme"""

text = text.replace(colors_find, colors_replace)

with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f:
    f.write(text)
