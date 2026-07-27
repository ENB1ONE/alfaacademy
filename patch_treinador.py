with open("dashboard-treinador.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

new_styles = """
    <style>
        /* Mobile First adjustments */
        @media (max-width: 768px) {
            .app-container { flex-direction: column; }
            .sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--linha); padding: 15px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
            .logo h2 { font-size: 20px; }
            .menu { display: none; } /* Hide normal menu on mobile, or make it horizontal */
            .main-content { padding: 15px; }
            
            .card-treino { flex-direction: column; }
            .btn { width: 100%; text-align: center; }
            .tabs { flex-wrap: wrap; }
            .tab-btn { flex: 1 1 auto; margin-bottom: 5px; }
            
            /* Responsive tables */
            .table-container { overflow-x: auto; }
            table { min-width: 600px; }
        }
        
        .btn-back {
            background: transparent;
            color: var(--ouro);
            border: 1px solid var(--ouro);
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }
        .btn-back:hover {
            background: rgba(248,193,70,0.1);
        }
"""
content = content.replace("<style>", new_styles, 1)

# Add Back button to admin panel if the user is an admin
# Inside the <aside class="sidebar">, I will add the button
back_admin_btn = """
          <div class="menu" style="margin-top: 20px;">
              <button class="btn sec" id="btnVoltarAdmin" style="display:none; width:100%; margin-bottom:15px;" onclick="window.location.href='dashboard-admin.html'">
                  <i class="fas fa-arrow-left"></i> Painel Admin
              </button>
"""
content = content.replace('<div class="menu">', back_admin_btn)

# Add logic to show it if admin
logic_js = """
        const token = localStorage.getItem('alfa_token');
        const perfil = localStorage.getItem('alfa_perfil');

        if (!token || (perfil !== 'Treinador' && perfil !== 'Administrador' && perfil !== 'admin')) {
            window.location.href = 'login.html';
        }
        
        if (perfil === 'Administrador' || perfil === 'admin') {
            document.getElementById('btnVoltarAdmin').style.display = 'block';
        }
"""
content = re.sub(r'const token.*?;.*?\}', logic_js, content, flags=re.DOTALL)

with open("dashboard-treinador.html", "w", encoding="utf-8") as f:
    f.write(content)
