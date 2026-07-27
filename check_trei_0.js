

        const API_BASE_URL = 'https://alfa-api.servicesbr.duckdns.org';
        
        const token = localStorage.getItem('alfa_token');
        const perfil = localStorage.getItem('alfa_perfil');

        if (!token || (perfil !== 'Treinador' && perfil !== 'Administrador' && perfil !== 'admin')) {
            window.location.href = 'login.html';
        }
        
        if (perfil === 'Administrador' || perfil === 'admin') {
            document.getElementById('btnVoltarAdmin').style.display = 'block';
        }


        const CATEGORIAS = ['Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'];
        let currentCategory = null;
        let currentAtletas = [];
        let chamadaData = {};

        document.addEventListener('DOMContentLoaded', () => {
            configurarData();
            configurarNavbar();
            renderSessoes();
        });

        function configurarData() {
            const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dataStr = new Date().toLocaleDateString('pt-BR', opcoes);
            document.getElementById('diaAtual').innerText = dataStr.charAt(0).toUpperCase() + dataStr.slice(1);
        }

        function configurarNavbar() {
            const actionsDiv = document.getElementById('topbarActions');
            actionsDiv.innerHTML = `
                <div class="user-badge">
                    <i class="fas fa-user-circle"></i>
                    <span>${localStorage.getItem('usuario_lc') || 'Treinador'}</span>
                </div>
            `;
        }

        function renderSessoes() {
            const container = document.getElementById('sessoesContainer');
            container.innerHTML = CATEGORIAS.map(cat => `
                <div class="sessao-card" onclick="abrirSessao('${cat}')">
                    <div class="sessao-icon"><i class="fas fa-futbol"></i></div>
                    <div class="sessao-info">
                        <h3>Treino ${cat}</h3>
                        <p>Toque para iniciar chamada</p>
                    </div>
                    <div class="sessao-arrow"><i class="fas fa-chevron-right"></i></div>
                </div>
            `).join('');
        }

        function voltarSessoes() {
            document.getElementById('viewChamada').className = 'view-hidden';
            document.getElementById('viewSessoes').className = 'view-active';
            currentCategory = null;
        }

        async function abrirSessao(categoria) {
            currentCategory = categoria;
            document.getElementById('tituloSessaoAtual').innerText = `Treino ${categoria}`;
            
            document.getElementById('viewSessoes').className = 'view-hidden';
            document.getElementById('viewChamada').className = 'view-active';
            
            document.getElementById('listaAtletas').innerHTML = '<div class="carregando"><i class="fas fa-spinner fa-spin"></i> Carregando atletas...</div>';
            
            try {
                const res = await fetch(`${API_BASE_URL}/api/chamada/atletas/${categoria}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resJson = await res.json();
                currentAtletas = resJson.atletas || [];
                chamadaData = {}; 
                renderListaAtletas();
            } catch(e) {
                console.error(e);
                toast('Erro ao carregar atletas. Tente novamente.');
                voltarSessoes();
            }
        }

        function renderListaAtletas() {
            const container = document.getElementById('listaAtletas');
            if (!currentAtletas.length) {
                container.innerHTML = '<div class="vazio">Nenhum atleta cadastrado nesta categoria.</div>';
                return;
            }

            container.innerHTML = currentAtletas.map(a => `
                <div class="atleta-row">
                    <div class="atleta-foto"><i class="fas fa-user"></i></div>
                    <div class="atleta-info">
                        <h4>${a.nome}</h4>
                        <p>Posição: ${a.posicao || '-'}</p>
                    </div>
                    <div class="atleta-actions">
                        <button class="btn-check btn-presente" onclick="marcarPresenca(${a.id}, 'Presente', this)" title="Presente"><i class="fas fa-check"></i></button>
                        <button class="btn-check btn-falta" onclick="marcarPresenca(${a.id}, 'Falta', this)" title="Falta"><i class="fas fa-times"></i></button>
                        <button class="btn-check btn-justificado" onclick="marcarPresenca(${a.id}, 'Justificado', this)" title="Justificado"><i class="fas fa-user-injured"></i></button>
                    </div>
                </div>
            `).join('');
        }

        function marcarPresenca(atletaId, status, btnElement) {
            chamadaData[atletaId] = status;
            
            const row = btnElement.closest('.atleta-actions');
            const btns = row.querySelectorAll('.btn-check');
            btns.forEach(b => b.classList.remove('active'));
            
            btnElement.classList.add('active');
        }

        function marcarTodosPresentes() {
            currentAtletas.forEach(a => {
                chamadaData[a.id] = 'Presente';
            });
            const allBtns = document.querySelectorAll('.btn-check');
            allBtns.forEach(b => b.classList.remove('active'));
            const presBtns = document.querySelectorAll('.btn-presente');
            presBtns.forEach(b => b.classList.add('active'));
            toast('Todos marcados como Presentes');
        }

        async function salvarChamada() {
            const keys = Object.keys(chamadaData);
            if (keys.length === 0) {
                toast('Nenhuma presença marcada.');
                return;
            }

            const payload = {
                categoria: currentCategory,
                chamadas: keys.map(id => ({
                    atleta_id: parseInt(id),
                    status_presenca: chamadaData[id]
                }))
            };

            const btn = document.getElementById('btnSalvarChamada');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_BASE_URL}/api/chamada`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) {
                    throw new Error('Falha na API');
                }

                toast('CHAMADA SALVA COM SUCESSO!');
                setTimeout(() => voltarSessoes(), 1500);

            } catch(e) {
                console.error(e);
                toast(e.message || 'Falha ao sincronizar chamada.');
            } finally {
                btn.innerHTML = '<i class="fas fa-save"></i> SALVAR CHAMADA';
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        }

        function toast(msg) {
            const d = document.createElement('div');
            d.style.position = 'fixed';
            d.style.bottom = '20px';
            d.style.left = '50%';
            d.style.transform = 'translateX(-50%)';
            d.style.background = 'var(--ouro)';
            d.style.color = '#000';
            d.style.padding = '12px 24px';
            d.style.borderRadius = '8px';
            d.style.fontWeight = '700';
            d.style.zIndex = '9999';
            d.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            d.innerText = msg;
            document.body.appendChild(d);
            setTimeout(() => d.remove(), 3000);
        }

        function logout() {
            localStorage.clear();
            window.location.href = 'login.html';
        }

    