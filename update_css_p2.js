const fs = require('fs');
let code = fs.readFileSync('crm/src/index.css', 'utf8');

const cssToAdd = `
/* ==========================================
   UX/UI IMPROVEMENTS (PHASE 2 - MOBILE)
   ========================================== */

/* Bottom Navigation Bar */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65px;
  background: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav-inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--cinza);
  text-decoration: none;
  font-size: 10px;
  font-weight: 600;
  width: 25%;
  height: 100%;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.bottom-nav-item.active {
  color: var(--ouro);
}

.bottom-nav-item:active {
  transform: scale(0.9);
}

/* Hide desktop sidebar on mobile, adjust layout */
@media (max-width: 768px) {
  .bottom-nav {
    display: block;
  }
  .main-content {
    padding-bottom: 85px !important; /* Space for bottom nav */
  }
  /* Optional: Hide the top header if you want full app feel, 
     but maybe just hide the hamburger if we use the bottom menu instead. */
  .mobile-header .menu-btn {
    display: none; /* The menu is now accessed via bottom nav */
  }
}
`;

if (!code.includes('UX/UI IMPROVEMENTS (PHASE 2')) {
    fs.writeFileSync('crm/src/index.css', code + '\n' + cssToAdd, 'utf8');
}
