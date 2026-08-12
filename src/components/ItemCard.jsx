import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* ==========================================================================
   TAG STYLES CONFIGURATION (SORTED ALPHABETICALLY A-Z)
   ========================================================================== */
const TAG_STYLES = {
  AMMIS_SPECIAL: { 
    label: "Ammi's Special", 
    bg: 'rgba(236, 72, 153, 0.1)', 
    border: '#EC4899', 
    text: '#F472B6', 
    emoji: '👵' 
  },
  BEST_SELLER: { 
    label: 'Best Seller', 
    bg: 'rgba(255, 215, 0, 0.1)', 
    border: '#FFD700', 
    text: '#FFD700', 
    emoji: '🏆' 
  },
  CHEFS_SPECIAL: { 
    label: "Chef's Special", 
    bg: 'rgba(139, 92, 246, 0.1)', 
    border: '#8B5CF6', 
    text: '#A78BFA', 
    emoji: '👨‍🍳' 
  },
  FAST_MOVING: { 
    label: 'Fast Moving', 
    bg: 'rgba(245, 158, 11, 0.1)', 
    border: '#F59E0B', 
    text: '#FBBF24', 
    emoji: '⚡' 
  },
  HIGH_PROTEIN: { 
    label: 'High Protein', 
    bg: 'rgba(59, 130, 246, 0.1)', 
    border: '#3B82F6', 
    text: '#60A5FA', 
    emoji: '💪' 
  },
  HOT: { 
    label: 'Hot', 
    bg: 'rgba(255, 89, 88, 0.1)', 
    border: '#FF5958', 
    text: '#FF7372', 
    emoji: '🔥' 
  },
  LOW_CAL: { 
    label: 'Low Cal', 
    bg: 'rgba(16, 185, 129, 0.1)', 
    border: '#10B981', 
    text: '#34D399', 
    emoji: '🥗' 
  },
  NEW: { 
    label: 'New', 
    bg: 'rgba(16, 185, 129, 0.1)', 
    border: '#10B981', 
    text: '#34D399', 
    emoji: '✨' 
  },
  PREMIUM: { 
    label: 'Gourmet', 
    bg: 'rgba(168, 85, 247, 0.1)', 
    border: '#A855F7', 
    text: '#C084FC', 
    emoji: '👑' 
  }
};

/* ==========================================================================
   STORAGE & CARE INSTRUCTIONS DATASET (SORTED ALPHABETICALLY A-Z)
   ========================================================================== */
const STORAGE_DATA = {
  beverages: {
    title: "Directions - Non-Alcoholic Wine",
    shelfLife: "12 Months (Unopened) / 5 Days (Opened)",
    steps: [
      "Store unopened bottles in a cool, dark location away from direct sunlight.",
      "Serve chilled (8°C–10°C) for the best flavor profile.",
      "Keep refrigerated once opened and consume within 5 days."
    ]
  },
  dryBakery: {
    title: "Directions - Cookies & Festive Treats",
    shelfLife: "30–40 Days",
    steps: [
      "Store in an airtight tin or glass container immediately after opening.",
      "Keep in a cool, dry pantry away from direct heat and sunlight.",
      "Always use clean, completely dry hands or tongs when handling to maintain crispness."
    ]
  },
  freshCakes: {
    title: "Directions - Fresh Cakes & Loaves",
    shelfLife: "3–5 Days (Refrigerated)",
    steps: [
      "Store in a refrigerator inside an airtight container to retain soft sponge texture.",
      "Allow slice to sit at room temperature for 15 minutes before serving for maximum flavor.",
      "Keep remaining cake wrapped or covered to prevent frosting oxidation."
    ]
  },
  jamsSpreads: {
    title: "Directions - Jams & Spreads",
    shelfLife: "3 Months (Refrigerated)",
    steps: [
      "Refrigerate immediately after unsealing.",
      "Always serve with a clean, dry spoon to prevent moisture contamination.",
      "Ensure the jar lid is sealed tightly after every use."
    ]
  },
  mealsBiryani: {
    title: "Directions - Fresh Meals & Biryanis",
    shelfLife: "Consume within 2–4 Hours",
    steps: [
      "Best enjoyed hot immediately upon delivery.",
      "If storing for later, refrigerate below 5°C within 2 hours of arrival.",
      "Reheat thoroughly in a microwave (1–2 mins) or covered pan on medium heat prior to serving."
    ]
  },
  pickles: {
    title: "Directions - Ammi's Achar",
    shelfLife: "6 Months",
    steps: [
      "Always use a fresh, completely dry spoon to avoid moisture-induced spoilage.",
      "Maintain a subtle layer of oil over the surface to lock in freshness.",
      "If oil level depletes, heat 2 tbsp of refined oil, cool completely, and pour over the top.",
      "Store in a cool pantry or refrigerate after opening for extended longevity."
    ]
  },
  plumCake: {
    title: "Directions - Traditional Rich Plum Cake",
    shelfLife: "25–30 Days",
    steps: [
      "Keep tightly wrapped in cling film or in an airtight container to preserve moisture.",
      "Store in a cool, dry place. Do not refrigerate, as cold air dries out the crumb.",
      "Optionally brush lightly with wine or orange juice periodically to retain deep moisture.",
      "Warm in a microwave (20–30 sec) or preheated OTG (120°C for 3–4 mins) for optimal warmth and aroma."
    ]
  },
  sandwichesCutlets: {
    title: "Directions - Sandwiches & Cutlets",
    shelfLife: "Consume Fresh (Within 3 Hours)",
    steps: [
      "Best consumed fresh for maximum crunch and optimal flavor.",
      "For cutlets, reheat in an air fryer (180°C for 2–3 mins) or dry skillet to restore crispness.",
      "Keep sandwiches wrapped in foil in a cool area if consuming within a short window."
    ]
  }
};

/* ==========================================================================
   UTILITY & HELPER FUNCTIONS
   ========================================================================== */

/**
 * Maps menu items to their corresponding storage guidelines based on context keyword matching
 */
function getStorageGuideline(item) {
  if (!item) return STORAGE_DATA.mealsBiryani;
  
  const name = (item.name || '').toLowerCase();
  const category = (item.category || item.Category || '').toLowerCase();
  const subCategory = (item.subCategory || item.SubCategory || item['Sub Category'] || '').toLowerCase();
  const fullContext = `${name} ${category} ${subCategory}`;

  if (fullContext.includes('plum cake') || fullContext.includes('plum')) {
    return STORAGE_DATA.plumCake;
  }
  if (fullContext.includes('cake') || fullContext.includes('frosting') || fullContext.includes('banana cake') || fullContext.includes('sponge')) {
    return STORAGE_DATA.freshCakes;
  }
  if (fullContext.includes('cookie') || fullContext.includes('kulkul') || fullContext.includes('shortbread') || fullContext.includes('assorted box') || fullContext.includes('oat meal')) {
    return STORAGE_DATA.dryBakery;
  }
  if (fullContext.includes('achar') || fullContext.includes('pickle') || fullContext.includes('thokku')) {
    return STORAGE_DATA.pickles;
  }
  if (fullContext.includes('jam') || fullContext.includes('chutney') || fullContext.includes('spread')) {
    return STORAGE_DATA.jamsSpreads;
  }
  if (fullContext.includes('sandwich') || fullContext.includes('cutlet')) {
    return STORAGE_DATA.sandwichesCutlets;
  }
  if (fullContext.includes('wine') || fullContext.includes('grape')) {
    return STORAGE_DATA.beverages;
  }
  if (fullContext.includes('meal') || fullContext.includes('biryani') || fullContext.includes('catering')) {
    return STORAGE_DATA.mealsBiryani;
  }

  return STORAGE_DATA.mealsBiryani; // Fallback default
}

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

function shouldShowRating(item) {
  if (!item) return false;
  const rating = item.rating ?? item.Rating;
  return Number(rating) === 5;
}

/* ==========================================================================
   INLINE TAG BADGE COMPONENT
   ========================================================================== */
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
      
      /* --- CUSTOMIZATION: Tag Badge Inner Gap & Padding --- */
      gap: '3px',
      padding: '1px 6px',                     // Adjust top/bottom and left/right padding
      borderRadius: '8px',                    // Badge corner rounding
      
      backgroundColor: config.bg,
      border: `1px solid ${subtleBorder}`,
      color: config.text,
      
      /* --- CUSTOMIZATION: Tag Typography --- */
      fontSize: '9.5px',                      // Font size for tags
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

/* ==========================================================================
   MAIN ITEM CARD COMPONENT
   ========================================================================== */
export default function ItemCard({ item, openModal, addToCart, resolveImagePath, layout }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hasVariants = item?.variants && item.variants.length > 0;
  const displayPrice = hasVariants ? item.variants[0].price : (parseFloat(item?.price) || 0);
  const displayUnit = item?.unit || (hasVariants ? item.variants[0].label : "");

  const guideline = getStorageGuideline(item);

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
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsAddedRecently(false), 1000);
    }
  };

  const isGridView = layout === 'grid';
  const showGoogleRating = shouldShowRating(item);
  const variationString = item?.variation ? String(item.variation).trim().toLowerCase() : '';

  return (
    <>
      {/* CARD CONTAINER */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          /* --- CUSTOMIZATION: Card Internal Padding & Layout Gap --- */
          padding: isGridView ? '10px' : '10px 12px', 
          borderRadius: '16px',               // Corner rounding
          display: 'flex', 
          flexDirection: isGridView ? 'column' : 'row', 
          gap: isGridView ? '10px' : '12px',    // Space between image & details
          overflow: 'hidden',
          
          /* --- CUSTOMIZATION: Dark Glassmorphic Card Background & Borders --- */
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(38, 33, 29, 0.96) 0%, rgba(22, 19, 16, 0.98) 100%)' 
            : 'linear-gradient(135deg, rgba(30, 26, 23, 0.92) 0%, rgba(18, 15, 13, 0.96) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered 
            ? '1px solid rgba(255, 89, 88, 0.4)' // Border color on hover
            : '1px solid rgba(255, 255, 255, 0.08)', // Normal state border
          
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
        {/* 1. THUMBNAIL IMAGE CONTAINER */}
        <div 
          role="button"
          tabIndex={0}
          aria-label={`View image for ${item?.name || 'item'}`}
          onClick={(e) => {
            e.stopPropagation();
            openModal('ZOOM', item);
          }} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              openModal('ZOOM', item);
            }
          }}
          onMouseEnter={() => setIsImgHovered(true)}
          onMouseLeave={() => setIsImgHovered(false)}
          style={{ 
            position: 'relative', 
            cursor: 'pointer', 
            flexShrink: 0, 
            borderRadius: '12px',             // Corner rounding for item image
            overflow: 'hidden',
            
            /* --- CUSTOMIZATION: Thumbnail Dimensions (Grid vs List View) --- */
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

          {/* Veg / Non-Veg Glass Overlay Badge (Top Left) */}
          {variationString && (
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
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
              zIndex: 1
            }}>
              <img 
                src={`/menu-items/${variationString === 'non-veg' ? 'non-veg' : variationString}.png`} 
                alt={item.variation} 
                style={{ width: '12px', height: '12px', display: 'block' }} 
              />
            </div>
          )}

          {/* Storage & Care Info (i) Icon Badge (Top Right) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowStorageModal(true);
            }}
            aria-label="Storage & Care Guidelines"
            title="Storage & Care Guidelines"
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              
              /* --- CUSTOMIZATION: (i) Icon Circle Styling --- */
              backgroundColor: 'rgba(18, 15, 13, 0.85)',
              border: '1px solid rgba(255, 215, 0, 0.5)', // Gold border
              color: '#FFD700',                          // Gold icon color
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
              padding: 0,
              zIndex: 2,
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            i
          </button>

          {/* Google 5-Star Rating Glass Badge (Bottom Left) */}
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
              <svg width="10" height="10" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
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

        {/* 2. CONTENT COLUMN */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justify: 'space-between', 
          alignItems: 'flex-start',
          minWidth: 0,
          width: '100%',
          minHeight: isGridView ? 'auto' : '90px',
          height: 'auto'
        }}>
          {/* Item Name & Details */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            textAlign: 'left', 
            gap: '4px',
            width: '100%' 
          }}>
            <div style={{ 
              /* --- CUSTOMIZATION: Item Title Typography --- */
              fontWeight: '700', 
              fontSize: '15px',                // Title font size
              color: '#FFFFFF',                // Title color
              lineHeight: '1.2',
              letterSpacing: '0.1px',
              textAlign: 'left',
              width: '100%'
            }}>
              {item.name}
            </div>

            {/* Unit / Portion & Customisable Label */}
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
                  <span style={{ 
                    /* --- CUSTOMIZATION: Portion Unit Text Color --- */
                    color: '#FF6B6B', 
                    fontStyle: 'italic', 
                    fontWeight: '400' 
                  }}>
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

            {/* Primary Tag Badge */}
            {primaryTag && (
              <div style={{ marginTop: '2px', display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <InlineTagBadge tagKey={primaryTag} />
              </div>
            )}
          </div>
          
          {/* Price & Add Button Row */}
          <div style={{ 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center', 
            width: '100%',
            marginTop: isGridView ? '8px' : '4px'
          }}>
            <div>
              {hasVariants && !isGridView && (
                <span style={{ fontSize: '9.5px', color: '#A1A1AA', fontWeight: '500' }}>
                  Customisable
                </span>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginLeft: 'auto' 
            }}>
              {/* Price Label */}
              <div style={{ 
                /* --- CUSTOMIZATION: Price Styling --- */
                color: '#FF5958',              // Price text color
                fontWeight: '600', 
                fontSize: '16px',              // Price font size
                letterSpacing: '-0.2px',
                lineHeight: '1',
                textShadow: '0 0 10px rgba(255, 89, 88, 0.25)'
              }}>
                ₹{displayPrice}
              </div>

              {/* Add / Added Button */}
              <button 
                onClick={handleAddClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                style={{
                  /* --- CUSTOMIZATION: Add Button Gradients --- */
                  background: isAddedRecently 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' // Green gradient when added
                    : 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', // Default Coral gradient
                  
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  
                  /* --- CUSTOMIZATION: Button Padding & Corners --- */
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

      {/* 3. STORAGE & CARE INSTRUCTIONS MODAL (REACT PORTAL) */}
      {showStorageModal && guideline && createPortal(
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowStorageModal(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            
            /* --- CUSTOMIZATION: Modal Backdrop Overlay --- */
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              /* --- CUSTOMIZATION: Modal Card Background & Border --- */
              background: 'linear-gradient(135deg, rgba(32, 27, 24, 0.98) 0%, rgba(18, 15, 13, 0.98) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '20px',
              
              /* --- CUSTOMIZATION: Modal Dimensions & Padding --- */
              padding: '22px 20px',
              maxWidth: '380px',
              width: '100%',
              
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.12)',
              color: '#FFFFFF',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            {/* Modal Header Row */}
            <div style={{ 
              display: 'flex', 
              justify: 'space-between', 
              alignItems: 'flex-start', 
              width: '100%', 
              marginBottom: '10px' 
            }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#FFD700',               // Modal title text color
                lineHeight: '1.3',
                textAlign: 'left',
                paddingRight: '10px'
              }}>
                {guideline.title}
              </h4>
              <button 
                onClick={() => setShowStorageModal(false)}
                aria-label="Close modal"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  color: '#A1A1AA',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px', 
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                ✕
              </button>
            </div>

            {/* Shelf Life Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              color: '#FF7372',
              marginBottom: '16px',
              backgroundColor: 'rgba(255, 89, 88, 0.12)',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 89, 88, 0.25)',
              textAlign: 'left',
              alignSelf: 'flex-start'
            }}>
              <span style={{ fontSize: '12px' }}>⏳</span> 
              <span><strong>Shelf Life:</strong> {guideline.shelfLife}</span>
            </div>

            {/* Instruction Steps */}
            <ol style={{ 
              paddingLeft: '20px', 
              margin: '0 0 18px 0', 
              display: 'flex', 
              flexDirection: 'column', 
              
              /* --- CUSTOMIZATION: Step List Gap --- */
              gap: '10px',
              
              fontSize: '12.5px',
              lineHeight: '1.5',
              color: '#E4E4E7',
              textAlign: 'left',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {guideline.steps.map((step, idx) => (
                <li key={idx} style={{ textAlign: 'left', paddingLeft: '2px' }}>
                  {step}
                </li>
              ))}
            </ol>

            {/* Modal Confirm Button */}
            <button
              onClick={() => setShowStorageModal(false)}
              style={{
                width: '100%',
                padding: '11px',
                background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)',
                textAlign: 'center'
              }}
            >
              Got it
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}