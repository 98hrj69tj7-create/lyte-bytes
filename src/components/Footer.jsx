import React from 'react';
import { Home, Sparkles, ShoppingBag, Navigation, Info } from 'lucide-react';

export default function Footer({ view, setView, theme, cart = [] }) {
  // Calculate total item quantity for the cart badge
  const totalItems = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) 
    : 0;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Sparkles },       
    { id: 'cart', label: 'Bag', icon: ShoppingBag, badge: totalItems },
    { id: 'track', label: 'Track', icon: Navigation },     
    { id: 'info', label: 'Info', icon: Info },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '12px',         // 👈 CUSTOMIZE: Distance of the floating dock from the bottom of the screen
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', // 👈 CUSTOMIZE: Dock width span across mobile screens
      maxWidth: '440px',      // 👈 CUSTOMIZE: Maximum width limit for desktop/tablet viewports
      
      // --- GLASSMORPHISM, BACKGROUND & OPACITY ---
      backgroundColor: 'rgba(24, 24, 27, 0.88)', // 👈 CUSTOMIZE: Charcoal background & Opacity (Change last value 0 to 1)
      backdropFilter: 'blur(24px)',              // 👈 CUSTOMIZE: iOS background glass blur intensity
      WebkitBackdropFilter: 'blur(24px)',        // Safari blur support
      border: '1px solid rgba(255, 255, 255, 0.15)', // 👈 CUSTOMIZE: Outer rim border & highlight opacity
      borderRadius: '26px',                      // 👈 CUSTOMIZE: Dock corner rounding (capsule curvature)
      
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 8px',        // 👈 CUSTOMIZE: Slim vertical & horizontal height padding of the dock
      zIndex: 1000,
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    }}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = view === item.id || (item.id === 'home' && (view === 'subcat' || view === 'items'));

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '4px 6px', // 👈 CUSTOMIZE: Inner spacing/padding around individual buttons
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
            }}
          >
            {/* Locked Bounding Box Wrapper for Icons */}
            <div style={{ 
              position: 'relative', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <IconComponent 
                size={22} // 👈 CUSTOMIZE: Default icon dimension size
                color={isActive ? '#FF5958' : '#A1A1AA'} 
                strokeWidth={isActive ? 2.6 : 1.8}        
                style={{
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)', // 👈 CUSTOMIZE: Active icon scale magnification effect
                  filter: isActive ? 'drop-shadow(0 4px 12px rgba(255, 89, 88, 0.5))' : 'none',
                }}
              />
              
              {/* --- COUNTER BADGE CUSTOMIZATION --- */}
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',      // 👈 CUSTOMIZE: Badge vertical position (move higher/lower)
                  right: '-12px',     // 👈 CUSTOMIZE: Badge horizontal position (move left/right)
                  height: '16px',     // 👈 CUSTOMIZE: Badge container height
                  minWidth: '16px',   // 👈 CUSTOMIZE: Badge minimum width for single digits
                  padding: '0 4px',   // 👈 CUSTOMIZE: Horizontal inner padding for double-digit expansion
                  borderRadius: '8px',// 👈 CUSTOMIZE: Badge rounding (circle vs soft pill)
                  
                  background: 'linear-gradient(135deg, #F5E6CA 0%, #D4AF37 100%)', // 👈 CUSTOMIZE: Badge background color/gradient
                  color: '#18181B',   // 👈 CUSTOMIZE: Badge text color
                  fontSize: '10px',    // 👈 CUSTOMIZE: Badge number font size
                  fontWeight: '600',  // 👈 CUSTOMIZE: Badge font weight boldness
                  
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(212, 175, 55, 0.45)',
                  animation: 'popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  border: '1.5px solid rgba(24, 24, 27, 0.95)',
                  whiteSpace: 'nowrap',
                }}>
                  {item.badge}
                </span>
              )}
            </div>

            <span style={{
              fontSize: '9.5px',      // 👈 CUSTOMIZE: Navigation label text font size
              marginTop: '3px',       // 👈 CUSTOMIZE: Spacing gap between icon and label text
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#FF5958' : '#A1A1AA',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}