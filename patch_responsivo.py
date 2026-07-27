with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add CSS for mobile responsivity and hero header
new_styles = """
    <style>
        /* Mobile first additions */
        @media (max-width: 768px) {
            .admin-container { flex-direction: column; }
            .admin-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--linha); display: flex; flex-direction: row; overflow-x: auto; padding: 10px; }
            .admin-logo { display: none; }
            .admin-menu { flex-direction: row; margin: 0; display: flex; gap: 10px; }
            .admin-menu-item { margin: 0; font-size: 13px; padding: 10px; white-space: nowrap; }
            .admin-content { padding: 15px; }
            .metric-grid { grid-template-columns: 1fr; }
            .subtabs-nav { flex-wrap: wrap; }
            .subtab-btn { flex: 1 1 auto; text-align: center; }
            
            /* Responsive tables */
            .data-table { display: block; overflow-x: auto; white-space: nowrap; }
        }
        
        /* Hero Header */
        .hero-header {
            position: relative;
            background: linear-gradient(rgba(10,10,12,0.6), rgba(10,10,12,0.9)), url('assets/img/alfa_academy_hero.png') center 20%/cover no-repeat;
            border-radius: var(--radius);
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: var(--sombra);
            border: 1px solid rgba(248, 193, 70, 0.15);
            overflow: hidden;
        }
        .hero-header::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, rgba(248,193,70,0.1) 0%, transparent 100%);
            pointer-events: none;
        }
        .hero-title {
            font-family: 'Anton', sans-serif;
            font-size: 32px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 10px 0;
            position: relative;
            z-index: 1;
        }
        .hero-subtitle {
            font-size: 15px;
            color: #ddd;
            margin: 0;
            position: relative;
            z-index: 1;
            font-weight: 300;
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

# Inject Hero Header inside the main content before sections
hero_html = """          <!-- HERO HEADER -->
          <div class="hero-header" id="heroHeader">
              <h1 class="hero-title">Painel de Controle</h1>
              <p class="hero-subtitle">Bem-vindo ao centro de comando do Alfa Academy.</p>
          </div>
          
          <!-- ================= TAB: VISÃO GERAL ================= -->"""
content = content.replace("<!-- ================= TAB: VISÃO GERAL ================= -->", hero_html)

# Add Back buttons in subtabs
back_btn_html = '<button class="btn-back" onclick="setAdminTab(\'visao\')"><i class="fas fa-arrow-left"></i> Voltar ao Painel</button>\n              '
content = content.replace('<div class="subtabs-nav">', back_btn_html + '<div class="subtabs-nav">')

# Modify label updates to update the Hero Title instead of the small span
js_hero = """            const labelMap = { 'visao': 'Visão Geral', 'usuarios': 'Gestão de Usuários', 'relatorios': 'Relatórios' };
            document.getElementById('adminCurrentTabLabel').textContent = labelMap[tab] || 'Painel Admin';
            
            const heroTitle = document.querySelector('.hero-title');
            if(heroTitle) heroTitle.textContent = labelMap[tab] || 'Painel Admin';
"""
content = re.sub(r'const labelMap.*?;', js_hero, content, flags=re.DOTALL)

with open("dashboard-admin.html", "w", encoding="utf-8") as f:
    f.write(content)
