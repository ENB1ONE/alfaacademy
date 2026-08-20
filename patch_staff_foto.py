import os

with open('crm/src/pages/Staff.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''        <form onSubmit={handleSalvar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Nome</label>'''

replacement = '''        <form onSubmit={handleSalvar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--linha)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {form.foto ? <img src={form.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserPlus size={40} color="var(--cinza)" />}
            </div>
            <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              Escolher Imagem
            </label>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Nome</label>'''

if target in text:
    text = text.replace(target, replacement)
else:
    print('Target not found for form')

target_card = '''              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{t.nome}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{t.perfil}</span>
                </div>'''

replacement_card = '''              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ouro)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                    {t.foto ? <img src={t.foto} alt={t.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (t.nome ? t.nome.charAt(0) : '')}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--ouro)', fontSize: '1.2rem' }}>{t.nome}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>{t.perfil}</span>
                  </div>
                </div>'''

if target_card in text:
    text = text.replace(target_card, replacement_card)
else:
    print('Target not found for card')

with open('crm/src/pages/Staff.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
