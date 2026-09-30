const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// 1. Wrap 'Novo Atleta' button
const btnNovoOld = `<button onClick={() => { setEditMode(false); setShowForm(!showForm); setForm({ nome: '', categoria_id: '', posicao: '', posicao_secundaria: '', pe_dominante: '', competicoes: '', clube_atual: '', peso: '', altura: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' }); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Atleta
        </button>`;
const btnNovoNew = `{isAdmin && (
        <button onClick={() => { setEditMode(false); setShowForm(!showForm); setForm({ nome: '', categoria_id: '', posicao: '', posicao_secundaria: '', pe_dominante: '', competicoes: '', clube_atual: '', peso: '', altura: '', nome_responsavel: '', telefone_responsavel: '', status_medico: 'Apto', foto: '' }); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plus size={20} /> Novo Atleta
        </button>
        )}`;
code = code.replace(btnNovoOld, btnNovoNew);

// 2. Wrap the DM/Edit/Delete buttons
const cardBtnsOld = `<div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" className="btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', flexShrink: 0 }}><Activity size={16} /></button>
                        <button onClick={() => handleEdit(a)} title="Editar" className="btn" style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(a.id)} title="Excluir" className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Trash2 size={16} /></button>
                    </div>`;
const cardBtnsNew = `{isAdmin && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => toggleDM(a.id, a.status_medico)} title="Alternar DM" className="btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', flexShrink: 0 }}><Activity size={16} /></button>
                        <button onClick={() => handleEdit(a)} title="Editar" className="btn" style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(a.id)} title="Excluir" className="btn" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', flexShrink: 0 }}><Trash2 size={16} /></button>
                    </div>
                    )}`;
code = code.replace(cardBtnsOld, cardBtnsNew);

fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
console.log("Athletes.jsx updated.");
