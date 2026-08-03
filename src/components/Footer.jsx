import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, Navigation, PhoneIcon, User } from 'lucide-react';

export default function Footer({ view, setView, theme }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  // Fallback Theme values matching your app's warm boutique aesthetic
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
  };

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

  // 5 Main Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Sparkles },       
    { id: 'track', label: 'Track', icon: Navigation },     
    { id: 'info', label: 'Support', icon: PhoneIcon },
    { id: 'account', label: 'Account', icon: User }, // 5th Tab for Customer/Loyalty page
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',         // Distance of floating dock from bottom screen edge
      left: '50%',
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '100px'})`, // Smart scroll slide hide effect
      width: 'calc(100% - 24px)', // Dock width span across mobile screens
      maxWidth: '380px',      // Maximum width limit optimized for 5 items
      
      // --- GLASSMORPHISM, BACKGROUND & OPACITY ---
      backgroundColor: 'rgba(28, 22, 20, 0.92)', // Deep warm charcoal background & Opacity
      backdropFilter: 'blur(24px)',              // iOS background glass blur intensity
      WebkitBackdropFilter: 'blur(24px)',        // Safari blur support
      border: '1px solid rgba(230, 200, 165, 0.25)', // Subtle warm gold-tinted rim border
      borderRadius: '24px',                      // Dock corner rounding (capsule curvature)
      
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 8px',        // Inner height & edge padding of the dock
      zIndex: 1000,
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      boxSizing: 'border-box',
      
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
              background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '6px 8px',      // Equal spacing and padding for all 5 buttons
              borderRadius: '16px',     
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              transition: 'all 0.2s ease', 
              boxShadow: 'none',
              flex: 1,
            }}
          >
            {/* Icon Bounding Box */}
            <div style={{ 
              position: 'relative', 
              width: '22px', 
              height: '22px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <IconComponent 
                size={20} // Icon dimensions balanced for 5 items
                color={isActive ? '#E6C875' : '#A19A92'} 
                strokeWidth={isActive ? 2.5 : 1.8}        
                style={{
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 2px 8px rgba(230, 200, 165, 0.4))' : 'none',
                }}
              />
            </div>

            <span style={{
              fontSize: '10.5px',      // Font size optimized for 5-item alignment without wrapping
              marginTop: '4px',       // Gap between icon and text
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#E6C875' : '#A19A92',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}