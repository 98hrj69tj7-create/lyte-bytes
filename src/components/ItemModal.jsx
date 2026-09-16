import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Flame } from 'lucide-react';
import StorageGuidelineModal from '../utils/storageGuidelines';

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

/* ==========================================================================
   STORAGE & CARE INSTRUCTIONS DATASET (SORTED ALPHABETICALLY A-Z)
   ========================================================================== */
const STORAGE_DATA = {
  beverages: { title: "Directions: Non-Alcoholic Wine", shelfLife: "12 Months (Unopened) / 5 Days (Opened)", steps: ["Store unopened bottles in a cool, dark location away from direct sunlight.", "Serve chilled (8°C–10°C) for the best flavor profile.", "Keep refrigerated once opened and consume within 5 days."] },
  dryBakery: { title: "Directions: Cookies & Festive Treats", shelfLife: "30–40 Days", steps: ["Store in an airtight tin or glass container immediately after opening.", "Keep in a cool, dry pantry away from direct heat and sunlight.", "Always use clean, completely dry hands or tongs when handling to maintain crispness."] },
  freshCakes: { title: "Directions: Fresh Cakes & Loaves", shelfLife: "3–5 Days (Refrigerated)", steps: ["Store in a refrigerator inside an airtight container to retain soft sponge texture.", "Allow slice to sit at room temperature for 15 minutes before serving for maximum flavor.", "Keep remaining cake wrapped or covered to prevent frosting oxidation."] },
  jamsSpreads: { title: "Directions: Jams & Spreads", shelfLife: "3 Months (Refrigerated)", steps: ["Refrigerate immediately after unsealing.", "Always serve with a clean, dry spoon to prevent moisture contamination.", "Ensure the jar lid is sealed tightly after every use."] },
  mealsBiryani: { title: "Directions: Fresh Meals & Biryanis", shelfLife: "Consume within 2–4 Hours", steps: ["Best enjoyed hot immediately upon delivery.", "If storing for later, refrigerate below 5°C within 2 hours of arrival.", "Reheat thoroughly in a microwave (1–2 mins) or covered pan on medium heat prior to serving."] },
  pickles: { title: "Directions: Ammi's Achar", shelfLife: "6 Months", steps: ["Always use a fresh, completely dry spoon to avoid moisture-induced spoilage.", "Maintain a subtle layer of oil over the surface to lock in freshness.", "If oil level depletes, heat 2 tbsp of refined oil, cool completely, and pour over the top.", "Store in a cool pantry or refrigerate after opening for extended longevity."] },
  plumCake: { title: "Directions: Traditional Rich Plum Cake", shelfLife: "25–30 Days", steps: ["Keep tightly wrapped in cling film or in an airtight container to preserve moisture.", "Store in a cool, dry place. Do not refrigerate, as cold air dries out the crumb.", "Optionally brush lightly with wine or orange juice periodically to retain deep moisture.", "Warm in a microwave (20–30 sec) or preheated OTG (120°C for 3–4 mins) for optimal warmth and aroma."] },
  sandwichesCutlets: { title: "Directions: Sandwiches & Cutlets", shelfLife: "Consume Fresh (Within 3 Hours)", steps: ["Best consumed fresh for maximum crunch and optimal flavor.", "For cutlets, reheat in an air fryer (180°C for 2–3 mins) or dry skillet to restore crispness.", "Keep sandwiches wrapped in foil in a cool area if consuming within a short window."] }
};

function getStorageGuideline(item) {
  if (!item) return STORAGE_DATA.mealsBiryani;
  const name = (item.name || '').toLowerCase();
  const category = (item.category || item.Category || '').toLowerCase();
  const subCategory = (item.subCategory || item.SubCategory || item['Sub Category'] || '').toLowerCase();
  const fullContext = `${name} ${category} ${subCategory}`;

  if (fullContext.includes('plum cake') || fullContext.includes('plum')) return STORAGE_DATA.plumCake;
  if (fullContext.includes('cake') || fullContext.includes('frosting') || fullContext.includes('banana cake') || fullContext.includes('sponge')) return STORAGE_DATA.freshCakes;
  if (fullContext.includes('cookie') || fullContext.includes('kulkul') || fullContext.includes('shortbread') || fullContext.includes('assorted box') || fullContext.includes('oat meal')) return STORAGE_DATA.dryBakery;
  if (fullContext.includes('achar') || fullContext.includes('pickle') || fullContext.includes('thokku')) return STORAGE_DATA.pickles;
  if (fullContext.includes('jam') || fullContext.includes('chutney') || fullContext.includes('spread')) return STORAGE_DATA.jamsSpreads;
  if (fullContext.includes('sandwich') || fullContext.includes('cutlet')) return STORAGE_DATA.sandwichesCutlets;
  if (fullContext.includes('wine') || fullContext.includes('grape')) return STORAGE_DATA.beverages;
  if (fullContext.includes('meal') || fullContext.includes('biryani') || fullContext.includes('catering')) return STORAGE_DATA.mealsBiryani;

  return STORAGE_DATA.mealsBiryani;
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
  const [showStorageModal, setShowStorageModal] = useState(false);

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

  const guideline = getStorageGuideline(selectedItem);
  const variationString = selectedItem?.variation ? String(selectedItem.variation).trim().toLowerCase() : '';

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
              top: '12px', 
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
              whiteSpace: 'nowrap',
              zIndex: 2
            }}>
              {selectedItem.unit}
            </div>
          )}

          {/* VEG / NON-VEG LOGO AT BOTTOM LEFT */}
          {variationString && (
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              left: '10px', 
              backgroundColor: 'rgba(0, 0, 0, 0.75)', 
              backdropFilter: 'blur(6px)', 
              WebkitBackdropFilter: 'blur(6px)', 
              borderRadius: '6px', 
              padding: '4px 6px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)', 
              zIndex: 2 
            }}>
              <img 
                src={`/menu-items/${variationString === 'non-veg' ? 'non-veg' : variationString}.png`} 
                alt={selectedItem.variation} 
                style={{ width: '14px', height: '14px', display: 'block' }} 
              />
            </div>
          )}

          {/* STORAGE GUIDELINES (I) BUTTON AT BOTTOM RIGHT */}
          <button 
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              setShowStorageModal(true); 
            }} 
            aria-label="Storage & Care Guidelines" 
            style={{ 
              position: 'absolute', 
              bottom: '10px', 
              right: '10px', 
              backgroundColor: 'rgba(18, 15, 13, 0.85)', 
              border: '1px solid rgba(197, 160, 89, 0.6)', 
              color: '#FFD700', 
              borderRadius: '50%', 
              width: '26px', 
              height: '26px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '13px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)', 
              padding: 0, 
              zIndex: 2, 
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              flexShrink: 0
            }}
          >
            i
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
          
          {/* TITLE AND ALL INLINE TAGS */}
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

      {/* Storage Guideline Modal Component */}
      <StorageGuidelineModal 
        isOpen={showStorageModal} 
        onClose={() => setShowStorageModal(false)} 
        guideline={guideline} 
      />
    </div>
  );

  return createPortal(modalContent, document.body);
}