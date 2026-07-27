with open("crm/src/context/AuthContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "await api.post('/api/auth/login', { username, password })",
    "await api.post('/api/auth/login', { usuario: username, senha: password })"
)

with open("crm/src/context/AuthContext.jsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("crm/index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('href="/vite.svg"', 'href="../assets/img/alfa_logo.png"')
html = html.replace('type="image/svg+xml"', 'type="image/png"')

with open("crm/index.html", "w", encoding="utf-8") as f:
    f.write(html)
