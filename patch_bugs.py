with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    layout = f.read()

layout = layout.replace("user?.perfil === 'Administrador' || user?.perfil === 'admin'", "['Administrador', 'admin', 'Admin'].includes(user?.perfil)")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(layout)

with open("crm/src/App.jsx", "r", encoding="utf-8") as f:
    app = f.read()

app = app.replace("['Administrador', 'admin']", "['Administrador', 'admin', 'Admin']")

with open("crm/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(app)

with open("crm/src/pages/Overview.jsx", "r", encoding="utf-8") as f:
    overview = f.read()

overview = overview.replace("setMetrics(res.data)", "setMetrics({ total_atletas: res.data.metricas?.total_atletas || 0, lesionados: res.data.metricas?.total_dm || 0, total_treinadores: res.data.metricas?.total_treinadores || 0 })")

with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f:
    f.write(overview)
