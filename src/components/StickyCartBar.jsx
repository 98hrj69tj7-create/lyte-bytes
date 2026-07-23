import React from 'react';

export default function StickyCartBar({ cart = [], onViewCart }) {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  if (totalItems === 0) return null;

  return (
    <div 
      onClick={onViewCart}
      style={{
        position: 'fixed',
        // Perfectly positioned to hover right above the bottom navigation pill
        bottom: '80px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '440px',
        
        // Advanced Glassmorphism Styling
        backgroundColor: 'rgba(255, 89, 88, 0.88)', // Semi-transparent coral brand color
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(12px)', // Safari support
        border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle glossy rim highlight
        
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '6px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(255, 89, 88, 0.3)',
        zIndex: 950, 
        cursor: 'pointer',
        animation: 'slideUpBar 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box'
      }}
    >
      {/* Left side: Item count and total price */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.8px', color: 'rgba(255, 255, 255, 0.9)' }}>
          {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
        </span>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', letterSpacing: '0.8px' }}>
          ₹{totalPrice}
        </span>
      </div>

      {/* Right side: View Bag CTA Pill */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        backgroundColor: 'rgba(255, 255, 255, 0.22)', 
        backdropFilter: 'blur(4px)',
        padding: '7px 14px', 
        borderRadius: '14px',
        fontWeight: '600',
        fontSize: '14px',
        letterSpacing: '0.4px',
        border: '1.5px solid #ffffff', 
      }}>
        <span>VIEW BAG</span>
        <span style={{ fontSize: '16px' }}>→</span>
      </div>

      <style>{`
        @keyframes slideUpBar {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}