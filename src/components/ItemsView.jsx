import React from 'react';
import { ArrowLeft, List as ListIcon, Grid } from 'lucide-react';
import ItemCard from './ItemCard'; // Adjust path if needed depending on your folder structure

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
        style={{ ...backButtonStyle, marginBottom: '10px' }}
      >
        <ArrowLeft size={20}/> Back
      </button>

      {/* Uniform Global Search Bar */}
      <div style={{ marginBottom: '18px', padding: '0 2px' }}>
        <input 
          type="text"
          placeholder="Search all items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="catchy-search-input"
          style={{
            width: '100%',
            padding: '14px 18px',
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

      {/* Premium Slide Toggle Switch */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
        <span 
          onClick={() => setIsNonVeg(false)}
          style={{ fontSize: '13px', fontWeight: '700', color: isNonVeg === false ? '#2D8A56' : '#aaa', cursor: 'pointer' }}
        >VEG</span>
        
        <div 
          onClick={() => setIsNonVeg(isNonVeg === null ? false : !isNonVeg)}
          style={{ 
            width: '50px', height: '26px', 
            background: isNonVeg === null ? '#ccc' : (isNonVeg ? '#D32F2F' : '#2D8A56'), 
            borderRadius: '25px', position: 'relative', cursor: 'pointer', transition: '0.4s' 
          }}
        >
          <div style={{ 
            width: '22px', height: '22px', background: 'white', borderRadius: '50%', 
            position: 'absolute', top: '2px', left: isNonVeg === null ? '14px' : (isNonVeg ? '26px' : '2px'), transition: '0.4s' 
          }} />
        </div>
        
        <span 
          onClick={() => setIsNonVeg(true)}
          style={{ fontSize: '13px', fontWeight: '700', color: isNonVeg === true ? '#D32F2F' : '#aaa', cursor: 'pointer' }}
        >NON-VEG</span>
      </div>

      {/* Grid/List Layout Toggles */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ListIcon size={20} color={layout === 'list' ? '#E8E4D9' : theme.text}/>
        </button>
        <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Grid size={20} color={layout === 'grid' ? '#E8E4D9' : theme.text}/>
        </button>
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