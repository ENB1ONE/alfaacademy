import re

with open("crm/src/pages/Overview.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("total_atletas: res.data.metricas?.total_atletas || 0,", "total_atletas: res.data.total_atletas || 0,")
text = text.replace("lesionados: res.data.metricas?.total_dm || 0,", "lesionados: res.data.departamento_medico || 0,")
text = text.replace("total_treinadores: res.data.metricas?.total_treinadores || 0", "total_treinadores: res.data.equipe_tecnica || 0")

text = text.replace("ComissAo TAccnica", "Comissão Técnica")
text = text.replace("DistribuiA Ao por Categoria", "Distribuição por Categoria")
text = text.replace("invAlidas", "inválidas")

with open("crm/src/pages/Overview.jsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("crm/src/pages/Login.jsx", "r", encoding="utf-8") as f:
    login = f.read()
login = login.replace("invAlidas", "inválidas")
login = login.replace("UsuArio", "Usuário")
with open("crm/src/pages/Login.jsx", "w", encoding="utf-8") as f:
    f.write(login)
