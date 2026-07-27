import re

with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix subtabs nav
subtabs_nav = """              <!-- Sub-tabs nav -->
              <div class="subtabs-nav">
                  <button class="subtab-btn active" id="subtabAtletasBtn" onclick="setSubTab('atletas')">Atletas</button>
                  <button class="subtab-btn" id="subtabTreinadoresBtn" onclick="setSubTab('treinadores')">Treinadores</button>
                  <button class="subtab-btn" id="subtabAvisosBtn" onclick="setSubTab('avisos')">Mural de Avisos</button>
              </div>"""
content = re.sub(r'<!-- Sub-tabs nav -->.*?</div>', subtabs_nav, content, flags=re.DOTALL)

# Inject avisos form
avisos_form = """              <!-- FORM AVISOS -->
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

              <!-- Cadastro de Atleta (EvoluA-do) -->
              <div id="subtabAtletasForm" style="display:block;">"""

content = content.replace('<!-- Cadastro de Atleta', avisos_form)

# Make sure setSubTab handles classes correctly (subtab-btn instead of tab-btn usually)
content = content.replace("document.getElementById('subtabAvisosBtn').classList.toggle('active', subtab === 'avisos');", "if(document.getElementById('subtabAvisosBtn')) document.getElementById('subtabAvisosBtn').classList.toggle('active', subtab === 'avisos');")

with open("dashboard-admin.html", "w", encoding="utf-8") as f:
    f.write(content)
