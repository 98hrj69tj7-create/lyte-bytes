import React from 'react';
import { Home, ShoppingBag, Truck, Info } from 'lucide-react';

export default function Footer({ setView, cart, theme }) {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <footer style={{ height: '70px', borderTop: theme.border, display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: theme.bg, flexShrink: 0, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
      {[
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'cart', icon: ShoppingBag, label: 'Bag', count: totalQty },
        { id: 'track', icon: Truck, label: 'Track' },
        { id: 'info', icon: Info, label: 'Info' }
      ].map((item) => (
        <div 
          key={item.id} 
          onClick={() => setView(item.id)} 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: theme.buttonBg, flex: 1 }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <item.icon size={22} style={{ marginBottom: '4px' }}/>
            {item.count > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.brand, color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {item.count}
              </span>
            )}
          </div>
          {item.label}
        </div>
      ))}
    </footer>
  );
}