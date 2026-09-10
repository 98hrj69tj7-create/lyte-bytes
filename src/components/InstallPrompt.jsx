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

<<<<<<< HEAD
    // 🔥 2. Check 10-hour cooldown window for dismissal
    const dismissedUntil = localStorage.getItem('prompt_dismissed_until');
    const now = Date.now();
    
    // If we haven't passed the expiration time, keep it hidden
    if (dismissedUntil && now < parseInt(dismissedUntil, 10)) {
=======
    const dismissedTime = localStorage.getItem('lyte_bytes_pwa_dismissed_time');
    const now = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    if (dismissedTime && (now - parseInt(dismissedTime, 10)) < twoHoursInMs) {
>>>>>>> development
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
<<<<<<< HEAD
=======

>>>>>>> development
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
<<<<<<< HEAD
    // 🔥 Save expiration marker for 10 hours in the future
    localStorage.setItem('prompt_dismissed_until', (Date.now() + 10 * 60 * 60 * 1000).toString());
=======
    localStorage.setItem('lyte_bytes_pwa_dismissed_time', new Date().getTime().toString());
>>>>>>> development
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

<<<<<<< HEAD
  const activeTheme = {
    radius: 'clamp(20px, 5vw, 24px)' 
  };

  return (
    <div 
      onClick={handleDismiss}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '16px', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif"
=======
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
>>>>>>> development
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
<<<<<<< HEAD
          borderRadius: activeTheme.radius, padding: 'clamp(18px, 5vw, 24px)', maxWidth: '360px', width: '100%', 
          boxSizing: 'border-box', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(197, 160, 89, 0.4)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px'
        }}
      >
        <button
          onClick={handleDismiss}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-4px' }}>
          <div style={{ backgroundColor: 'rgba(197, 160, 89, 0.15)', border: '1px solid rgba(197, 160, 89, 0.35)', borderRadius: '16px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isIos ? <Share2 size={26} color="#FF5958" /> : <Download size={26} color="#FF5958" />}
=======
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
>>>>>>> development
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

<<<<<<< HEAD
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'var(--font-h2)', fontWeight: '700', color: '#1A1816', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Install Lyte Bytes
          </h3>
          <p style={{ fontSize: 'var(--font-caption)', color: '#78716C', margin: 0, lineHeight: '1.45', fontWeight: '500' }}>
=======
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
>>>>>>> development
            {isIos 
              ? "To install our app on your device, tap the Share button (⎋) below and select 'Add to Home Screen' (➕)."
              : "Add Lyte Bytes to your home screen for quick ordering, instant access, and an app-like experience."}
          </p>

<<<<<<< HEAD
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleDismiss}
            style={{ flex: 1, minWidth: 0, backgroundColor: 'rgba(197, 160, 89, 0.1)', color: '#1A1816', border: '1px solid rgba(197, 160, 89, 0.3)', padding: 'clamp(10px, 3vw, 12px)', fontSize: 'var(--font-body)', fontWeight: '600', borderRadius: '14px', cursor: 'pointer' }}
          >
            Maybe Later
          </button>
          
          {!isIos && (
            <button 
              onClick={handleInstallClick}
              style={{ flex: 1, minWidth: 0, border: '1px solid rgba(255, 255, 255, 0.2)', background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', color: '#FFFFFF', padding: 'clamp(10px, 3vw, 12px)', fontSize: 'var(--font-body)', fontWeight: '600', borderRadius: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)' }}
=======
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
>>>>>>> development
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