import React from 'react';

export default function Header({ theme = {}, setView }) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958', // Official logo coral red
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #FF5958',
    bg: theme?.bg || '#FFFDF9'
  };

  return (
    <header style={{ 
      padding: '10px 16px', 
      backgroundColor: activeTheme.bg,
      borderBottom: '1px solid #FF5958', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      gap: '12px'
    }}>
      {/* Brand Logo & Title Group (Strictly Left-Aligned) */}
      <div 
        onDoubleClick={() => setView && setView('admin-customers')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', textAlign: 'left', minWidth: 0, flex: 1 }}
        title="Double-click for Admin Access"
      >
        <img 
          src="/logo.png" 
          alt="Lyte Bytes Logo" 
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%', 
            objectFit: 'cover',
            border: activeTheme.border,
            boxShadow: '0 2px 8px rgba(197, 160, 89, 0.15)',
            flexShrink: 0
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(20px, 5vw, 25px)', // 💡 FLUID TYPOGRAPHY
            margin: 0, 
            color: activeTheme.brand, 
            fontWeight: '700', 
            letterSpacing: '1px', 
            lineHeight: '1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }}>
            LYTE BYTES
          </h2>
          <span style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#78716C', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            Freshly Crafted For <span style={{ color: activeTheme.brand, fontWeight: '800' }}>"YOU"</span>
          </span>
        </div>
      </div>

      {/* Compliance & Certifications (Without Pill Backgrounds) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
        {/* FSSAI Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '0px'
        }}>
          <img 
            src="/Fssai.png" 
            alt="FSSAI" 
            style={{ width: '16px', height: '12px', objectFit: 'contain', flexShrink: 0 }} 
          />
          <span style={{ fontSize: '9px', fontWeight: '600', color: '#8A6D2B', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
            21225008002806
          </span>
        </div>
        
        {/* Halal Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '0px'
        }}>
          <img 
            src="/halallogo.png" 
            alt="Halal" 
            style={{ width: '16px', height: '12px', objectFit: 'contain', flexShrink: 0 }} 
          />
          <span style={{ fontSize: '9px', fontWeight: '600', color: '#8A6D2B', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
            HALAL COMPLIANT
          </span>
        </div>
      </div>
    </header>
  );
}