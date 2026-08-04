import React from 'react';
import { Flame } from 'lucide-react';

// Color & Style mapping for menu tags
const TAG_STYLES = {
  BEST_SELLER: { label: 'Best Seller', bg: '#FFD700', color: '#000000', emoji: '🏆' },
  HOT: { label: 'Hot', bg: '#FF5958', color: '#FFFFFF', emoji: '🔥' },
  NEW: { label: 'New', bg: '#10B981', color: '#FFFFFF', emoji: '✨' },
  FAST_MOVING: { label: 'Fast Moving', bg: '#F59E0B', color: '#FFFFFF', emoji: '⚡' },
  HIGH_PROTEIN: { label: 'High Protein', bg: '#3B82F6', color: '#FFFFFF', emoji: '💪' },
  LOW_CAL: { label: 'Low Cal', bg: '#10B981', color: '#FFFFFF', emoji: '🥗' },
  GUILT_FREE: { label: 'Guilt Free', bg: '#34D399', color: '#FFFFFF', emoji: '🌿' },
  CHEFS_SPECIAL: { label: "Chef's Special", bg: '#8B5CF6', color: '#FFFFFF', emoji: '👨‍🍳' },
  AMMIS_SPECIAL: { label: "Ammi's Special", bg: '#EC4899', color: '#FFFFFF', emoji: '👵' },
  FESTIVE: { label: 'Festive', bg: '#F43F5E', color: '#FFFFFF', emoji: '🎄' },
  LIMITED: { label: 'Limited', bg: '#EF4444', color: '#FFFFFF', emoji: '⌛' },
  PREMIUM: { label: 'Gourmet', bg: '#A855F7', color: '#FFFFFF', emoji: '👑' },
  SPICY: { label: 'Spicy', bg: '#DC2626', color: '#FFFFFF', emoji: '🌶️' },
  TANGY: { label: 'Tangy', bg: '#F59E0B', color: '#FFFFFF', emoji: '🍋' },
  SWEET: { label: 'Sweet', bg: '#EC4899', color: '#FFFFFF', emoji: '🍩' },
  PARTY_PACK: { label: 'Party Pack', bg: '#6366F1', color: '#FFFFFF', emoji: '👥' },
  QUICK_BITE: { label: 'Quick Bite', bg: '#0EA5E9', color: '#FFFFFF', emoji: '🥪' }
};

function normalizeTagKey(tag) {
  if (!tag) return '';
  return String(tag)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Premium Modal Tag Pill (Inline layout)
 */
function ModalTagBadge({ tagKey }) {
  const normalizedKey = normalizeTagKey(tagKey);
  if (!normalizedKey) return null;

  const config = TAG_STYLES[normalizedKey] || {
    label: tagKey.replace(/[,_]/g, ' ').trim(),
    bg: '#FF5958',
    color: '#FFFFFF',
    emoji: '✦'
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      padding: '3px 6px',
      borderRadius: '8px',
      color: '#36281E',
      fontSize: '10px',
      fontWeight: '500',
      lineHeight: '1.2'
    }}>
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}

export default function ItemModal({ selectedItem, setSelectedItem, resolveImagePath }) {
  if (!selectedItem) return null;

  const handleClose = () => {
    setSelectedItem(null);
  };

  // Parse all tags
  const rawTags = selectedItem.tags || selectedItem.Tags || selectedItem.tag || '';
  const parsedTags = (
    Array.isArray(rawTags) 
      ? rawTags 
      : typeof rawTags === 'string' 
        ? rawTags.split(',') 
        : []
  )
    .map(t => normalizeTagKey(t))
    .filter(Boolean);

  // Image path resolution
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px', 
        boxSizing: 'border-box',
        backgroundColor: 'rgba(20, 15, 12, 0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer' 
      }}
    >
      <div 
        onClick={() => e.stopPropagation()}
        style={{
          maxWidth: '460px', 
          width: '100%',
          maxHeight: '90vh', 
          borderRadius: '24px', 
          backgroundColor: '#FFFBF2',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 89, 88, 0.4)',
          position: 'relative',
          boxSizing: 'border-box',
          cursor: 'default' 
        }}
      >
        {/* MAIN ITEM IMAGE HEADER */}
        <div style={{ 
          width: '100%', 
          height: '240px', 
          backgroundColor: '#1a1a1a', 
          position: 'relative',
          flexShrink: 0
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

          {/* PORTION / UNIT OVERLAY */}
          {selectedItem.unit && (
            <div style={{
              position: 'absolute',
              bottom: '12px', 
              left: '16px', 
              padding: '5px 12px', 
              borderRadius: '20px', 
              backgroundColor: 'rgba(30, 24, 20, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.15)',
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
          padding: '18px', 
          gap: '14px', 
          textAlign: 'left', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1
        }}>
          
          {/* TITLE, VEG/NON-VEG ICON, AND ALL INLINE TAGS (ZOOMED-IN VIEW) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '6px' 
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px', 
              color: '#36281E', 
              fontWeight: '600', 
              letterSpacing: '0.2px', 
              lineHeight: '1.2' 
            }}>
              {selectedItem.name}
            </h2>

            {selectedItem.variation && (
              <img 
                src={`/menu-items/${selectedItem.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : selectedItem.variation.trim().toLowerCase()}.png`}
                alt={selectedItem.variation}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  objectFit: 'contain', 
                  flexShrink: 0 
                }}
              />
            )}

            {/* SHOWS ALL TAGS WHEN ZOOMED IN */}
            {parsedTags.map((tag, idx) => (
              <ModalTagBadge key={idx} tagKey={tag} />
            ))}
          </div>

          {/* DESCRIPTION TEXT */}
          {selectedItem.description && (
            <p style={{ 
              color: '#5A4A3E', 
              margin: 0, 
              fontSize: '14px', 
              lineHeight: '1.5', 
              fontWeight: '400' 
            }}>
              {selectedItem.description}
            </p>
          )}

          {/* HIGHLIGHTS / ALLERGEN BOX */}
          {selectedItem.highlights && (
            <div style={{ 
              padding: '8px 12px', 
              borderLeft: '4px solid #FF5958', 
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
            padding: '12px', 
            borderRadius: '16px', 
            backgroundColor: '#F7E7D4', 
            border: '1px solid rgba(255, 89, 88, 0.3)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '6px', 
              fontSize: '11px', 
              fontWeight: '700', 
              color: '#36281E', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px'
            }}>
              <Flame size={16} color="#FF5958" /> Nutritional Information (Per Portion)
            </div>
            
            {/* NUTRITIONAL GRID */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px', 
              textAlign: 'center' 
            }}>
              <div style={{ padding: '6px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '700' }}>CALORIES</div>
                <div style={{ marginTop: '-5px', fontSize: '12px', color: '#36281E', fontWeight: '700' }}>
                  {selectedItem.calories || '240'}
                </div>
              </div>

              <div style={{ padding: '6px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '700' }}>PROTEIN</div>
                <div style={{ marginTop: '-5px', fontSize: '12px', color: '#36281E', fontWeight: '700' }}>
                  {selectedItem.protein || '12g'}
                </div>
              </div>

              <div style={{ padding: '6px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '700' }}>CARBS</div>
                <div style={{ marginTop: '-5px', fontSize: '12px', color: '#36281E', fontWeight: '700' }}>
                  {selectedItem.carbs || '18g'}
                </div>
              </div>

              <div style={{ padding: '6px 4px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                <div style={{ fontSize: '10px', color: '#8C7A6B', fontWeight: '700' }}>FAT</div>
                <div style={{ marginTop: '-5px', fontSize: '12px', color: '#36281E', fontWeight: '700' }}>
                  {selectedItem.fat || '8g'}
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL DISCLAIMER */}
          <div style={{
            paddingTop: '1px' 
          }}>
            <span style={{ fontSize: '11px', color: '#8C7A6B', fontStyle: 'italic' }}>
              * Visuals are for illustration. The final product may vary
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}