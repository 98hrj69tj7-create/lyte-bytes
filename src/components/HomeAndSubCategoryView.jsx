import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  List as ListIcon, Grid, ArrowLeft, ChevronRight, ChevronDown, BookOpen,
  Heart, Sparkles, ShieldCheck, ChefHat, Home, Gift, Award, 
  Badge,
  BadgeCheck,
  Clock,
  CircleCheck,
  Recycle,
  HandHeart,
  Users,
  X
} from 'lucide-react';
import ItemCard from './ItemCard';
import BulkOrdersModal from './BulkOrdersModal';

/* ==========================================================================
   CONFIG & UTILITY HELPERS
   ========================================================================== */

/**
 * Safely extracts an image path from an object regardless of property naming convention
 */
function getImgUrl(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return obj.imageUrl || obj.image || obj.img || obj.banner || obj.categoryImage || obj.photo || null;
}

/**
 * Case-insensitive category lookup helper
 */
function findCategoryData(menuData, catKey) {
  if (!menuData || !catKey) return null;
  if (menuData[catKey]) return menuData[catKey];
  
  const normalizedKey = String(catKey).trim().toLowerCase();
  const foundKey = Object.keys(menuData).find(
    k => String(k).trim().toLowerCase() === normalizedKey
  );
  
  return foundKey ? menuData[foundKey] : null;
}

/**
 * Generates a clean, Base64-encoded SVG fallback data URL.
 */
function getFallbackSvgImage(title = "Lyte Bytes") {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a2421" />
          <stop offset="100%" stop-color="#14120f" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#C5A059" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#C5A059" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#bg)" />
      <circle cx="300" cy="200" r="180" fill="url(#glow)" />
      <g transform="translate(300, 160) scale(1.8)" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v7a3 3 0 0 0 3 3h4v5h4v-5h4a3 3 0 0 0 3-3v-7h-3V7a5 5 0 0 0-5-5z"></path>
      </g>
      <text x="300" y="245" font-family="'Cormorant Garamond', serif" font-size="26" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${title}</text>
      <text x="300" y="270" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#C5A059" text-anchor="middle" letter-spacing="3">CRAFTED DELICACY</text>
    </svg>
  `;

  const base64 = typeof window !== 'undefined' && window.btoa 
    ? window.btoa(unescape(encodeURIComponent(svgString))) 
    : '';

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Resolves the image path for a subcategory using hierarchical fallback
 */
function resolveSubcategoryImage(subName, activeCat, menuData, resolveImagePath) {
  const catObj = findCategoryData(menuData, activeCat);
  if (!catObj) return getFallbackSvgImage(subName);

  let subItemImg = null;

  if (Array.isArray(catObj.subcategories)) {
    const subObj = catObj.subcategories.find(
      s => (s.name || s.title || s.id || '').trim().toLowerCase() === String(subName).trim().toLowerCase()
    );
    if (subObj) {
      subItemImg = getImgUrl(subObj);
      if (!subItemImg && Array.isArray(subObj.items)) {
        const itemWithImg = subObj.items.find(item => getImgUrl(item));
        subItemImg = getImgUrl(itemWithImg);
      }
    }
  } else if (catObj.subcategories && typeof catObj.subcategories === 'object') {
    const matchedKey = Object.keys(catObj.subcategories).find(
      k => k.trim().toLowerCase() === String(subName).trim().toLowerCase()
    );
    if (matchedKey) {
      const val = catObj.subcategories[matchedKey];
      if (Array.isArray(val)) {
        const itemWithImg = val.find(item => getImgUrl(item));
        subItemImg = getImgUrl(itemWithImg);
      } else if (typeof val === 'object') {
        subItemImg = getImgUrl(val);
      }
    }
  }

  const catImg = getImgUrl(catObj);

  const resolvedSubItemImg = subItemImg ? resolveImagePath(subItemImg) : null;
  const resolvedCatImg = catImg ? resolveImagePath(catImg) : null;

  return resolvedSubItemImg || resolvedCatImg || getFallbackSvgImage(subName);
}

/* ==========================================================================
   CATEGORY CARD COMPONENT
   ========================================================================== */
function CategoryCard({ cat, resolveImagePath, theme, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const rawPath = getImgUrl(cat);
  const initialImg = rawPath ? resolveImagePath(rawPath) : getFallbackSvgImage(cat.name);
  const [imgSrc, setImgSrc] = useState(initialImg);

  useEffect(() => {
    const freshRaw = getImgUrl(cat);
    setImgSrc(freshRaw ? resolveImagePath(freshRaw) : getFallbackSvgImage(cat.name));
  }, [cat]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        position: 'relative',
        height: 'clamp(76px, 18vw, 84px)',
        borderRadius: 'clamp(14px, 4vw, 16px)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 12px 28px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '0.5px solid rgba(197, 160, 89, 0.4)',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1A1714',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <img 
        src={imgSrc}
        alt={cat.name}
        onError={() => setImgSrc(getFallbackSvgImage(cat.name))}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
          opacity: 0.85
        }}
      />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, rgba(20,18,15,0.92) 0%, rgba(20,18,15,0.7) 55%, rgba(20,18,15,0.35) 100%)',
        zIndex: 2
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 3, 
        padding: '0 clamp(12px, 4vw, 18px)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        boxSizing: 'border-box',
        gap: '12px',
        minWidth: 0
      }}>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(20px, 5vw, 25px)',
            fontWeight: '700',
            color: '#FFFFFF',
            margin: 0, 
            letterSpacing: '0.2px', 
            textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
            lineHeight: '1.1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {cat.name}
          </h3>
        </div>
        
        <div style={{
          width: '30px', 
          height: '30px', 
          borderRadius: '50%',
          backgroundColor: '#C5A059',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(197, 160, 89, 0.4)',
          transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          flexShrink: 0
        }}>
          <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUBCATEGORY CARD COMPONENT
   ========================================================================== */
function SubCategoryCard({ sub, resolveImagePath, activeCat, menuData, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const initialImg = resolveSubcategoryImage(sub, activeCat, menuData, resolveImagePath);
  const [imgSrc, setImgSrc] = useState(initialImg);

  useEffect(() => {
    setImgSrc(resolveSubcategoryImage(sub, activeCat, menuData, resolveImagePath));
  }, [sub, activeCat, menuData]);

  const fallbackSvg = getFallbackSvgImage(sub);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        position: 'relative',
        height: 'clamp(76px, 18vw, 84px)',
        borderRadius: 'clamp(14px, 4vw, 16px)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 12px 28px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '0.5px solid rgba(197, 160, 89, 0.4)',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1A1714',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <img 
        src={imgSrc}
        alt={sub}
        onError={() => {
          const catObj = findCategoryData(menuData, activeCat);
          const catImg = getImgUrl(catObj);
          const resolvedCatImg = catImg ? resolveImagePath(catImg) : null;

          if (imgSrc !== resolvedCatImg && resolvedCatImg) {
            setImgSrc(resolvedCatImg);
          } else if (imgSrc !== fallbackSvg) {
            setImgSrc(fallbackSvg);
          }
        }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
          opacity: 0.85
        }}
      />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, rgba(20,18,15,0.92) 0%, rgba(20,18,15,0.7) 55%, rgba(20,18,15,0.35) 100%)',
        zIndex: 2
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 3, 
        padding: '0 clamp(12px, 4vw, 18px)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        boxSizing: 'border-box',
        gap: '12px',
        minWidth: 0
      }}>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(18px, 4.5vw, 22px)',
            fontWeight: '700',
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '0.2px',
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            lineHeight: '1.1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {sub}
          </h3>
        </div>
        <div style={{
          width: '30px', 
          height: '30px', 
          borderRadius: '50%',
          backgroundColor: '#C5A059',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(197, 160, 89, 0.4)',
          transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          flexShrink: 0
        }}>
          <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN VIEW COMPONENT
   ========================================================================== */
export default function HomeAndSubCategoryView({ 
  view, 
  theme, 
  searchQuery, 
  setSearchQuery, 
  layout, 
  setLayout, 
  menuData, 
  activeCat, 
  setActiveCat, 
  setActiveSub, 
  setView, 
  openModal, 
  addToCart, 
  resolveImagePath,
  onStoryToggle
}) {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Theme configuration matching uniform modal guidelines
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
  };

  // Close modal on Escape key press and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsStoryModalOpen(false);
    };
    if (isStoryModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isStoryModalOpen]);

  useEffect(() => {
    if (typeof onStoryToggle === 'function') {
      onStoryToggle(isStoryModalOpen);
    }
  }, [isStoryModalOpen, onStoryToggle]);

  const currentCategoryData = findCategoryData(menuData, activeCat);
  const isCateringCategory = activeCat && activeCat.toLowerCase().includes('catering');

  /* ------------------------------------------------------------------------
     ALPHABETICAL SORTING (A to Z) LOGIC FOR CATEGORIES AND SUBCATEGORIES
     ------------------------------------------------------------------------ */
  
  const sortedCategoryKeys = Object.keys(menuData || {}).sort((a, b) => 
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  let subCategoryKeys = [];
  if (currentCategoryData && currentCategoryData.subcategories) {
    if (Array.isArray(currentCategoryData.subcategories)) {
      subCategoryKeys = currentCategoryData.subcategories.map(s => typeof s === 'string' ? s : (s.name || s.title || s.id));
    } else if (typeof currentCategoryData.subcategories === 'object') {
      subCategoryKeys = Object.keys(currentCategoryData.subcategories);
    }
  }
  
  subCategoryKeys.sort((a, b) => 
    String(a).localeCompare(String(b), undefined, { sensitivity: 'base' })
  );

  // Story Modal Portal Content matching PolicyModal structure
  const storyModalContent = isStoryModalOpen && (
    <div 
      onClick={() => setIsStoryModalOpen(false)}
      style={{
        position: 'fixed', 
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '20px', 
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderRadius: 'clamp(20px, 5vw, 28px)',
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
          overflow: 'hidden'
        }}
      >
        {/* Header with Title & Polished Close Button */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '16px',
          marginBottom: '2px',
          flexShrink: 0,
          gap: '8px',
          minWidth: 0
        }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: 'clamp(18px, 4.5vw, 22px)', 
            fontWeight: '700', 
            color: activeTheme.brand, 
            margin: 5,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0
          }}>
            Our Origins & Promise
          </h3>
          <button
            onClick={() => setIsStoryModalOpen(false)}
            style={{
              background: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1A1816',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Content Body with Dashed Cards */}
        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#57534E',
          lineHeight: '1.5',
          paddingRight: '6px',
          minWidth: 0
        }}>
          {/* Card 1: Our Origins */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderRadius: '16px',
            padding: '1px 8px',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8A6D2B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              ✦ Our Origins
            </span>
            <p style={{ margin: 0, color: '#44403C', lineHeight: '1.65' }}>
              I grew up in a home where food wasn’t just cooked, it was cherished. My connection to cooking began at a very long age, simply by being present in the kitchen and watching my family members prepare meals, savouries and desserts with quiet patience and care. Standing beside them, observing every movement with fascination and helping wherever I could were the first sparks of a passion I didn’t yet fully understand.
            </p>
          </div>

          {/* Card 2: Journey */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderRadius: '16px',
            padding: '2px 8px',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)',
            boxSizing: 'border-box'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#44403C', lineHeight: '1.65' }}>
              Over time, that curiosity turned into a calling. Pursuing hotel management allowed me to master the professional science behind flavour, texture, aroma, and presentation while holding onto the soul of home cooking. Through constant experimentation and learning from mistakes, I began recreating dishes with my own twists. I realised cooking wasn’t merely a skill, it was a sacred way to bring joy to people. Watching someone truly enjoy a meal that I cooked made me feel deeply fulfilled.
            </p>
            <p style={{ margin: 0, color: '#44403C', lineHeight: '1.65' }}>
              That feeling pushed me further. I began baking orders of traditional Christmas cakes, taking orders from family and friends and also explored hand-brewing non‑alcoholic wines inspired by an old heirloom book filled with handwritten notes.
            </p>
          </div>

          {/* Card 3: Quote Highlight */}
          <div style={{
            backgroundColor: 'rgba(197, 160, 89, 0.08)',
            borderRadius: '16px',
            padding: '4px 8px',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            boxSizing: 'border-box'
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px',
              fontStyle: 'italic',
              lineHeight: '1.45',
              color: '#2C221E',
              margin: 0
            }}>
              "Eventually, conversations with friends turned into a dream of creating an honest, home-grown brand. That is how <strong style={{ fontStyle: 'normal', color: '#8B0000' }}>LYTE BYTES</strong> was born." <span style={{ display: 'block', marginTop: '4px' }}>(<strong style={{ fontStyle: 'normal', color: '#8B0000' }}>'Bytes'</strong> inspired by the tech pulse of Bengaluru, and <strong style={{ fontStyle: 'normal', color: '#8B0000' }}>'Bites'</strong> representing the heartfelt food we loved to make.)</span>
            </p>
          </div>

          {/* Card 4: Evolution & Culmination */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderRadius: '16px',
            padding: '2px 8px',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)',
            boxSizing: 'border-box'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#44403C', lineHeight: '1.65' }}>
              We participated in a few food exhibitions, set up food stalls and shared our creations with other vendors. Every experience taught us something new, and demand grew organically. Each returning customer and genuine smile reinforced why I started. From there, we expanded into handcrafted cookies, celebration cakes, small-event catering and preservative-free jams made entirely from scratch.
            </p>
            <p style={{ margin: 0, color: '#44403C', lineHeight: '1.65' }}>
              This journey naturally culminated in <strong style={{ color: '#1A1816' }}>Ammi’s Achar</strong>. Disappointed by commercial options laden with additives, I set out to craft rare, authentic meat-based and vegetarian pickles. <br></br>Our philosophy remains uncompromising: premium ingredients, zero preservatives, and small-batch production where every single jar is prepared strictly to order and never stored or mass-produced.
            </p>
          </div>

          {/* Grid Features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { icon: Clock, label: 'Made strictly to order' },
              { icon: ShieldCheck, label: 'Zero Preservatives' },
              { icon: Recycle, label: 'Zero Wastage' },
              { icon: HandHeart, label: '100% Handcrafted' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
                border: '1px dashed #C5A059',
                borderRadius: '12px',
                padding: '8px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <item.icon size={14} color="#8A6D2B" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#292524', letterSpacing: '0.2px' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Card 5: Our Promise */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderRadius: '16px',
            padding: '2px 8px',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8A6D2B', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              ✦ Our Promise
            </span>
            <p style={{ margin: '0 0 10px 0', color: '#3C3633', lineHeight: '1.6' }}>
              At Lyte Bytes, every dish is made with intention. We prepare food only when an order comes in, so what you receive is always fresh, never stored, and never rushed. This approach has guided us from the very beginning and remains at the heart of everything we do.
            </p>
            <p style={{ margin: '0 0 12px 0', color: '#3C3633', lineHeight: '1.6' }}>
              We choose premium ingredients, follow traditional methods, and craft in small batches to preserve authenticity and flavour. Whether it is a catered meal, a celebration cake, or a jar of Ammi’s Achar, we give each creation the same care and attention that shaped our journey.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '500', lineHeight: '1.4', color: '#1A1816', margin: '0 0 8px 0', fontStyle: 'italic' }}>
              "Food that is honest, handcrafted and freshly prepared for your indulgence."
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#524B47', lineHeight: '1.5', fontWeight: '500' }}>
              A pure, home‑grown goodness prepared with the same warmth that inspired us all those years ago.
            </p>
            <p style={{ color: '#FF5958', margin: 0, lineHeight: '1.5', fontWeight: '600' }}>
              Every order is a commitment to quality, to legacy and to the joy we hope you feel in every bite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes prismSweep {
          0% { left: -150%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }
        .support-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(44, 34, 30, 0.08) !important;
          border-color: rgba(197, 160, 89, 0.6) !important;
        }
      `}</style>
      
      {/* ====================================================================
         HOME VIEW
         ==================================================================== */}
      {view === 'home' && (
        <div style={{ 
          paddingBottom: '100px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          position: 'relative'
        }}>
          
          {/* --- RENDER STORY MODAL VIA PORTAL --- */}
          {ReactDOM.createPortal(storyModalContent || <></>, document.body)}

          {/* --- TOP SCROLLING BRAND SLOGAN BAR --- */}
          <div style={{ 
            margin: '2px 0 8px 0', 
            overflow: 'hidden', 
            width: '100%',
            maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)'
          }}>
            <div className="marquee-wrapper">
              <div className="marquee-track">
                {[...Array(2)].map((_, i) => (
                  <span key={i} style={{ 
                    fontSize: 'var(--font-caption)', 
                    color: '#8A6D2B', 
                    fontWeight: '600', 
                    letterSpacing: '2px', 
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap'
                  }}>
                    <span>✦</span> Home-Made Heart
                    <span>✦</span> Strictly Made to Order
                    <span>✦</span> Gourmet Delights 
                    <span>✦</span> Handcrafted Goodness 
                    <span>✦</span> Small-Batch Perfection
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* --- CORAL RED GLOW SEARCH BAR --- */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #FF5958',
              boxShadow: '0 0 20px rgba(255, 89, 88, 0.28), 0 4px 12px rgba(255, 89, 88, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
              boxSizing: 'border-box',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{ paddingLeft: '10px', display: 'flex', alignItems: 'center', color: '#FF5958' }}>
              </div>
              <input 
                type="text"
                placeholder="Search across all menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: theme.text,
                  fontSize: 'var(--font-body)',
                  fontWeight: '500',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* --- HERITAGE & CRAFT TRIGGER CARD --- */}
          {!searchQuery.trim() && (
            <div 
              className="support-card"
              onClick={() => setIsStoryModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
                borderRadius: 'clamp(16px, 4vw, 20px)',
                border: '1px solid rgba(197, 160, 89, 0.45)',
                padding: 'clamp(12px, 3.5vw, 16px) clamp(14px, 4vw, 18px)',
                marginBottom: '12px',
                boxShadow: '0 4px 18px rgba(44, 34, 30, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-150%',
                width: '150%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.22), transparent)',
                transform: 'skewX(-20deg)',
                animation: 'prismSweep 4s infinite ease-in-out',
                pointerEvents: 'none',
                zIndex: 1
              }} />

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
                gap: '12px',
                minWidth: 0
              }}>
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <span style={{ 
                    fontSize: 'clamp(9px, 2.5vw, 10px)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.6px', 
                    color: '#8A6D2B', 
                    fontWeight: '600',
                    display: 'block'
                  }}>
                    ✦ HERITAGE & CRAFT ✦
                  </span>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(18px, 4.5vw, 22px)',
                    fontWeight: '800',
                    color: '#FF5958',
                    margin: 0,
                    lineHeight: '1.15',
                    letterSpacing: '-0.2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Our Origins & Our Promise
                  </h2>
                  <p style={{ 
                    fontSize: 'var(--font-caption)', 
                    fontWeight: '500',
                    color: '#524B47', 
                    margin: 0, 
                    fontStyle: 'italic', 
                    fontFamily: "'Cormorant Garamond', serif" 
                  }}>
                    A legacy of warmth & authenticity
                  </p>
                </div>

                <div 
                  style={{
                    border: '1px solid rgba(197, 160, 89, 0.45)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '4px 10px',
                    fontSize: 'var(--font-caption)',
                    fontWeight: '600',
                    color: '#FF5958',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(197, 160, 89, 0.12)',
                    flexShrink: 0
                  }}
                >
                  <span>Story</span>
                  <ChevronRight size={13} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          )}

          {/* --- SEARCH RESULTS OR CATEGORY LIST --- */}
          {searchQuery.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: 'var(--font-body)', fontWeight: '600', color: theme.text }}>Search Results</span>
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#C5A059', cursor: 'pointer', fontSize: 'var(--font-caption)', fontWeight: 'bold' }}>
                  Clear
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginBottom: '2px' }}>
                <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? '#C5A059' : 'transparent', border: layout === 'list' ? 'none' : '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ListIcon size={16} color={layout === 'list' ? '#FFFFFF' : theme.text}/>
                </button>
                <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? '#C5A059' : 'transparent', border: layout === 'grid' ? 'none' : '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Grid size={16} color={layout === 'grid' ? '#FFFFFF' : theme.text}/>
                </button>
              </div>

              <div style={{ 
                display: layout === 'grid' ? 'grid' : 'flex', 
                gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', 
                flexDirection: 'column', 
                gap: '10px' 
              }}>
                {Object.entries(menuData).flatMap(([catKey, cat]) => {
                  const catImg = getImgUrl(cat);
                  const subValues = Array.isArray(cat.subcategories) 
                    ? cat.subcategories.flatMap(s => s.items || s) 
                    : Object.values(cat.subcategories || {}).flat();

                  return subValues.map(item => ({
                    ...item,
                    parentCatImage: catImg
                  }));
                })
                .filter(item => item && item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
                .map((item, i) => {
                  const rawItemImg = getImgUrl(item);
                  const resolvedImg = rawItemImg ? resolveImagePath(rawItemImg) : null;
                  const resolvedCatImg = item.parentCatImage ? resolveImagePath(item.parentCatImage) : null;

                  const processedItem = {
                    ...item,
                    imageUrl: resolvedImg || resolvedCatImg || getFallbackSvgImage(item.name)
                  };

                  return (
                    <ItemCard 
                      key={i}
                      item={processedItem} 
                      openModal={openModal} 
                      addToCart={addToCart} 
                      resolveImagePath={resolveImagePath} 
                      layout={layout}
                      theme={theme}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            /* --- RENDER ALPHABETICALLY SORTED CATEGORIES (A-Z) --- */
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px'
            }}>
              {sortedCategoryKeys.map(catKey => (
                <CategoryCard 
                  key={catKey}
                  cat={{ name: catKey, ...menuData[catKey] }}
                  resolveImagePath={resolveImagePath}
                  theme={theme}
                  onClick={() => { setActiveCat(catKey); setActiveSub(null); setView('subcat'); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
         SUBCATEGORY VIEW
         ==================================================================== */}
      {view === 'subcat' && (
        <div style={{ 
          paddingBottom: '100px', 
          fontFamily: "'Plus Jakarta Sans', sans-serif" 
        }}>
          {/* --- TOP BAR (BACK BUTTON & CATEGORY TITLE) --- */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '12px', padding: '4px 0' }}>
            <button 
              onClick={() => setView('home')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                color: theme.text, 
                fontSize: 'var(--font-caption)', 
                fontWeight: '700', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                backgroundColor: 'rgba(0,0,0,0.04)', 
                zIndex: 1,
                flexShrink: 0
              }}
            >
              <ArrowLeft size={15} style={{ flexShrink: 0 }}/> Back
            </button>
            <h2 style={{ 
              position: 'absolute', 
              left: 0, 
              right: 0, 
              textAlign: 'center', 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 'var(--font-h2)', 
              color: '#1A1816', 
              margin: 0, 
              fontWeight: '700', 
              letterSpacing: '0.5px', 
              textTransform: 'uppercase', 
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              paddingLeft: '70px',
              paddingRight: '70px'
            }}>
              {activeCat}
            </h2>
          </div>

          {/* Bespoke Catering Callout Card */}
          {isCateringCategory && (
            <div 
              className="support-card" 
              onClick={() => setIsBulkModalOpen(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: 'clamp(12px, 3.5vw, 14px) clamp(14px, 4vw, 16px)', 
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
                border: '1px solid rgba(197, 160, 89, 0.5)', 
                borderRadius: 'clamp(14px, 4vw, 16px)', 
                boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
                boxSizing: 'border-box',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '16px',
                gap: '12px'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-150%',
                width: '150%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.28), transparent)',
                transform: 'skewX(-20deg)',
                animation: 'prismSweep 4s infinite ease-in-out',
                pointerEvents: 'none',
                zIndex: 1
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
                <div style={{ 
                  backgroundColor: 'rgba(197, 160, 89, 0.15)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>
                  <Users size={20} color="#8A6D2B" style={{ flexShrink: 0 }} />
                </div>
                <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      ✦ Bespoke Catering ✦
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 1px 0', fontFamily: "'Cormorant Garamond', serif", color: '#1A1816', fontSize: 'clamp(16px, 4vw, 17px)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Bulk Orders & Pricing
                  </h3>
                  <p style={{ margin: 0, color: '#78716C', fontSize: 'var(--font-caption)', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Competitive pricing for bespoke bulk orders
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0',
                position: 'relative',
                zIndex: 2
              }}>
                <ChevronRight size={18} color="#8A6D2B" strokeWidth={2.5} />
              </div>
            </div>
          )}

          {/* --- RENDER ALPHABETICALLY SORTED SUBCATEGORIES (A-Z) --- */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            {subCategoryKeys.map(sub => (
              <SubCategoryCard 
                key={sub}
                sub={sub}
                activeCat={activeCat}
                menuData={menuData}
                resolveImagePath={resolveImagePath}
                theme={theme}
                onClick={() => { setActiveSub(sub); setView('items'); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bulk Orders Popup Modal */}
      <BulkOrdersModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
      />
    </>
  );
}