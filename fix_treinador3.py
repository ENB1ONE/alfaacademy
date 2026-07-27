import re
with open("dashboard-treinador.html", "r", encoding="utf-8") as f:
    content = f.read()

# Make the JS safe
content = content.replace("document.getElementById('btnVoltarAdmin').style.display = 'block';", "const btn = document.getElementById('btnVoltarAdmin'); if(btn) btn.style.display = 'block';")

# Ensure the button exists in the HTML
if 'id="btnVoltarAdmin"' not in content:
    # insert it after <aside class="sidebar"> or similar
    btn_html = """
          <div class="menu" style="margin-top: 20px;">
              <button class="btn sec" id="btnVoltarAdmin" style="display:none; width:100%; margin-bottom:15px;" onclick="window.location.href='dashboard-admin.html'">
                  <i class="fas fa-arrow-left"></i> Painel Admin
              </button>
          </div>
"""
    content = content.replace('<aside class="sidebar">', '<aside class="sidebar">' + btn_html)

with open("dashboard-treinador.html", "w", encoding="utf-8") as f:
    f.write(content)
