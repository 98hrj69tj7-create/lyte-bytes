import React from 'react';

export default function ItemCard({ item, openModal, addToCart, resolveImagePath, layout, theme }) {
  // Safe price parsing
  const price = parseFloat(item.price);
  const displayPrice = isNaN(price) ? "" : `₹${price}`;

  return (
    <div style={{ 
      padding: '12px', 
      border: '1px solid #D8C7A5', 
      borderRadius: '16px', 
      display: 'flex', 
      flexDirection: layout === 'grid' ? 'column' : 'row', 
      gap: '12px', 
      backgroundColor: '#FFFFFF', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
    }}>
      {/* Image Container with Zoom trigger */}
      <div onClick={() => openModal('ZOOM', item)} style={{ cursor: 'pointer', flexShrink: 0 }}>
    <img 
      src={resolveImagePath(item.imageUrl, 'menu-items')} 
      alt={item.name} 
      style={{ 
      width: layout === 'grid' ? '100%' : '90px', 
      height: layout === 'grid' ? '120px' : '90px', 
      objectFit: 'cover', 
      borderRadius: '12px' 
      }} 
      />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          {item.variation && (
            <img 
              src={`/menu-items/${item.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : item.variation.trim().toLowerCase()}.png`} 
              alt={item.variation} 
              style={{ width: '16px', height: '16px', flexShrink: 0 }} 
            />
          )}
          <div style={{ fontWeight: '800', fontSize: '15px', color: '#36281E' }}>{item.name}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#FF5958', marginTop: '2px', fontStyle: 'italic', fontWeight: '500' }}>
        {/* Priority: Item unit -> First Variant Label -> "Customisable" */}
        {item.unit || (item.variants && item.variants.length > 0 ? item.variants[0].label : "Customisable")}
        </div>
        
        {/* PRICE & ADD BUTTON SECTION */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
          
          {/* Price - This is now to the immediate left of the button */}
          <div style={{ color: '#FF5958', fontWeight: '600', fontSize: '15px' }}>
          ₹{item.variants ? item.variants[0].price : (parseFloat(item.price) || 0)}
          </div>

          {/* Button and Customisable Container */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
          onClick={() => {
          // This logic prevents the Zoom modal from ever opening on click
          if (item.variants && item.variants.length > 0) {
          openModal('VARIANTS', item);
          } else {
          addToCart(item);
          }
          }}
          style={{
          backgroundColor: '#FF5958',
          color: '#FFFFFF',
          border: 'none',
          padding: '6px 16px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer'
          }}
          >
          Add
          </button>
  
  {/* Customisable text: Only shows if item is marked as customisable */}
  {String(item.isCustomisable || "").toLowerCase() === 'yes' && (
  <span style={{ fontSize: '9px', color: '#888', marginTop: '2px', textAlign: 'center' }}>
    Customisable
  </span>
  )}
</div>
        </div>
      </div>
    </div>
  );
}