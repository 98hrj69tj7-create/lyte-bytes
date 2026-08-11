import React, { useState } from 'react';
import { Sparkles, Tag, ShoppingBag, X } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';
import { OfferPolicyModalContent } from './PolicyContents';

// ==========================================
// POLICY MODAL COMPONENT (WRAPPER)
// ==========================================
function PolicyModal({ isOpen, onClose, title, children, theme = {} }) {
  if (!isOpen) return null;

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2',
    radius: theme?.radius || '22px'
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(46, 40, 40, 0.77)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={() => e.stopPropagation(null)}
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: 'auto',
          background: activeTheme.bg,
          color: activeTheme.text,
          borderRadius: '16px',
          border: `2px solid ${activeTheme.brand}`,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          boxSizing: 'border-box'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '14px 16px',
          background: activeTheme.bg,
          borderBottom: '1px solid #EFECE6',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: '15px', 
            color: activeTheme.brand, 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.8px'
          }}>
            {title}
          </div>
        </div>

        {/* Modal Body Content Container */}
        <div style={{ 
          padding: '12px 16px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          boxSizing: 'border-box'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OFFERS TAB MAIN COMPONENT
// ==========================================
export default function OffersTab({ theme = {} }) {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const offers = getAllOffers(currentCount);

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
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginTop: '16px', 
        marginBottom: '20px', 
        padding: '0 16px', 
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <h2 style={{ 
          fontSize: '16px', 
          color: activeTheme.brand, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase',
          textAlign: 'center'
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
              fontSize: '12px',
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

      {/* Render Active Offers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>
        {offers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              background: 'linear-gradient(145deg, #2C221E 0%, #3D3028 100%)',
              borderRadius: '16px',
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(44, 34, 30, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              border: '1px solid rgba(216, 199, 165, 0.2)',
              width: '100%'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08, pointerEvents: 'none' }}>
              <Sparkles size={120} color="#FFFFFF" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.12)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: '9.5px', 
                  fontWeight: '600', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#FFFBF2'
                }}>
                  {offer.tag}
                </span>

                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  background: activeTheme.brand, 
                  color: '#FFFFFF',
                  padding: '3px 10px', 
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(255, 89, 88, 0.4)'
                }}>
                  {offer.discount}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '6px 0 6px 0', position: 'relative', zIndex: 1, letterSpacing: '0.3px', color: '#FFFBF2' }}>
                {offer.title}
              </h3>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '0 0 12px 0', lineHeight: '1.45', position: 'relative', zIndex: 1, color: '#E8E1D5' }}>
                {offer.description}
              </p>

              <div style={{ fontSize: '10.5px', opacity: '0.8', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', zIndex: '1', marginBottom: '12px', color: '#D4C8B8' }}>
                <Tag size={11} color={activeTheme.brand} /> {offer.condition}
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)', 
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '9px 12px', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginTop: '4px',
              fontSize: '12px',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1,
              color: '#FFFBF2'
            }}>
              <ShoppingBag size={20} color={activeTheme.brand} />
              <span>Available in Bag at Checkout</span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* OFFER CONDITIONS MODAL (USING POLICY CONTENTS) */}
      {/* ========================================== */}
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