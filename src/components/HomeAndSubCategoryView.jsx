import React, { useState, useEffect } from 'react';
import { List as ListIcon, Grid, ArrowLeft, ChevronRight, ChevronDown, Search, MessageCircle, Heart, Sparkles, Clock, ShieldCheck, ChefHat, BookOpen, Home } from 'lucide-react';
import ItemCard from './ItemCard';

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
          <stop offset="0%" stop-color="#FF5958" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#FF5958" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#bg)" />
      <circle cx="300" cy="200" r="180" fill="url(#glow)" />
      <g transform="translate(300, 160) scale(1.8)" fill="none" stroke="#FF5958" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v7a3 3 0 0 0 3 3h4v5h4v-5h4a3 3 0 0 0 3-3v-7h-3V7a5 5 0 0 0-5-5z"></path>
      </g>
      <text x="300" y="245" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${title}</text>
      <text x="300" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#FF5958" text-anchor="middle" letter-spacing="3">CRAFTED DELICACY</text>
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

/**
 * Category Card Component (Sleek, Compact, High-End Luxury Polish)
 */
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
        height: '84px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 12px 28px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '0.5px solid rgba(216, 199, 165, 0.6)',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1A1714'
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

      <div style={{ position: 'relative', zIndex: 3, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0, letterSpacing: '-0.2px', textShadow: '0 1px 3px rgba(0,0,0,0.4)', lineHeight: '1.2' }}>
            {cat.name}
          </h3>
          <span style={{ fontSize: '10.5px', fontWeight: '500', color: '#E6D5BC', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
            Explore Collection
          </span>
        </div>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: '#FF5958',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(255, 89, 88, 0.35)',
          transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          flexShrink: 0
        }}>
          <ChevronRight size={15} color="#FFFFFF" />
        </div>
      </div>
    </div>
  );
}

/**
 * SubCategory Card Component (Sleek, Compact, High-End)
 */
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
        height: '84px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 12px 28px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '0.5px solid rgba(216, 199, 165, 0.6)',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1A1714'
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

      <div style={{ position: 'relative', zIndex: 3, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0, letterSpacing: '-0.2px', textShadow: '0 1px 3px rgba(0,0,0,0.4)', lineHeight: '1.2' }}>
            {sub}
          </h3>
          <span style={{ fontSize: '10.5px', fontWeight: '500', color: '#E6D5BC', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
            Handcrafted Selection
          </span>
        </div>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: '#FF5958',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(255, 89, 88, 0.35)',
          transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          flexShrink: 0
        }}>
          <ChevronRight size={15} color="#FFFFFF" />
        </div>
      </div>
    </div>
  );
}

/**
 * Main View Component
 */
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
  resolveImagePath 
}) {
  const [showStory, setShowStory] = useState(false);
  const currentCategoryData = findCategoryData(menuData, activeCat);

  const isCateringCategory = activeCat && activeCat.toLowerCase().includes('catering');
  const whatsappNumber = "9108286886"; 
  const whatsappMessage = encodeURIComponent("Hi Lyte Bytes, I would like to inquire about your catering services and customized menu packages!");

  let subCategoryKeys = [];
  if (currentCategoryData && currentCategoryData.subcategories) {
    if (Array.isArray(currentCategoryData.subcategories)) {
      subCategoryKeys = currentCategoryData.subcategories.map(s => typeof s === 'string' ? s : (s.name || s.title || s.id));
    } else if (typeof currentCategoryData.subcategories === 'object') {
      subCategoryKeys = Object.keys(currentCategoryData.subcategories);
    }
  }

  return (
    <>
      {view === 'home' && (
        <div style={{ paddingBottom: '100px' }}>
          {/* --- TOP BRAND SLOGAN BAR --- */}
          <div style={{ textAlign: 'center', margin: '4px 0 10px 0' }}>
            <span style={{ fontSize: '10px', color: '#B57C3C', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.95 }}>
              ✦ Home‑Made Heart &nbsp;•&nbsp; Gourmet Delights &nbsp;•&nbsp; Handcrafted Goodness ✦
            </span>
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
              <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: '#FF5958' }}>
                <Search size={16} />
              </div>
              <input 
                type="text"
                placeholder="Search across all menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: theme.text,
                  fontSize: '14px',
                  fontWeight: '500',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    paddingRight: '14px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* --- iOS-STYLE REFINED STORY CARD (TOP & LEFT CHAMPAGNE GOLD HIGHLIGHT) --- */}
          {!searchQuery.trim() && (
            <div 
              onClick={() => setShowStory(!showStory)}
              style={{
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF3E8 100%)',
                border: '4px solid #D4AF37',
                borderRadius: '16px',
                padding: '10px 14px',
                marginBottom: '14px',
                textAlign: 'left',
                boxShadow: '-4px -4px 16px rgba(212, 175, 55, 0.12), 0 4px 20px rgba(0, 0, 0, 0.03)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,89,88,0.06) 0%, rgba(255,89,88,0) 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF5958',
                    flexShrink: '0'
                  }}>
                    <Heart size={24} fill="#FF5958" color="#FF5958" />
                  </div>
                  <div>
                    <h3 style={{ margin: '1px 0', fontSize: '17px', fontWeight: '600', color: '#1C1917', letterSpacing: '0.3px', lineHeight: '1.2' }}>
                      Our Origins & Our Promise
                    </h3>
                    <p style={{ margin: '1px 0', fontSize: '12px', color: '#78716C', fontWeight: '500', letterSpacing: '0.3px', lineHeight: '1.3' }}>
                      A legacy of warmth & authenticity
                    </p>
                    <p style={{ margin: '1px 0', fontSize: '11px', color: '#A89F95', fontStyle: 'italic', fontWeight: '400', lineHeight: '1.2' }}>
                      Since 1995
                    </p>
                  </div>
                </div>

                {/* Clean inline More/Less text link with Down Chevron */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#FF5958',
                  flexShrink: 0
                }}>
                  <span>{showStory ? 'Less' : 'More'}</span>
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      transform: showStory ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                    }} 
                  />
                </div>
              </div>

              {showStory && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    marginTop: '12px', 
                    fontSize: '13px', 
                    lineHeight: '1.5', 
                    color: '#292524', 
                    borderTop: '0.5px solid rgba(212, 175, 55, 0.4)', 
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#FF5958', fontWeight: '700', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Home size={14} fill="#FF5958" color="#FF5958" /> Our Origins
                    </h4>
                    
                    <p style={{ margin: '0 0 6px 0', color: '#44403C' }}>
                      Lyte Bytes began in 1995 in our home kitchen under my mother’s guidance, she built on the belief that <b>good food needs patience, honesty, and warmth</b>, not shortcuts. From corporate catering origins to specialty baking, small-batch wines, and handcrafted packaged goods, every offering carries that same sincere touch.
                    </p>
                    <p style={{ margin: 0, color: '#44403C' }}>
                      We operate with absolute transparency and care. Every item is freshly prepared when your order arrives: <b><i>never stored, never rushed.</i></b>
                    </p>
                  </div>

                  {/* Compact Highlights Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    backgroundColor: '#F3EAD8',
                    borderRadius: '12px',
                    padding: '4px 12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '600', color: '#292524' }}>
                      <span style={{ color: '#FF5958' }}>✓</span> Fresh Batches
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '600', color: '#292524' }}>
                      <span style={{ color: '#FF5958' }}>✓</span> Zero Preservatives
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '600', color: '#292524' }}>
                      <span style={{ color: '#FF5958' }}>✓</span> Zero Wastage
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '600', color: '#292524' }}>
                      <span style={{ color: '#FF5958' }}>✓</span> 100% Batch Crafted
                    </div>
                  </div>

                  {/* Promise Note */}
                  <div style={{ paddingTop: '2px' }}>
                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#FF5958', fontWeight: '700', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ShieldCheck size={13} fill="#FF5958" color="#FF5958" /> Our Promise
                    </h4>
                    <p style={{ margin: 0, fontWeight: '400', color: '#292524', fontSize: '12.5px', lineHeight: '1.4' }}>
                      Freshly crafted for you, made to order, and made to be remembered with the exact precision that has guided us for decades.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {searchQuery.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: theme.text }}>Search Results</span>
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: theme.brand, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  Clear
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginBottom: '2px' }}>
                <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? '#FF5958' : 'transparent', border: layout === 'list' ? 'none' : '1px solid rgba(216, 199, 165, 0.4)', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ListIcon size={16} color={layout === 'list' ? '#FFFFFF' : theme.text}/>
                </button>
                <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? '#FF5958' : 'transparent', border: layout === 'grid' ? 'none' : '1px solid rgba(216, 199, 165, 0.4)', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Grid size={16} color={layout === 'grid' ? '#FFFFFF' : theme.text}/>
                </button>
              </div>

              <div style={{ display: layout === 'grid' ? 'grid' : 'flex', gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', flexDirection: 'column', gap: '10px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.keys(menuData).map(catKey => (
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

      {view === 'subcat' && (
        <div style={{ paddingBottom: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '12px', padding: '4px 0' }}>
            <button 
              onClick={() => setView('home')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: theme.text, fontSize: '13px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.04)', zIndex: 1 }}
            >
              <ArrowLeft size={15}/> Back
            </button>
            <h2 style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: '15px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', pointerEvents: 'none' }}>
              {activeCat}
            </h2>
          </div>

          {/* --- SLEEK WHATSAPP CATERING BANNER --- */}
          {isCateringCategory && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFFDF9',
                border: '0.5px solid rgba(216, 199, 165, 0.7)',
                borderRadius: '16px',
                padding: '12px 16px',
                marginBottom: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: 'rgba(37, 211, 102, 0.12)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MessageCircle size={20} color="#25D366" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: theme.text, letterSpacing: '-0.2px' }}>
                    Custom bulk menus & pricing?
                  </h4>
                  <p style={{ margin: '1px 0 0 0', fontSize: '11px', color: '#78716C', fontWeight: '400' }}>
                    Chat with us instantly on WhatsApp
                  </p>
                </div>
              </div>
              <div style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
                flexShrink: 0
              }}>
                Chat Now
              </div>
            </a>
          )}

          {/* Subcategories List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
    </>
  );
}