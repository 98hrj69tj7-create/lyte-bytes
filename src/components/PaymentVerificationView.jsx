import React, { useEffect } from 'react';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

export default function PaymentVerificationView({ 
  theme = {}, 
  onVerificationComplete = () => {} 
}) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '20px',
  };

  useEffect(() => {
    // Simulate secure bank communication latency (3 seconds)
    const timer = setTimeout(() => {
      onVerificationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onVerificationComplete]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '30px 20px',
      textAlign: 'center',
      boxSizing: 'border-box',
      minHeight: '400px',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Secure Card Container */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
        border: '1px solid rgba(197, 160, 89, 0.4)',
        borderRadius: activeTheme.radius,
        padding: '36px 24px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        boxSizing: 'border-box'
      }}>
        
        {/* Animated Spinner with Brand Accent */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 
            size={56} 
            color={activeTheme.brand} 
            style={{ animation: 'spin 1.5s linear infinite' }} 
          />
          <div style={{ position: 'absolute' }}>
            <Lock size={20} color={activeTheme.brand} />
          </div>
        </div>

        {/* Text Details */}
        <div>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '21px', 
            fontWeight: '700', 
            color: activeTheme.text, 
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Verifying Payment
          </h3>
          <p style={{ 
            fontSize: '12.5px', 
            color: '#78716C', 
            margin: 0, 
            lineHeight: '1.4',
            fontWeight: '500' 
          }}>
            Communicating securely with your bank. Please do not close or refresh this page.
          </p>
        </div>

        {/* Security Trust Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ECFDF5',
          border: '1px solid #059669',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11.5px',
          fontWeight: '600',
          color: '#065F46',
          marginTop: '6px'
        }}>
          <ShieldCheck size={15} />
          <span>256-Bit Bank Grade Encryption</span>
        </div>

      </div>
    </div>
  );
}