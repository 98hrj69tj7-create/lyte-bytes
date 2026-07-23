import React from 'react';
import { Home, ShoppingBag, Truck, Info } from 'lucide-react';

export default function Footer({ view, setView, cart, theme }) {
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0);

  return (
    <footer style={{ 
      position: 'fixed',
      bottom: '5px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '420px',
      zIndex: 1000,
      height: '64px', 
      border: '1px solid #FF5958', 
      display: 'flex', 
      justifyContent: 'space-around', 
      alignItems: 'center', 
      backgroundColor: 'rgba(66, 59, 50, 0.88)', // Deep warm tone with transparency for glassmorphism
      borderRadius: '22px',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxSizing: 'border-box'
    }}>
      {[
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'cart', icon: ShoppingBag, label: 'Bag', count: totalQty },
        { id: 'track', icon: Truck, label: 'Track' },
        { id: 'info', icon: Info, label: 'Info' }
      ].map((item) => {
        const isActive = view === item.id;

        return (
          <div 
            key={item.id} 
            onClick={() => setView(item.id)} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              cursor: 'pointer', 
              fontSize: '11px', 
              fontWeight: isActive ? '700' : '500', 
              color: isActive ? (theme?.brand || '#FF5958') : '#ffffff',
              flex: 1,
              transition: 'all 0.2s ease',
              transform: isActive ? 'translateY(-1px)' : 'none'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ marginBottom: '2px', transition: 'stroke-width 0.2s ease' }}
              />
              {item.count > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-6px', 
                  right: '-12px', 
                  backgroundColor: theme?.brand || '#FF5958', 
                  color: '#FFFFFF', 
                  borderRadius: '10px', 
                  padding: '0 5px',
                  height: '16px', 
                  fontSize: '9px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '800',
                  boxShadow: '0 2px 6px rgba(255, 89, 88, 0.4)'
                }}>
                  {item.count}
                </span>
              )}
            </div>
            <span style={{ letterSpacing: '0.2px' }}>{item.label}</span>
          </div>
        );
      })}
    </footer>
  );
}