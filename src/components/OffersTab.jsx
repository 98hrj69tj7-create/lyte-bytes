import React, { useState } from 'react';
import { Sparkles, Tag, ShoppingBag } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';
import { OfferPolicyModalContent } from './PolicyContents';
import PolicyModal from './PolicyModal';

export default function OffersTab({ theme = {} }) {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const offers = getAllOffers(currentCount);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(14px, 4vw, 16px)', // 💡 FLUID RADIUS
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
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginTop: '16px', 
        marginBottom: '16px', 
        padding: '0 16px', 
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0
      }}>
        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(20px, 5vw, 24px)', // 💡 FLUID TYPOGRAPHY
          color: '#FF5958', 
          margin: '-8px 0 0 0',
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%'
        }}>
          Live Offers
        </h2>

        {/* Trigger Link */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          width: '100%', 
          marginTop: '6px',
          boxSizing: 'border-box'
        }}>
          <span
            onClick={() => setIsPolicyOpen(true)}
            style={{
              fontSize: 'clamp(11px, 3vw, 13px)', // 💡 FLUID TYPOGRAPHY
              fontWeight: '600',
              color: activeTheme.brand,
              cursor: 'pointer',
              textDecoration: 'underline',
              letterSpacing: '0.2px'
            }}
          >
            Offer Conditions
          </span>
        </div>
      </div>

      {/* Render Active Offers List with Golden Ticket Styling */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>
        {offers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: activeTheme.radius,
              padding: 'clamp(14px, 4vw, 18px) clamp(16px, 4.5vw, 20px)', // 💡 FLUID PADDING
              color: activeTheme.text,
              boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              border: '1px dashed #C5A059',
              width: '100%',
              minWidth: 0
            }}
          >
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.05, pointerEvents: 'none' }}>
              <Sparkles size={110} color="#C5A059" />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1, gap: '8px', minWidth: 0 }}>
                <span style={{ 
                  background: 'rgba(197, 160, 89, 0.12)', 
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: 'clamp(9px, 2.5vw, 10.5px)', // 💡 FLUID TYPOGRAPHY
                  fontWeight: '700', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#8A6D2B',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {offer.tag}
                </span>

                <span style={{ 
                  fontSize: 'clamp(10px, 3vw, 12px)', // 💡 FLUID TYPOGRAPHY
                  fontWeight: '800', 
                  background: activeTheme.brand, 
                  color: '#FFFFFF',
                  padding: '3px 10px', 
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(255, 89, 88, 0.3)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {offer.discount}
                </span>
              </div>

              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: 'clamp(17px, 4.5vw, 20px)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '700', 
                margin: '4px 0 6px 0', 
                position: 'relative', 
                zIndex: 1, 
                letterSpacing: '0.3px', 
                color: activeTheme.text 
              }}>
                {offer.title}
              </h3>
              <p style={{ 
                fontSize: 'clamp(11.5px, 3.2vw, 13px)', // 💡 FLUID TYPOGRAPHY
                color: '#78716C', 
                margin: '0 0 10px 0', 
                lineHeight: '1.45', 
                position: 'relative', 
                zIndex: 1, 
                fontWeight: '500' 
              }}>
                {offer.description}
              </p>

              <div style={{ 
                fontSize: 'clamp(10.5px, 3vw, 12px)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                position: 'relative', 
                zIndex: '1', 
                marginBottom: '12px', 
                color: '#8A6D2B' 
              }}>
                <Tag size={12} color={activeTheme.brand} style={{ flexShrink: 0 }} /> 
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{offer.condition}</span>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(197, 160, 89, 0.08)', 
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '9px 12px', 
              borderRadius: '10px',
              border: '1px solid rgba(197, 160, 89, 0.25)',
              marginTop: '4px',
              fontSize: 'clamp(11px, 3vw, 12.5px)', // 💡 FLUID TYPOGRAPHY
              fontWeight: '700',
              position: 'relative',
              zIndex: 1,
              color: activeTheme.text,
              boxSizing: 'border-box'
            }}>
              <ShoppingBag size={18} color={activeTheme.brand} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Available in Bag at Checkout</span>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Modal Wrapper Component */}
      <PolicyModal 
        isOpen={isPolicyOpen} 
        onClose={() => setIsPolicyOpen(false)} 
        title="Offer Conditions" 
        theme={activeTheme}
      >
        <OfferPolicyModalContent brandColor={activeTheme.brand} />
      </PolicyModal>
    </div>
  );
}