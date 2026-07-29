import React, { useState } from 'react';
import { List as ListIcon, Grid, ArrowLeft } from 'lucide-react';
import ItemCard from './ItemCard';

function CategoryCard({ cat, resolveImagePath, theme, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 16px', 
        backgroundColor: theme.buttonBg, 
        border: isHovered ? '1px solid rgba(255, 89, 88, 0.4)' : theme.border, 
        borderRadius: theme.radius, 
        cursor: 'pointer',
        boxShadow: isHovered ? '0 16px 36px rgba(0,0,0,0.22)' : '0 3px 8px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        onMouseEnter={() => setIsImgHovered(true)}
        onMouseLeave={() => setIsImgHovered(false)}
        style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', marginRight: '16px', flexShrink: 0 }}
      >
        <img 
          src={resolveImagePath(cat.imageUrl)} 
          alt={cat.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block',
            transform: isImgHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} 
        />
      </div>
      <div style={{ fontSize: '16px', fontWeight: '600', color: '#E8E4D9', letterSpacing: '0.4px' }}>
        {cat.name}
      </div>
    </div>
  );
}

function SubCategoryButton({ sub, theme, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        width: '100%', 
        padding: '14px 18px', 
        textAlign: 'left', 
        fontSize: '15px', 
        fontWeight: '600', 
        backgroundColor: theme.buttonBg, 
        border: isHovered ? '1px solid rgba(255, 89, 88, 0.4)' : theme.border, 
        borderRadius: theme.radius, 
        color: '#E8E4D9',
        boxShadow: isHovered ? '0 12px 28px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box'
      }}
    >
      {sub}
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
        <div style={{ paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '17px', color: theme.brand, textAlign: 'center', margin: '10px 0 10px 0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Freshly crafted for YOU
          </h1>

          <div style={{ marginBottom: '20px', padding: '0 2px' }}>
            <input 
              type="text"
              placeholder="Search all items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #ff5958',
                borderRadius: theme.radius,
                backgroundColor: theme.bg,
                color: theme.text,
                fontSize: '15px',
                fontWeight: '500',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {searchQuery.trim() ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: theme.text }}>Search Results</span>
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: theme.brand, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                  Clear
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <ListIcon size={18} color={layout === 'list' ? theme.bg : theme.text}/>
                </button>
                <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Grid size={18} color={layout === 'grid' ? theme.bg : theme.text}/>
                </button>
              </div>

              <div style={{ display: layout === 'grid' ? 'grid' : 'flex', gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', flexDirection: 'column', gap: '14px' }}>
                {Object.values(menuData).flatMap(cat => Object.values(cat.subcategories).flat())
                  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, i) => (
                    <ItemCard 
                      key={i}
                      item={item} 
                      openModal={openModal} 
                      addToCart={addToCart} 
                      resolveImagePath={resolveImagePath} 
                      layout={layout}
                      theme={theme}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
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
        <div style={{ paddingBottom: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '16px', padding: '4px 0' }}>
            <button 
              onClick={() => setView('home')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: theme.text, fontSize: '15px', fontWeight: '600', padding: '0', zIndex: 1 }}
            >
              <ArrowLeft size={18}/> Back
            </button>
            <h2 style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: '17px', color: theme.brand, margin: 0, fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', pointerEvents: 'none' }}>
              {activeCat}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeCat && menuData[activeCat]?.subcategories && Object.keys(menuData[activeCat].subcategories).map(sub => (
              <SubCategoryButton 
                key={sub}
                sub={sub}
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