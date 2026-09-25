import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronRight } from 'lucide-react';
import api from '../api';

export default function PublicPortal() {
  const [jogos, setJogos] = useState([]);
  
  useEffect(() => {
    // We try to fetch jogos. If the endpoint doesn't exist yet, we show a graceful fallback.
    api.get('/api/admin/jogos').then(res => {
      // Just showing future games
      setJogos(res.data.slice(0, 3));
    }).catch(() => {
      // Ignore
    });
  }, []);

  return (
    <div style={{ background: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <img src="/alfaacademy/admin/alfa_logo.png" alt="Alfa Academy" style={{ height: '40px' }} />
        <Link to="/app" style={{ background: 'var(--ouro)', color: '#111', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
          Área Restrita
        </Link>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '60px 20px', backgroundImage: 'linear-gradient(to bottom, #111, #1a1a1a)' }}>
        <h1 style={{ color: 'var(--ouro)', fontSize: '36px', marginBottom: '15px', fontWeight: 900, textTransform: 'uppercase' }}>Formando Atletas e Cidadãos</h1>
        <p style={{ color: 'var(--cinza)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>O melhor centro de treinamento para desenvolver o seu talento no futebol.</p>
        
        <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25D366', color: '#fff', padding: '15px 30px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.3)', transition: 'all 0.3s' }}>
          <MessageSquare /> Matrículas Abertas - Fale Conosco
        </a>
      </section>

      {/* Próximos Jogos */}
      <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', marginBottom: '20px' }}>
          <Calendar color="var(--ouro)" /> Agenda Oficial
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {jogos.length > 0 ? jogos.map(jogo => (
            <div key={jogo.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--ouro)', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>{jogo.data_br}</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>vs {jogo.adversario}</div>
              </div>
              <ChevronRight color="var(--cinza)" />
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: 'var(--cinza)' }}>
              Fique ligado! A agenda da próxima temporada será divulgada em breve.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
