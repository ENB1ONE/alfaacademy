
const sidebarHTML = `<aside class="admin-sidebar" id="adminSidebar">
        <div class="admin-sidebar-nav">
          <div class="admin-brand">
            <img src="./logo.png" alt="Alfa Academy Logo" onerror="this.style.display='none'">
            <div class="admin-brand-text">
              <span class="n">Alfa Academy</span>
              <span class="p">Painel Admin</span>
            </div>
          </div>
          <a href="#admin-visao" class="admin-menu-item active" onclick="setAdminTab('visao', event)">Visão Geral</a>
          <a href="#admin-usuarios" class="admin-menu-item" onclick="setAdminTab('usuarios', event)">Gestão de Usuários</a>
          <a href="#admin-relatorios" class="admin-menu-item" onclick="setAdminTab('relatorios', event)">Relatórios</a>
          <a href="dashboard-treinador.html" class="admin-menu-item" style="border-color: rgba(248,193,70,0.3); color: var(--ouro);">Modo Treinador (Chamada)</a>
        </div>
        <button class="btn sec" style="padding:10px; margin-top:20px; font-size:12px; height: 38px;" onclick="logout()">Sair do Painel</button>
      </aside>`;
document.write(sidebarHTML);
