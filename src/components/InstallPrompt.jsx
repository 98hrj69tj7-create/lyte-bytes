import React, { useState, useEffect } from 'react';
import { Download, X, Share2, Sparkles, Tag, Bookmark } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function InstallPrompt({ theme = {} }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // 🔥 Reduced cooldown to 30 minutes so users see it more frequently
    const dismissedTime = localStorage.getItem('lyte_bytes_pwa_dismissed_time');
    const now = new Date().getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;
    
    if (dismissedTime && (now - parseInt(dismissedTime, 10)) < thirtyMinutesInMs) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    const checkAndShowPrompt = () => {
      // Trigger shortly after app load or when browsing
      setShowBanner(true);
    };

    if (iosDevice) {
      const timer = setTimeout(checkAndShowPrompt, 4000);
      return () => clearTimeout(timer);
    } else {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        checkAndShowPrompt();
      };
      window.addEventListener('beforeinstallprompt', handler);
      
      // Fallback timer for browsers that don't immediately fire beforeinstallprompt
      const fallbackTimer = setTimeout(checkAndShowPrompt, 4000);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('lyte_bytes_pwa_dismissed_time', new Date().getTime().toString());
  };

  const handleInstallClick = async () => {
    if (isIos) {
      // On iOS, keep the modal open so they can read the instructions
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    }
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
        backgroundColor: 'rgba(20, 15, 12, 0.82)', 
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
          padding: 'clamp(18px, 4.5vw, 24px)', 
          maxWidth: '520px', 
          width: '100%', 
          maxHeight: '85vh',
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
        {/* Header */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '14px',
          flexShrink: 0,
          gap: '8px',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              borderRadius: '12px',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <Bookmark size={30} color="#FF5958" fill="#FF5958" />
            </div>
            <div>
              <span style={{ 
                background: 'rgba(197, 160, 89, 0.15)', 
                border: '1px solid rgba(197, 160, 89, 0.3)', 
                padding: '2px 8px', 
                borderRadius: '8px', 
                fontSize: '9.5px', 
                fontWeight: '700', 
                letterSpacing: '1px', 
                textTransform: 'uppercase', 
                color: '#8A6D2B' 
              }}>
                App Exclusive
              </span>
              <h3 style={{ 
                fontFamily: "'sans-serif", 
                fontSize: 'clamp(14px, 4.5vw, 18px)', 
                fontWeight: '600', 
                color: '#1A1816', 
                margin: '1px 0 0 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                10% OFF on First Order
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
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
          paddingTop: '4px'
        }}>
          <p style={{ 
            fontSize: 'clamp(12px, 3.5vw, 14px)', 
            color: '#78716C', 
            margin: 0, 
            fontWeight: '500' 
          }}>
            {isIos 
              ? "Unlock your welcome perk and enjoy a seamless ordering experience. Tap the Share button (⎋) below and select 'Add to Home Screen' (➕)."
              : "Add Lyte Bytes to your device home screen to unlock instant rewards, smooth app navigation, and your welcome savings."}
          </p>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(197, 160, 89, 0.08)', 
            padding: '10px 14px', 
            borderRadius: '10px',
            border: '1px dashed rgba(197, 160, 89, 0.4)',
            fontSize: '13px',
            fontWeight: '600',
            color: '#8A6D2B'
          }}>
            <Tag size={15} color="#FF5958" style={{ flexShrink: 0 }} />
            <span>Use code <strong style={{ color: '#1A1816' }}>APPFIRST</strong> at checkout</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: '6px' }}>
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
                boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Download size={16} />
              <span>{isIos ? 'Install Now' : 'Install & Save 10%'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}