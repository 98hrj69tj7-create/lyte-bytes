import React, { useState } from 'react';
import { List as ListIcon, Grid, ArrowLeft, ChevronRight } from 'lucide-react';
import ItemCard from './ItemCard';

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
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

function CategoryCard({ cat, resolveImagePath, theme, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const bgImage = cat.imageUrl ? resolveImagePath(cat.imageUrl) : getFallbackSvgImage(cat.name);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        position: 'relative',
        height: '110px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 16px 36px rgba(0,0,0,0.22)' : '0 6px 16px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(216, 199, 165, 0.4)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, rgba(20,18,15,0.88) 0%, rgba(20,18,15,0.6) 60%, rgba(20,18,15,0.3) 100%)',
        zIndex: 2
      }} />
      <div style={{ position: 'relative', zIndex: 3, padding: '0 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#FF5958', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
            Collection
          </span>
          <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#FFFFFF', margin: 0, letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {cat.name}
          </h3>
        </div>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}>
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}

function SubCategoryCard({ sub, resolveImagePath, activeCat, menuData, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const catObj = menuData[activeCat];
  const subItems = (catObj && catObj.subcategories && catObj.subcategories[sub]) || [];
  const foundItemWithImage = subItems.find(item => item.imageUrl)?.imageUrl;
  const representativeImage = foundItemWithImage 
    ? resolveImagePath(foundItemWithImage) 
    : (catObj?.imageUrl ? resolveImagePath(catObj.imageUrl) : getFallbackSvgImage(sub));

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        position: 'relative',
        height: '110px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 16px 36px rgba(0,0,0,0.22)' : '0 6px 16px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(216, 199, 165, 0.4)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${representativeImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, rgba(20,18,15,0.88) 0%, rgba(20,18,15,0.6) 60%, rgba(20,18,15,0.3) 100%)',
        zIndex: 2
      }} />
      <div style={{ position: 'relative', zIndex: 3, padding: '0 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#FF5958', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
            Menu
          </span>
          <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#FFFFFF', margin: 0, letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {sub}
          </h3>
        </div>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}>
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}

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
  return (
    <>
      {view === 'home' && (
        <div style={{ paddingBottom: '140px' }}>
          <div style={{ textAlign: 'center', margin: '8px 0 16px 0' }}>
            <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              ✦ Curated Delicacies ✦
            </span>
            <h1 style={{ fontSize: '20px', color: theme.text, margin: '4px 0 0 0', fontWeight: '800', letterSpacing: '0.3px' }}>
              Freshly Crafted For You
            </h1>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input 
              type="text"
              placeholder="Search across all menus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                border: '1.5px solid #FF5958',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                color: theme.text,
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 0 12px rgba(255, 89, 88, 0.25)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          {searchQuery.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: theme.text }}>Search Results</span>
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: theme.brand, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                  Clear
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? '#FF5958' : 'transparent', border: layout === 'list' ? 'none' : '1px solid rgba(216, 199, 165, 0.4)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ListIcon size={18} color={layout === 'list' ? '#FFFFFF' : theme.text}/>
                </button>
                <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? '#FF5958' : 'transparent', border: layout === 'grid' ? 'none' : '1px solid rgba(216, 199, 165, 0.4)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Grid size={18} color={layout === 'grid' ? '#FFFFFF' : theme.text}/>
                </button>
              </div>

              <div style={{ display: layout === 'grid' ? 'grid' : 'flex', gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', flexDirection: 'column', gap: '14px' }}>
                {Object.values(menuData).flatMap(cat => Object.values(cat.subcategories).flat())
                  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, i) => {
                    const processedItem = {
                      ...item,
                      imageUrl: item.imageUrl || getFallbackSvgImage(item.name)
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.keys(menuData).map(catKey => (
                <CategoryCard 
                  key={catKey}
                  cat={{ name: catKey, imageUrl: menuData[catKey].imageUrl }}
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
        <div style={{ paddingBottom: '140px' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
            <button 
              onClick={() => setView('home')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: theme.text, fontSize: '14px', fontWeight: '700', padding: '4px 8px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.04)', zIndex: 1 }}
            >
              <ArrowLeft size={16}/> Back
            </button>
            <h2 style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: '16px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', pointerEvents: 'none' }}>
              {activeCat}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeCat && menuData[activeCat]?.subcategories && Object.keys(menuData[activeCat].subcategories).map(sub => (
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