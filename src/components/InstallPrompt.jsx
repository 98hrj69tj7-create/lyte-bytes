import React, { useState, useEffect } from 'react';
import { Download, X, Share2 } from 'lucide-react';

export default function InstallPrompt({ theme = {} }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Check if the app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // 2. Check if the user previously dismissed the prompt
    const hasDismissed = localStorage.getItem('lyte_bytes_pwa_dismissed');
    if (hasDismissed) return;

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    if (iosDevice) {
      // Show the iOS guide modal after a short delay
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

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember that the user dismissed it so it won't pop up again
    localStorage.setItem('lyte_bytes_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    handleDismiss();
  };

  if (!showBanner) return null;

  return (
    <div 
      onClick={handleDismiss}
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.75)', 
        backdropFilter: 'blur(6px)', 
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999, 
        padding: '16px', 
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderRadius: '24px', 
          padding: '24px',
          maxWidth: '360px', 
          width: '100%', 
          boxSizing: 'border-box',
          position: 'relative', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(197, 160, 89, 0.4)',
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#78716C',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Icon Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-4px' }}>
          <div style={{
            backgroundColor: 'rgba(197, 160, 89, 0.15)',
            border: '1px solid rgba(197, 160, 89, 0.35)',
            borderRadius: '16px',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isIos ? <Share2 size={26} color="#FF5958" /> : <Download size={26} color="#FF5958" />}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '21px', 
            fontWeight: '700', 
            color: '#1A1816', 
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Install Lyte Bytes
          </h3>
          <p style={{ 
            fontSize: '12.5px', 
            color: '#78716C', 
            margin: 0, 
            lineHeight: '1.45',
            fontWeight: '500' 
          }}>
            {isIos 
              ? "To install our app on your iPhone, tap the Safari Share button (⎋) below and select 'Add to Home Screen' (➕)."
              : "Add Lyte Bytes to your home screen for quick ordering, instant access, and an app-like experience."}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button 
            onClick={handleDismiss}
            style={{
              flex: 1,
              backgroundColor: 'rgba(197, 160, 89, 0.1)',
              color: '#1A1816',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '14px',
              cursor: 'pointer'
            }}
          >
            Maybe Later
          </button>
          
          {!isIos && (
            <button 
              onClick={handleInstallClick}
              style={{
                flex: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                color: '#FFFFFF',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
              }}
            >
              Install Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}