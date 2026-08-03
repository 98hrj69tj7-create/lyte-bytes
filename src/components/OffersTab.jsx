import React from 'react';
import { Sparkles, Tag, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function OffersTab({ theme = {} }) {
  // Get current order count from localStorage (defaults to 1)
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const offers = getAllOffers(currentCount);

  // Fallback Theme values
  const activeTheme = {
    brand: theme?.brand || '#E53935',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #E0D3C1',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '12px',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '90px', 
      paddingTop: '5px',
      boxSizing: 'border-box',
      paddingLeft: '16px',
      paddingRight: '16px'
    }}>
      {/* Header with Centered Title & Badge on Right */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <div /> {/* Left spacer to perfectly center the title */}
        <h2 style={{ 
          color: activeTheme.brand, 
          margin: 0, 
          fontSize: '16px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px', 
          fontWeight: '700',
          textAlign: 'center' 
        }}>
          Offers & Rewards
        </h2>
        <span style={{ 
          fontSize: '11px', 
          background: '#F3E8FF', 
          color: '#7E22CE', 
          padding: '4px 8px', 
          borderRadius: '8px', 
          fontWeight: '700', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          justifySelf: 'end'
        }}>
        </span>
      </div>

      {/* Info Banner */}
      <div style={{
        background: '#FEF3C7',
        border: '1px solid #FDE68A',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '14px',
        fontSize: '12px',
        color: '#92400E',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <CheckCircle2 size={16} color="#D97706" style={{ flexShrink: 0 }} />
        <span>All active rewards below are available directly inside your Bag during checkout!</span>
      </div>

      {/* Render All Active Offers in a List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {offers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              background: `linear-gradient(135deg, ${offer.themeColor || activeTheme.brand}, #2C2416)`,
              borderRadius: activeTheme.radius,
              padding: '16px',
              color: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.12 }}>
              <Sparkles size={120} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
              <span style={{ fontSize: '14px', fontWeight: '700', background: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: '6px' }}>
                {offer.discount}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '8px 0 4px 0' }}>
              {offer.title}
            </h3>
            <p style={{ fontSize: '12.5px', opacity: 0.9, margin: '0 0 10px 0', lineHeight: '1.4' }}>
              {offer.description}
            </p>

            {/* Condition badge */}
            <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              padding: '8px 12px', 
              borderRadius: '8px',
              border: '1px dashed rgba(255,255,255,0.4)',
              fontSize: '12px',
              fontWeight: '700'
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