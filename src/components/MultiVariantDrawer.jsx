import React, { useState } from 'react';

export default function MultiVariantDrawer({ selectedItem, setSelectedItem, addToCart }) {
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
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '100%', 
          maxWidth: '345px', 
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          zIndex: 1001,
          maxHeight: '75vh', 
          overflowY: 'auto',
          padding: '16px 16px 24px 16px',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drag Handle */}
        <div style={{ width: '36px', height: '4px', backgroundColor: '#E5E0D8', borderRadius: '2px', margin: '0 auto 12px auto' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '17px', color: '#3E3328', fontWeight: '700' }}>
            {selectedItem.name}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#8C7A6B' }}>
            Choose your variants
          </p>
        </div>
        
        {/* Variant List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
          {selectedItem.variants.map((v, index) => {
            const qty = quantities[index];
            const isSelected = qty > 0;

            return (
              <div 
                key={index}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 16px', 
                  border: `1.5px solid ${isSelected ? '#FF5958' : '#EFECE6'}`, 
                  borderRadius: '12px',
                  background: isSelected ? '#FFF8F8' : '#FAFAFA',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '400', fontSize: '14px', color: '#3E3328' }}>
                    {v.label || "N/A"}
                  </span>
                  <span style={{ color: '#FF5958', fontWeight: '500', fontSize: '14px', marginTop: '0px' }}>
                    ₹{v.price}
                  </span>
                </div>
        
                {/* Compact Inline Counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FF5958', color: '#FFF', padding: '4px 10px', borderRadius: '8px' }}>
                  <button 
                    onClick={() => handleDecrement(index)}
                    style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: '0 2px' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '10px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button 
                    onClick={() => handleIncrement(index)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: '0 2px' }}
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
            padding: '10px',
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '15px',
            cursor: totalSelectedCount === 0 ? 'not-allowed' : 'pointer',
            boxShadow: totalSelectedCount === 0 ? 'none' : '0 4px 12px rgba(255, 89, 88, 0.25)',
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