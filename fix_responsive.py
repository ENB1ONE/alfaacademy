import re

# 1. Update index.html viewport meta tag
with open("admin/index.html", "r", encoding="utf-8") as f:
    html = f.read()

if "viewport" not in html:
    html = html.replace("<title>", '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\n    <title>')
else:
    html = re.sub(r'<meta name="viewport"[^>]*>', '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">', html)

with open("admin/index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("crm/index.html", "r", encoding="utf-8") as f:
    html = f.read()

if "viewport" not in html:
    html = html.replace("<title>", '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\n    <title>')
else:
    html = re.sub(r'<meta name="viewport"[^>]*>', '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">', html)

with open("crm/index.html", "w", encoding="utf-8") as f:
    f.write(html)

# 2. Update Layout.jsx to have a hamburger menu on mobile
with open("crm/src/components/Layout.jsx", "r", encoding="utf-8") as f:
    layout = f.read()

if "isMobileMenuOpen" not in layout:
    layout = layout.replace("import { LayoutDashboard", "import { useState } from 'react';\nimport { LayoutDashboard, Menu, X,")
    
    comp_start = """export default function Layout() {
  const { user, logout } = useContext(AuthContext);"""
    
    comp_new = """export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);"""
    
    layout = layout.replace(comp_start, comp_new)
    
    # We add a top bar for mobile that shows Logo and Hamburger
    mobile_header = """    <div className="layout" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'var(--painel)', borderBottom: '1px solid var(--linha)' }}>
        <img src='/alfaacademy/admin/alfa_logo.png' alt='Alfa Academy' style={{ width: 100 }} />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--ouro)' }}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
"""
    layout = layout.replace('<div className="layout" style={{ display: \'flex\', minHeight: \'100vh\' }}>', mobile_header)
    
    # Modify Sidebar classes and inline styles to work with CSS
    sidebar_old = """<aside className="sidebar" style={{ width: 260, flexShrink: 0, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>"""
    sidebar_new = """<aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: 260, flexShrink: 0, background: 'var(--painel)', borderRight: '1px solid var(--linha)', padding: 20, display: 'flex', flexDirection: 'column' }}>"""
    layout = layout.replace(sidebar_old, sidebar_new)
    
    # Close the flex row div at the end
    layout = layout.replace("</main>\n    </div>", "</main>\n      </div>\n    </div>")
    
    # Add onClick to NavLinks to close menu on mobile
    layout = layout.replace("const isActive = location.pathname === to", "const isActive = location.pathname === to")
    nav_link_ret = "return (\n      <Link to={to} onClick={() => setIsMobileMenuOpen(false)} style={{"
    layout = layout.replace("return (\n      <Link to={to} style={{", nav_link_ret)
    
    # Also add onClick for Sair to close menu
    layout = layout.replace("const handleLogout = () => {", "const handleLogout = () => {\n    setIsMobileMenuOpen(false);")
    
    with open("crm/src/components/Layout.jsx", "w", encoding="utf-8") as f:
        f.write(layout)

# 3. Update index.css for mobile layout
with open("crm/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

mobile_css = """
/* Responsive Layout */
@media (max-width: 768px) {
  .layout { flex-direction: column !important; }
  .mobile-header { display: flex !important; }
  .sidebar { 
    position: absolute; 
    top: 0; 
    left: -100%; 
    width: 100% !important; 
    height: 100%; 
    z-index: 999; 
    transition: left 0.3s ease; 
    border-right: none !important;
  }
  .sidebar.open {
    left: 0;
  }
  .main-content {
    padding: 20px !important;
    width: 100%;
  }
  /* Ocultar a logo de dentro da sidebar no mobile porque já tem no header */
  .sidebar > div:first-child {
    display: none !important;
  }
}
"""

if ".mobile-header" not in css:
    # Remove the old media query if it exists
    css = re.sub(r'@media \(max-width: 768px\) \{.*?\}', '', css, flags=re.DOTALL)
    css += mobile_css
    
    with open("crm/src/index.css", "w", encoding="utf-8") as f:
        f.write(css)

