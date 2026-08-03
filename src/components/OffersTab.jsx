import React from 'react';
import { Sparkles, Tag, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function OffersTab({ theme = {} }) {
  // Get current order count from localStorage (defaults to 1)
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const offers = getAllOffers(currentCount);

  // Fallback Theme values
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <div style={{ width: '60px' }} /> {/* Spacer to balance layout */}
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontSize: '16px', 
          color: activeTheme.brand, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Offers & Rewards
        </h2>
      </div>

      {/* Info Banner */}
      <div style={{
        background: '#FFFBF2',
        border: activeTheme.border,
        borderRadius: activeTheme.radius,
        padding: '14px 16px',
        marginBottom: '18px',
        fontSize: '13px',
        color: activeTheme.text,
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#FFF8E7',
          border: '1px solid #E5D6B5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle2 size={16} color={activeTheme.brand} />
        </div>
        <span style={{ lineHeight: '1.4' }}>All active rewards below are available directly inside your Bag during checkout!</span>
      </div>

      {/* Render All Active Offers in a List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
        {offers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              background: `linear-gradient(135deg, ${offer.themeColor || activeTheme.brand}, #2C2416)`,
              borderRadius: activeTheme.radius,
              padding: '18px 16px',
              color: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
              width: '100%'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.12, pointerEvents: 'none' }}>
              <Sparkles size={120} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '10px', 
                fontWeight: '600', 
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {offer.tag}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', background: 'rgba(0,0,0,0.25)', padding: '3px 9px', borderRadius: '6px' }}>
                {offer.discount}
              </span>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '10px 0 4px 0', position: 'relative', zIndex: 1 }}>
              {offer.title}
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 12px 0', lineHeight: '1.45', position: 'relative', zIndex: 1 }}>
              {offer.description}
            </p>

            {/* Condition badge */}
            <div style={{ fontSize: '11.5px', opacity: 0.85, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative', zIndex: 1 }}>
              <Tag size={12} /> {offer.condition}
            </div>

            {/* Checkout Availability Bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.18)', 
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '10px 12px', 
              borderRadius: '10px',
              border: '1px dashed rgba(255,255,255,0.4)',
              fontSize: '12px',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1
            }}>
              <ShoppingBag size={14} />
              <span>Available in Bag at Checkout</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}