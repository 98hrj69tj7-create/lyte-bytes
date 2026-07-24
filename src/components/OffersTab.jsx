import React, { useState } from 'react';
import { Sparkles, Copy, Check, Tag } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function OffersTab({ theme }) {
  // Get current order count from localStorage (defaults to 1)
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const offers = getAllOffers(currentCount);
  
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
        Offers & Rewards
        </h2>
        <span style={{ fontSize: '11px', background: '#F3E8FF', color: '#7E22CE', padding: '4px 8px', borderRadius: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12}/> Live Coupons ({offers.length})
        </span>
      </div>

      {/* Render All Active Offers in a List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {offers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              background: `linear-gradient(135deg, ${offer.themeColor}, #2C2416)`,
              borderRadius: theme.radius,
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
              <span style={{ fontSize: '14px', fontWeight: '700', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                {offer.discount}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 4px 0' }}>
              {offer.title}
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 10px 0', lineHeight: '1.4' }}>
              {offer.description}
            </p>

            {/* Condition badge */}
            <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} /> {offer.condition}
            </div>

            {/* Coupon Code & Copy Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(4px)',
              padding: '6px 12px', 
              borderRadius: '10px',
              border: '1px dashed rgba(255,255,255,0.4)'
            }}>
              <div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.8 }}>Use Code</div>
                <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '1px' }}>{offer.code}</div>
              </div>
              <button 
                onClick={() => handleCopy(offer.code)}
                style={{
                  background: '#FFFFFF',
                  color: offer.themeColor,
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px'
                }}
              >
                {copiedCode === offer.code ? <><Check size={14}/> Copied</> : <><Copy size={14}/> Copy</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}