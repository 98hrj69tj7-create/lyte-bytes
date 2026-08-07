import React, { useState } from 'react';
import { Sparkles, Tag, ShoppingBag, X, Clock, ShieldCheck } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

// ==========================================
// POLICY MODAL COMPONENT (WRAPPER)
// ==========================================
function PolicyModal({ isOpen, onClose, title, children, theme = {} }) {
  if (!isOpen) return null;

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
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
        backgroundColor: 'rgba(46, 40, 40, 0.77)', // 🎨 [TWEAK]: Backdrop darkness & opacity
        backdropFilter: 'blur(15px)',             // 🎨 [TWEAK]: Background blur intensity
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '14px',                          // 🎨 [TWEAK]: Outer screen margin around modal
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',                      // 🎨 [TWEAK]: Maximum width of the modal popup box
          margin: 'auto',
          background: '#FDF6E3',                  // 🎨 [TWEAK]: Modal background color
          color: activeTheme.text,
          borderRadius: '20px',       // 🎨 [TWEAK]: Modal container corner roundness
          padding: '18px 24px',                   // 🎨 [TWEAK]: Inner padding inside the main container (top/bottom, left/right)
          maxHeight: '82vh',                      // 🎨 [TWEAK]: Maximum height relative to screen viewport
          overflowY: 'auto',                      // Enables smooth scrolling if content is long
          boxShadow: '0 24px 60px rgba(44, 34, 30, 0.3)', // 🎨 [TWEAK]: Modal drop shadow depth
          border: activeTheme.border,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '10px',                   // 🎨 [TWEAK]: Space between header and the first micro-card
          paddingBottom: '10px',                  // 🎨 [TWEAK]: Space between header title and bottom border line
          position: 'relative'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px',                     // 🎨 [TWEAK]: Header title font size
            color: activeTheme.brand, 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1.2px',                 // 🎨 [TWEAK]: Space between header letters
            textAlign: 'center'
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 0,
              background: '#FDF6E3', // 🎨 [TWEAK]: Close button background color
              border: 'none',
              borderRadius: '50%',
              width: '32px',                        // 🎨 [TWEAK]: Close button width
              height: '32px',                       // 🎨 [TWEAK]: Close button height
              cursor: 'pointer',
              color: '#FF5958',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={30} />
          </button>
        </div>

        {/* Modal Body Content Container */}
        <div style={{ 
          fontSize: '13px', 
          lineHeight: '1.65', 
          color: '#FDF6E3', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '6px',                            // 🎨 [TWEAK]: Vertical gap/spacing *between* individual micro-cards
          textAlign: 'left'
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

              <div style={{ fontSize: '10.5px', opacity: '0.8', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', zIndex: 1, marginBottom: '12px', color: '#D4C8B8' }}>
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
      {/* OFFER CONDITIONS MODAL CONTENT (MICRO-CARDS) */}
      {/* ========================================== */}
      <PolicyModal 
        isOpen={isPolicyOpen} 
        onClose={() => setIsPolicyOpen(false)} 
        title="Offer Conditions" 
        theme={activeTheme}
      >
        {/* Micro-Card 1 */}
        <div style={cardStyle}>
          <div style={headerRowStyle}>
            <Clock size={15} color={activeTheme.brand} />
            <span style={titleStyle}>Validity & Single-Use</span>
          </div>
          <p style={textStyle}>
            Offers are valid for limited windows only. Promo codes cannot be combined, have no cash value, and apply as <strong>one code per order</strong>. Canceled orders forfeit their discount.
          </p>
        </div>

        {/* Micro-Card 2 */}
        <div style={cardStyle}>
          <div style={headerRowStyle}>
            <Tag size={15} color={activeTheme.brand} />
            <span style={titleStyle}>Perks, Minimums & Taxes</span>
          </div>
          <p style={textStyle}>
            Welcome and early-bird perks are limited to one use per customer. Minimum order values and discounts apply exclusively to item prices, excluding taxes, packaging, and delivery fees.
          </p>
        </div>

        {/* Micro-Card 3 */}
        <div style={cardStyle}>
          <div style={headerRowStyle}>
            <ShieldCheck size={15} color={activeTheme.brand} />
            <span style={titleStyle}>Stock, Exclusions & Fair Usage</span>
          </div>
          <p style={textStyle}>
            Promotional offers apply only to in-stock items and exclude custom hampers or special products. Accounts or orders suspected of promo code misuse will be blocked or canceled.
          </p>
        </div>
      </PolicyModal>
    </div>
  );
}

// ==========================================
// 🎨 ADJUSTABLE MICRO-CARD DESIGN SETTINGS
// ==========================================
const cardStyle = {
  background: 'rgba(216, 199, 165, 0.12)',       // 🎨 [TWEAK]: Micro-card background tint color & opacity
  border: '1px dashed rgba(216, 199, 165, 0.3)',   // 🎨 [TWEAK]: Micro-card border style, thickness & color
  borderRadius: '12px',                           // 🎨 [TWEAK]: Micro-card corner roundness
  padding: '4px 14px',                            // 🎨 [TWEAK]: Micro-card internal spacing (top/bottom, left/right)
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'                                      // 🎨 [TWEAK]: Vertical space between card header row and text paragraph
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'                                      // 🎨 [TWEAK]: Space between the icon and micro-card title text
};

const titleStyle = {
  fontSize: '12px',                               // 🎨 [TWEAK]: Micro-card title font size
  fontWeight: '600',                              // 🎨 [TWEAK]: Micro-card title font weight (boldness)
  textTransform: 'uppercase',
  letterSpacing: '0.8px',                         // 🎨 [TWEAK]: Micro-card title letter spacing
  color: '#2C221E'                                // 🎨 [TWEAK]: Micro-card title text color
};

const textStyle = {
  margin: 0,
  fontSize: '10.5px',                             // 🎨 [TWEAK]: Body text font size inside micro-cards
  fontWeight: '300',                              // 🎨 [TWEAK]: Body text font weight
  lineHeight: '1.55',                             // 🎨 [TWEAK]: Line spacing/height for paragraph readability
  color: '#6E6457'                                // 🎨 [TWEAK]: Body text color inside micro-cards
};