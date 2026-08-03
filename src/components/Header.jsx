import React from 'react';

export default function Header({ theme = {} }) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2'
  };

  return (
    <header style={{ 
      height: '64px', 
      padding: '0 16px', 
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
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src="/logo.png" 
          alt="Lyte Bytes Logo" 
          style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            objectFit: 'cover',
            border: activeTheme.border 
          }} 
        />
        <h2 style={{ fontSize: '22px', margin: 0, color: activeTheme.brand, fontWeight: '800', letterSpacing: '0.5px' }}>
          LYTE BYTES
        </h2>
      </div>

      {/* Compliance & Certifications */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img 
            src="/Fssai.png" 
            alt="FSSAI" 
            style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '11px', fontWeight: '600', color: activeTheme.text, letterSpacing: '0.3px' }}>
            21225008002806
          </span>
        </div>
        <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#776E62', lineHeight: '1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Halal Compliant
        </span>
      </div>
    </header>
  );
}