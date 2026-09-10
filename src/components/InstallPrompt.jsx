import React, { useState, useEffect } from 'react';
import { Download, X, Share2 } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function InstallPrompt({ theme = {} }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    const dismissedTime = localStorage.getItem('lyte_bytes_pwa_dismissed_time');
    const now = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    if (dismissedTime && (now - parseInt(dismissedTime, 10)) < twoHoursInMs) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    const checkAndShowPrompt = () => {
      const offerClosed = localStorage.getItem('lyte_offer_closed');
      
      if (!offerClosed) {
        setTimeout(checkAndShowPrompt, 1000);
        return;
      }

      setShowBanner(true);
    };

    if (iosDevice) {
      const timer = setTimeout(checkAndShowPrompt, 2000);
      return () => clearTimeout(timer);
    } else {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        checkAndShowPrompt();
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('lyte_bytes_pwa_dismissed_time', new Date().getTime().toString());
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

  const modalContent = (
    <div 
      onClick={handleDismiss}
      style={{
        position: 'fixed', 
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '20px', 
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderTopLeftRadius: 'clamp(20px, 5vw, 28px)', 
          borderTopRightRadius: 'clamp(20px, 5vw, 28px)',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          padding: 'clamp(16px, 4vw, 22px)', 
          maxWidth: '520px', 
          width: '100%', 
          maxHeight: '82vh',
          boxSizing: 'border-box',
          position: 'relative', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          border: '1px solid rgba(197, 160, 89, 0.5)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          animation: 'slideUpSheet 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default'
        }}
      >
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '16px',
          marginBottom: '2px',
          flexShrink: 0,
          gap: '8px',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              backgroundColor: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isIos ? <Share2 size={18} color="#FF5958" /> : <Download size={18} color="#FF5958" />}
            </div>
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 'clamp(18px, 4.5vw, 22px)', 
              fontWeight: '700', 
              color: '#FF5958', 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}>
              Install Lyte Bytes
            </h3>
          </div>
          <button 
            onClick={handleDismiss}
            style={{
              background: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1A1816',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#57534E',
          lineHeight: '1.5',
          paddingRight: '6px',
          minWidth: 0
        }}>
          <p style={{ 
            fontSize: 'clamp(12px, 3.5vw, 14px)', 
            color: '#78716C', 
            margin: 0, 
            lineHeight: '1.5',
            fontWeight: '500' 
          }}>
            {isIos 
              ? "To install our app on your device, tap the Share button (⎋) below and select 'Add to Home Screen' (➕)."
              : "Add Lyte Bytes to your home screen for quick ordering, instant access, and an app-like experience."}
          </p>

          <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: '4px' }}>
            <button 
              onClick={handleDismiss}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                color: '#1A1816',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                padding: '12px',
                fontSize: 'clamp(13px, 3.8vw, 14.5px)',
                fontWeight: '600',
                borderRadius: '12px',
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
                  minWidth: 0,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                  color: '#FFFFFF',
                  padding: '12px',
                  fontSize: 'clamp(13px, 3.8vw, 14.5px)',
                  fontWeight: '600',
                  borderRadius: '12px',
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
    </div>
  );

  return createPortal(modalContent, document.body);
}