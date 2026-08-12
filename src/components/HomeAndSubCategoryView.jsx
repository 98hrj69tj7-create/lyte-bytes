import React, { useState, useEffect } from 'react';
import { 
  List as ListIcon, Grid, ArrowLeft, ChevronRight, ChevronDown, 
  Heart, Sparkles, ShieldCheck, ChefHat, Home, Gift, Award, 
  Badge,
  BadgeCheck
} from 'lucide-react';
import ItemCard from './ItemCard';

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
        height: '84px',
        borderRadius: '16px',
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
        padding: '0 18px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}>
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: '700',
            color: '#FFFFFF',
            margin: 0, 
            letterSpacing: '0.2px', 
            textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
            lineHeight: '1.1' 
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
        height: '84px',
        borderRadius: '16px',
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
        padding: '0 18px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}>
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px',
            fontWeight: '700',
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '0.2px',
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            lineHeight: '1.1'
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
  const [showStory, setShowStory] = useState(false);
  const currentCategoryData = findCategoryData(menuData, activeCat);

  useEffect(() => {
    if (typeof onStoryToggle === 'function') {
      onStoryToggle(showStory);
    }
  }, [showStory, onStoryToggle]);

  const isCateringCategory = activeCat && activeCat.toLowerCase().includes('catering');
  const whatsappNumber = "9108286886"; 
  const whatsappMessage = encodeURIComponent("Hi Lyte Bytes, I would like to inquire about your catering services and customized menu packages!");

  const handleChatAndSave = () => {
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Lyte Bytes',
      'ORG:Lyte Bytes - Gourmet Delights',
      'TEL;TYPE=WORK,VOICE:+919108286886',
      'NOTE:Handcrafted Goodness & Gourmet Delights Since 1995',
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Lyte_Bytes_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const waUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(waUrl, '_blank');
  };

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
          fontFamily: "'Plus Jakarta Sans', sans-serif" 
        }}>
          
          {/* --- TOP BRAND SLOGAN BAR --- */}
          <div style={{ 
            textAlign: 'center', 
            margin: '2px 0 10px 0'
          }}>
            <span style={{ 
              fontSize: '10px', 
              color: '#8A6D2B', 
              fontWeight: '600', 
              letterSpacing: '2px', 
              textTransform: 'uppercase',
              display: 'inline-block'
            }}>
              ✦ Home‑Made Heart ✦ Gourmet Delights ✦ <p>✦ Handcrafted Goodness ✦</p>
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
              <div style={{ paddingLeft: '10px', display: 'flex', alignItems: 'center', color: '#FF5958' }}>
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
            </div>
          </div>

          {/* --- HERITAGE & CRAFT STORY CARD (ELITE LEFT-ALIGNED EDITION) --- */}
{!searchQuery.trim() && (
  <div 
    className="support-card"
    style={{
      background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(197, 160, 89, 0.45)',
      padding: '10px 16px',
      marginBottom: '12px',
      boxShadow: '0 4px 18px rgba(44, 34, 30, 0.04)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    }}
  >
    {/* Prism Sweep Animated Shimmer Light Effect */}
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

    {/* --- HEADER BLOCK (CENTER-ALIGNED & CLICKABLE) --- */}
<div 
  onClick={() => setShowStory(prev => !prev)}
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    position: 'relative',
    cursor: 'pointer',
    zIndex: 2,
    paddingBottom: '2px'
  }}
>
  {/* Elite Authenticated Shield Seal (Left - 50px) */}
  <div style={{
    width: '50px',
    height: '50px',
    borderRadius: '10px 10px 22px 22px', /* Shield Silhouette */
    border: '2px solid #C5A059',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF4EB 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(197, 160, 89, 0.18), inset 0 0 0 1.5px #FFFDF9',
    flexShrink: 0
  }}>
    <BadgeCheck size={20} color="#C5A059" strokeWidth={2} />
    <span style={{ 
      fontSize: '10px', 
      fontWeight: '700', 
      color: '#8A6D2B', 
      letterSpacing: '0.8px', 
      marginTop: '1px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      1995
    </span>
  </div>

  {/* Perfectly Centered Typography Block */}
  <div style={{ 
    flex: 1, 
    textAlign: 'center',
    padding: '0 8px'
  }}>
    <span style={{ 
      fontSize: '9px', 
      textTransform: 'uppercase', 
      letterSpacing: '1.5px', 
      color: '#C5A059', 
      fontWeight: '600',
      display: 'block',
      marginBottom: '2px'
    }}>
      ✦ HERITAGE & CRAFT ✦
    </span>
    <h2 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '18px',
      fontWeight: '600',
      color: '#FF5958',
      margin: 0,
      lineHeight: '1.15'
    }}>
      Our Origins & Our Promise
    </h2>
    <p style={{ 
      fontSize: '12px', 
      fontWeight: '500',
      color: '#3f3c3a', 
      margin: '3px 0 0 0', 
      fontStyle: 'italic', 
      fontFamily: "'Cormorant Garamond', serif" 
    }}>
      A legacy of warmth & authenticity
    </p>
  </div>

  {/* Invisible Balance Spacer (Matches 50px Shield Width) */}
  <div style={{ width: '50px', flexShrink: 0 }} />

  {/* Story Toggle Pill Positioned Neat at Bottom-Right */}
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setShowStory(prev => !prev);
    }}
    style={{
      position: 'absolute',
      bottom: '0px',
      right: '0px',
      border: '1px solid rgba(197, 160, 89, 0.45)',
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: '600',
      color: '#FF5958',
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      transition: 'all 0.2s ease',
      zIndex: 3
    }}
  >
    <span>{showStory ? 'Less' : 'Story'}</span>
    <ChevronDown 
      size={13} 
      style={{ 
        transform: showStory ? 'rotate(180deg)' : 'rotate(0deg)', 
        transition: 'transform 0.3s ease' 
      }} 
    />
  </button>
</div>

    {/* --- EXPANDED STORY DRAWER --- */}
    {showStory && (
      <div style={{ marginTop: '16px', position: 'relative', zIndex: 2 }}>
        <div style={{ height: '1px', backgroundColor: 'rgba(197, 160, 89, 0.25)', marginBottom: '12px' }} />

        {/* Section 1: Our Origins */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Home size={13} color="#8B0000" />
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.6px', color: '#8B0000', fontWeight: '800' }}>
            Our Origins
          </span>
        </div>

        <p style={{ 
          fontSize: '12.5px', 
          lineHeight: '1.65', 
          color: '#44403C', 
          fontWeight: '400', 
          marginBottom: '10px',
          textAlign: 'left'
        }}>
          Lyte Bytes is a culinary brand shaped by two generations: my mother’s treasured heritage recipes and my passion for elevating them for today’s food lovers. For nearly three decades, our kitchen has specialised in fresh, small-batch craftsmanship, where every dish reflects intention, precision, and family warmth.
        </p>

        <p style={{ 
          fontSize: '12.5px', 
          lineHeight: '1.65', 
          color: '#44403C', 
          fontWeight: '400', 
          marginBottom: '16px',
          textAlign: 'left'
        }}>
          What began with my mother’s catering and timeless techniques has evolved into a refined experience—from customized event menus to artisanal baking and signature pickles under <strong style={{ color: '#1A1816', fontWeight: '700' }}>Ammi’s Achar</strong>.
        </p>

        {/* Micro-Pills Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '8px', 
          marginBottom: '16px' 
        }}>
          {[
            { icon: Sparkles, label: 'Fresh Batches' },
            { icon: ShieldCheck, label: 'Zero Preservatives' },
            { icon: Heart, label: 'Zero Wastage' },
            { icon: ChefHat, label: '100% Handcrafted' }
          ].map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(197, 160, 89, 0.08)',
              border: '1px solid rgba(197, 160, 89, 0.22)',
              borderRadius: '10px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px'
            }}>
              <item.icon size={13} color="#8A6D2B" />
              <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#292524', letterSpacing: '0.2px' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Editorial Quote Card */}
        <div style={{
          backgroundColor: '#FAF6F0',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '16px',
          borderLeft: '3px solid #8B0000',
          textAlign: 'left'
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '14.5px',
            fontStyle: 'italic',
            lineHeight: '1.45',
            color: '#332F2E',
            margin: 0
          }}>
            "Ammi’s Achar showcases authentic vegetarian and meat-based pickles prepared using age-old methods, premium ingredients, and meticulous attention to detail."
          </p>
        </div>

        {/* Our Promise Block */}
        <div style={{
          borderLeft: '2.5px solid #C5A059',
          paddingLeft: '12px',
          paddingTop: '2px',
          paddingBottom: '2px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8A6D2B', marginBottom: '3px' }}>
            <ShieldCheck size={13} color="#8A6D2B" />
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.4px', fontWeight: '800' }}>
              Our Promise
            </span>
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '15.5px',
            fontWeight: '600',
            lineHeight: '1.35',
            color: '#1A1816',
            margin: 0
          }}>
            At Lyte Bytes, every batch is a promise: crafted with purpose, rooted in legacy, and refined for today’s palate.
          </p>
        </div>
      </div>
    )}
  </div>
)}

          {/* --- SEARCH RESULTS OR CATEGORY LIST --- */}
          {searchQuery.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>Search Results</span>
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#C5A059', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            position: 'relative', 
            marginBottom: '12px', 
            padding: '4px 0' 
          }}>
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
                fontSize: '13px', 
                fontWeight: '700', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                backgroundColor: 'rgba(0,0,0,0.04)', 
                zIndex: 1 
              }}
            >
              <ArrowLeft size={15}/> Back
            </button>
            <h2 style={{ 
              position: 'absolute', 
              left: 0, 
              right: 0, 
              textAlign: 'center', 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: '20px', 
              color: '#1A1816', 
              margin: 0, 
              fontWeight: '700', 
              letterSpacing: '0.5px', 
              textTransform: 'uppercase', 
              pointerEvents: 'none' 
            }}>
              {activeCat}
            </h2>
          </div>

          {/* Bespoke Catering Callout Card */}
          {isCateringCategory && (
            <div 
              className="support-card" 
              onClick={handleChatAndSave}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '14px 16px', 
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
                border: '1px solid rgba(197, 160, 89, 0.5)', 
                borderRadius: '16px', 
                boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
                boxSizing: 'border-box',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '16px'
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
                  <Gift size={20} color="#8A6D2B" />
                </div>
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      ✦ Bespoke Catering ✦
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 1px 0', fontFamily: "'Cormorant Garamond', serif", color: '#1A1816', fontSize: '17px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Bulk Orders & Pricing
                  </h3>
                  <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Competitive pricing for bespoke bulk orders
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0',
                marginLeft: '10px',
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
    </>
  );
}