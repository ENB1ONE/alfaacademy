
        const API_BASE_URL = 'https://alfa-api.servicesbr.duckdns.org';

        // Check Session
        const token = localStorage.getItem('alfa_token');
        const profile = localStorage.getItem('alfa_profile');
        const nome = localStorage.getItem('alfa_nome');

        if (!token || (profile !== 'admin' && profile !== 'Administrador')) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            document.getElementById('adminUserName').textContent = nome || 'Administrador Geral';
            const initial = (nome || 'A').slice(0, 1).toUpperCase();
            document.getElementById('desktopAvatar').textContent = initial;
            document.getElementById('mobAvatar').textContent = initial;
            carregarMetricas();
        }

        // Sidebar responsive toggle
        function toggleSidebar(open) {
            const sidebar = document.getElementById('adminSidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (open) {
                sidebar.classList.add('open');
                overlay.style.display = 'block';
            } else {
                sidebar.classList.remove('open');
                overlay.style.display = 'none';
            }
        }

        // Helper de Toast
        function toast(msg) {
          const t = document.getElementById('toast');
          t.textContent = msg;
          t.classList.add('show');
          setTimeout(() => t.classList.remove('show'), 3000);
        }

        // Main tabs switching
        function setAdminTab(tab, event) {
          if (event) event.preventDefault();
          toggleSidebar(false); // Close sidebar on mobile
          
          const items = document.querySelectorAll('.admin-menu-item');
          items.forEach(el => el.classList.remove('active'));
          
          const activeItem = Array.from(items).find(el => el.getAttribute('href') === '#' + 'admin-' + tab);
          if (activeItem) activeItem.classList.add('active');
          
                      const labelMap = { 'visao': 'Visão Geral', 'usuarios': 'Gestão de Usuários', 'relatorios': 'Relatórios' };
            document.getElementById('adminCurrentTabLabel').textContent = labelMap[tab] || 'Painel Admin';
            
            const heroTitle = document.querySelector('.hero-title');
            if(heroTitle) heroTitle.textContent = labelMap[tab] || 'Painel Admin';

          document.getElementById('adminCurrentTabLabel').textContent = labelMap[tab] || 'Painel Admin';
          
          // Switch main divs
          document.getElementById('adminVisaoSection').style.display = tab === 'visao' ? 'block' : 'none';
          document.getElementById('adminGestaoSection').style.display = tab === 'usuarios' ? 'block' : 'none';
          document.getElementById('adminRelatoriosSection').style.display = tab === 'relatorios' ? 'block' : 'none';
          
          if (tab === 'usuarios') {
              carregarAtletas();
              carregarTreinadores();
          } else if (tab === 'visao') {
              carregarMetricas();
          }
        }

        // Sub tabs of Gestão de Usuários
        
        function setSubTab(subtab) {
            document.getElementById('subtabAtletasBtn').classList.toggle('active', subtab === 'atletas');
            document.getElementById('subtabTreinadoresBtn').classList.toggle('active', subtab === 'treinadores');
            if(document.getElementById('subtabAvisosBtn')) document.getElementById('subtabAvisosBtn').classList.toggle('active', subtab === 'avisos');
            document.getElementById('subtabAtletasForm').style.display = subtab === 'atletas' ? 'block' : 'none';
            document.getElementById('subtabTreinadoresForm').style.display = subtab === 'treinadores' ? 'block' : 'none';
            document.getElementById('subtabAvisosForm').style.display = subtab === 'avisos' ? 'block' : 'none';
            if(subtab === 'avisos') carregarGestaoAvisos();
        }


        
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

        async function carregarMetricas() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/metricas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.success && data.metricas) {
                        const m = data.metricas;
                        const el1 = document.getElementById('valTotalAtletas'); if(el1) el1.textContent = m.total_atletas ?? 0;
                        const el2 = document.getElementById('valTotalTreinadores'); if(el2) el2.textContent = m.total_treinadores ?? 3;
                        const el3 = document.getElementById('valAtletasDM'); if(el3) el3.textContent = m.total_dm ?? 0;
                        carregarAvisos();
                        const el4 = document.getElementById('valPresencaMedia'); if(el4) el4.textContent = '92%';
                    } else {
                        fallbackMetricas();
                    }
                } else {
                    fallbackMetricas();
                }
            } catch(e) {
                console.error(e);
                fallbackMetricas();
            }
        }

        async function fallbackMetricas() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/atletas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const listJson = await res.json();
                    const list = listJson.atletas || [];
                    const el1 = document.getElementById('valTotalAtletas'); if(el1) el1.textContent = list.length || 0;
                }
            } catch(e) {}
        }

        async function carregarAtletas() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/atletas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                const list = data.atletas || [];
                const tbody = document.getElementById('tblAtletasCorpo'); if(!tbody) return;
                if (!list.length) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--cinza);">Nenhum atleta cadastrado.</td></tr>';
                    return;
                }
                tbody.innerHTML = list.map(a => {
                    const status = a.status_medico || a.statusMedico || 'Apto';
                    return `<tr style="border-bottom:1px solid var(--linha);">
                        <td style="padding:10px 5px; font-weight:600;">${a.nome}</td>
                        <td style="padding:10px 5px; color:var(--cinza);">${a.categoria}</td>
                        <td style="padding:10px 5px; color:var(--cinza);">${a.posicao || 'Sem posição'}</td>
                        <td style="padding:10px 5px;">
                            <select onchange="alterarStatusMedico(${a.id}, this.value)" style="height:32px; padding:4px 8px; font-size:12px; width:auto; border-radius:6px; background:var(--preto-3); border-color:var(--linha-2);">
                                <option value="Apto" ${status === 'Apto' ? 'selected' : ''}>Apto</option>
                                <option value="Lesionado" ${status === 'Lesionado' ? 'selected' : ''}>Lesionado</option>
                                <option value="Afastado" ${status === 'Afastado' ? 'selected' : ''}>Afastado</option>
                            </select>
                        </td>
                    </tr>`;
                }).join('');
            } catch(e) {
                console.error(e);
            }
        }

        async function carregarTreinadores() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/treinadores`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                const list = data.treinadores || [];
                const tbody = document.getElementById('tblTreinadoresCorpo'); if(!tbody) return;
                if (!list.length) {
                    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:10px; color:var(--cinza);">Nenhum treinador cadastrado.</td></tr>';
                    return;
                }
                tbody.innerHTML = list.map(t => {
                    return `<tr style="border-bottom:1px solid var(--linha);">
                        <td style="padding:10px 5px; font-weight:600;">${t.nome}</td>
                        <td style="padding:10px 5px; color:var(--cinza);">${t.usuario_lc || t.usuario || ''}</td>
                        <td style="padding:10px 5px; color:var(--ouro); font-family:'Space Mono',monospace; font-size:11px;">${t.perfil || 'Treinador'}</td><td style="padding:10px 5px; text-align: center;"><button onclick="resetarSenhaTreinador(${t.id}, '${t.nome}')" style="background:none; border:none; color:var(--ouro); cursor:pointer; margin-right:8px;" title="Resetar Senha">Resetar</button><button onclick="excluirTreinador(${t.id}, '${t.nome}')" style="background:none; border:none; color:#f87171; cursor:pointer;" title="Excluir">Excluir</button></td>
                    </tr>`;
                }).join('');
            } catch(e) {
                console.error(e);
            }
        }

        async function alterarStatusMedico(id, newStatus) {
            try {
                toast('Salvando status...');
                const res = await fetch(`${API_BASE_URL}/api/admin/atletas/${id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status_medico: newStatus })
                });
                
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.erro || 'Falha ao alterar status.');
                }
                toast('Status médico atualizado!');
                carregarMetricas();
            } catch(e) {
                toast(e.message || 'Erro ao salvar.');
                carregarAtletas();
            }
        }

        async function adminCadastrarAtleta() {
          const nomeInput = document.getElementById('adminAtletaNome').value.trim();
          const cat = document.getElementById('adminAtletaCat').value;
          const pos = document.getElementById('adminAtletaPos').value;
          const resp = document.getElementById('adminAtletaResp').value.trim();
          const tel = document.getElementById('adminAtletaTel').value.trim();
          const med = document.getElementById('adminAtletaMed').value;
          
          const btn = document.getElementById('btnAdminCadAtleta');

          if (nomeInput.length < 2 || nomeInput.length > 60) {
            toast('Nome deve ter entre 2 e 60 caracteres.');
            return;
          }
          
          try {
            btn.classList.add('btn-loading');
            const res = await fetch(`${API_BASE_URL}/api/admin/atletas`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ 
                  nome: nomeInput, 
                  categoria: cat, 
                  posicao: pos,
                  nome_responsavel: resp || null,
                  telefone_responsavel: tel || null,
                  status_medico: med
              })
            });
            
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.erro || 'Falha ao cadastrar atleta.');
            }
            
            toast('Atleta cadastrado com sucesso!');
            document.getElementById('adminAtletaNome').value = '';
            document.getElementById('adminAtletaResp').value = '';
            document.getElementById('adminAtletaTel').value = '';
            carregarMetricas();
            carregarAtletas();
          } catch(e) {
            toast(e.message || 'Erro de conexão.');
          } finally {
            btn.classList.remove('btn-loading');
          }
        }

        async function adminCadastrarTreinador() {
            const nomeInput = document.getElementById('adminTreinadorNome').value.trim();
            const user = document.getElementById('adminTreinadorUser').value.trim();
            const pass = document.getElementById('adminTreinadorSenha').value;
            const perf = document.getElementById('adminTreinadorPerfil').value;
            
            const btn = document.getElementById('btnAdminCadTreinador');

            if (!nomeInput || !user || !pass) {
                toast('Por favor, preencha todos os campos.');
                return;
            }

            try {
                btn.classList.add('btn-loading');
                const res = await fetch(`${API_BASE_URL}/api/admin/treinadores`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nome: nomeInput,
                        usuario_lc: user,
                        senha: pass,
                        perfil: perf
                    })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.erro || 'Falha ao cadastrar comissão.');
                }

                toast('Treinador/Admin cadastrado com sucesso!');
                document.getElementById('adminTreinadorNome').value = '';
                document.getElementById('adminTreinadorUser').value = '';
                document.getElementById('adminTreinadorSenha').value = '';
                carregarTreinadores();
            } catch(e) {
                toast(e.message || 'Erro de conexão.');
            } finally {
                btn.classList.remove('btn-loading');
            }
        }

        
          async function excluirTreinador(id, nome) {
              if(!confirm(`Tem certeza que deseja EXCLUIR o usuário ${nome}?`)) return;
              try {
                  const res = await fetch(`${API_BASE_URL}/api/admin/treinadores/${id}`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Bearer ${token}` }
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
              if(!confirm(`Resetar a senha de ${nome} para alfa@123?`)) return;
              try {
                  const res = await fetch(`${API_BASE_URL}/api/admin/treinadores/${id}/reset-senha`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if(!res.ok) throw new Error('Falha ao resetar senha');
                  toast('Senha resetada para alfa@123!');
              } catch(e) {
                  toast(e.message);
              }
          }

          
        async function carregarGestaoAvisos() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/avisos`, { headers: { 'Authorization': `Bearer ${token}` } });
                if(res.ok) {
                    const data = await res.json();
                    const list = data.avisos || [];
                    const tbody = document.getElementById('tblAvisosCorpo'); if(!tbody) return;
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
                    const tbody = document.getElementById('tblRelatorioFrequencia'); if(!tbody) return;
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

        function logout() {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    