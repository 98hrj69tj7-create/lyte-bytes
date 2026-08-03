import React, { useState } from 'react';

export default function ItemCard({ item, openModal, addToCart, resolveImagePath, layout, theme }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // State for the success morph animation
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const hasVariants = item.variants && item.variants.length > 0;
  const displayPrice = hasVariants ? item.variants[0].price : (parseFloat(item.price) || 0);
  const displayUnit = item.unit || (hasVariants ? item.variants[0].label : "");

  const handleAddClick = (e) => {
    e.stopPropagation();

    if (hasVariants) {
      openModal('VARIANTS', item);
    } else {
      addToCart(item);
      
      // Trigger success morph state for 1 second
      setIsAddedRecently(true);
      setTimeout(() => {
        setIsAddedRecently(false);
      }, 1000);
    }
  };

  const isGridView = layout === 'grid';

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '14px', 
        border: isHovered ? '1px solid rgba(255, 89, 88, 0.4)' : (theme.border || '1px solid rgba(216, 199, 165, 0.3)'), 
        borderRadius: theme.radius || '16px', 
        display: 'flex', 
        flexDirection: isGridView ? 'column' : 'row', 
        gap: '14px', 
        backgroundColor: theme.buttonBg || '#201C18', 
        boxShadow: isHovered ? '0 16px 36px rgba(0,0,0,0.22)' : '0 2px 8px rgba(0,0,0,0.06)', 
        alignItems: isGridView ? 'stretch' : 'center',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Image Container with Premium Zoom */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          openModal('ZOOM', item);
        }} 
        onMouseEnter={() => setIsImgHovered(true)}
        onMouseLeave={() => setIsImgHovered(false)}
        style={{ 
          cursor: 'pointer', 
          flexShrink: 0, 
          borderRadius: '12px', 
          overflow: 'hidden',
          width: isGridView ? '100%' : '100px',
          height: isGridView ? '130px' : '100px',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src={resolveImagePath ? resolveImagePath(item.imageUrl, 'menu-items') : item.imageUrl} 
          alt={item.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block',
            transform: isImgHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} 
        />
      </div>

      {/* Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '2px' }}>
            {item.variation && (
              <img 
                src={`/menu-items/${item.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : item.variation.trim().toLowerCase()}.png`} 
                alt={item.variation} 
                style={{ width: '14px', height: '14px', flexShrink: '0', marginTop: '3px' }} 
              />
            )}
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#ffffff', lineHeight: '1.3' }}>
              {item.name}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '12px', color: theme.brand || '#FF5958', fontStyle: 'italic', fontWeight: '500' }}>
              {displayUnit}
            </span>
          </div>
        </div>
        
        {/* Bottom Row: Customisable Text (Left) & Price + Add Button (Right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: isGridView ? '4px' : '0' }}>
          <div>
            {hasVariants && (
              <span style={{ fontSize: '12px', color: '#B5AFA7', fontWeight: '400' }}>
                Customisable
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: theme.brand || '#FF5958', fontWeight: '700', fontSize: '16px' }}>
              ₹{displayPrice}
            </div>

            {/* Instagram-style Pill Add Button */}
            <button 
              onClick={handleAddClick}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              style={{
                backgroundColor: isAddedRecently ? '#10B981' : (theme.brand || '#FF5958'),
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 18px', 
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: isAddedRecently ? '0 4px 16px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(255, 89, 88, 0.25)',
                transform: isPressed ? 'scale(0.92)' : (isAddedRecently ? 'scale(1.05)' : 'scale(1)'),
                transition: 'transform 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                minWidth: '68px',
                textAlign: 'center'
              }}
            >
              {isAddedRecently ? '✓ Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}