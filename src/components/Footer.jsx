import React from 'react';
import { Home, Sparkles, Truck, Info } from 'lucide-react';

export default function Footer({ view, setView, theme }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Sparkles },
    { id: 'track', label: 'Track', icon: Truck },
    { id: 'info', label: 'Info', icon: Info },
  ];

  return (
    <div style={{
      position: 'flex',
      bottom: 5,
      left: 0,
      right: 0,
      backgroundColor: theme.bg,
      borderTop: theme.border,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
    }}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = view === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '2px 12px',
              color: isActive ? theme.brand : theme.text,
              opacity: isActive ? 1 : 0.6,
              transition: 'all 0.2s ease'
            }}
          >
            <IconComponent size={22} />
            <span style={{ fontSize: '11px', fontWeight: isActive ? '700' : '500', marginTop: '4px' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}