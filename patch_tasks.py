with open(r"c:\Users\Eduardo\.gemini\antigravity\brain\1d039b17-103a-4281-8591-bbff3ca61df2\task.md", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("- `[ ]` **Backend: Avisos**", "- `[x]` **Backend: Avisos**")
content = content.replace("- `[ ]` Criar tabela `avisos` no banco de dados.", "- `[x]` Criar tabela `avisos` no banco de dados.")
content = content.replace("- `[ ]` Criar rotas `GET /api/admin/avisos` e `POST /api/admin/avisos`.", "- `[x]` Criar rotas `GET /api/admin/avisos` e `POST /api/admin/avisos`.")
content = content.replace("- `[ ]` Inserir registros seed de avisos na tabela.", "- `[x]` Inserir registros seed de avisos na tabela.")

content = content.replace("- `[ ]` **Frontend: Avisos**", "- `[/]` **Frontend: Avisos**")
content = content.replace("- `[ ]` Modificar a tela Visão Geral para consumir dinamicamente o `GET /api/admin/avisos`.", "- `[x]` Modificar a tela Visão Geral para consumir dinamicamente o `GET /api/admin/avisos`.")

content = content.replace("- `[ ]` **Frontend: Ficha de Atletas**", "- `[/]` **Frontend: Ficha de Atletas**")
content = content.replace("- `[ ]` Alterar o card \"Total de Atletas\" para ter efeito de clique (cursor-pointer).", "- `[x]` Alterar o card \"Total de Atletas\" para ter efeito de clique (cursor-pointer).")
content = content.replace("- `[ ]` Ao clicar, redirecionar para a aba \"Gestão de Usuários\" > \"Atletas\", ou abrir um Modal Detalhado.", "- `[x]` Ao clicar, redirecionar para a aba \"Gestão de Usuários\" > \"Atletas\", ou abrir um Modal Detalhado.")

content = content.replace("- `[ ]` Implementar a aba \"Relatórios\" (que hoje está vazia).", "- `[x]` Implementar a aba \"Relatórios\" (que hoje está vazia).")

with open(r"c:\Users\Eduardo\.gemini\antigravity\brain\1d039b17-103a-4281-8591-bbff3ca61df2\task.md", "w", encoding="utf-8") as f:
    f.write(content)
