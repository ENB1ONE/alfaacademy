with open("dashboard-treinador.html", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("perfil !== 'Treinador'", "perfil !== 'Treinador' && perfil !== 'Administrador' && perfil !== 'admin'")

with open("dashboard-treinador.html", "w", encoding="utf-8") as f:
    f.write(content)
