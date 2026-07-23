import React, { useState } from 'react';

export default function MultiVariantDrawer({ selectedItem, setSelectedItem, addToCart, theme }) {
  if (!selectedItem || !selectedItem.variants) return null;

  const [quantities, setQuantities] = useState(
    selectedItem.variants.reduce((acc, _, index) => {
      acc[index] = 0;
      return acc;
    }, {})
  );

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
        // Provides safe clearance at the bottom so it floats cleanly above your sticky cart bar and bottom navigation pill
        paddingBottom: '85px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          // Fluid design scaling dynamically to any screen size
          width: '81%', 
          maxWidth: '440px', 
          backgroundColor: theme?.bg || '#FDFCF0', 
          borderTopLeftRadius: '24px',
          borderBottomLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          zIndex: 1101,
          maxHeight: '75vh', 
          overflowY: 'auto',
          padding: '12px 18px 20px 18px', 
          boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drag Handle */}
        <div style={{ width: '40px', height: '2px', backgroundColor: '#D8D0C5', borderRadius: '2px', margin: '0 auto 14px auto' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '18px', color: '#3E3328', fontWeight: '700' }}>
            {selectedItem.name}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#7C6E61' }}>
            Choose your variants
          </p>
        </div>
        
        {/* Variant List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '08px', marginBottom: '20px' }}>
          {selectedItem.variants.map((v, index) => {
            const qty = quantities[index];
            const isSelected = qty > 0;

            return (
              <div 
                key={index}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 8px', 
                  border: isSelected ? '1.5px solid #FF5958' : (theme?.border || '1px solid #EBE5D9'), 
                  borderRadius: '14px',
                  background: isSelected ? '#FFF5F5' : (theme?.buttonBg || '#423B32'),
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '400', fontSize: '15px', color: isSelected ? '#3E3328' : '#E8E4D9' }}>
                    {v.label || "N/A"}
                  </span>
                  <span style={{ color: '#FF5958', fontWeight: '600', fontSize: '15px', marginTop: '1px' }}>
                    ₹{v.price}
                  </span>
                </div>
        
                {/* Compact Inline Counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FF5958', color: '#FFF', padding: '6px 14px', borderRadius: '10px' }}>
                  <button 
                    onClick={() => handleDecrement(index)}
                    style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '15px', fontWeight: '500', cursor: 'pointer', padding: '0 2px' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: '700', fontSize: '15px', minWidth: '12px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button 
                    onClick={() => handleIncrement(index)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '15px', fontWeight: '500', cursor: 'pointer', padding: '0 2px' }}
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
            backgroundColor: totalSelectedCount === 0 ? '#EAE5DE' : '#FF5958',
            color: totalSelectedCount === 0 ? '#A39688' : '#FFFFFF',
            border: 'none',
            padding: '8px',
            borderRadius: '14px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: totalSelectedCount === 0 ? 'not-allowed' : 'pointer',
            boxShadow: totalSelectedCount === 0 ? 'none' : '0 4px 15px rgba(255, 89, 88, 0.3)',
            transition: 'all 0.2s ease'
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