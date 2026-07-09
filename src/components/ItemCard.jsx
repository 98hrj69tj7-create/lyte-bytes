import React from 'react';

export default function ItemCard({ item, addToCart, setSelectedItem, layout, resolveImagePath }) {
  return (
    <div style={{ padding: '12px', border: '1px solid #D8C7A5', borderRadius: '16px', display: 'flex', flexDirection: layout === 'grid' ? 'column' : 'row', gap: '12px', backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer', flexShrink: 0 }}>
        <img src={resolveImagePath(item.imageUrl, 'menu-items')} alt={item.name} style={{ width: layout === 'grid' ? '100%' : '90px', height: layout === 'grid' ? '120px' : '90px', objectFit: 'cover', borderRadius: '12px' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          {item.variation && (
            <img 
              src={`/menu-items/${item.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : item.variation.trim().toLowerCase()}.png`} 
              alt={item.variation} 
              style={{ width: '16px', height: '16px', flexShrink: 0 }} 
            />
          )}
          <div style={{ fontWeight: '800', fontSize: '15px', color: '#36281E' }}>{item.name}</div>
        </div>
        <div style={{ fontSize: '12px', color: '#FF5958', fontWeight: '700', fontStyle: 'italic', marginBottom: '8px' }}>{item.unit}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
          <div style={{ color: '#FF5958', fontWeight: '600', fontSize: '15px' }}>₹{item.price}</div>
          <button onClick={() => addToCart(item)} style={{ backgroundColor: '#FF5958', color: '#FFFFFF', border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Add</button>
        </div>
      </div>
    </div>
  );
}