import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      return;
    }

    // iOS detection
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    if (isIos()) {
      // Show iOS prompt if not installed
      const hasSeenIosPrompt = localStorage.getItem('alfa_ios_prompt_seen');
      if (!hasSeenIosPrompt) {
        setShowIosPrompt(true);
      }
    }

    // Android / Desktop standard PWA event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasSeenAndroidPrompt = localStorage.getItem('alfa_android_prompt_seen');
      if (!hasSeenAndroidPrompt) {
        setShowAndroidPrompt(true);
      }
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
        setShowAndroidPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const closeAndroid = () => {
    localStorage.setItem('alfa_android_prompt_seen', 'true');
    setShowAndroidPrompt(false);
  };

  const closeIos = () => {
    localStorage.setItem('alfa_ios_prompt_seen', 'true');
    setShowIosPrompt(false);
  };

  if (!showAndroidPrompt && !showIosPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        border: '1px solid var(--ouro)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <button onClick={showIosPrompt ? closeIos : closeAndroid} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          color: '#aaa',
          cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <img src="/alfaacademy/admin/logo192.png" alt="Alfa Academy" style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '16px', border: '2px solid var(--ouro)' }} />
        
        <h3 style={{ color: 'var(--ouro)', marginBottom: '12px' }}>Instalar Aplicativo</h3>
        
        {showIosPrompt && (
          <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '16px' }}>Para instalar o Alfa Academy no seu iPhone ou iPad:</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
              <span>1. Toque em Compartilhar</span>
              <Share size={18} color="var(--ouro)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
              <span>2. Selecione "Adicionar à Tela de Início"</span>
              <span style={{ fontSize: '18px' }}>+</span>
            </div>
            <button onClick={closeIos} style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'var(--ouro)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Entendi
            </button>
          </div>
        )}

        {showAndroidPrompt && (
          <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '20px' }}>Instale o aplicativo da Alfa Academy para um acesso mais rápido e uma experiência completa.</p>
            <button onClick={handleInstallAndroid} style={{ width: '100%', padding: '12px', background: 'var(--ouro)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Download size={18} /> Instalar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
