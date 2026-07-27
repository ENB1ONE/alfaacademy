import os
import re

with open("dashboard-admin.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Create Directories
os.makedirs("css", exist_ok=True)
os.makedirs("js", exist_ok=True)

# 2. Extract CSS
style_match = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
css_content = style_match.group(1) if style_match else ""
with open("css/admin.css", "w", encoding="utf-8") as f:
    f.write(css_content)

# Remove style from HTML (will be replaced by link tag)
html = re.sub(r"<style>.*?</style>", '<link rel="stylesheet" href="css/admin.css">', html, flags=re.DOTALL)

# 3. Extract Sidebar
sidebar_match = re.search(r'(<aside class="admin-sidebar" id="adminSidebar">.*?</aside>)', html, re.DOTALL)
sidebar_html = sidebar_match.group(1) if sidebar_match else ""

# Modify the sidebar links in the extracted HTML to point to real files
sidebar_html = sidebar_html.replace("onclick=\"setAdminTab('visao')\"", 'onclick="window.location.href=\'admin-dashboard.html\'"')
sidebar_html = sidebar_html.replace("onclick=\"setAdminTab('usuarios')\"", 'onclick="window.location.href=\'admin-atletas.html\'"')
sidebar_html = sidebar_html.replace("onclick=\"setAdminTab('relatorios')\"", 'onclick="window.location.href=\'admin-relatorios.html\'"')

sidebar_js = f"""
const sidebarHTML = `{sidebar_html}`;
document.write(sidebarHTML);
"""
with open("js/admin-sidebar.js", "w", encoding="utf-8") as f:
    f.write(sidebar_js)

# Replace the aside in the original HTML with the script inclusion
html = re.sub(r'<aside class="admin-sidebar" id="adminSidebar">.*?</aside>', '<script src="js/admin-sidebar.js"></script>', html, flags=re.DOTALL)

# 4. Extract Javascript logic
script_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
js_content = script_match.group(1) if script_match else ""

# Remove the JS logic from HTML
html = re.sub(r'<script>.*?</script>', '<script src="js/admin.js"></script>', html, flags=re.DOTALL)

# Write js/admin.js
with open("js/admin.js", "w", encoding="utf-8") as f:
    f.write(js_content)

# 5. Extract Sections to create individual pages
header_part = html.split('<!-- HERO HEADER -->')[0]
footer_part = "    </div>\n</body>\n</html>"

hero_header = """          <!-- HERO HEADER -->
          <div class="hero-header" id="heroHeader">
              <h1 class="hero-title" id="pageTitle">Painel de Controle</h1>
              <p class="hero-subtitle">Bem-vindo ao centro de comando do Alfa Academy.</p>
          </div>
"""

# Extract the sections
visao_section = re.search(r'<div id="adminVisaoSection">(.*?)</div>\s*<!-- ================= TAB: GEST', html, re.DOTALL)
visao_content = visao_section.group(1) if visao_section else ""

atletas_section = re.search(r'<div id="subtabAtletasForm" style="display:block;">(.*?)</div>\s*<!-- Cadastro de Treinador', html, re.DOTALL)
atletas_content = atletas_section.group(1) if atletas_section else ""

treinador_section = re.search(r'<div id="subtabTreinadoresForm" style="display:none;">(.*?)</div>\s*<!-- FORM AVISOS -->', html, re.DOTALL)
treinador_content = treinador_section.group(1) if treinador_section else ""

avisos_section = re.search(r'<div id="subtabAvisosForm" style="display:none;">(.*?)</div>\s*<!-- Cadastro de Atleta', html, re.DOTALL)
avisos_content = avisos_section.group(1) if avisos_section else ""

relatorios_section = re.search(r'<div id="adminRelatoriosSection" style="display:none; margin-top: 20px;">(.*?)</div>\s*</div>\s*</div>\s*</body>', html, re.DOTALL)
relatorios_content = relatorios_section.group(1) if relatorios_section else ""

# Helper to generate a page
def create_page(filename, title, content):
    # Fix 'display:none' if present in the content blocks (they should be visible now)
    # Actually, we extracted the inside of the sections, so we just wrap them in a container
    page_html = header_part + hero_header.replace('Painel de Controle', title) + f'\n<div class="page-content">\n{content}\n</div>\n' + footer_part
    with open(filename, "w", encoding="utf-8") as f:
        f.write(page_html)

create_page("admin-dashboard.html", "Visão Geral", visao_content)
create_page("admin-atletas.html", "Gestão de Atletas", atletas_content)
create_page("admin-treinadores.html", "Gestão de Treinadores", treinador_content)
create_page("admin-avisos.html", "Mural de Avisos", avisos_content)
create_page("admin-relatorios.html", "Relatórios", relatorios_content)

print("Refactoring complete!")
