with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Make cards clickable
content = content.replace(
    'TREINADORES</p>',
    'TREINADORES</p>',
    1
).replace(
    '<div class="metric-card">', 
    '<div class="metric-card" onclick="setAdminTab(\'usuarios\'); setSubTab(\'treinadores\')" style="cursor:pointer;" title="Gerenciar treinadores">', 
    1
)

content = content.replace(
    'NO DEPARTAMENTO M',
    'NO DEPARTAMENTO M',
    1
).replace(
    '<div class="metric-card">', 
    '<div class="metric-card" onclick="setAdminTab(\'usuarios\'); setSubTab(\'atletas\')" style="cursor:pointer;" title="Ver atletas no DM">', 
    1
)

# 2. Add sub-tab button for Avisos
subtab_btns = """
                <button class="tab-btn active" id="subtabAtletasBtn" onclick="setSubTab('atletas')">Atletas Cadastrados</button>
                <button class="tab-btn" id="subtabTreinadoresBtn" onclick="setSubTab('treinadores')">Comissão Técnica</button>
                <button class="tab-btn" id="subtabAvisosBtn" onclick="setSubTab('avisos')">Mural de Avisos</button>
"""
content = re.sub(
    r'<button class="tab-btn active" id="subtabAtletasBtn".*?</button>\s*<button class="tab-btn" id="subtabTreinadoresBtn".*?</button>',
    subtab_btns,
    content,
    flags=re.DOTALL
)

# 3. Add Avisos section in Gestão de Usuários
avisos_form = """
              <!-- FORM AVISOS -->
              <div id="subtabAvisosForm" style="display:none;">
                  <div class="form-section">
                      <h3>Adicionar Novo Aviso</h3>
                      <form id="formAddAviso" style="display:flex; flex-direction:column; gap:12px; max-width:500px;" onsubmit="return false;">
                          <input type="text" id="avisoTitulo" class="input-dark" placeholder="Título (ex: Feriado Nacional)" required>
                          <textarea id="avisoDescricao" class="input-dark" placeholder="Descrição da atividade ou aviso..." required style="min-height:80px;"></textarea>
                          <select id="avisoTipo" class="input-dark">
                              <option value="Aviso">Aviso Geral</option>
                              <option value="Servidor">Sistema/Servidor</option>
                              <option value="Presença">Lembrete de Presença</option>
                              <option value="Evento">Evento/Jogo</option>
                          </select>
                          <button type="button" class="btn" id="btnSalvarAviso" onclick="salvarAviso()" style="align-self:flex-start;">Publicar Aviso</button>
                      </form>
                  </div>
                  
                  <div class="form-section" style="margin-top: 30px;">
                      <h3>Avisos Publicados</h3>
                      <div style="overflow-x:auto;">
                          <table class="data-table">
                              <thead>
                                  <tr>
                                      <th>Título</th>
                                      <th>Tipo</th>
                                      <th>Data</th>
                                      <th>Ações</th>
                                  </tr>
                              </thead>
                              <tbody id="tblAvisosCorpo">
                                  <tr><td colspan="4" style="text-align:center; padding:15px; color:var(--cinza);">Carregando mural...</td></tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
"""
content = re.sub(
    r'(<!-- ================= FORMULÁRIOS DE CADASTRO ================= -->.*?)(<div id="subtabAtletasForm" style="display:block;">)',
    r'\1' + avisos_form + r'\2',
    content,
    flags=re.DOTALL
)

# 4. Modify setSubTab JS
set_subtab_js = """
        function setSubTab(subtab) {
            document.getElementById('subtabAtletasBtn').classList.toggle('active', subtab === 'atletas');
            document.getElementById('subtabTreinadoresBtn').classList.toggle('active', subtab === 'treinadores');
            document.getElementById('subtabAvisosBtn').classList.toggle('active', subtab === 'avisos');
            document.getElementById('subtabAtletasForm').style.display = subtab === 'atletas' ? 'block' : 'none';
            document.getElementById('subtabTreinadoresForm').style.display = subtab === 'treinadores' ? 'block' : 'none';
            document.getElementById('subtabAvisosForm').style.display = subtab === 'avisos' ? 'block' : 'none';
            if(subtab === 'avisos') carregarGestaoAvisos();
        }
"""
content = re.sub(
    r'function setSubTab\(subtab\) \{.*?\n\s*\}',
    set_subtab_js,
    content,
    flags=re.DOTALL
)

# 5. Add Avisos CRUD JS
avisos_crud_js = """
        async function carregarGestaoAvisos() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/avisos`, { headers: { 'Authorization': `Bearer ${token}` } });
                if(res.ok) {
                    const data = await res.json();
                    const list = data.avisos || [];
                    const tbody = document.getElementById('tblAvisosCorpo');
                    if(!list.length) {
                        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--cinza);">Nenhum aviso no mural.</td></tr>';
                        return;
                    }
                    tbody.innerHTML = list.map(a => {
                        const d = new Date(a.data_criacao).toLocaleDateString('pt-BR');
                        return `<tr style="border-bottom:1px solid var(--linha);">
                            <td style="padding:10px 5px; font-weight:600;">${a.titulo}</td>
                            <td style="padding:10px 5px; color:var(--cinza);"><span class="recent-tag" style="position:static;">${a.tipo}</span></td>
                            <td style="padding:10px 5px; color:var(--cinza);">${d}</td>
                            <td style="padding:10px 5px; text-align:center;"><button onclick="excluirAviso(${a.id})" style="background:none; border:none; color:#f87171; cursor:pointer;" title="Excluir">Excluir</button></td>
                        </tr>`;
                    }).join('');
                }
            } catch(e) { console.error(e); }
        }

        async function salvarAviso() {
            const titulo = document.getElementById('avisoTitulo').value;
            const descricao = document.getElementById('avisoDescricao').value;
            const tipo = document.getElementById('avisoTipo').value;
            if(!titulo || !descricao) { toast('Preencha título e descrição'); return; }
            
            const btn = document.getElementById('btnSalvarAviso');
            btn.innerHTML = 'Publicando...'; btn.disabled = true;
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/avisos`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo, descricao, tipo })
                });
                if(res.ok) {
                    toast('Aviso publicado no mural!');
                    document.getElementById('avisoTitulo').value = '';
                    document.getElementById('avisoDescricao').value = '';
                    carregarGestaoAvisos();
                } else throw new Error('Erro da API');
            } catch(e) { toast('Falha ao salvar aviso'); }
            finally { btn.innerHTML = 'Publicar Aviso'; btn.disabled = false; }
        }

        async function excluirAviso(id) {
            if(!confirm('Remover este aviso do mural?')) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/avisos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) {
                    toast('Aviso removido.');
                    carregarGestaoAvisos();
                }
            } catch(e) { toast('Falha ao excluir'); }
        }

        async function carregarRelatorio() {
            document.getElementById('tblRelatorioFrequencia').innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:var(--cinza);"><i class="fas fa-spinner fa-spin"></i> Processando dados...</td></tr>';
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/relatorios`, { headers: { 'Authorization': `Bearer ${token}` } });
                if(res.ok) {
                    const data = await res.json();
                    const list = data.estatisticas || [];
                    const tbody = document.getElementById('tblRelatorioFrequencia');
                    if(!list.length) {
                        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:var(--cinza);">Nenhum dado de chamada registrado.</td></tr>';
                        return;
                    }
                    tbody.innerHTML = list.map(c => `
                        <tr style="border-bottom:1px solid var(--linha);">
                            <td style="padding:10px 5px; font-weight:600;">Sub-${c.categoria.replace('Sub-', '')}</td>
                            <td style="padding:10px 5px; color:var(--cinza);">${c.total_sessoes}</td>
                            <td style="padding:10px 5px; color:var(--cinza);">${c.atletas_ativos}</td>
                            <td style="padding:10px 5px; color:var(--ouro); font-weight:bold;">${Math.round(c.presenca_media || 0)}%</td>
                        </tr>
                    `).join('');
                } else { throw new Error('Erro na API'); }
            } catch(e) { 
                console.error(e);
                document.getElementById('tblRelatorioFrequencia').innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:#f87171;">Erro ao carregar relatório.</td></tr>';
            }
        }
"""
if "async function carregarGestaoAvisos" not in content:
    content = content.replace('function logout() {', avisos_crud_js + '\n        function logout() {')

with open("dashboard-admin.html", "w", encoding="utf-8") as f:
    f.write(content)
