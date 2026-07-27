with open("crm/src/context/AuthContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("res.data.perfil", "res.data.usuario?.perfil")
content = content.replace("res.data.nome", "res.data.usuario?.nome")
content = content.replace("setUser(res.data)", "setUser({ token: res.data.token, perfil: res.data.usuario?.perfil, nome: res.data.usuario?.nome })")

with open("crm/src/context/AuthContext.jsx", "w", encoding="utf-8") as f:
    f.write(content)
