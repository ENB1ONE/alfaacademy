with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("- [ ] Criar tabela `categorias`.", "- [x] Criar tabela `categorias`.")
text = text.replace("- [ ] Injetar dados iniciais", "- [x] Injetar dados iniciais")
text = text.replace("- [ ] Criar tabela `treinador_categoria` (N:N).", "- [x] Criar tabela `treinador_categoria` (N:N).")
text = text.replace("- [ ] Criar tabela `activity_logs`.", "- [x] Criar tabela `activity_logs`.")
text = text.replace("- [ ] Modificar tabela `atletas`", "- [x] Modificar tabela `atletas`")

text = text.replace("- [ ] Desenvolver CRUD de Categorias", "- [x] Desenvolver CRUD de Categorias")
text = text.replace("- [ ] Alterar rotas de Atletas", "- [x] Alterar rotas de Atletas")
text = text.replace("- [ ] Injetar middlewares RBAC", "- [x] Injetar middlewares RBAC")
text = text.replace("- [ ] Atualizar rotas de Treinadores", "- [x] Atualizar rotas de Treinadores")
text = text.replace("- [ ] Criar função para registro", "- [x] Criar função para registro")

with open("C:/Users/Eduardo/.gemini/antigravity/brain/1d039b17-103a-4281-8591-bbff3ca61df2/task.md", "w", encoding="utf-8") as f:
    f.write(text)
