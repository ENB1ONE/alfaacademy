with open("/opt/alfa-api/routes/admin.js", "r", encoding="utf-8") as f:
    text = f.read()

# Fix Atletas query
text = text.replace("JOIN categorias c ON a.categoria_id = c.id", "LEFT JOIN categorias c ON a.categoria_id = c.id")

# Fix Treinadores metricas (actually, Treinador should only see their assigned categories, so JOIN is correct for Treinador)

with open("/opt/alfa-api/routes/admin.js", "w", encoding="utf-8") as f:
    f.write(text)

