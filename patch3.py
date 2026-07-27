import re

file_path = 'dashboard-admin.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace body template
content = re.sub(
    r'(<td style="padding:10px 5px; color:var\(--ouro\); font-family:\'Space Mono\',monospace;.*?\n.*?font-size:11px;">\$\{t\.perfil \|\| \'Treinador\'\}</td>\s*</tr>;)',
    r'<td style="padding:10px 5px; color:var(--ouro); font-family:\'Space Mono\',monospace; font-size:11px;"></td><td style="padding:10px 5px; text-align: center;"><button onclick="resetarSenhaTreinador(, \'\')" style="background:none; border:none; color:var(--ouro); cursor:pointer; margin-right:8px;" title="Resetar Senha para alfa@123">🔑</button><button onclick="excluirTreinador(, \'\')" style="background:none; border:none; color:#f87171; cursor:pointer;" title="Excluir Usuário">🗑️</button></td></tr>;',
    content,
    flags=re.DOTALL
)

# Add functions if not present
if "excluirTreinador" not in content:
    new_funcs = '''
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

          function logout() {'''
    content = content.replace('          function logout() {', new_funcs)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
