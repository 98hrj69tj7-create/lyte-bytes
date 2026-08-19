import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, Navigation, User, Headphones } from 'lucide-react';

export default function Footer({ view, setView, theme }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  // Time check helper: Active between 09:00 AM (540 mins) and 10:00 PM (1320 mins)
  const checkIsLive = () => {
    const now = new Date();
    const totalMins = now.getHours() * 60 + now.getMinutes();
    return totalMins >= 540 && totalMins < 1320;
  };
  const isLive = checkIsLive();

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
    { id: 'info', label: 'Concierge', icon: Headphones, badge: true }, 
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
      backgroundColor: '#1A1714', 
      backdropFilter: 'blur(24px)',              
      WebkitBackdropFilter: 'blur(24px)',        
      border: '1px solid rgba(197, 160, 89, 0.4)', 
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
      <style>{`
        @keyframes pulseLive {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes pulseOffline {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>

      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = view === item.id || (item.id === 'home' && (view === 'subcat' || view === 'items'));

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              background: 'transparent', // Removed active background box block
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '6px 8px',      
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
                color={isActive ? '#C5A059' : '#A19A92'} 
                strokeWidth={isActive ? 2.5 : 1.8}        
                style={{
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 2px 8px rgba(197, 160, 89, 0.4))' : 'none',
                }}
              />
              {/* Dynamic Timeline Status Dot for Concierge (Green when live, Red when offline) */}
              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-4px',
                  width: '7px',
                  height: '7px',
                  backgroundColor: isLive ? '#22c55e' : '#ef4444',
                  borderRadius: '50%',
                  boxShadow: isLive ? '0 0 6px #22c55e' : '0 0 6px #ef4444',
                  animation: isLive ? 'pulseLive 2s infinite' : 'pulseOffline 2s infinite',
                  border: '1px solid #1A1714'
                }} />
              )}
            </div>

            <span style={{
              fontSize: '10.5px',      
              marginTop: '4px',       
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#C5A059' : '#A19A92',
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