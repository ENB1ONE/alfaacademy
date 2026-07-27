with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Remove inline flexDirection column from layout
text = text.replace("<div className=\"layout\" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>", "<div className=\"layout\">")

# Remove inline styles from sidebar that conflict with css
sidebar_find = """<aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: 260, flexShrink: 0, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>"""
sidebar_replace = """<aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>"""
text = text.replace(sidebar_find, sidebar_replace)

# Remove inline styles from mobile header to put in css
header_find = """<div className="mobile-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'var(--painel)', borderBottom: '1px solid var(--linha)' }}>"""
header_replace = """<div className="mobile-header">"""
text = text.replace(header_find, header_replace)

# Remove inline styles from main-content
main_find = """<main className="main-content" style={{ flexGrow: 1, padding: 40, overflowY: 'auto', overflowX: 'hidden' }}>"""
main_replace = """<main className="main-content">"""
text = text.replace(main_find, main_replace)

# Fix weird characters in Layout.jsx (VisÃ£o Geral, HistÃ³rico)
text = text.replace("VisAo Geral", "Visão Geral")
text = text.replace("HistA3rico de PresenA as", "Histórico de Presenças")

with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("crm/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

new_css = """
/* BASE LAYOUT */
.layout {
  display: flex;
  min-height: 100vh;
  flex-direction: row;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--painel);
  border-right: 1px solid var(--linha);
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.main-content {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  width: calc(100% - 260px);
}

.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--painel);
  border-bottom: 1px solid var(--linha);
  width: 100%;
}

/* RESPONSIVE LAYOUT */
@media (max-width: 768px) {
  .layout {
    flex-direction: column !important;
  }
  
  .mobile-header {
    display: flex !important;
  }
  
  .sidebar {
    position: fixed;
    top: 70px; /* height of mobile header approx */
    left: -100%;
    width: 100% !important;
    height: calc(100vh - 70px);
    transition: left 0.3s ease;
    border-right: none;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .main-content {
    padding: 20px !important;
    width: 100% !important;
  }
  
  .sidebar > div:first-child {
    display: none !important;
  }
}
"""

# Append classes
css += new_css

with open("crm/src/index.css", "w", encoding="utf-8") as f:
    f.write(css)
