const fs = require('fs');
let code = fs.readFileSync('crm/src/index.css', 'utf8');

const cssToAdd = `
/* ==========================================
   UX/UI IMPROVEMENTS (PHASE 1)
   ========================================== */

/* Skeleton Loading Animation */
@keyframes skeleton-loading {
  0% { background-color: rgba(255, 255, 255, 0.05); }
  50% { background-color: rgba(255, 255, 255, 0.12); }
  100% { background-color: rgba(255, 255, 255, 0.05); }
}

.skeleton {
  animation: skeleton-loading 1.5s infinite ease-in-out;
  border-radius: var(--radius-sm);
  color: transparent !important;
  user-select: none;
}
.skeleton * {
  visibility: hidden;
}

/* Sticky Bottom Action Bar (For Mobile Saves) */
.sticky-bottom-action {
  position: sticky;
  bottom: 20px;
  z-index: 100;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(234, 179, 8, 0.3);
  box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
  margin-top: 30px;
  animation: slideUpFade 0.4s ease-out;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Search Input Clear Button Enhancement */
.search-input-wrapper {
  position: relative;
  width: 100%;
}
.search-input-wrapper input {
  transition: all 0.3s ease;
}
.search-input-wrapper input:focus {
  box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.3);
  border-color: var(--ouro) !important;
}
.clear-search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--cinza);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
}
.clear-search-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
`;

if (!code.includes('UX/UI IMPROVEMENTS (PHASE 1)')) {
    fs.writeFileSync('crm/src/index.css', code + '\n' + cssToAdd, 'utf8');
    console.log("CSS added.");
} else {
    console.log("CSS already exists.");
}
