import React from 'react';

export default function ItemCard({ item, openModal, addToCart, resolveImagePath, layout, theme }) {
  // Pre-calculate variant logic to keep JSX clean
  const hasVariants = item.variants && item.variants.length > 0;
  const displayPrice = hasVariants ? item.variants[0].price : (parseFloat(item.price) || 0);
  const displayUnit = item.unit || (hasVariants ? item.variants[0].label : "");

  return (
    <div style={{ 
      padding: '12px', 
      border: theme.border, 
      borderRadius: theme.radius, 
      display: 'flex', 
      flexDirection: layout === 'grid' ? 'column' : 'row', 
      gap: '14px', 
      backgroundColor: theme.buttonBg, // Matches your theme card background
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
      alignItems: layout === 'grid' ? 'stretch' : 'center'
    }}>
      {/* Image Container */}
      <div onClick={() => openModal('ZOOM', item)} style={{ cursor: 'pointer', flexShrink: 0 }}>
        <img 
          src={resolveImagePath(item.imageUrl, 'menu-items')} 
          alt={item.name} 
          style={{ 
            width: layout === 'grid' ? '100%' : '100px', 
            height: layout === 'grid' ? '120px' : '100px', 
            objectFit: 'cover', 
            borderRadius: '10px',
            display: 'block'
          }} 
        />
      </div>

      {/* Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', minHeight: layout === 'grid' ? 'auto' : '100px', justifyContent: 'space-between' }}>
        
        {/* Top Section: Title, Unit, & Customisable */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '2px' }}>
            {item.variation && (
              <img 
                src={`/menu-items/${item.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : item.variation.trim().toLowerCase()}.png`} 
                alt={item.variation} 
                style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '3px' }} 
              />
            )}
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#E8E4D9', lineHeight: '1.2' }}>
              {item.name}
            </div>
          </div>
          
          {/* Tightly stacked Unit and Customisable text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
            <span style={{ fontSize: '12px', color: theme.brand, fontStyle: 'italic', fontWeight: '500' }}>
              {displayUnit}
            </span>
            {hasVariants && (
              <span style={{ fontSize: '10px', color: '#E8E4D9', opacity: 0.8, fontWeight: '400' }}>
                Customisable
              </span>
            )}
          </div>
        </div>
        
        {/* Bottom Section: Price & Add Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px' }}>
          
          {/* Price & Button Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: theme.brand, fontWeight: '700', fontSize: '15px' }}>
              ₹{displayPrice}
            </div>
            <button 
              onClick={() => {
                if (hasVariants) {
                  openModal('VARIANTS', item);
                } else {
                  addToCart(item);
                }
              }}
              style={{
                backgroundColor: theme.brand,
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 18px', 
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(255, 89, 88, 0.25)'
              }}
            >
              Add
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}