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
    <div style={{ paddingBottom: '140px' }}>
      {/* Uniform Header with Absolute Centered Title & Floating Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('subcat')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: theme.text, 
            fontSize: '14px', 
            fontWeight: '700', 
            padding: '4px 8px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(0,0,0,0.04)', 
            zIndex: 1 
          }}
        >
          <ArrowLeft size={16}/> Back
        </button>
        <h2 style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: '16px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', pointerEvents: 'none' }}>
          {activeSub || 'Items'}
        </h2>
      </div>

      {/* Uniform Glowing Coral-Red Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text"
          placeholder="Search all items..."
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

      {/* Transparent Controls Bar: Veg/Non-Veg (Left) & Grid/List (Right) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '20px', 
        padding: '4px 2px',
        backgroundColor: 'transparent',
        border: 'none'
      }}>
        {/* Left Side: Slide Toggle Switch for Veg / Non-Veg */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            onClick={() => setIsNonVeg(false)}
            style={{ fontSize: '12px', fontWeight: '800', color: '#2D8A56', cursor: 'pointer', letterSpacing: '0.5px' }}
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
            style={{ fontSize: '12px', fontWeight: '700', color: '#D32F2F', cursor: 'pointer', letterSpacing: '0.5px' }}
          >
            NON-VEG
          </span>
        </div>

        {/* Right Side: Grid & List Layout Toggle Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button 
            onClick={() => setLayout('list')} 
            style={{ 
              background: layout === 'list' ? '#FF5958' : 'transparent', 
              border: layout === 'list' ? 'none' : '1px solid rgba(216, 199, 165, 0.4)', 
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
              background: layout === 'grid' ? '#FF5958' : 'transparent', 
              border: layout === 'grid' ? 'none' : '1px solid rgba(216, 199, 165, 0.4)', 
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
        gap: '14px' 
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