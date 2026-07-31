import React from 'react';
import { ArrowLeft, List as ListIcon, Grid } from 'lucide-react';
import ItemCard from './ItemCard';

export default function ItemsView({
  setView,
  backButtonStyle,
  theme,
  searchQuery,
  setSearchQuery,
  isNonVeg,
  setIsNonVeg,
  layout,
  setLayout,
  menuData,
  activeCat,
  activeSub,
  openModal,
  addToCart,
  resolveImagePath
}) {
  return (
    <div style={{ paddingBottom: '90px' }}>
      <button 
        onClick={() => setView('subcat')} 
        style={{ 
          ...backButtonStyle, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginBottom: '10px' 
        }}
      >
        <ArrowLeft size={18}/> Back
      </button>

      {/* Uniform Global Search Bar */}
      <div style={{ marginBottom: '16px', padding: '0 2px' }}>
        <input 
          type="text"
          placeholder="Search all items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="catchy-search-input"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '2px solid #ff5958',
            borderRadius: theme.radius,
            backgroundColor: theme.bg,
            color: '#3E3328',
            fontSize: '15px',
            fontWeight: '500',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* ========================================================== */}
      {/* TRANSPARENT CONTROLS BAR: Veg/Non-Veg (Left) & Grid/List (Right) */}
      {/* ========================================================== */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '16px', 
        padding: '4px 2px',
        backgroundColor: 'transparent', // Completely transparent background
        border: 'none'                     // No outer border box
      }}>
        {/* Left Side: Slide Toggle Switch for Veg / Non-Veg */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            onClick={() => setIsNonVeg(false)}
            style={{ fontSize: '12px', fontWeight: '800', color: isNonVeg === false ? '#2D8A56' : '#2D8A56', cursor: 'pointer', letterSpacing: '0.5px' }}
          >
            VEG
          </span>
          
          <div 
            onClick={() => setIsNonVeg(isNonVeg === null ? false : !isNonVeg)}
            style={{ 
              width: '44px', height: '24px', 
              background: isNonVeg === null ? '#ccc' : (isNonVeg ? '#D32F2F' : '#2D8A56'), 
              borderRadius: '24px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' 
            }}
          >
            <div style={{ 
              width: '20px', height: '20px', background: '#FFFFFF', borderRadius: '50%', 
              position: 'absolute', top: '2px', left: isNonVeg === null ? '12px' : (isNonVeg ? '22px' : '2px'), transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }} />
          </div>
          
          <span 
            onClick={() => setIsNonVeg(true)}
            style={{ fontSize: '12px', fontWeight: '700', color: isNonVeg === true ? '#D32F2F' : '#D32F2F', cursor: 'pointer', letterSpacing: '0.5px' }}
          >
            NON-VEG
          </span>
        </div>

        {/* Right Side: Grid & List Layout Toggle Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button 
            onClick={() => setLayout('list')} 
            style={{ 
              background: layout === 'list' ? theme.brand : 'transparent', 
              border: layout === 'list' ? 'none' : theme.border, 
              borderRadius: '8px', 
              padding: '6px 8px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
            title="List View"
          >
            <ListIcon size={16} color={layout === 'list' ? '#FFFFFF' : theme.text}/>
          </button>
          
          <button 
            onClick={() => setLayout('grid')} 
            style={{ 
              background: layout === 'grid' ? theme.brand : 'transparent', 
              border: layout === 'grid' ? 'none' : theme.border, 
              borderRadius: '8px', 
              padding: '6px 8px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
            title="Grid View"
          >
            <Grid size={16} color={layout === 'grid' ? '#FFFFFF' : theme.text}/>
          </button>
        </div>
      </div>

      {/* Filtered Item List */}
      <div style={{ 
        display: layout === 'grid' ? 'grid' : 'flex', 
        gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', 
        flexDirection: 'column', 
        gap: '16px' 
      }}>
        {(searchQuery 
          ? Object.values(menuData).flatMap(cat => Object.values(cat.subcategories).flat())
          : (activeCat && activeSub && menuData[activeCat]?.subcategories[activeSub] ? menuData[activeCat].subcategories[activeSub] : [])
        )
        .filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
          if (isNonVeg === null) return matchesSearch;
          const v = item.variation ? item.variation.trim().toLowerCase() : '';
          if (!isNonVeg) return matchesSearch && (v === 'veg' || v === 'egg');
          return matchesSearch && (v === 'non-veg' || v === 'egg');
        })
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
  );
}