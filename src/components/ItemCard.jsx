import React, { useState } from 'react';

export default function ItemCard({ item, openModal, addToCart, resolveImagePath, layout, theme }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);

  const hasVariants = item.variants && item.variants.length > 0;
  const displayPrice = hasVariants ? item.variants[0].price : (parseFloat(item.price) || 0);
  const displayUnit = item.unit || (hasVariants ? item.variants[0].label : "");

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '14px', 
        border: isHovered ? '1px solid rgba(255, 89, 88, 0.4)' : theme.border, 
        borderRadius: theme.radius, 
        display: 'flex', 
        flexDirection: layout === 'grid' ? 'column' : 'row', 
        gap: '14px', 
        backgroundColor: theme.buttonBg, 
        boxShadow: isHovered ? '0 16px 36px rgba(0,0,0,0.22)' : '0 2px 8px rgba(0,0,0,0.06)', 
        alignItems: layout === 'grid' ? 'stretch' : 'center',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
      }}
    >
      {/* Image Container with Premium Zoom */}
      <div 
        onClick={() => openModal('ZOOM', item)} 
        onMouseEnter={() => setIsImgHovered(true)}
        onMouseLeave={() => setIsImgHovered(false)}
        style={{ cursor: 'pointer', flexShrink: 0, borderRadius: '10px', overflow: 'hidden' }}
      >
        <img 
          src={resolveImagePath(item.imageUrl, 'menu-items')} 
          alt={item.name} 
          style={{ 
            width: layout === 'grid' ? '100%' : '100px', 
            height: layout === 'grid' ? '120px' : '100px', 
            objectFit: 'cover', 
            display: 'block',
            transform: isImgHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} 
        />
      </div>

      {/* Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', minHeight: layout === 'grid' ? 'auto' : '100px', justifyContent: 'space-between' }}>
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
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px' }}>
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
                boxShadow: '0 4px 12px rgba(255, 89, 88, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="active:scale-95"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}