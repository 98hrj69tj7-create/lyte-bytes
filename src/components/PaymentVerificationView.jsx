import React, { useEffect } from 'react';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

export default function PaymentVerificationView({ 
  theme = {}, 
  onVerificationComplete = () => {} 
}) {
  const activeTheme = {
    brand: theme?.brand || '#E53935',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #E0D3C1',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '12px',
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
      minHeight: '400px'
    }}>
      {/* Secure Card Container */}
      <div style={{
        background: '#FFFBF2',
        border: activeTheme.border,
        borderRadius: activeTheme.radius,
        padding: '36px 24px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
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
            fontSize: '17px', 
            fontWeight: '700', 
            color: activeTheme.text, 
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Verifying Payment
          </h3>
          <p style={{ 
            fontSize: '13px', 
            color: '#776E62', 
            margin: 0, 
            lineHeight: '1.4' 
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