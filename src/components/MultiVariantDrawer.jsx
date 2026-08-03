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
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px',
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
        backgroundColor: 'rgba(0,0,0,0.5)', 
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
          backgroundColor: '#FFFBF2', 
          borderRadius: activeTheme.radius,
          zIndex: 1101,
          maxHeight: '75vh', 
          overflowY: 'auto',
          padding: '16px 20px 24px 20px', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          border: activeTheme.border,
          boxSizing: 'border-box',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drag Handle */}
        <div style={{ width: '40px', height: '4px', backgroundColor: '#E5D6B5', borderRadius: '2px', margin: '0 auto 16px auto' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px dashed #E5D6B5', paddingBottom: '12px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '17px', color: activeTheme.text, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {selectedItem.name}
          </h3>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#776E62' }}>
            Choose your variants
          </p>
        </div>
        
        {/* Variant List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          {selectedItem.variants.map((v, index) => {
            const qty = quantities[index];
            const isSelected = qty > 0;

            return (
              <div 
                key={index}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', 
                  border: isSelected ? `1.5px solid ${activeTheme.brand}` : activeTheme.border, 
                  borderRadius: '12px',
                  background: isSelected ? '#FFF8E7' : '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '14.5px', color: activeTheme.text }}>
                    {v.label || "N/A"}
                  </span>
                  <span style={{ color: activeTheme.brand, fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>
                    ₹{v.price}
                  </span>
                </div>
        
                {/* Pill Counter */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  backgroundColor: isSelected ? activeTheme.brand : '#F5EFE6', 
                  color: isSelected ? '#FFF' : activeTheme.text, 
                  padding: '6px 14px', 
                  borderRadius: '20px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <button 
                    onClick={() => handleDecrement(index)}
                    style={{ background: 'none', border: 'none', color: isSelected ? '#FFF' : activeTheme.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 2px' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: '700', fontSize: '14px', minWidth: '14px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button 
                    onClick={() => handleIncrement(index)}
                    style={{ background: 'none', border: 'none', color: isSelected ? '#FFF' : activeTheme.brand, fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 2px' }}
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
            backgroundColor: totalSelectedCount === 0 ? '#EAE5DE' : activeTheme.brand,
            color: totalSelectedCount === 0 ? '#A39688' : '#FFFFFF',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: totalSelectedCount === 0 ? 'not-allowed' : 'pointer',
            boxShadow: totalSelectedCount === 0 ? 'none' : '0 4px 15px rgba(255, 89, 88, 0.3)',
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