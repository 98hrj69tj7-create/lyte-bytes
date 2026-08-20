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
      gap: '3px',
      padding: '2px 8px',
      borderRadius: '8px',
      backgroundColor: 'rgba(197, 160, 89, 0.12)',
      border: '1px solid rgba(197, 160, 89, 0.3)',
      color: '#8A6D2B',
      fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
      fontWeight: '600',
      lineHeight: '1.2',
      flexShrink: 0
    }}>
      <span style={{ flexShrink: 0 }}>{config.emoji}</span>
      <span style={{ whiteSpace: 'nowrap' }}>{config.label}</span>
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

  const activeTheme = {
    radius: 'clamp(20px, 5vw, 24px)' // 💡 FLUID RADIUS
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
          borderRadius: activeTheme.radius, // 💡 FLUID RADIUS
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(197, 160, 89, 0.45)',
          position: 'relative',
          boxSizing: 'border-box',
          cursor: 'default',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* MAIN ITEM IMAGE HEADER */}
        <div style={{ 
          width: '100%', 
          height: 'clamp(200px, 50vw, 240px)', // 💡 FLUID HEIGHT
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
              border: '1px solid rgba(197, 160, 89, 0.3)',
              color: '#FFD700',
              fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
              fontWeight: '600',
              letterSpacing: '0.3px',
              fontFamily: "sans-serif",
              whiteSpace: 'nowrap'
            }}>
              {selectedItem.unit}
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div style={{ 
          padding: 'clamp(16px, 4vw, 22px)', // 💡 FLUID PADDING
          gap: '12px', 
          textAlign: 'left', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          boxSizing: 'border-box',
          minWidth: 0
        }}>
          
          {/* TITLE, VEG/NON-VEG ICON, AND ALL INLINE TAGS */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '8px',
            minWidth: 0
          }}>
            <h2 style={{ 
              margin: 0, 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
              color: '#1A1816', 
              fontWeight: '700', 
              letterSpacing: '0.2px', 
              lineHeight: '1',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {selectedItem.name}
            </h2>

            {selectedItem.variation && (
              <img 
                src={`/menu-items/${selectedItem.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : selectedItem.variation.trim().toLowerCase()}.png`}
                alt={selectedItem.variation}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  objectFit: 'contain', 
                  flexShrink: 0 
                }}
              />
            )}

            {/* SHOWS ALL TAGS */}
            {parsedTags.map((tag, idx) => (
              <ModalTagBadge key={idx} tagKey={tag} />
            ))}
          </div>

          {/* DESCRIPTION TEXT */}
          {selectedItem.description && (
            <p style={{ 
              color: '#57534E', 
              margin: 0, 
              fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
              lineHeight: '1.6', 
              fontWeight: '400' 
            }}>
              {selectedItem.description}
            </p>
          )}

          {/* HIGHLIGHTS / ALLERGEN BOX */}
          {selectedItem.highlights && (
            <div style={{ 
              padding: '10px 14px', 
              borderLeft: '3.5px solid #FF5958', 
              borderRadius: '0 10px 10px 0',
              backgroundColor: 'rgba(255, 89, 88, 0.06)', 
              fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
              color: '#C53030', 
              fontStyle: 'italic', 
              fontWeight: '500',
              lineHeight: '1.45',
              boxSizing: 'border-box'
            }}>
              {selectedItem.highlights}
            </div>
          )}

          {/* NUTRITIONAL FACTS CONTAINER (Optimized Compact Grid) */}
          <div style={{ 
            padding: '12px 14px', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(197, 160, 89, 0.08)', 
            border: '1px solid rgba(197, 160, 89, 0.3)',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '8px', 
              fontSize: 'clamp(9.5px, 2.5vw, 11px)', 
              fontWeight: '700', 
              color: '#8A6D2B', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              minWidth: 0
            }}>
              <Flame size={18} color="#FF5958" style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nutritional Info. (Per Portion)</span>
            </div>
            
            {/* NUTRITIONAL GRID */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '6px', 
              textAlign: 'center',
              boxSizing: 'border-box'
            }}>
              {/* CALORIES BOX */}
              <div style={{ padding: '5px 4px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.22)', minWidth: 0 }}>
                <div style={{ fontSize: '9px', color: '#78716C', fontWeight: '700', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>CALORIES</div>
                <div style={{ marginTop: '1px', fontSize: 'var(--font-caption)', color: '#1A1816', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedItem.calories || '240'}
                </div>
              </div>

              {/* PROTEIN BOX */}
              <div style={{ padding: '5px 4px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.22)', minWidth: 0 }}>
                <div style={{ fontSize: '9px', color: '#78716C', fontWeight: '700', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>PROTEIN</div>
                <div style={{ marginTop: '1px', fontSize: 'var(--font-caption)', color: '#1A1816', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedItem.protein || '12g'}
                </div>
              </div>

              {/* CARBS BOX */}
              <div style={{ padding: '5px 4px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.22)', minWidth: 0 }}>
                <div style={{ fontSize: '9px', color: '#78716C', fontWeight: '700', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>CARBS</div>
                <div style={{ marginTop: '1px', fontSize: 'var(--font-caption)', color: '#1A1816', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedItem.carbs || '18g'}
                </div>
              </div>

              {/* FAT BOX */}
              <div style={{ padding: '5px 4px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.22)', minWidth: 0 }}>
                <div style={{ fontSize: '9px', color: '#78716C', fontWeight: '700', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>FAT</div>
                <div style={{ marginTop: '1px', fontSize: 'var(--font-caption)', color: '#1A1816', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedItem.fat || '8g'}
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL DISCLAIMER */}
          <div style={{ paddingTop: '0px' }}>
            <span style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#78716C', fontStyle: 'italic' }}>
              * Visuals are for illustration. The final product may vary.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}