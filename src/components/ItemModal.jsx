import React from 'react';
import { createPortal } from 'react-dom';
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
      fontSize: 'var(--font-caption)',
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

  const modalContent = (
    <div 
      onClick={handleClose}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '20px', 
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <style>{`
        @keyframes slideUpSheet {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          borderTopLeftRadius: 'clamp(20px, 5vw, 28px)',
          borderTopRightRadius: 'clamp(20px, 5vw, 28px)',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          padding: 'clamp(16px, 4vw, 22px)',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '82vh',
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          border: '1px solid rgba(197, 160, 89, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUpSheet 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default'
        }}
      >
        {/* MAIN ITEM IMAGE HEADER */}
        <div style={{ 
          width: '100%', 
          height: 'clamp(180px, 40vw, 220px)', 
          backgroundColor: '#1a1a1a', 
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          flexShrink: 0,
          marginBottom: '12px'
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
              left: '12px', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              backgroundColor: 'rgba(30, 24, 20, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              color: '#FFD700',
              fontSize: 'var(--font-caption)',
              fontWeight: '600',
              letterSpacing: '0.3px',
              fontFamily: "sans-serif",
              whiteSpace: 'nowrap'
            }}>
              {selectedItem.unit}
            </div>
          )}

          {/* CLOSE BUTTON OVERLAY ON TOP RIGHT OF IMAGE */}
          <button 
            type="button"
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(30, 24, 20, 0.75)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFF',
              zIndex: 10,
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: 'var(--font-body)',
          color: '#57534E',
          lineHeight: '1.5',
          paddingRight: '4px',
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
              fontSize: 'clamp(18px, 4.5vw, 22px)',
              color: '#1A1816', 
              fontWeight: '700', 
              letterSpacing: '0.2px', 
              lineHeight: '1.2',
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
              fontSize: 'var(--font-body)',
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
              fontSize: 'var(--font-caption)',
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
              <Flame size={16} color="#FF5958" style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nutritional Info. (Per Portion)</span>
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
          <div style={{ paddingTop: '2px', paddingBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#78716C', fontStyle: 'italic' }}>
              * Visuals are for illustration. The final product may vary.
            </span>
          </div>

        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}