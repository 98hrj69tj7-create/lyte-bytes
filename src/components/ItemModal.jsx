import React from 'react';
import { Flame } from 'lucide-react';

export default function ItemModal({ selectedItem, setSelectedItem, addToCart, theme, resolveImagePath }) {
  if (!selectedItem) return null;

  const handleClose = () => {
    setSelectedItem(null);
  };

  // Robust image path resolution
  const getImageSrc = () => {
    if (!selectedItem.imageUrl) return '';
    if (selectedItem.imageUrl.startsWith('http') || selectedItem.imageUrl.startsWith('/')) {
      return selectedItem.imageUrl;
    }
    try {
      if (typeof resolveImagePath === 'function') {
        const resolved = resolveImagePath(selectedItem.imageUrl, 'menu-items');
        if (resolved) return resolved;
      }
    } catch (e) {
      // Fallback
    }
    return `/menu-items/${selectedItem.imageUrl}`;
  };

  return (
    <div 
      onClick={handleClose}
      style={{
        // FIXED OVERLAY SPACING
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
        // This padding ensures the modal card doesn't touch the absolute edges of mobile screens
        // Increase to make the background border thicker on mobile devices
        padding: '20px', 
        
        boxSizing: 'border-box',
        backgroundColor: 'rgba(20, 15, 12, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        cursor: 'pointer' 
      }}
    >
      <div 
        style={{
          // MODAL CARD DIMENSIONS
          // maxWidth dictates how wide the card gets on large screens (desktop/tablet)
          maxWidth: '480px', 
          width: '100%',
          
          // maxHeight dictates how tall the card gets before it forces a scrollbar
          // 90vh means it will take up a maximum of 90% of the screen height
          maxHeight: '90vh', 
          
          // Controls how round the corners of the main pop-up card are
          borderRadius: '24px', 
          
          backgroundColor: '#FFFBF2',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #ff5958',
          position: 'relative',
          boxSizing: 'border-box',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'default' 
        }}
      >
        {/* MAIN ITEM IMAGE HEADER */}
        <div style={{ 
          width: '100%', 
          // Height of the food image. Increase this for a taller image, decrease for more text space.
          height: '260px', 
          backgroundColor: '#1a1a1a', 
          position: 'relative' 
        }}>
          <img 
            src={getImageSrc()} 
            alt={selectedItem.name} 
            onError={(e) => {
              if (!e.target.src.includes('/menu-items/')) {
                e.target.src = `/menu-items/${selectedItem.imageUrl}`;
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />

          {/* UNIT OVERLAY (e.g., "01 piece") */}
          {selectedItem.unit && (
            <div style={{
              position: 'absolute',
              // Controls how far from the bottom edge of the image the badge sits
              bottom: '12px', 
              // Controls how far from the left edge of the image the badge sits
              left: '16px', 
              
              // Internal spacing inside the badge (top/bottom: 6px, left/right: 12px)
              padding: '6px 12px', 
              
              // Roundness of the badge
              borderRadius: '20px', 
              
              backgroundColor: 'rgba(54, 40, 30, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.3px'
            }}>
              {selectedItem.unit}
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div style={{ 
          // Overall padding inside the text area. 
          // Increase to push text further away from the outer borders.
          padding: '18px', 
          
          // Gap handles the vertical spacing between EVERY major block 
          // (Header <-> Description <-> Highlights <-> Nutrition <-> Disclaimer)
          // Adjust this instead of adding margins to individual blocks for cleaner code
          gap: '12px', 

          textAlign: 'left', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column'
        }}>
          
          {/* TITLE & PRICE SECTION */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              
              // Spacing between the Item Name text and the Veg/Non-Veg icon
              gap: '2px', 
              
              // Space between the top row (Title) and the bottom row (Price)
              marginBottom: '1px' 
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '20px', 
                color: '#36281E', 
                fontWeight: '600', 
                letterSpacing: '-0.4px', 
                lineHeight: '1.2' 
              }}>
                {selectedItem.name}
              </h2>
              {selectedItem.variation && (
                <img 
                  src={`/menu-items/${selectedItem.variation.toLowerCase()}.png`}
                  alt={selectedItem.variation}
                  style={{ 
                    // Size of the Veg/Non-veg icon
                    width: '20px', 
                    height: '20px', 
                    objectFit: 'contain', 
                    flexShrink: 0 
                  }}
                />
              )}
            </div>
          </div>

          {/* DESCRIPTION TEXT */}
          <p style={{ 
            color: '#5A4A3E', 
            margin: 0, 
            fontSize: '15px', 
            // Line height controls vertical spacing between lines of text in the description
            lineHeight: '1.4', 
            fontWeight: '400' 
          }}>
            {selectedItem.description}
          </p>

          {/* HIGHLIGHTS / ALLERGEN BOX */}
          {selectedItem.highlights && (
            <div style={{ 
              // Internal spacing of the highlight box (top/bottom: 10px, left/right: 14px)
              padding: '4px 14px', 
              
              // Thickness of the red bar on the left
              borderLeft: '5px solid #FF5958', 
              
              // Only rounds the top-right and bottom-right corners
              borderRadius: '0 8px 8px 0',

              backgroundColor: 'rgba(255, 89, 88, 0.06)', 
              fontSize: '13px', 
              color: '#D32F2F', 
              fontStyle: 'italic', 
              fontWeight: '500',
              lineHeight: '1.4'
            }}>
              {selectedItem.highlights}
            </div>
          )}

          {/* NUTRITIONAL FACTS CONTAINER */}
          <div style={{ 
            // Internal padding around the edge of the entire nutritional block
            padding: '8px', 
            
            borderRadius: '14px', 
            backgroundColor: '#F7E7D4', 
            border: '1px solid #FF5958'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              
              // Spacing between the Flame icon and the "NUTRITIONAL INFORMATION" text
              gap: '4px', 
              
              // Distance between the header text and the 4 grid boxes below it
              marginBottom: '8px', 

              fontSize: '10px', 
              fontWeight: '600', 
              color: '#36281E', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px'
            }}>
              <Flame size={16} color="#FF5958" /> Nutritional Information (Per Portion)
            </div>
            
            {/* NUTRITIONAL GRID (4 COLUMNS) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              
              // Gap controls the space horizontally between the 4 small stat boxes
              gap: '10px', 
              
              textAlign: 'center' 
            }}>
              {/* Individual Stat Box (Calories) */}
              <div style={{ 
                // Internal space inside the white stat box (top/bottom: 8px, left/right: 4px)
                padding: '8px 4px', 
                borderRadius: '8px',
                backgroundColor: '#FFFBF2' 
              }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '600' }}>CALORIES</div>
                <div style={{ 
                  // Pushes the number slightly away from the title above it
                  marginTop: '1px', 
                  fontSize: '12px', color: '#36281E', fontWeight: '600' 
                }}>
                  {selectedItem.calories || '240'}
                </div>
              </div>

              {/* Individual Stat Box (Protein) */}
              <div style={{ padding: '8px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '600' }}>PROTEIN</div>
                <div style={{ marginTop: '2px', fontSize: '12px', color: '#36281E', fontWeight: '600' }}>
                  {selectedItem.protein || '12g'}
                </div>
              </div>

              {/* Individual Stat Box (Carbs) */}
              <div style={{ padding: '8px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '600' }}>CARBS</div>
                <div style={{ marginTop: '2px', fontSize: '12px', color: '#36281E', fontWeight: '600' }}>
                  {selectedItem.carbs || '18g'}
                </div>
              </div>

              {/* Individual Stat Box (Fat) */}
              <div style={{ padding: '8px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '600' }}>FAT</div>
                <div style={{ marginTop: '2px', fontSize: '12px', color: '#36281E', fontWeight: '600' }}>
                  {selectedItem.fat || '8g'}
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL DISCLAIMER FOOTER */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            
            // Creates the subtle separator line
            borderTop: '1px solid rgba(54, 40, 30, 0.08)', 
            
            // Space between the separator line and the text itself
            paddingTop: '8px' 
          }}>
            <span style={{ fontSize: '11px', color: '#8C7A6B', fontStyle: 'italic' }}>
              * Visuals are for illustration. Final product may vary.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}