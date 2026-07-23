import React from 'react';

export default function VariantDrawer({ selectedItem, setSelectedItem, addToCart, resolveImagePath }) {
  if (!selectedItem) return null;

  return (
    <>
      {/* Background Overlay - Aligned to bottom */}
      <div 
        onClick={() => setSelectedItem(null)} 
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}
      >
        {/* Bottom Sheet Drawer */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          style={{ 
            width: '100%', 
            maxWidth: '480px', 
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            zIndex: 1001,
            maxHeight: '80vh', 
            overflowY: 'auto',
            padding: '24px 20px 32px 20px',
            boxShadow: '0 -4px 25px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Drag Handle Indicator */}
          <div style={{ width: '40px', height: '4px', backgroundColor: '#E0E0E0', borderRadius: '2px', margin: '0 auto 16px auto' }} />

          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', textAlign: 'center', color: '#36281E', fontWeight: '700' }}>
            Select Size
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedItem.variants?.map((v, index) => (
              <button 
                key={index}
                onClick={() => {
                  addToCart({ ...selectedItem, price: v.price, unit: v.label });
                  setSelectedItem(null);
                }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px', border: '1.5px solid #FF5958', borderRadius: '10px',
                  background: '#F9F9F9', cursor: 'pointer', textAlign: 'left', width: '100%'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#36281E', whiteSpace: 'nowrap' }}>
                    {v.label || "N/A"}
                  </span>
                  <span style={{ fontSize: '12px', color: '#FF5958', marginTop: '2px' }}>01 portion</span>
                </div>
        
                <span style={{ color: '#FF5958', fontWeight: '700', fontSize: '16px', marginLeft: '8px' }}>
                  ₹{v.price}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { 
          from { transform: translateY(100%); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>
    </>
  );
}