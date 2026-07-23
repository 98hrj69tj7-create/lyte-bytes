import React from 'react';

export default function Header({ theme }) {
  return (
    <header style={{ height: '60px', padding: '0 15px', borderBottom: theme.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        <h2 style={{ fontSize: '25px', margin: 0, color: theme.brand, fontWeight: '800' }}>LYTE BYTES</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src="/Fssai.png" alt="FSSAI" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text }}>21225008002806</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text, lineHeight: '1' }}>
          Halal Compliant
        </span>
      </div>
    </header>
  );
}