const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/PerfilAtleta.jsx', 'utf8');

// 1. Remove Share2 and MoreHorizontal and their container
const topIconsRegex = /<div style=\{\{ display: 'flex', gap: 10 \}\}>\s*<button style=\{\{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' \}\}>\s*<Share2 size=\{20\} color="#000" \/>\s*<\/button>\s*<button style=\{\{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' \}\}>\s*<MoreHorizontal size=\{20\} color="#000" \/>\s*<\/button>\s*<\/div>/;
code = code.replace(topIconsRegex, '');

// Adjust Voltar button background
code = code.replace(
  `background: '#fff', border: 'none'`,
  `background: 'transparent', border: '1px solid var(--ouro)'`
);
code = code.replace(
  `<ArrowLeft size={20} color="#000" />`,
  `<ArrowLeft size={20} color="var(--ouro)" />`
);

// 2. Remove bottom Compartilhar button
const compartilharBtnRegex = /<button style=\{\{ flex: 1, background: 'transparent', border: '1px solid #444', color: '#fff', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' \}\}>\s*Compartilhar <Upload size=\{16\} \/>\s*<\/button>/;
code = code.replace(compartilharBtnRegex, '');

// 3. Fix Data values
code = code.replace(`atleta.clube_atual || 'N/A'`, `atleta.clube_atual || 'Sem dados'`);
code = code.replace(`<span>Alfa Academy</span>`, `<span>{atleta.clube_atual || 'Sem dados'}</span>`);
code = code.replace(`<span style={{ color: '#06b6d4', fontSize: '14px' }}>Campeonato Paulista</span>`, `<span style={{ color: '#06b6d4', fontSize: '14px' }}>{atleta.competicoes || 'Sem dados'}</span>`);
code = code.replace(`<span style={{ color: '#fff', fontWeight: 'bold' }}>2026</span>`, ` `);

// 4. Update Mock AI logic to use actual AI data or fallback
const mockRegex = /setAiData\(\{\s*score: 82,\s*radar_tatico: \[\s*\{ subject: "Ofensivo", atual: 85, anterior: 75 \},\s*\{ subject: "Defensivo", atual: 70, anterior: 65 \},\s*\{ subject: "Físico", atual: 81, anterior: 78 \},\s*\{ subject: "Mental", atual: 80, anterior: 82 \},\s*\{ subject: "Técnico", atual: 88, anterior: 80 \}\s*\]\s*\}\);/;

code = code.replace(mockRegex, `
    // If no real AI data is passed down from the backend, leave it empty.
    if (found && found.ai_score) {
      setAiData(found.aiData);
    } else {
      setAiData(null);
    }
`);

// 5. UI adjustments for missing AI data, and Radar sizing
const indexCardRegex = /<div style=\{\{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' \}\}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newIndexCard = `<div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '15px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: 'var(--ouro)', fontSize: '12px', fontWeight: 'bold' }}>Alfa Index &gt;</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '38px', fontWeight: '900', color: 'var(--ouro)', lineHeight: '1' }}>{aiData ? aiData.score + '%' : '--'}</span>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '4px solid #333', borderTopColor: aiData ? 'var(--ouro)' : '#333', borderRightColor: aiData ? 'var(--ouro)' : '#333', borderBottomColor: aiData ? 'var(--ouro)' : '#333' }}></div>
                  </div>
                </div>`;

code = code.replace(indexCardRegex, newIndexCard);

const radarCardRegex = /<RadarChart cx="50%" cy="50%" outerRadius="75%" data=\{aiData\.radar_tatico\}>/;
code = code.replace(radarCardRegex, `<RadarChart cx="50%" cy="50%" outerRadius="50%" data={aiData ? aiData.radar_tatico : [{subject: 'Sem dados', atual: 0}]}>`);

// Handle when aiData is null in radar
code = code.replace(
  `{activeTab === 'detalhes' && (`,
  `{activeTab === 'detalhes' && (
          <>
            {/* GRID LAYOUT */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 600 ? '1fr 1.2fr' : '1fr', gap: 15 }}>
`
);

code = code.replace(
  `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 15 }}>`,
  ``
);

fs.writeFileSync('crm/src/pages/PerfilAtleta.jsx', code, 'utf8');
