import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, Navigation, PhoneIcon, User } from 'lucide-react';

export default function Footer({ view, setView, theme }) {
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

  // 5 Main Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Sparkles },       
    { id: 'track', label: 'Track', icon: Navigation },     
    { id: 'info', label: 'Support', icon: PhoneIcon },
    { id: 'account', label: 'Account', icon: User }, // 👈 5th Tab for Customer/Loyalty page
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',         // 👈 CUSTOMIZE: Distance of floating dock from bottom screen edge
      left: '50%',
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '100px'})`, // Smart scroll slide hide effect
      width: 'calc(100% - 24px)', // 👈 CUSTOMIZE: Dock width span across mobile screens
      maxWidth: '350px',      // 👈 CUSTOMIZE: Maximum width limit (expanded slightly for 5 items)
      
      // --- GLASSMORPHISM, BACKGROUND & OPACITY ---
      backgroundColor: 'rgba(24, 18, 17, 0.88)', // Charcoal background & Opacity
      backdropFilter: 'blur(24px)',              // iOS background glass blur intensity
      WebkitBackdropFilter: 'blur(24px)',        // Safari blur support
      border: '1px solid rgba(255, 255, 255, 0.15)', // Outer rim border & highlight opacity
      borderRadius: '20px',                      // Dock corner rounding (capsule curvature)
      
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '4px 4px',        // 👈 CUSTOMIZE: Inner height & edge padding of the dock
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
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '4px 6px',      // 👈 CUSTOMIZE: Equal spacing for all 5 buttons
              borderRadius: '20px',     
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              transition: 'all 0.2s ease', 
              boxShadow: 'none',
            }}
          >
            {/* Icon Bounding Box */}
            <div style={{ 
              position: 'relative', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <IconComponent 
                size={21} // 👈 CUSTOMIZE: Icon dimensions
                color={isActive ? '#D4AF37' : '#A1A1AA'} 
                strokeWidth={isActive ? 2.6 : 1.8}        
                style={{
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.5))' : 'none',
                }}
              />
            </div>

            <span style={{
              fontSize: '11px',      // 👈 CUSTOMIZE: Font size for 5-item alignment
              marginTop: '4px',       // 👈 CUSTOMIZE: Gap between icon and text
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#D4AF37' : '#A1A1AA',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}