const fs = require('fs');
let content = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');

if (!content.includes("import { useNavigate }")) {
    content = content.replace(
        "import { useState, useEffect } from 'react';",
        "import { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';"
    );
    content = content.replace(
        "export default function Overview() {",
        "export default function Overview() {\n  const navigate = useNavigate();"
    );
}

// Replace DM Card div with onClick navigation
content = content.replace(
    `<div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Activity size={24} />
          </div>`,
    `<div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/atletas?status=dm')}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Activity size={24} />
          </div>`
);

fs.writeFileSync('crm/src/pages/Overview.jsx', content, 'utf8');
console.log('Overview.jsx updated');
