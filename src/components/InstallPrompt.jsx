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

    // 2. Check 2-hour cooldown window for dismissal
    const dismissedTime = localStorage.getItem('lyte_bytes_pwa_dismissed_time');
    const now = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    // If it was dismissed less than 2 hours ago, keep it hidden
    if (dismissedTime && (now - parseInt(dismissedTime, 10)) < twoHoursInMs) {
      return;
    }

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // 3. Sequential trigger logic: Wait until user acts on/closes the Limited Offer Modal
    const checkAndShowPrompt = () => {
      const offerClosed = localStorage.getItem('lyte_offer_closed');
      
      if (!offerClosed) {
        // If the offer modal is still active, poll again in 1 second
        setTimeout(checkAndShowPrompt, 1000);
        return;
      }

      // Offer modal has been dismissed by user action! Safe to show install prompt.
      setShowBanner(true);
    };

    if (iosDevice) {
      // Start checking after initial load delay
      const timer = setTimeout(checkAndShowPrompt, 2000);
      return () => clearTimeout(timer);
    } else {
      // Listen for Android / Chrome automated install prompt event
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
    // Save current timestamp so it only reappears after 2 hours
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

  const activeTheme = {
    radius: 'clamp(20px, 5vw, 24px)' // 💡 FLUID RADIUS
  };

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
          borderRadius: activeTheme.radius, 
          padding: 'clamp(18px, 5vw, 24px)', // 💡 FLUID PADDING
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
            justifyContent: 'center',
            flexShrink: 0
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
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isIos ? <Share2 size={26} color="#FF5958" /> : <Download size={26} color="#FF5958" />}
          </div>
        </div>

        {/* Title & Description */}
        <div style={{ minWidth: 0 }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
            fontWeight: '700', 
            color: '#1A1816', 
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Install Lyte Bytes
          </h3>
          <p style={{ 
            fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
            color: '#78716C', 
            margin: 0, 
            lineHeight: '1.45',
            fontWeight: '500' 
          }}>
            {isIos 
              ? "To install our app on your device, tap the Share button (⎋) below and select 'Add to Home Screen' (➕)."
              : "Add Lyte Bytes to your home screen for quick ordering, instant access, and an app-like experience."}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleDismiss}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: 'rgba(197, 160, 89, 0.1)',
              color: '#1A1816',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              padding: 'clamp(10px, 3vw, 12px)',
              fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
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
                minWidth: 0,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                color: '#FFFFFF',
                padding: 'clamp(10px, 3vw, 12px)',
                fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
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