import React from 'react';

export default function ItemModal({ selectedItem, setSelectedItem, addToCart, theme, resolveImagePath }) {
  if (!selectedItem) return null;

  return (
    <div 
      onClick={() => setSelectedItem()} 
    
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.85)', 
        display: 'flex', alignItems: 'center', 
        justifyContent: 'center', zIndex: 1000 
      }}
    >
      <div 
        onClick={() => e.stopPropagation(null)} 
        style={{ 
          backgroundColor: 'white', 
          margin: '20px', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          maxWidth: '500px', 
          width: '90%', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)' 
        }}
      >
        {/* Main Item Image */}
        <img 
          src={resolveImagePath(selectedItem.imageUrl, 'menu-items')} 
          alt={selectedItem.name} 
          style={{ width: '100%', display: 'block' }} 
        />

        <div style={{ backgroundColor: '#F7E7D4', padding: '24px', textAlign: 'left', borderTop: '4px solid #E6D6C4' }}>
          
          {/* Header: Name and Variation Icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '7px', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#36281E', fontWeight: '700' }}>
              {selectedItem.name}
            </h2>
            {selectedItem.variation && (
              <img 
                src={`/menu-items/${selectedItem.variation.toLowerCase()}.png`}
                alt={selectedItem.variation}
                style={{ width: '18px', height: '20px', objectFit: 'contain' }}
              />
            )}
          </div>

          {/* Description */}
          <p style={{ color: '#36281E', margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.6', fontWeight: '600', textAlign: 'left' }}>
            {selectedItem.description}
          </p>

          {/* Highlights */}
          {selectedItem.highlights && (
            <p style={{ color: '#FF5958', margin: '0 0 12px 0', fontSize: '14px', fontStyle: 'italic', fontWeight: '500', textAlign: 'left' }}>
              {selectedItem.highlights}
            </p>
          )}

          {/* Visual Disclaimer */}
          <p style={{ 
            borderTop: '1.5px solid rgba(54, 40, 30, 0.1)', 
            paddingTop: '3px', margin: 0, fontSize: '11px', 
            color: '#36281E', fontStyle: 'italic' 
          }}>
            * Visuals are for illustration. The final product may vary.
          </p>
        </div>
      </div>
    </div>
  );
}