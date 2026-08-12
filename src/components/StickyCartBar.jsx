import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const PALETTES = {
  obsidianGold: {
    bg: 'linear-gradient(135deg, rgba(26, 23, 20, 0.98) 0%, rgba(18, 15, 13, 0.99) 100%)', // #1A1714 Dark Charcoal Base
    border: '1px solid rgba(197, 160, 89, 0.4)',
    shadow: '0 16px 36px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(197, 160, 89, 0.2)',
    
    badgeBg: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
    badgeText: '#FFFFFF',
    labelColor: '#C5A059',   // Champagne Gold
    priceColor: '#FFFBF2',
    
    goldGlow: '197, 160, 89', 
    
    btnBg: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
    btnText: '#FFFFFF',
    btnShadow: '0 4px 16px rgba(255, 89, 88, 0.4)'
  }
};

const SPACING = {
  dockBottom: '82px',          
  dockMaxWidth: '325px',        
  dockPadding: '10px 16px',     
  dockBorderRadius: '50px',     
  badgeToTextGap: '12px',      
  labelToPriceGap: '3px',       
  badgeSize: '35px',            
  badgeFontSize: '14px',        
  labelFontSize: '10px',        
  priceFontSize: '16px',        
  btnPadding: '6px 12px',       
  btnBorderRadius: '20px',      
  btnTextToIconGap: '5px',      
  btnFontSize: '12px',          
  btnIconSize: 16,              
};

export default function StickyCartBar({ cart = [], onViewCart }) {
  const theme = PALETTES.obsidianGold;

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const [isPulseActive, setIsPulseActive] = useState(false);
  
  const prevTotalItemsRef = useRef(0);
  const isInitialMount = useRef(true);

  const totalItems = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0) 
    : 0;
  
  const totalPrice = Array.isArray(cart) 
    ? cart.reduce((sum, item) => {
        const price = typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
          : (Number(item.price) || 0);
        const qty = Number(item.qty) || 1;
        return sum + (price * qty);
      }, 0) 
    : 0;

  useEffect(() => {
    if (isInitialMount.current) {
      prevTotalItemsRef.current = totalItems;
      isInitialMount.current = false;
      return;
    }

    if (totalItems > prevTotalItemsRef.current) {
      setIsPulseActive(true);
      const timer = setTimeout(() => setIsPulseActive(false), 900);
      prevTotalItemsRef.current = totalItems;
      return () => clearTimeout(timer);
    } else {
      prevTotalItemsRef.current = totalItems;
    }
  }, [totalItems]);

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

  if (totalItems === 0) return null;

  return (
    <>
      <div 
        onClick={onViewCart}
        style={{
          position: 'fixed',
          bottom: SPACING.dockBottom,
          left: '50%',
          transform: `translateX(-50%) translateY(${isVisible ? '0px' : '140px'}) scale(${isPulseActive ? 1.015 : 1})`,
          
          width: 'calc(100% - 28px)',
          maxWidth: SPACING.dockMaxWidth,
          
          background: theme.bg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isPulseActive 
            ? '1px solid rgba(197, 160, 89, 0.85)' 
            : theme.border,
          borderRadius: SPACING.dockBorderRadius,
          color: theme.priceColor,
          
          padding: SPACING.dockPadding,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          
          boxShadow: isPulseActive 
            ? `0 16px 36px rgba(0, 0, 0, 0.7), 0 0 18px rgba(${theme.goldGlow}, 0.35)` 
            : theme.shadow,
          
          zIndex: 990,
          cursor: 'pointer',
          overflow: 'hidden',
          boxSizing: 'border-box',
          
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, border 0.6s ease, box-shadow 0.6s ease',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Shimmer Glass Sweep Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-150%',
          width: '150%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transform: 'skewX(-20deg)',
          animation: 'prismSweep 4s infinite ease-in-out',
          pointerEvents: 'none'
        }} />

        {/* Left Section: Item Count Badge & Price */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: SPACING.badgeToTextGap,
          zIndex: 1 
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `2px solid rgba(${theme.goldGlow}, 0.85)`,
              opacity: isPulseActive ? 1 : 0,
              transform: isPulseActive ? 'scale(1.35)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: SPACING.badgeSize,
              height: SPACING.badgeSize,
              borderRadius: '50%',
              background: theme.badgeBg,
              border: isPulseActive ? '1.5px solid #FFF5C0' : '1.5px solid #C5A059',
              
              boxShadow: isPulseActive
                ? `0 0 0 4px rgba(${theme.goldGlow}, 0.3), 0 0 18px rgba(${theme.goldGlow}, 0.85), 0 0 30px rgba(${theme.goldGlow}, 0.4)`
                : `0 2px 10px rgba(0, 0, 0, 0.4), 0 0 8px rgba(${theme.goldGlow}, 0.25)`,
              
              fontSize: SPACING.badgeFontSize,
              fontWeight: '700',
              color: theme.badgeText,
              
              textShadow: isPulseActive
                ? `0 0 10px rgba(${theme.goldGlow}, 1), 0 0 4px #FFFFFF`
                : `0 0 4px rgba(${theme.goldGlow}, 0.5)`,

              transform: isPulseActive ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease, text-shadow 0.6s ease, border 0.6s ease',
            }}>
              {totalItems}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: SPACING.labelToPriceGap 
          }}>
            <span style={{ 
              fontSize: SPACING.labelFontSize,
              fontWeight: '600', 
              letterSpacing: '0.8px', 
              color: theme.labelColor,
              textTransform: 'uppercase',
              lineHeight: 1,
              margin: 0,
              padding: 0
            }}>
              {totalItems === 1 ? '1 Item Selected' : 'Items Selected'}
            </span>
            <span style={{ 
              fontSize: SPACING.priceFontSize,
              fontWeight: '600',  
              color: theme.priceColor, 
              letterSpacing: '0.3px',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              lineHeight: 1.1,
              margin: 0,
              padding: 0
            }}>
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right Section: View Bag Button */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: SPACING.btnTextToIconGap,                 
          background: theme.btnBg, 
          color: theme.btnText,
          padding: SPACING.btnPadding,
          borderRadius: SPACING.btnBorderRadius,       
          fontWeight: '700',
          fontSize: SPACING.btnFontSize,
          letterSpacing: '0.5px',
          boxShadow: theme.btnShadow,
          zIndex: 1,
          transition: 'all 0.2s ease',
        }}>
          <span>VIEW BAG</span>
          <ArrowRight size={SPACING.btnIconSize} strokeWidth={2.8} />
        </div>
      </div>

      <style>{`
        @keyframes prismSweep {
          0% { left: -150%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }
      `}</style>
    </>
  );
}