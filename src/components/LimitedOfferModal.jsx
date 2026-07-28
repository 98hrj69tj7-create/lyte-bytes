import React, { useState, useEffect } from 'react';

export default function LimitedOfferModal({ theme }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
        border: '1px solid rgba(255, 89, 88, 0.4)',
        borderRadius: '24px',
        padding: '28px 24px',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        position: 'relative',
        animation: 'scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', color: '#FF5958', textTransform: 'uppercase', marginBottom: '8px' }}>
          🎉 Special Launch Offer
        </div>
        
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.2' }}>
          Get 15% OFF on Your First Order!
        </h2>
        
        <p style={{ fontSize: '14px', color: '#A0A0A0', marginBottom: '24px', lineHeight: '1.4' }}>
          Handcrafted to perfection. Use code <span style={{ color: '#FFFFFF', fontWeight: '700', background: 'rgba(255,89,88,0.2)', padding: '2px 6px', borderRadius: '4px' }}>LYTE15</span> at checkout.
        </p>

        <button 
          onClick={() => setIsOpen(false)}
          style={{
            width: '100%',
            backgroundColor: '#FF5958',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px',
            borderRadius: '14px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(255, 89, 88, 0.4)',
            transition: 'transform 0.2s ease'
          }}
        >
          Claim Offer & Explore Menu
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}