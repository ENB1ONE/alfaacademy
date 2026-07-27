import re

file_path = 'dashboard-admin.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace body template safely without backslash escaping inside the HTML string
content = re.sub(
    r'(<td style="padding:10px 5px; color:var\(--ouro\); font-family:\'Space Mono\',monospace;.*?>\$\{t\.perfil \|\| \'Treinador\'\}</td>)(\s*<td style="padding:10px 5px; text-align: center;">.*?</td>)?(\s*</tr>)',
    r'\1<td style="padding:10px 5px; text-align: center;"><button onclick="resetarSenhaTreinador(${t.id}, \'${t.nome}\')" style="background:none; border:none; color:var(--ouro); cursor:pointer; margin-right:8px;" title="Resetar Senha">Resetar</button><button onclick="excluirTreinador(${t.id}, \'${t.nome}\')" style="background:none; border:none; color:#f87171; cursor:pointer;" title="Excluir">Excluir</button></td>\3',
    content,
    flags=re.DOTALL
)

# Remove the backslashes from the onclick inside the HTML because it breaks the browser parser
content = content.replace("onclick=\"resetarSenhaTreinador(${t.id}, \\'${t.nome}\\')\"", "onclick=\"resetarSenhaTreinador(${t.id}, '${t.nome}')\"")
content = content.replace("onclick=\"excluirTreinador(${t.id}, \\'${t.nome}\\')\"", "onclick=\"excluirTreinador(${t.id}, '${t.nome}')\"")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
