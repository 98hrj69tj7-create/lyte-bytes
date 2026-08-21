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
    <div style={{ paddingBottom: '140px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Uniform Header with Absolute Centered Title & Floating Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0', gap: '8px' }}>
        <button 
          onClick={() => setView('subcat')} 
          style={{ 
            background: 'none', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: theme.text, 
            fontSize: 'var(--font-caption)', 
            fontWeight: '600', 
            padding: '6px 10px', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            zIndex: 1,
            transition: 'all 0.2s ease',
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
          color: '#FF5958', 
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
          {activeSub || 'Items'}
        </h2>
      </div>

      {/* Uniform Glowing Coral-Red Search Bar */}
      <div style={{ marginBottom: '16px' }}>
        <input 
          type="text"
          placeholder="Search all items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: 'clamp(10px, 3vw, 12px) clamp(14px, 4vw, 18px)', 
            border: '1.5px solid #FF5958',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            color: theme.text,
            fontSize: 'var(--font-body)', 
            fontWeight: '500',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 0 16px rgba(255, 89, 88, 0.2), 0 4px 12px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {/* Transparent Controls Bar: Veg/Non-Veg (Left) & Grid/List (Right) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '16px', 
        padding: '4px 2px',
        backgroundColor: 'transparent',
        border: 'none',
        gap: '8px',
        minWidth: 0,
        boxSizing: 'border-box'
      }}>
        {/* Left Side: Slide Toggle Switch for Veg / Non-Veg */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 0 }}>
          <span 
            onClick={() => setIsNonVeg(false)}
            style={{ fontSize: 'var(--font-caption)', fontWeight: '800', color: '#2D8A56', cursor: 'pointer', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}
          >
            VEG
          </span>
          
          <div 
            onClick={() => setIsNonVeg(isNonVeg === null ? false : !isNonVeg)}
            style={{ 
              width: '42px', height: '22px', 
              background: isNonVeg === null ? '#d4d4d8' : (isNonVeg ? '#D32F2F' : '#2D8A56'), 
              borderRadius: '24px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}
          >
            <div style={{ 
              width: '18px', height: '18px', background: '#FFFFFF', borderRadius: '50%', 
              position: 'absolute', top: '2px', left: isNonVeg === null ? '12px' : (isNonVeg ? '22px' : '2px'), transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
          
          <span 
            onClick={() => setIsNonVeg(true)}
            style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#D32F2F', cursor: 'pointer', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}
          >
            NON-VEG
          </span>
        </div>

        {/* Right Side: Grid & List Layout Toggle Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <button 
            onClick={() => setLayout('list')} 
            style={{ 
              background: layout === 'list' ? '#FF5958' : 'rgba(255, 255, 255, 0.05)', 
              border: layout === 'list' ? 'none' : '1px solid rgba(197, 160, 89, 0.4)', 
              borderRadius: '10px', 
              padding: '6px 10px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              boxShadow: layout === 'list' ? '0 2px 8px rgba(255, 89, 88, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="List View"
          >
            <ListIcon size={15} color={layout === 'list' ? '#FFFFFF' : theme.text} style={{ flexShrink: 0 }}/>
          </button>
          
          <button 
            onClick={() => setLayout('grid')} 
            style={{ 
              background: layout === 'grid' ? '#FF5958' : 'rgba(255, 255, 255, 0.05)', 
              border: layout === 'grid' ? 'none' : '1px solid rgba(197, 160, 89, 0.4)', 
              borderRadius: '10px', 
              padding: '6px 10px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              boxShadow: layout === 'grid' ? '0 2px 8px rgba(255, 89, 88, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Grid View"
          >
            <Grid size={15} color={layout === 'grid' ? '#FFFFFF' : theme.text} style={{ flexShrink: 0 }}/>
          </button>
        </div>
      </div>

{/* ✨ Executive Pass VIP Luminous Card */}
      {activeSub?.toLowerCase() === 'meals' && (
        <div 
          onClick={() => setView('subscription-pass')}
          style={{
            background: 'linear-gradient(135deg, #282421 0%, #141211 100%)',
            borderRadius: '20px',
            padding: '12px 20px',
            color: '#FFFBF2',
            cursor: 'pointer',
            border: '2px solid #C5A059',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 8px 30px rgba(197, 160, 89, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.35)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Top Metallic Shimmer Highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
          }} />

          <div style={{ flex: 1, paddingRight: '10px'}}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#FFD700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              LYTE BYTES EXECUTIVE MEAL PASS
            </div>
            <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#FF5958', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              • Save up to 15% •
            </div>
            <div style={{ fontSize: '11.5px', color: '#FFFFFF', lineHeight: '1.6', fontWeight: '400' }}>
              Flexible skips, no-loss credits
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
            color: '#FFF',
            padding: '4px 10px',
            borderRadius: '14px',
            fontSize: '12px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(255, 89, 88, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            flexShrink: 0
          }}>
            CHECK
          </div>
        </div>
      )}

      {/* Filtered Item List */}
      <div style={{ 
        display: layout === 'grid' ? 'grid' : 'flex', 
        gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', 
        flexDirection: 'column', 
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box'
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