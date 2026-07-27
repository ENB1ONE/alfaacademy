import os

# 1. Update index.css for responsiveness
with open("crm/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

# Add media queries if not already present
if "@media (max-width: 768px)" not in css:
    css += """

/* ====== RESPONSIVIDADE (MOBILE) ====== */
@media (max-width: 768px) {
  /* Layout principal */
  .layout {
    flex-direction: column !important;
  }
  
  /* Esconde a sidebar lateral no mobile (ou transforma num menu de topo/baixo) */
  .sidebar {
    width: 100% !important;
    height: auto !important;
    position: static !important;
    padding: 15px !important;
    display: flex;
    flex-direction: column;
  }

  .sidebar nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  .sidebar a {
    padding: 10px 15px !important;
    margin-bottom: 0 !important;
    font-size: 14px !important;
    flex: 1 1 45%;
    text-align: center;
    justify-content: center;
  }

  /* O conteAdo principal */
  .main-content {
    margin-left: 0 !important;
    width: 100% !important;
    padding: 15px !important;
  }

  /* Ajustar tabelas para nA£o quebrarem a tela */
  .card table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  /* Ajustar os grids do Dashboard e FormulA¡rios */
  form {
    grid-template-columns: 1fr !important;
  }
  
  .card {
    padding: 15px !important;
  }

  /* BotAµes e inputs ocupam a tela toda no mobile */
  input, select, .btn {
    width: 100%;
  }

  /* Dashboard Cards */
  div[style*="grid-template-columns: repeat"] {
    grid-template-columns: 1fr !important;
  }
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
"""
    with open("crm/src/index.css", "w", encoding="utf-8") as f:
        f.write(css.replace("A£", "ã").replace("A¡", "á").replace("Aµ", "õ").replace("Ado", "údo"))

# 2. Update Layout.jsx to change from grid to flex for easier media querying
with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    layout = f.read()

# Replace the layout style container
layout = layout.replace("display: 'grid', gridTemplateColumns: '260px 1fr'", "display: 'flex', flexDirection: 'row'")
layout = layout.replace("className=\\\"sidebar\\\" style={{", "className=\"sidebar\" style={{ width: 260, flexShrink: 0, ")
layout = layout.replace("className=\\\"main-content\\\" style={{", "className=\"main-content\" style={{ flexGrow: 1, overflowX: 'hidden', ")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(layout)
