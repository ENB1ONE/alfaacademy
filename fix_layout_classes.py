with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    layout = f.read()

layout = layout.replace("<div style={{ display: 'flex', minHeight: '100vh' }}>", "<div className=\"layout\" style={{ display: 'flex', minHeight: '100vh' }}>")
layout = layout.replace("<aside style={{ width: 260, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>", "<aside className=\"sidebar\" style={{ width: 260, flexShrink: 0, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>")
layout = layout.replace("<main style={{ flex: 1, padding: 40, overflowY: 'auto' }}>", "<main className=\"main-content\" style={{ flexGrow: 1, padding: 40, overflowY: 'auto', overflowX: 'hidden' }}>")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(layout)
