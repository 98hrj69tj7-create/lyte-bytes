import React from 'react';

export default function Header({ theme = {}, setView }) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958', // Perfectly matches your official logo coral red
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2'
  };

  return (
    <header style={{ 
      padding: '10px 16px', 
      backgroundColor: activeTheme.bg,
      borderBottom: activeTheme.border, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 900
    }}>
      {/* Brand Logo & Title Group (Strictly Left-Aligned) */}
      <div 
        onDoubleClick={() => setView && setView('admin-customers')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', textAlign: 'left' }}
        title="Double-click for Admin Access"
      >
        <img 
          src="/logo.png" 
          alt="Lyte Bytes Logo" 
          style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            objectFit: 'cover',
            border: activeTheme.border,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 style={{ fontSize: '25px', margin: 0, color: activeTheme.brand, fontWeight: '800', letterSpacing: '1px', lineHeight: '1.1' }}>
            LYTE BYTES
          </h2>
          {/* Tagline with Brand-Matching Highlight on "You" */}
          <span style={{ fontSize: '11px', color: '#776E62', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '2px' }}>
            Freshly Crafted For <span style={{ color: activeTheme.brand, fontWeight: '800' }}>"YOU"</span>
          </span>
        </div>
      </div>

      {/* Compliance & Certifications */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '1px' }}>
        {/* FSSAI Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <img 
            src="/Fssai.png" 
            alt="FSSAI" 
            style={{ width: '20px', height: '18px', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '10px', fontWeight: '500', color: activeTheme.text, letterSpacing: '0.2px'}}>
            21225008002806
          </span>
        </div>
        {/* Halal Row with Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <img 
            src="/halallogo.png" 
            alt="Halal" 
            style={{ width: '20px', height: '15px', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '10px', fontWeight: '500', color: activeTheme.text, letterSpacing: '0.2px'}}>
            Halal compliant
          </span>
        </div>
      </div>
    </header>
  );
}