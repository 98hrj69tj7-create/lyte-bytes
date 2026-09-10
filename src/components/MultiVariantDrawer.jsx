import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function MultiVariantDrawer({ selectedItem, setSelectedItem, addToCart, theme = {} }) {
  if (!selectedItem || !selectedItem.variants) return null;

  const [quantities, setQuantities] = useState(
    selectedItem.variants.reduce((acc, _, index) => {
      acc[index] = 0;
      return acc;
    }, {})
  );

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid #FF5958',
    bg: theme?.bg || '#FFFDF9',
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSelectedItem]);

  const handleIncrement = (index) => {
    setQuantities(prev => ({ ...prev, [index]: prev[index] + 1 }));
  };

  const handleDecrement = (index) => {
    setQuantities(prev => ({ ...prev, [index]: Math.max(0, prev[index] - 1) }));
  };

  const totalSelectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleAddAllToCart = () => {
    selectedItem.variants.forEach((v, index) => {
      const qty = quantities[index];
      if (qty > 0) {
        for (let i = 0; i < qty; i++) {
          addToCart({ ...selectedItem, price: v.price, unit: v.label });
        }
      }
    });
    setSelectedItem(null);
  };

  const modalContent = (
    <div 
      onClick={() => setSelectedItem(null)} 
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed', 
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }}
    >
      <style>{`
        @keyframes slideUpSheet {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '100%', 
          maxWidth: '520px', 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderTopLeftRadius: 'clamp(20px, 5vw, 28px)',
          borderTopRightRadius: 'clamp(20px, 5vw, 28px)',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          maxHeight: '82vh', 
          overflowY: 'auto',
          padding: 'clamp(16px, 4vw, 22px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          border: '1px solid rgba(197, 160, 89, 0.5)',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUpSheet 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '14px', paddingBottom: '6px', minWidth: 0 }}>
          <h3 style={{ 
            margin: '0 0 3px 0', 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(18px, 4.5vw, 22px)',
            color: activeTheme.text, 
            fontWeight: '700', 
            letterSpacing: '0.2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {selectedItem.name}
          </h3>
          <p style={{ margin: 0, fontSize: 'clamp(11.5px, 3.2vw, 13px)', color: '#78716C', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
            Select your preferred portions or options
          </p>
        </div>
        
        {/* Variant List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
          {selectedItem.variants.map((v, index) => {
            const qty = quantities[index];
            const isSelected = qty > 0;

            return (
              <div 
                key={index}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px',
                  border: isSelected ? `1.5px solid ${activeTheme.brand}` : '1px solid rgba(197, 160, 89, 0.25)', 
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(197, 160, 89, 0.12)' : '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  boxSizing: 'border-box',
                  gap: '12px',
                  minWidth: 0
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span style={{ 
                    fontWeight: '600', 
                    fontSize: 'clamp(12px, 3.5vw, 14px)',
                    color: activeTheme.text,
                    fontFamily: "sans-serif",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {v.label || "N/A"}
                  </span>
                  <span style={{ color: activeTheme.brand, fontWeight: '700', fontSize: 'clamp(11.5px, 3.2vw, 13px)', marginTop: '1px', whiteSpace: 'nowrap' }}>
                    ₹{v.price}
                  </span>
                </div>
        
                {/* Pill Counter */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  backgroundColor: isSelected ? activeTheme.brand : 'rgba(197, 160, 89, 0.12)', 
                  color: isSelected ? '#FFFFFF' : activeTheme.text, 
                  padding: '6px 12px', 
                  borderRadius: '20px',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  flexShrink: 0
                }}>
                  <button 
                    type="button"
                    onClick={() => handleDecrement(index)}
                    style={{ background: 'none', border: 'none', color: isSelected ? '#FFFFFF' : activeTheme.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: '700', fontSize: 'clamp(12px, 3.5vw, 14px)', minWidth: '14px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleIncrement(index)}
                    style={{ background: 'none', border: 'none', color: isSelected ? '#FFFFFF' : activeTheme.brand, fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button 
          type="button"
          onClick={handleAddAllToCart}
          disabled={totalSelectedCount === 0}
          style={{
            width: '100%',
            background: totalSelectedCount === 0 
              ? '#E5E0D8' 
              : 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
            color: totalSelectedCount === 0 ? '#9C9388' : '#FFFFFF',
            border: totalSelectedCount === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: 'clamp(13px, 3.8vw, 14.5px)',
            letterSpacing: '0.2px',
            cursor: totalSelectedCount === 0 ? 'not-allowed' : 'pointer',
            boxShadow: totalSelectedCount === 0 ? 'none' : '0 4px 15px rgba(255, 89, 88, 0.35)',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
        >
          {totalSelectedCount === 0 ? 'Select a Variant' : `Add ${totalSelectedCount} Item(s) to Cart`}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}