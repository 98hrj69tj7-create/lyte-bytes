import React, { useState, useEffect } from 'react';

export default function StickyCartBar({ cart = [], onViewCart }) {
  const totalItems = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
      : (Number(item.price) || 0);
    const qty = Number(item.qty) || 1;
    return sum + (price * qty);
  }, 0);

  // State to trigger the spring pulse on item change
  const [isPulseActive, setIsPulseActive] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setIsPulseActive(true);
      const timer = setTimeout(() => setIsPulseActive(false), 350);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <>
      <div 
        onClick={onViewCart}
        style={{
          position: 'fixed',
          bottom: '80px', 
          left: '50%',
          transform: isPulseActive ? 'translateX(-50%) scale(1.03)' : 'translateX(-50%) scale(1)',
          width: '95%',
          maxWidth: '440px',
          background: 'linear-gradient(135deg, rgba(255, 90, 88, 0.95) 0%, rgba(215, 45, 60, 0.98) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          color: '#FFFFFF',
          borderRadius: '22px',
          padding: '10px 16px 10px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: isPulseActive 
            ? '0 20px 45px rgba(215, 45, 60, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.8)' 
            : '0 14px 35px rgba(215, 45, 60, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
          zIndex: 950, 
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
          boxSizing: 'border-box'
        }}
      >
        {/* Sleek Prism Glass Sweep Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-150%',
          width: '150%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
          transform: 'skewX(-20deg)',
          animation: 'prismSweep 3.2s infinite ease-in-out',
          pointerEvents: 'none'
        }} />

        {/* Left Side: Quantity Badge + Total Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
          {/* Animated Glow Counter Badge */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)',
            animation: 'badgePulse 2s infinite ease-in-out',
            fontWeight: '700',
            fontSize: '15px',
            color: '#FFFFFF',
            transform: isPulseActive ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {totalItems}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.8px', color: 'rgba(255, 255, 255, 0.85)', textTransform: 'uppercase' }}>
              {totalItems === 1 ? 'Total Item' : 'Total Items'}
            </span>
            <span style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              ₹{totalPrice}
            </span>
          </div>
        </div>

        {/* Right Side: Sleek Call to Action Button */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          backgroundColor: '#FFFFFF', 
          color: '#E03E44',
          padding: '9px 18px', 
          borderRadius: '15px',
          fontWeight: '700',
          fontSize: '13px',
          letterSpacing: '0.6px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
          transition: 'transform 0.2s ease',
        }}>
          <span>VIEW BAG</span>
          <span style={{ fontSize: '15px', fontWeight: '800' }}>→</span>
        </div>
      </div>

      <style>{`
        @keyframes badgePulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
          }
          70% {
            transform: scale(1.06);
            box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        @keyframes prismSweep {
          0% {
            left: '-150%';
          }
          35% {
            left: '150%';
          }
          100% {
            left: '150%';
          }
        }
      `}</style>
    </>
  );
}