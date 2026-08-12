import React, { useState } from 'react';

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
    radius: theme?.radius || '20px',
  };

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

  return (
    <div 
      onClick={() => setSelectedItem(null)} 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'rgba(20, 15, 12, 0.82)', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center',
        paddingBottom: '85px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '90%', 
          maxWidth: '440px', 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderRadius: activeTheme.radius,
          zIndex: 1101,
          maxHeight: '75vh', 
          overflowY: 'auto',
          padding: '16px 20px 24px 20px', 
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          border: activeTheme.border,
          boxSizing: 'border-box',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Drag Handle */}
        <div style={{ width: '38px', height: '4px', backgroundColor: '#C5A059', opacity: 0.5, borderRadius: '2px', margin: '0 auto 16px auto' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '10px', paddingBottom: '6px' }}>
          <h3 style={{ 
            margin: '0 0 3px 0', 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px', 
            color: activeTheme.text, 
            fontWeight: '700', 
            letterSpacing: '0.2px' 
          }}>
            {selectedItem.name}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#78716C', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
            Select your preferred portions or options
          </p>
        </div>
        
        {/* Variant List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
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
                  borderRadius: '14px',
                  background: isSelected ? 'rgba(197, 160, 89, 0.12)' : '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ 
                    fontWeight: '700', 
                    fontSize: '15px', 
                    color: activeTheme.text,
                    fontFamily: "'Cormorant Garamond', serif"
                  }}>
                    {v.label || "N/A"}
                  </span>
                  <span style={{ color: activeTheme.brand, fontWeight: '700', fontSize: '14.5px', marginTop: '1px' }}>
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
                  padding: '5px 12px', 
                  borderRadius: '20px',
                  border: '1px solid rgba(197, 160, 89, 0.25)'
                }}>
                  <button 
                    onClick={() => handleDecrement(index)}
                    style={{ background: 'none', border: 'none', color: isSelected ? '#FFFFFF' : activeTheme.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 2px' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: '700', fontSize: '13.5px', minWidth: '14px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button 
                    onClick={() => handleIncrement(index)}
                    style={{ background: 'none', border: 'none', color: isSelected ? '#FFFFFF' : activeTheme.brand, fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 2px' }}
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
          onClick={handleAddAllToCart}
          disabled={totalSelectedCount === 0}
          style={{
            width: '100%',
            background: totalSelectedCount === 0 
              ? '#E5E0D8' 
              : 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
            color: totalSelectedCount === 0 ? '#9C9388' : '#FFFFFF',
            border: totalSelectedCount === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '13px',
            borderRadius: '14px',
            fontWeight: '600',
            fontSize: '14px',
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

      <style>{`
        @keyframes slideUp { 
          from { transform: translateY(100%); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>
    </div>
  );
}