import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      return;
    }

    // 2. Check if dismissed
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) {
      return;
    }

    // 3. Detect iOS Safari
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    if (isIos()) {
      // Delay 2 seconds before showing iOS prompt
      const timer = setTimeout(() => {
        setShowIosPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // 4. Android / Desktop standard PWA event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const timer = setTimeout(() => {
        setShowAndroidPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        dismissPrompt();
      }
      setDeferredPrompt(null);
    }
  };

  const dismissPrompt = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setShowAndroidPrompt(false);
    setShowIosPrompt(false);
  };

  if (!showAndroidPrompt && !showIosPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '400px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        background: '#111',
        borderRadius: '16px',
        padding: '20px',
        width: '100%',
        position: 'relative',
        border: '1px solid var(--ouro)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <img src="/alfaacademy/admin/logo192.png" alt="Alfa Academy" style={{ width: '50px', height: '50px', borderRadius: '12px', border: '1px solid var(--ouro)' }} />
            <h4 style={{ color: 'var(--ouro)', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Instalar Aplicativo</h4>
        </div>
        
        {showIosPrompt && (
          <div style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Para uma experiência completa de aplicativo:</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: 'var(--ouro)', fontWeight: 'bold' }}>1.</span>
              <span>Toque no ícone de Compartilhar (abaixo)</span>
              <Share size={18} color="var(--ouro)" />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ color: 'var(--ouro)', fontWeight: 'bold' }}>2.</span>
              <span>Role para baixo e selecione <br/><strong style={{color: '#fff'}}>"Adicionar à Tela de Início"</strong></span>
              <span style={{ fontSize: '20px', color: 'var(--ouro)', fontWeight: 'bold', marginLeft: '5px' }}>+</span>
            </div>
            
            <button onClick={dismissPrompt} style={{ width: '100%', padding: '12px', background: 'transparent', color: 'var(--ouro)', border: '1px solid var(--ouro)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Fechar / Entendi
            </button>
          </div>
        )}

        {showAndroidPrompt && (
          <div style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '20px' }}>Instale o aplicativo da Alfa Academy para um acesso rápido diretamente da sua tela inicial.</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={dismissPrompt} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#888', border: '1px solid #444', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Agora Não
              </button>
              <button onClick={handleInstallAndroid} style={{ flex: 2, padding: '12px', background: 'var(--ouro)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Download size={18} /> Instalar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Seta visual apontando para baixo (navbar do Safari) se for iOS */}
      {showIosPrompt && (
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid var(--ouro)',
          marginTop: '-1px', // Evitar gap
        }} />
      )}
    </div>
  );
}
