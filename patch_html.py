import re

file_path = 'dashboard-admin.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the table header to include Ações
content = re.sub(
    r'(<th style="padding: 10px 5px;">Perfil</th>.*?)(</tr>)',
    r'\1<th style="padding: 10px 5px; text-align: center;">Ações</th>\n\2',
    content,
    flags=re.DOTALL | re.IGNORECASE
)

# Replace the table rows to include action buttons
content = re.sub(
    r'(<td style="padding:10px 5px; color:var\(--ouro\); font-family:\'Space Mono\',monospace;.*?>\$\{t\.perfil \|\| \'Treinador\'\}</td>)(\s*</tr>)',
    r'\1<td style="padding:10px 5px; text-align: center;"><button onclick="resetarSenhaTreinador(, \'\')" style="background:none; border:none; color:var(--ouro); cursor:pointer; margin-right:8px;" title="Resetar Senha para alfa@123">🔑</button><button onclick="excluirTreinador(, \'\')" style="background:none; border:none; color:#f87171; cursor:pointer;" title="Excluir Usuário">🗑️</button></td>\2',
    content,
    flags=re.DOTALL
)

# Check if functions already added
if "function excluirTreinador" not in content:
    content = content.replace('function logout() {', '''
          async function excluirTreinador(id, nome) {
              if(!confirm(Tem certeza que deseja EXCLUIR o usuário ?)) return;
              try {
                  const res = await fetch(${API_BASE_URL}/api/admin/treinadores/, {
                      method: 'DELETE',
                      headers: { 'Authorization': Bearer  }
                  });
                  if(!res.ok) throw new Error('Falha ao excluir');
                  toast('Usuário excluído com sucesso!');
                  carregarTreinadores();
                  carregarMetricas();
              } catch(e) {
                  toast(e.message);
              }
          }

          async function resetarSenhaTreinador(id, nome) {
              if(!confirm(Resetar a senha de  para alfa@123?)) return;
              try {
                  const res = await fetch(${API_BASE_URL}/api/admin/treinadores//reset-senha, {
                      method: 'POST',
                      headers: { 'Authorization': Bearer  }
                  });
                  if(!res.ok) throw new Error('Falha ao resetar senha');
                  toast('Senha resetada para alfa@123!');
              } catch(e) {
                  toast(e.message);
              }
          }

          function logout() {''')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")
