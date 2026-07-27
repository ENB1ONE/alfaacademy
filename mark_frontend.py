with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("- [ ] Criar Componente e Tela", "- [x] Criar Componente e Tela")
text = text.replace("- [ ] Atualizar Componente de `Treinadores`", "- [x] Atualizar Componente de `Treinadores`")
text = text.replace("- [ ] Atualizar Componente de `Atletas`", "- [x] Atualizar Componente de `Atletas`")
text = text.replace("- [ ] Atualizar o Dashboard", "- [x] Atualizar o Dashboard")
text = text.replace("- [ ] Preparar bloqueio de rotas", "- [x] Preparar bloqueio de rotas")

with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "w", encoding="utf-8") as f:
    f.write(text)
