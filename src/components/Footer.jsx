import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, Navigation, User, Headphones } from 'lucide-react';

export default function Footer({ view, setView, theme }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  // Scroll-aware smart hide logic
  useEffect(() => {
    const handleScroll = (e) => {
      const target = e.target === document ? document.documentElement : e.target;
      const scrollTop = target.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTopRef.current + 8) {
        setIsVisible(false); 
      } else if (scrollTop < lastScrollTopRef.current - 8) {
        setIsVisible(true);  
      }
      lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Sparkles },       
    { id: 'track', label: 'Track', icon: Navigation },     
    { id: 'info', label: 'Concierge', icon: Headphones },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',         
      left: '50%',
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '100px'})`, 
      width: 'calc(100% - 24px)', 
      maxWidth: '380px',      
      
      // Matching Dark Charcoal Container Styling (#1A1714)
      backgroundColor: '#1A1714', 
      backdropFilter: 'blur(24px)',              
      WebkitBackdropFilter: 'blur(24px)',        
      border: '1px solid rgba(197, 160, 89, 0.4)', // Warm gold rim border
      borderRadius: '24px',                      
      
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 8px',        
      zIndex: 1000,
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      boxSizing: 'border-box',
      
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = view === item.id || (item.id === 'home' && (view === 'subcat' || view === 'items'));

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              background: isActive ? 'rgba(197, 160, 89, 0.18)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '6px 8px',      
              borderRadius: '16px',     
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              transition: 'all 0.2s ease', 
              boxShadow: 'none',
              flex: 1,
            }}
          >
            <div style={{ 
              position: 'relative', 
              width: '22px', 
              height: '22px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <IconComponent 
                size={20} 
                color={isActive ? '#C5A059' : '#A19A92'} // Gold active state (#C5A059)
                strokeWidth={isActive ? 2.5 : 1.8}        
                style={{
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 2px 8px rgba(197, 160, 89, 0.4))' : 'none',
                }}
              />
            </div>

            <span style={{
              fontSize: '10.5px',      
              marginTop: '4px',       
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#C5A059' : '#A19A92', // Gold active state text
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