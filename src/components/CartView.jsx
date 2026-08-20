import React, { useState } from 'react';
import { 
  ArrowLeft, ShoppingBag, X, Tag, Check, Sparkles, ChevronRight, 
  Space
} from 'lucide-react';
import PolicyModal from './PolicyModal';
import { CartViewPolicyModalContent } from './PolicyContents';

// ============================================================================
// 🎫 DEFAULT COUPONS DATA STRUCTURE
// ============================================================================
const DEFAULT_COUPONS = [
  {
    code: 'ANNI25',
    title: 'Anniversary Celebration',
    discountPercent: 25,
    tag: 'EARLY BIRD',
    description: 'Exclusive early bird reward! 25% OFF.'
  },
  {
    code: 'APPFIRST',
    title: 'Welcome Wholesome Offer',
    discountPercent: 10,
    tag: 'LYTE PERKS',
    description: 'Enjoy 10% OFF on your order.'
  }
];

export default function CartView({
  setView = () => {},
  theme = {},
  cart = [],
  removeFromCart = () => {},
  addToCart = () => {},
  total = 0,
  handleProceedToDelivery = () => {},
  actionButtonStyle = {},
  secondaryButtonStyle = {},
  coupons = DEFAULT_COUPONS,
  appliedCoupon: externalAppliedCoupon,
  onApplyCoupon: externalOnApplyCoupon,
  onRemoveCoupon: externalOnRemoveCoupon
}) {
  // ============================================================================
  // 🎛️ LOCAL UI STATE MANAGEMENT
  // ============================================================================
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);         
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false); 
  const [internalAppliedCoupon, setInternalAppliedCoupon] = useState(null);

  const activeAppliedCoupon = externalAppliedCoupon !== undefined ? externalAppliedCoupon : internalAppliedCoupon;

  const handleApply = (coupon) => {
    if (externalOnApplyCoupon) {
      externalOnApplyCoupon(coupon);
    } else {
      setInternalAppliedCoupon(coupon);
    }
    setIsCouponDrawerOpen(false);
  };

  const handleRemove = () => {
    if (externalOnRemoveCoupon) {
      externalOnRemoveCoupon();
    } else {
      setInternalAppliedCoupon(null);
    }
  };

  // ============================================================================
  // 🎨 THEME & STYLING CONFIGURATION
  // ============================================================================
  const activeTheme = {
    brand: theme?.brand || '#FF5958',                        
    text: theme?.text || '#1A1816',                          
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)', 
    bg: theme?.bg || '#FFFDF9',                              
    radius: 'clamp(16px, 4vw, 20px)', // 💡 FLUID RADIUS                         
    buttonBg: theme?.buttonBg || '#FF5958'
  };

  const safeCart = Array.isArray(cart) ? cart : [];

  // ============================================================================
  // 🧮 DISCOUNT & TOTAL CALCULATIONS
  // ============================================================================
  const discountAmount = activeAppliedCoupon
    ? Math.round((Number(total) * (Number(activeAppliedCoupon.discountPercent) || 0)) / 100)
    : 0;

  const grandTotal = Math.max(0, Number(total) - discountAmount);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', sans-serif" 
    }}>
      
      {/* ================================================================== */}
      {/* 🧭 UNIFORM HEADER SECTION (Back Button & Title)                    */}
      {/* ================================================================== */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
            fontWeight: '600', 
            padding: '6px 10px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={15}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Your Bag
        </h2>
      </div>

      {/* ================================================================== */}
      {/* 🛒 CONDITIONAL RENDER: EMPTY VS POPULATED CART STATE              */}
      {/* ================================================================== */}
      {safeCart.length === 0 ? (
        // ------------------ EMPTY CART VIEW ------------------
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'clamp(60px, 15vh, 100px)', // 💡 FLUID MARGIN
          padding: 'clamp(20px, 5vw, 25px)', // 💡 FLUID PADDING
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          borderRadius: activeTheme.radius, 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)' 
        }}>
          <ShoppingBag size={45} color={activeTheme.buttonBg} style={{ marginBottom: '10px', opacity: 0.6 }} />
          <p style={{ fontSize: 'var(--font-h2)', color: activeTheme.text, fontWeight: '500', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
            Your bag is currently empty
          </p>
          <button 
            onClick={() => setView('home')} 
            style={{ 
              ...actionButtonStyle, 
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', 
              borderRadius: '14px', 
              padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px)', // 💡 FLUID PADDING
              border: 'none', 
              color: '#FFF', 
              fontSize: 'var(--font-body)',
              fontWeight: '600', 
              cursor: 'pointer', 
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)' 
            }}
          >
            Go to Menu
          </button>
        </div>
      ) : (
        // ------------------ POPULATED CART CONTAINER ------------------
        <div style={{ 
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          borderRadius: activeTheme.radius, 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
          boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)'
        }}>
          
          {/* ================= ITEM ROWS MAPPING ================= */}
          {safeCart.map((item, index) => (
            <div key={`${item.name}-${item.unit || 'default'}`} style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: index < safeCart.length - 1 ? `1px solid rgba(197, 160, 89, 0.2)` : 'none', 
              gap: '8px'
            }}>
              {/* 💡 BULLETPROOF FLEX: minWidth: 0 prevents long names from breaking layout */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  fontWeight: '700', 
                  fontSize: 'clamp(15px, 4vw, 18px)', // 💡 FLUID ITEM NAME
                  color: activeTheme.text, 
                  lineHeight: '1.2',
                  wordBreak: 'break-word'
                }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 'var(--font-caption)', color: '#FF5958', fontWeight: '600', marginTop: '2px' }}>
                  {item.unit ? String(item.unit).replace(/(\d+)([a-zA-Z]+)/g, '$1 $2') : ''}
                </span>
              </div>

              {/* 💡 BULLETPROOF FLEX: flexShrink: 0 ensures counters and prices never squish */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                
                {/* Quantity Controller Pill */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: 'rgba(197, 160, 89, 0.12)', 
                  borderRadius: '20px', 
                  padding: '3px 8px',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  gap: '4px'
                }}>
                  <button 
                    onClick={() => removeFromCart(item.name, item.unit)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#DC2626', fontWeight: '700', padding: '0 2px' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: activeTheme.text, minWidth: '16px', textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button 
                    onClick={() => addToCart(item)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color:'#059669', fontWeight: '700', padding: '0 2px' }}
                  >
                    +
                  </button>
                </div>

                {/* Item Line Total Price */}
                <span style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: activeTheme.brand, minWidth: '45px', textAlign: 'right' }}>
                  ₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}
                </span>

                {/* Remove Item Button */}
                <button 
                  onClick={() => removeFromCart(item.name, item.unit)} 
                  style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', transition: 'color 0.2s ease', flexShrink: 0 }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}

          {/* ============================================================== */}
          {/* 🏷️ LIVE COUPONS BANNER SECTION                                 */}
          {/* ============================================================== */}
          <div style={{ marginTop: '16px', marginBottom: '14px' }}>
            {!activeAppliedCoupon ? (
              <button 
                onClick={() => setIsCouponDrawerOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
                  borderRadius: '12px',
                  border: '1.5px dashed rgba(255, 89, 88, 0.6)',
                  backgroundColor: 'rgba(255, 89, 88, 0.04)',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <Tag size={16} color={activeTheme.brand} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-body)', fontWeight: '700', color: activeTheme.text, whiteSpace: 'nowrap' }}>
                    Apply Coupon
                  </span>
                  <span style={{
                    fontSize: 'clamp(9px, 2.5vw, 10px)', // 💡 FLUID BADGE
                    fontWeight: '800',
                    color: '#8A6D2B',
                    backgroundColor: 'rgba(197, 160, 89, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    flexShrink: 0
                  }}>
                    {coupons.length} Available
                  </span>
                </div>
                <ChevronRight size={18} color={activeTheme.brand} style={{ flexShrink: 0 }} />
              </button>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(8px, 2.5vw, 10px) clamp(10px, 3vw, 14px)',
                borderRadius: '12px',
                border: '1px solid #059669',
                backgroundColor: '#ECFDF5',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', minWidth: 0 }}>
                  <div style={{
                    backgroundColor: '#059669', borderRadius: '50%', width: '22px', height: '22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0'
                  }}>
                    <Check size={13} color="#FFFFFF" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--font-body)', fontWeight: '800', color: '#065F46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      '{activeAppliedCoupon.code}' Applied!
                    </div>
                    <div style={{ fontSize: 'var(--font-caption)', color: '#047857', fontWeight: '500' }}>
                      You saved ₹{discountAmount} on this order
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleRemove}
                  style={{
                    background: 'none', border: 'none', color: '#DC2626', fontSize: 'var(--font-caption)',
                    fontWeight: '700', cursor: 'pointer', padding: '4px', flexShrink: 0
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 🧾 BILL SUMMARY BREAKDOWN SUB-SECTION                          */}
          {/* ============================================================== */}
          <div style={{ borderTop: '1px dashed #FF5958', paddingTop: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-body)', color: '#78716C', fontWeight: '500', marginBottom: '8px' }}>
              <span>Item Total</span>
              <span style={{ color: activeTheme.text, fontWeight: '600' }}>₹{total}</span>
            </div>

            {activeAppliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-body)', color: '#059669', fontWeight: '600', marginBottom: '8px' }}>
                <span>Coupon Discount ({activeAppliedCoupon.discountPercent}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-body)', color: '#78716C', fontWeight: '500', marginBottom: '8px' }}>
              <span>Delivery Fee</span>
              <span style={{ fontSize: 'var(--font-caption)', color: activeTheme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Calculated next</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #FF5958', fontSize: 'clamp(15px, 4vw, 17px)', fontWeight: '700', color: activeTheme.text, marginBottom: '16px' }}>
              <span>Total Amount</span>
              <span style={{ color: activeTheme.brand }}>₹{grandTotal}</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: 'var(--font-caption)', color: '#78716C' }}>
                By proceeding, you agree to our{' '}
                <span 
                  onClick={() => setIsPolicyOpen(true)}
                  style={{ color: activeTheme.brand, cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
                >
                  Order Conditions
                </span>
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 🚀 ACTION BUTTONS (Proceed to Delivery & Continue Shopping)     */}
          {/* ============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={handleProceedToDelivery} 
              style={{ 
                ...actionButtonStyle, 
                background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                marginBottom: 0, 
                padding: 'clamp(12px, 3.5vw, 15px)', // 💡 FLUID PADDING
                fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '600', 
                borderRadius: '14px', 
                boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)' 
              }}
            >
              Proceed to Delivery • ₹{grandTotal}
            </button>
            <button 
              onClick={() => setView('home')} 
              style={{ 
                ...secondaryButtonStyle, 
                backgroundColor: 'rgba(197, 160, 89, 0.1)', 
                border: '1px solid rgba(197, 160, 89, 0.3)', 
                color: activeTheme.text, 
                marginBottom: 0, 
                padding: 'clamp(10px, 3vw, 12px)', 
                fontSize: 'var(--font-body)', 
                fontWeight: '600', 
                borderRadius: '14px' 
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 📋 COUPONS SELECTION BOTTOM SHEET DRAWER                             */}
      {/* ================================================================== */}
      {isCouponDrawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20, 15, 12, 0.82)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxHeight: '80vh',
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderTop: '1px solid rgba(197, 160, 89, 0.4)',
            padding: 'clamp(16px, 5vw, 24px)', // 💡 FLUID PADDING
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={18} color={activeTheme.brand} />
                <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 'var(--font-h2)', fontWeight: '700', color: activeTheme.text }}>
                  Available Coupons
                </h3>
              </div>
              <button 
                onClick={() => setIsCouponDrawerOpen(false)}
                style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}
              >
                <X size={16} color={activeTheme.text} />
              </button>
            </div>

            {/* List of Available Coupons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {coupons.map((coupon) => {
                const isSelected = activeAppliedCoupon?.code === coupon.code;
                const couponSaveAmount = Math.round((Number(total) * Number(coupon.discountPercent)) / 100);

                return (
                  <div 
                    key={coupon.code} 
                    style={{
                      padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
                      borderRadius: '14px',
                      border: isSelected ? '1.5px solid #059669' : '1px solid rgba(197, 160, 89, 0.3)',
                      backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      gap: '12px'
                    }}
                  >
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 'var(--font-caption)', fontWeight: '800', color: activeTheme.brand, letterSpacing: '0.5px' }}>
                        {coupon.tag}
                      </span>
                      <h4 style={{ margin: '2px 0 2px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: '700', color: activeTheme.text, wordBreak: 'break-word' }}>
                        {coupon.title} ({coupon.discountPercent}% OFF)
                      </h4>
                      <p style={{ margin: '0 0 4px 0', fontSize: 'var(--font-caption)', color: '#78716C' }}>
                        {coupon.description}
                      </p>
                      <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#059669' }}>
                        Saves ₹{couponSaveAmount} on current total
                      </span>
                    </div>

                    <button 
                      onClick={() => handleApply(coupon)}
                      style={{
                        backgroundColor: isSelected ? '#059669' : activeTheme.brand,
                        color: '#FFFFFF',
                        border: 'none',
                        padding: 'clamp(8px, 2.5vw, 10px) clamp(12px, 3.5vw, 16px)', // 💡 FLUID BUTTON
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: 'var(--font-caption)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {isSelected ? 'Applied' : 'APPLY'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 📜 POLICY / ORDER CONDITIONS MODAL                                 */}
      {/* ================================================================== */}
      <PolicyModal 
        isOpen={isPolicyOpen} 
        onClose={() => setIsPolicyOpen(false)} 
        title="Order Conditions" 
        theme={activeTheme}
      >
        <CartViewPolicyModalContent brandColor={activeTheme.brand} />
      </PolicyModal>
    </div>
  );
}