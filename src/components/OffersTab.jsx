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
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
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
        backgroundColor: 'rgba(20, 15, 12, 0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: 'auto',
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          color: activeTheme.text,
          borderRadius: '20px',
          border: '1px solid rgba(197, 160, 89, 0.4)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '16px 20px',
          background: 'transparent',
          borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px', 
            color: activeTheme.brand, 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '0.8px'
          }}>
            {title}
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} color={activeTheme.text} />
          </button>
        </div>

        {/* Modal Body Content Container */}
        <div style={{ 
          padding: '16px 20px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
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
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
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
        width: '100%'
      }}>
        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '22px', 
          color: '#FF5958', 
          margin: '-8px 0 0 0',
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

      {/* Render Active Offers List with Golden Ticket Styling */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>
        {offers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: '16px',
              padding: '18px 20px',
              color: activeTheme.text,
              boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              border: '1px dashed #C5A059', // Golden Ticket Border
              width: '100%'
            }}
          >
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.05, pointerEvents: 'none' }}>
              <Sparkles size={110} color="#C5A059" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <span style={{ 
                  background: 'rgba(197, 160, 89, 0.12)', 
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#8A6D2B'
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
                  boxShadow: '0 2px 8px rgba(255, 89, 88, 0.3)'
                }}>
                  {offer.discount}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '19px', fontWeight: '700', margin: '4px 0 6px 0', position: 'relative', zIndex: 1, letterSpacing: '0.3px', color: activeTheme.text }}>
                {offer.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#78716C', margin: '0 0 10px 0', lineHeight: '1.45', position: 'relative', zIndex: 1, fontWeight: '500' }}>
                {offer.description}
              </p>

              <div style={{ fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', zIndex: '1', marginBottom: '12px', color: '#8A6D2B' }}>
                <Tag size={12} color={activeTheme.brand} /> {offer.condition}
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
              fontSize: '12px',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1,
              color: activeTheme.text
            }}>
              <ShoppingBag size={18} color={activeTheme.brand} />
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