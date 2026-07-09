import React from 'react';

export default function VariantDrawer({ selectedItem, setSelectedItem, addToCart, resolveImagePath }) {
  if (!selectedItem) return null;

  return (
    <>
      {/* Background Overlay */}
      <div 
        onClick={() => setSelectedItem(null)} 
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000 
        }}
      />

      {/* Compact Right-Bottom Drawer */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          width: '25%', // 25% of screen width
          minWidth: '280px', // Ensures it doesn't get too skinny on small screens
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          zIndex: 1001,
          maxHeight: '50vh', 
          overflowY: 'auto',
          padding: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textAlign: 'center', color: '#36281E' }}>
          Select Size
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {selectedItem.variants?.map((v, index) => (
            <button 
              key={index}
              onClick={() => {
                addToCart({ ...selectedItem, price: v.price, unit: v.label });
                setSelectedItem(null);
              }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px', border: '1.5px solid #FF5958', borderRadius: '10px',
                background: '#F9F9F9', cursor: 'pointer', textAlign: 'left'
              }}
            >
              {/* Explicit rendering of the label (Size) */}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontWeight: '400', fontSize: '14px', color: '#36281E', whiteSpace: 'nowrap' }}>
            {v.label || "N/A"}
            </span>
            <span style={{ fontSize: '12px', color: '#FF5958' }}>01 portion</span>
            </div>
    
            {/* Price section */}
            <span style={{ color: '#FF5958', fontWeight: '600', fontSize: '15px', marginLeft: '8px' }}>
            ₹{v.price}
            </span>
        </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { 
          from { transform: translateX(100%); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; } 
        }
      `}</style>
    </>
  );
}