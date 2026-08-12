import React, { useState, useEffect } from 'react';
import { Download, X, Share2 } from 'lucide-react';

export default function InstallPrompt({ theme = {} }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if the app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    if (iosDevice) {
      // Show the iOS guide banner after a short delay so it doesn't pop up instantly on load
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    } else {
      // Listen for Android / Chrome automated install prompt event
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowBanner(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      left: '16px',
      right: '16px',
      zIndex: 1100,
      background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
      border: '1px solid rgba(197, 160, 89, 0.4)',
      borderRadius: '20px',
      padding: '16px',
      boxShadow: '0 12px 30px rgba(44, 34, 30, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div style={{
          backgroundColor: 'rgba(197, 160, 89, 0.15)',
          border: '1px solid rgba(197, 160, 89, 0.35)',
          borderRadius: '12px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isIos ? <Share2 size={20} color="#FF5958" /> : <Download size={20} color="#FF5958" />}
        </div>
        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '700', color: '#1A1816', fontFamily: "'Cormorant Garamond', serif" }}>
            Install Lyte Bytes App
          </h4>
          <p style={{ margin: 0, fontSize: '11.5px', color: '#78716C', fontWeight: '500', lineHeight: '1.3' }}>
            {isIos 
              ? "Tap the Share button (⎋) below and select 'Add to Home Screen' (➕)."
              : "Add to your home screen for quick ordering & instant access."}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {!isIos && (
          <button
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 89, 88, 0.3)'
            }}
          >
            Install
          </button>
        )}
        <button
          onClick={() => setShowBanner(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#78716C',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}