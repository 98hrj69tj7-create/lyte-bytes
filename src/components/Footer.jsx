import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Truck, Info } from 'lucide-react';

export default function Footer({ view, setView, cart, theme }) {
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0);
  
  // State for whether the footer is manually expanded by the user
  const [isManualExpanded, setIsManualExpanded] = useState(false);

  // If there are items in the cart, force it to stay up; otherwise follow manual user toggle (defaulting to tucked in)
  const isExpanded = totalQty > 0 ? true : isManualExpanded;

  // Automatically tuck back in when clicking anywhere outside the footer if cart is empty
  useEffect(() => {
    const handleOutsideClick = () => {
      if (totalQty === 0 && isManualExpanded) {
        setIsManualExpanded(false);
      }
    };

    if (isExpanded && totalQty === 0) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isExpanded, totalQty, isManualExpanded]);

  return (
    <footer 
      onClick={(e) => {
        e.stopPropagation(); 
        if (!isExpanded) setIsManualExpanded(true);
      }}
      style={{ 
        position: 'fixed',
        bottom: isExpanded ? '12px' : '-4px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: isExpanded ? '90%' : '180px', 
        maxWidth: '420px',
        zIndex: 1000,
        height: isExpanded ? '64px' : '34px', 
        border: `1px solid ${theme?.brand || '#FF5958'}`, 
        display: 'flex', 
        justifyContent: isExpanded ? 'space-around' : 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(66, 59, 50, 0.95)', 
        borderRadius: isExpanded ? '22px' : '16px 16px 0 0',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxSizing: 'border-box',
        cursor: !isExpanded ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {isExpanded ? (
        // Full Navigation Icons
        [
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'cart', icon: ShoppingBag, label: 'Bag', count: totalQty },
          { id: 'track', icon: Truck, label: 'Track' },
          { id: 'info', icon: Info, label: 'Info' }
        ].map((item) => {
          const isActive = view === item.id;

          return (
            <div 
              key={item.id} 
              onClick={(e) => { 
                e.stopPropagation(); 
                setView(item.id); 
                // Optional: tuck back in after clicking a tab if cart is empty
                if (totalQty === 0) setIsManualExpanded(false);
              }} 
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
        })
      ) : (
        // Tucked Default State
        <div style={{ 
          color: '#FFFFFF', 
          fontSize: '11.5px', 
          fontWeight: '600', 
          letterSpacing: '0.4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>You want more!!! ↑</span>
        </div>
      )}
    </footer>
  );
}