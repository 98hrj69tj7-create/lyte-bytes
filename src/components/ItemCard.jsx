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

            {/* Morphing Add Button */}
            <button 
              onClick={handleAddClick}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              style={{
                backgroundColor: isAddedRecently ? '#10B981' : theme.brand, // Turns success green when added
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 18px', 
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: isAddedRecently ? '0 4px 16px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(255, 89, 88, 0.35)',
                transform: isPressed ? 'scale(0.92)' : (isAddedRecently ? 'scale(1.05)' : 'scale(1)'),
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring bounce effect
                minWidth: '70px',
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