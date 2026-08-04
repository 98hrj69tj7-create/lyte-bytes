import React, { useState } from 'react';

// Color & Style Mapping for Tags
const TAG_STYLES = {
  BEST_SELLER: { label: 'Best Seller', bg: 'rgba(255, 215, 0, 0.1)', border: '#FFD700', text: '#FFD700', emoji: '🏆' },
  HOT: { label: 'Hot', bg: 'rgba(255, 89, 88, 0.1)', border: '#FF5958', text: '#FF7372', emoji: '🔥' },
  NEW: { label: 'New', bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', text: '#34D399', emoji: '✨' },
  FAST_MOVING: { label: 'Fast Moving', bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', text: '#FBBF24', emoji: '⚡' },
  HIGH_PROTEIN: { label: 'High Protein', bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', text: '#60A5FA', emoji: '💪' },
  LOW_CAL: { label: 'Low Cal', bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', text: '#34D399', emoji: '🥗' },
  CHEFS_SPECIAL: { label: "Chef's Special", bg: 'rgba(139, 92, 246, 0.1)', border: '#8B5CF6', text: '#A78BFA', emoji: '👨‍🍳' },
  AMMIS_SPECIAL: { label: "Ammi's Special", bg: 'rgba(236, 72, 153, 0.1)', border: '#EC4899', text: '#F472B6', emoji: '👵' },
  PREMIUM: { label: 'Gourmet', bg: 'rgba(168, 85, 247, 0.1)', border: '#A855F7', text: '#C084FC', emoji: '👑' }
};

function normalizeTagKey(tag) {
  if (!tag) return '';
  return String(tag)
    .trim()
    .toUpperCase()
    .replace(/'/g, '')
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Dynamically checks if the item has a 5-star rating from Orders_Engine sheet data
 */
function shouldShowRating(item) {
  if (!item) return false;
  const rating = item.rating ?? item.Rating;
  return Number(rating) === 5;
}

/**
 * De-cluttered & Compact Glassmorphic Tag Pill Badge
 */
function InlineTagBadge({ tagKey }) {
  const normalizedKey = normalizeTagKey(tagKey);
  if (!normalizedKey) return null;

  const config = TAG_STYLES[normalizedKey] || {
    label: String(tagKey).replace(/[,_]/g, ' ').trim(),
    bg: 'rgba(255, 89, 88, 0.1)',
    border: '#FF5958',
    text: '#FF7372',
    emoji: '✦'
  };

  const subtleBorder = config.border.startsWith('#') && config.border.length === 7 
    ? `${config.border}66` 
    : config.border;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      padding: '1px 6px',
      borderRadius: '8px',
      backgroundColor: config.bg,
      border: `1px solid ${subtleBorder}`,
      color: config.text,
      fontSize: '9.5px',
      fontWeight: '500',
      lineHeight: '1.2',
      letterSpacing: '0.1px',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      width: 'fit-content'
    }}>
      <span style={{ fontSize: '9px', lineHeight: '1' }}>{config.emoji}</span>
      {config.label}
    </span>
  );
}

export default function ItemCard({ item, openModal, addToCart, resolveImagePath, layout, theme }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const hasVariants = item?.variants && item.variants.length > 0;
  const displayPrice = hasVariants ? item.variants[0].price : (parseFloat(item?.price) || 0);
  const displayUnit = item?.unit || (hasVariants ? item.variants[0].label : "");

  const rawTags = item?.tags || item?.Tags || item?.TAGS || item?.tag || item?.Tag || '';
  const parsedTags = (
    Array.isArray(rawTags) 
      ? rawTags 
      : typeof rawTags === 'string' 
        ? rawTags.split(',') 
        : []
  )
    .map(t => normalizeTagKey(t))
    .filter(Boolean);

  const primaryTag = parsedTags[0];

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (hasVariants) {
      openModal('VARIANTS', item);
    } else {
      addToCart(item);
      setIsAddedRecently(true);
      setTimeout(() => setIsAddedRecently(false), 1000);
    }
  };

  const isGridView = layout === 'grid';
  const showGoogleRating = shouldShowRating(item);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: isGridView ? '10px' : '10px 12px', 
        borderRadius: '16px', 
        display: 'flex', 
        flexDirection: isGridView ? 'column' : 'row', 
        gap: isGridView ? '10px' : '12px', 
        overflow: 'hidden',
        
        /* Glassmorphic Dark Card Base */
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(38, 33, 29, 0.96) 0%, rgba(22, 19, 16, 0.98) 100%)' 
          : 'linear-gradient(135deg, rgba(30, 26, 23, 0.92) 0%, rgba(18, 15, 13, 0.96) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isHovered 
          ? '1px solid rgba(255, 89, 88, 0.4)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        
        boxShadow: isHovered 
          ? '0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 0 16px rgba(255, 89, 88, 0.12)' 
          : '0 4px 14px rgba(0, 0, 0, 0.3)',
        
        alignItems: isGridView ? 'stretch' : 'center',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* 1. Thumbnail Image Container */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          openModal('ZOOM', item);
        }} 
        onMouseEnter={() => setIsImgHovered(true)}
        onMouseLeave={() => setIsImgHovered(false)}
        style={{ 
          position: 'relative', 
          cursor: 'pointer', 
          flexShrink: 0, 
          borderRadius: '12px', 
          overflow: 'hidden',
          width: isGridView ? '100%' : '90px',
          height: isGridView ? '125px' : '90px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
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
            transition: 'transform 0.35s ease'
          }} 
        />

        {/* Veg / Non-Veg Glass Overlay Badge (Top Left: 5px) */}
        {item.variation && (
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '5px',
            padding: '2px 3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)'
          }}>
            <img 
              src={`/menu-items/${item.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : item.variation.trim().toLowerCase()}.png`} 
              alt={item.variation} 
              style={{ width: '12px', height: '12px', display: 'block' }} 
            />
          </div>
        )}

        {/* Google 5-Star Glass Badge (Only rendered if rating === 5) */}
        {showGoogleRating && (
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            backgroundColor: 'rgba(18, 15, 13, 0.85)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '10px',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Google Logo SVG */}
            <svg width="10" height="10" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>

            {/* 5 Stars */}
            <span style={{ 
              color: '#FFD700', 
              fontSize: '8.5px', 
              letterSpacing: '0.5px', 
              lineHeight: '1',
              display: 'inline-block'
            }}>
              ★★★★★
            </span>
          </div>
        )}
      </div>

      {/* 2. Content Column */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justify: 'space-between', 
        alignItems: 'flex-start',
        minWidth: 0,
        width: '100%',
        height: isGridView ? 'auto' : '90px'
      }}>
        
        {/* Top Info Group (Name -> Portion + Customisable -> Primary Tag) */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          textAlign: 'left', 
          gap: '4px',
          width: '100%' 
        }}>
          {/* Row 1: Item Name */}
          <div style={{ 
            fontWeight: '700', 
            fontSize: '15px', 
            color: '#FFFFFF', 
            lineHeight: '1.2',
            letterSpacing: '0.1px',
            textAlign: 'left',
            width: '100%'
          }}>
            {item.name}
          </div>

          {/* Row 2: Portion & Customisable Tag (Grid View) */}
          {(displayUnit || (isGridView && hasVariants)) && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px', 
              lineHeight: '1.15',
              letterSpacing: '0.1px',
              textAlign: 'left',
              width: '100%',
              flexWrap: 'wrap'
            }}>
              {displayUnit && (
                <span style={{ color: '#FF6B6B', fontStyle: 'italic', fontWeight: '400' }}>
                  {displayUnit}
                </span>
              )}
              {isGridView && hasVariants && (
                <span style={{ 
                  fontSize: '9.5px', 
                  color: '#A1A1AA', 
                  fontWeight: '500',
                  fontStyle: 'normal'
                }}>
                  {displayUnit ? '• Customisable' : 'Customisable'}
                </span>
              )}
            </div>
          )}

          {/* Row 3: Compact Primary Tag */}
          {primaryTag && (
            <div style={{ marginTop: '2px', display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <InlineTagBadge tagKey={primaryTag} />
            </div>
          )}
        </div>
        
        {/* Bottom Action Row */}
        <div style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          marginTop: isGridView ? '8px' : '0'
        }}>
          <div>
            {/* Customisable label only shown here in List View */}
            {hasVariants && !isGridView && (
              <span style={{ fontSize: '9.5px', color: '#A1A1AA', fontWeight: '500' }}>
                Customisable
              </span>
            )}
          </div>

          {/* Price & Add Button */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginLeft: 'auto' 
          }}>
            <div style={{ 
              color: '#FF5958', 
              fontWeight: '600', 
              fontSize: '16px',
              letterSpacing: '-0.2px',
              lineHeight: '1',
              textShadow: '0 0 10px rgba(255, 89, 88, 0.25)'
            }}>
              ₹{displayPrice}
            </div>

            <button 
              onClick={handleAddClick}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              style={{
                background: isAddedRecently 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px 16px', 
                borderRadius: '16px',
                fontWeight: '600',
                fontSize: '12px',
                letterSpacing: '0.2px',
                cursor: 'pointer',
                boxShadow: isAddedRecently 
                  ? '0 3px 10px rgba(16, 185, 129, 0.35)' 
                  : '0 3px 12px rgba(255, 89, 88, 0.3)',
                transform: isPressed ? 'scale(0.94)' : (isAddedRecently ? 'scale(1.03)' : 'scale(1)'),
                transition: 'transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease',
                lineHeight: '1.2'
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