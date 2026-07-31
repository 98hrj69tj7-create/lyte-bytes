import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, ShoppingCart, Navigation, Info, HeadphonesIcon, PhoneIcon } from 'lucide-react';

export default function Footer({ view, setView, theme, cart = [] }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  // Scroll-aware smart hide logic (listens to scroll events from window or any inner container via capture phase)
  useEffect(() => {
    const handleScroll = (e) => {
      const target = e.target === document ? document.documentElement : e.target;
      const scrollTop = target.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTopRef.current + 8) {
        setIsVisible(false); // Scrolling down -> Hide dock
      } else if (scrollTop < lastScrollTopRef.current - 8) {
        setIsVisible(true);  // Scrolling up -> Show dock
      }
      lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // Calculate total item quantity for the cart badge
  const totalItems = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) 
    : 0;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Sparkles },       
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: totalItems }, 
    { id: 'track', label: 'Track', icon: Navigation },     
    { id: 'info', label: 'Support', icon: PhoneIcon },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '14px',         // 👈 CUSTOMIZE: Distance of the floating dock from the bottom of the screen
      left: '50%',
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '100px'})`, // Smart scroll slide hide effect
      width: 'calc(100% - 32px)', // 👈 CUSTOMIZE: Dock width span across mobile screens
      maxWidth: '350px',      // 👈 CUSTOMIZE: Maximum width limit for desktop/tablet viewports
      
      // --- GLASSMORPHISM, BACKGROUND & OPACITY ---
      backgroundColor: 'rgba(24, 18, 17, 0.88)', // 👈 CUSTOMIZE: Charcoal background & Opacity
      backdropFilter: 'blur(24px)',              // 👈 CUSTOMIZE: iOS background glass blur intensity
      WebkitBackdropFilter: 'blur(24px)',        // Safari blur support
      border: '1px solid rgba(255, 255, 255, 0.15)', // 👈 CUSTOMIZE: Outer rim border & highlight opacity
      borderRadius: '30px',                      // 👈 CUSTOMIZE: Dock corner rounding (capsule curvature)
      
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 2px',        // 👈 CUSTOMIZE: Slim vertical & horizontal height padding of the dock
      zIndex: 1000,
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      
      // Smart Hide Transitions & Pointer Events
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
    }}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = view === item.id || (item.id === 'home' && (view === 'subcat' || view === 'items'));

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              background: 'transparent', // Background container highlight removed completely
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '4px 12px',      // 👈 CUSTOMIZE: Inner spacing/padding around individual buttons
              borderRadius: '20px',     
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              transition: 'all 0.2s ease', 
              boxShadow: 'none',        // No container box shadow
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
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)', // 👈 CUSTOMIZE: Active icon scale magnification effect
                  filter: isActive ? 'drop-shadow(0 4px 12px rgba(255, 89, 88, 0.5))' : 'none',
                }}
              />
              
              {/* --- ROUND COUNTER BADGE CUSTOMIZATION --- */}
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',        // 👈 CUSTOMIZE: Badge vertical position (move higher/lower)
                  right: '-15px',       // 👈 CUSTOMIZE: Badge horizontal position (move left/right)
                  width: '18px',      // 👈 CUSTOMIZE: Fixed width for a pure round circle shape
                  height: '18px',     // 👈 CUSTOMIZE: Fixed height matching width for symmetry
                  borderRadius: '50%',// 👈 CUSTOMIZE: Strict circle shape instead of a pill
                  
                  background: 'linear-gradient(135deg, #F5E6CA 0%, #D4AF37 100%)', // 👈 CUSTOMIZE: Badge background color/gradient
                  color: '#18181B',   // 👈 CUSTOMIZE: Badge text color
                  fontSize: '10px',    // 👈 CUSTOMIZE: Badge number font size (scaled to fit double digits neatly)
                  fontWeight: '700',  // 👈 CUSTOMIZE: Badge font weight boldness
                  
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(212, 175, 55, 0.45)',
                  animation: 'popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  border: '1.5px solid rgba(24, 24, 27, 0.95)',
                }}>
                  {item.badge}
                </span>
              )}
            </div>

            <span style={{
              fontSize: '12px',      // 👈 CUSTOMIZE: Navigation label text font size
              marginTop: '6px',       // 👈 CUSTOMIZE: Spacing gap between icon and label text
              fontWeight: isActive ? '500' : '400',
              color: isActive ? '#FF5958' : '#A1A1AA',
              letterSpacing: '0.5px',
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