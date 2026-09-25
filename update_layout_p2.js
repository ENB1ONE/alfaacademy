const fs = require('fs');
let code = fs.readFileSync('crm/src/components/Layout.jsx', 'utf8');

const navCode = `
      {/* BOTTOM NAVIGATION (MOBILE) */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <Link to="/" className={\`bottom-nav-item \${location.pathname === '/' ? 'active' : ''}\`}>
            <LayoutDashboard size={22} />
            <span>Início</span>
          </Link>
          <Link to="/chamada" className={\`bottom-nav-item \${location.pathname === '/chamada' ? 'active' : ''}\`}>
            <ClipboardCheck size={22} />
            <span>Chamada</span>
          </Link>
          <Link to="/jogos" className={\`bottom-nav-item \${location.pathname === '/jogos' ? 'active' : ''}\`}>
            <Trophy size={22} />
            <span>Jogos</span>
          </Link>
          <button className="bottom-nav-item" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={22} />
            <span>Menu</span>
          </button>
        </div>
      </nav>
      </div>
    </div>
  );
}`;

code = code.replace(/<\/div>\s*<\/div>\s*\);\s*\}/, navCode);

fs.writeFileSync('crm/src/components/Layout.jsx', code, 'utf8');
console.log("Layout.jsx updated.");
