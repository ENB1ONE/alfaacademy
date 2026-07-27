with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Total Atletas clickable
content = content.replace(
    '<div class="metric-card">', 
    '<div class="metric-card" onclick="setAdminTab(\'usuarios\'); setSubTab(\'atletas\')" style="cursor:pointer;" title="Ver ficha de atletas">', 
    1
)

# 2. Add id to recent-list and clear it
content = re.sub(
    r'<div class="recent-list">.*?</div>\s*</div>',
    '<div class="recent-list" id="listaAvisos">\n                    <div style="color:var(--cinza); padding:10px;">Carregando avisos...</div>\n                </div>\n            </div>',
    content,
    flags=re.DOTALL
)

# 3. Modify carregarMetricas to also fetch avisos
carregarAvisos = """
        async function carregarAvisos() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/avisos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) {
                    const data = await res.json();
                    const container = document.getElementById('listaAvisos');
                    if(data.avisos && data.avisos.length > 0) {
                        container.innerHTML = data.avisos.map(a => `
                            <div class="recent-item">
                                <div class="recent-info">
                                    <b>${a.titulo}</b>
                                    <span>${a.descricao}</span>
                                </div>
                                <span class="recent-tag">${a.tipo}</span>
                            </div>
                        `).join('');
                    } else {
                        container.innerHTML = '<div style="color:var(--cinza); padding:10px;">Nenhum aviso no mural.</div>';
                    }
                }
            } catch(e) {
                console.error('Erro ao carregar avisos', e);
            }
        }
"""
if "function carregarAvisos" not in content:
    content = content.replace('async function carregarMetricas() {', carregarAvisos + '\n        async function carregarMetricas() {')
    content = content.replace('document.getElementById(\'valAtletasDM\').textContent = m.total_dm ?? 0;', 'document.getElementById(\'valAtletasDM\').textContent = m.total_dm ?? 0;\n                        carregarAvisos();')

with open("dashboard-admin.html", "w", encoding="utf-8") as f:
    f.write(content)
