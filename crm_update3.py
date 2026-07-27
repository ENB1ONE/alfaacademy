# Layout.jsx logo update
with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    layout = f.read()

layout = layout.replace("<h2 style={{ color: 'var(--ouro)', marginBottom: 40, textAlign: 'center', fontSize: 22 }}>Alfa Academy</h2>", "<div style={{ textAlign: 'center', marginBottom: 30 }}><img src='/alfa_logo.png' alt='Alfa Academy' style={{ width: 120 }} /></div>")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(layout)

# index.html title update
with open("crm/index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace("<title>crm</title>", "<title>Alfa Academy | Painel</title>")
html = html.replace("<title>Vite + React</title>", "<title>Alfa Academy | Painel</title>")

with open("crm/index.html", "w", encoding="utf-8") as f:
    f.write(html)
