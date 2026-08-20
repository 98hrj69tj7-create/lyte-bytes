import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Lock, CheckCircle2, ArrowRight, Package, Sparkles } from 'lucide-react';

export default function PaymentVerificationView({ 
  theme = {}, 
  onVerificationComplete = () => {},
  setView = () => {},
  orderId = "LB-9482"
}) {
  const [isVerified, setIsVerified] = useState(false);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(18px, 5vw, 20px)', // 💡 FLUID RADIUS
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerified(true);
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
      minHeight: '450px',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .success-card-animation {
          animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Secure Card Container */}
      <div className="success-card-animation" style={{
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
        border: '1.5px solid rgba(197, 160, 89, 0.5)',
        borderRadius: activeTheme.radius,
        padding: 'clamp(24px, 5vw, 36px) clamp(18px, 4vw, 24px)', // 💡 FLUID PADDING
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 12px 32px rgba(44, 34, 30, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        boxSizing: 'border-box'
      }}>
        
        {!isVerified ? (
          // ================= STATE 1: VERIFYING PAYMENT =================
          <>
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

            <div style={{ minWidth: 0, width: '100%' }}>
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '700', 
                color: activeTheme.text, 
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Verifying Payment
              </h3>
              <p style={{ 
                fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
                color: '#78716C', 
                margin: 0, 
                lineHeight: '1.4',
                fontWeight: '500' 
              }}>
                Communicating securely with your bank. Please do not close or refresh this page.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ECFDF5',
              border: '1px solid #059669',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: 'var(--font-caption)',
              fontWeight: '600',
              color: '#065F46',
              marginTop: '6px'
            }}>
              <ShieldCheck size={15} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap' }}>256-Bit Bank Grade Encryption</span>
            </div>
          </>
        ) : (
          // ================= STATE 2: ORDER SUCCESS SEAL & SUMMARY =================
          <>
            {/* Luxury Success Icon Seal */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0
            }}>
              <Sparkles size={20} color="#C5A059" style={{ position: 'absolute', top: '-4px', right: '-4px' }} />
              <CheckCircle2 size={36} color="#059669" />
            </div>

            <div style={{ minWidth: 0, width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                ✦ Order Confirmed ✦
              </span>
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(20px, 5vw, 24px)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '700', 
                color: activeTheme.text, 
                margin: '2px 0 6px 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Thank You For Your Order
              </h3>
              <p style={{ 
                fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
                color: '#78716C', 
                margin: 0, 
                lineHeight: '1.4',
                fontWeight: '500' 
              }}>
                Your payment was verified successfully. Our kitchen engine is getting your handcrafted items ready.
              </p>
            </div>

            {/* Order Code Summary Badge */}
            <div style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box',
              gap: '8px',
              minWidth: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Package size={18} color="#C5A059" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--font-caption)', fontWeight: '600', color: '#78716C', whiteSpace: 'nowrap' }}>Order Reference</span>
              </div>
              <span style={{ fontSize: 'var(--font-body)', fontWeight: '800', color: activeTheme.text, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                {orderId}
              </span>
            </div>

            {/* Action Button to Track Live */}
            <button
              onClick={() => setView('track')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '13px',
                fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(225, 29, 72, 0.25)',
                transition: 'all 0.25s ease',
                outline: 'none',
                marginTop: '4px',
                boxSizing: 'border-box'
              }}
            >
              Track Live Order <ArrowRight size={16} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            </button>
          </>
        )}

      </div>
    </div>
  );
}