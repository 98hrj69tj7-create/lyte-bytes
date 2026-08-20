import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  ArrowLeft, ShoppingBag, X, Tag, Check, Sparkles, ChevronRight, 
  Space,
  Ticket,
  AlertCircle
} from 'lucide-react';
import PolicyModal from './PolicyModal';
import { CartViewPolicyModalContent } from './PolicyContents';
import { getAllOffers } from '../utils/offersEngine'; // 💡 Syncs coupons with your active offer engine flags

// ============================================================================
// 🎫 DEFAULT COUPONS DATA STRUCTURE (Fallback)
// ============================================================================
const DEFAULT_COUPONS = [];

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
  const [couponError, setCouponError] = useState(null);

  const activeAppliedCoupon = externalAppliedCoupon !== undefined ? externalAppliedCoupon : internalAppliedCoupon;

  // 💡 Robust helper to extract minimum order value from properties, text, or code fallback
  const extractMinOrder = (coupon) => {
    if (!coupon) return 0;
    if (coupon.minOrderValue !== undefined && !isNaN(Number(coupon.minOrderValue))) return Number(coupon.minOrderValue);
    if (coupon.minAmount !== undefined && !isNaN(Number(coupon.minAmount))) return Number(coupon.minAmount);
    
    const textToCheck = `${coupon.description || ''} ${coupon.title || ''} ${coupon.tag || ''} ${coupon.code || ''}`;
    const match = textToCheck.match(/(?:min\.?\s*order\s*(?:value)?|above)\s*₹?(\d+)/i) || textToCheck.match(/min[^\d]*(\d+)/i);
    if (match && match[1]) {
      return Number(match[1]);
    }

    // Fallback rule for known promotional codes if no explicit min order is in text
    const codeUpper = (coupon.code || '').toUpperCase();
    if (codeUpper.includes('ANNI')) return 499; 

    return 0;
  };

  // 💡 Fetch active store offers dynamically from your engine
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const activeStoreOffers = getAllOffers(currentCount).map(offer => ({
    code: offer.code,
    title: offer.title,
    discountPercent: parseInt(offer.discount) || 0,
    tag: offer.tag,
    description: offer.description,
    minOrderValue: extractMinOrder(offer)
  }));
  
  const displayCoupons = (coupons === DEFAULT_COUPONS ? activeStoreOffers : coupons).map(c => ({
    ...c,
    minOrderValue: extractMinOrder(c)
  }));

  // 💡 Validate active coupon against current cart total
  const activeMinOrder = extractMinOrder(activeAppliedCoupon);
  const isCouponValid = !activeAppliedCoupon || activeMinOrder === 0 || Number(total) >= activeMinOrder;

  const handleApply = (coupon) => {
    const minReq = extractMinOrder(coupon);
    if (minReq > 0 && Number(total) < minReq) {
      setCouponError(`Minimum order value of ₹${minReq} required for ${coupon.code}`);
      return; // 💡 Strictly block application
    }

    setCouponError(null);
    if (externalOnApplyCoupon) {
      externalOnApplyCoupon(coupon);
    } else {
      setInternalAppliedCoupon(coupon);
    }
    setIsCouponDrawerOpen(false);
  };

  const handleRemove = () => {
    setCouponError(null);
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
  // 🧮 DISCOUNT & TOTAL CALCULATIONS (Zeroes out if condition isn't met)
  // ============================================================================
  const discountAmount = (activeAppliedCoupon && isCouponValid)
    ? Math.round((Number(total) * (Number(activeAppliedCoupon.discountPercent) || 0)) / 100)
    : 0;

  const grandTotal = Math.max(0, Number(total) - discountAmount);

  const handleProceedClick = () => {
    if (activeAppliedCoupon && !isCouponValid) {
      setCouponError(`Cannot proceed: ${activeAppliedCoupon.code} requires a minimum order of ₹${activeMinOrder}`);
      return;
    }
    localStorage.setItem('lyte_checkout_summary', JSON.stringify({
      discountAmount: discountAmount,
      couponCode: (activeAppliedCoupon && isCouponValid) ? activeAppliedCoupon.code : null,
      couponPercent: (activeAppliedCoupon && isCouponValid) ? activeAppliedCoupon.discountPercent : 0
    }));
    handleProceedToDelivery();
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
            fontSize: 'var(--font-caption)', 
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
          fontSize: 'var(--font-h2)', 
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
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'clamp(60px, 15vh, 100px)', 
          padding: 'clamp(20px, 5vw, 25px)', 
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
              padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px)', 
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
        <div style={{ 
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          borderRadius: activeTheme.radius, 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          padding: 'clamp(12px, 3.5vw, 16px)', 
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
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ 
                  fontFamily: "sans-serif", 
                  fontWeight: '700', 
                  fontSize: 'clamp(16px, 4vw, 20px)', 
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
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

                <span style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: activeTheme.brand, minWidth: '45px', textAlign: 'right' }}>
                  ₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}
                </span>

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
          {/* 🏷️ LIVE COUPONS BANNER & CONDITION WARNING SECTION             */}
          {/* ============================================================== */}
          <div style={{ marginTop: '16px', marginBottom: '14px' }}>
            {couponError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #DC2626',
                backgroundColor: '#FEF2F2',
                marginBottom: '10px',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left', minWidth: 0 }}>
                  <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#991B1B', wordBreak: 'break-word' }}>
                    {couponError}
                  </span>
                </div>
                <button 
                  onClick={() => setCouponError(null)}
                  style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {!activeAppliedCoupon ? (
              <button 
                onClick={() => setIsCouponDrawerOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 16px)', 
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
                    fontSize: 'clamp(9px, 2.5vw, 10px)', 
                    fontWeight: '800',
                    color: '#8A6D2B',
                    backgroundColor: 'rgba(197, 160, 89, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    flexShrink: 0
                  }}>
                    {displayCoupons.length} Available
                  </span>
                </div>
                <ChevronRight size={18} color={activeTheme.brand} style={{ flexShrink: 0 }} />
              </button>
            ) : isCouponValid ? (
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
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 16px)',
                borderRadius: '12px',
                border: '1.5px solid #DC2626',
                backgroundColor: '#FEF2F2',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', minWidth: 0 }}>
                  <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--font-body)', fontWeight: '800', color: '#991B1B', wordBreak: 'break-word' }}>
                      '{activeAppliedCoupon.code}' requires min. ₹{activeMinOrder}!
                    </div>
                    <div style={{ fontSize: 'var(--font-caption)', color: '#B91C1C', fontWeight: '500' }}>
                      Add ₹{activeMinOrder - Number(total)} more to unlock this offer.
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleRemove}
                  style={{
                    background: '#DC2626', border: 'none', color: '#FFFFFF', fontSize: 'var(--font-caption)',
                    fontWeight: '700', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', flexShrink: 0
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

            {activeAppliedCoupon && isCouponValid && (
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
          {/* 🚀 ACTION BUTTONS                                              */}
          {/* ============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={handleProceedClick} 
              style={{ 
                ...actionButtonStyle, 
                background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                marginBottom: 10, 
                padding: 'clamp(12px, 3.5vw, 15px)', 
                fontSize: 'var(--font-body)', 
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
      {/* 📋 AVAILABLE COUPONS PORTAL MODAL                                  */}
      {/* ================================================================== */}
      {isCouponDrawerOpen && ReactDOM.createPortal(
        <div 
          onClick={() => setIsCouponDrawerOpen(false)}
          style={{
            position: 'fixed', 
            inset: 0,
            width: '100vw',
            height: '100dvh',
            backgroundColor: 'rgba(20, 15, 12, 0.8)', 
            backdropFilter: 'blur(8px)', 
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 99999, 
            padding: '20px', 
            boxSizing: 'border-box',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
              borderRadius: 'clamp(20px, 5vw, 28px)', 
              padding: 'clamp(16px, 4vw, 22px)',     
              maxWidth: '520px', 
              width: '100%', 
              maxHeight: '82vh',
              boxSizing: 'border-box',
              position: 'relative', 
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
              border: '1px solid rgba(197, 160, 89, 0.5)',
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden'
            }}
          >
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingBottom: '16px',
              marginBottom: '2px',
              flexShrink: 0,
              gap: '8px',
              minWidth: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Ticket size={22} color={activeTheme.brand} style={{ flexShrink: 0 }} />
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  fontSize: 'clamp(18px, 4.5vw, 22px)', 
                  fontWeight: '700', 
                  color: activeTheme.brand, 
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0
                }}>
                  Available Coupons
                </h3>
              </div>
              <button
                onClick={() => setIsCouponDrawerOpen(false)}
                style={{
                  background: 'rgba(197, 160, 89, 0.15)',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#1A1816',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              boxSizing: 'border-box',
              textAlign: 'left',
              paddingRight: '4px',
              minWidth: 0
            }}>
              {displayCoupons.map((coupon) => {
                const isSelected = activeAppliedCoupon?.code === coupon.code && isCouponValid;
                const couponMinOrder = extractMinOrder(coupon);
                const isMet = couponMinOrder === 0 || Number(total) >= couponMinOrder;
                const couponSaveAmount = isMet ? Math.round((Number(total) * Number(coupon.discountPercent)) / 100) : 0;
                const shortFall = Math.max(0, couponMinOrder - Number(total));

                return (
                  <div 
                    key={coupon.code} 
                    style={{
                      padding: 'clamp(12px, 3.5vw, 16px)',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid #059669' : '1px solid rgba(197, 160, 89, 0.35)',
                      backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(44, 34, 30, 0.04)',
                      gap: '12px',
                      boxSizing: 'border-box',
                      opacity: isMet ? 1 : 0.75
                    }}
                  >
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 'var(--font-caption)', fontWeight: '800', color: activeTheme.brand, letterSpacing: '0.5px' }}>
                        {coupon.tag}
                      </span>
                      <h4 style={{ margin: '3px 0 3px 0', fontFamily: "sans-serif", fontSize: 'clamp(12px, 4.5vw, 15px)', fontWeight: '700', color: activeTheme.text, wordBreak: 'break-word' }}>
                        {coupon.title} ({coupon.discountPercent}% OFF)
                      </h4>
                      <p style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500' }}>
                        {coupon.description}
                      </p>
                      <p style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '800', marginTop:'0px' }}>
                        {couponMinOrder > 0 && `(Min. order ₹${couponMinOrder})`}
                      </p>
                      
                      {isMet ? (
                        <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#059669' }}>
                          Saves ₹{couponSaveAmount} on current total
                        </span>
                      ) : (
                        <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#DC2626' }}>
                          Add ₹{shortFall} more to unlock this
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => isMet && handleApply(coupon)}
                      disabled={!isMet}
                      style={{
                        backgroundColor: isSelected ? '#059669' : (isMet ? activeTheme.brand : '#D1D5DB'),
                        color: '#FFFFFF',
                        border: 'none',
                        padding: 'clamp(8px, 2.5vw, 10px) clamp(14px, 4vw, 16px)',
                        borderRadius: '12px',
                        fontWeight: '700',
                        marginTop:'75px',
                        fontSize: 'var(--font-caption)',
                        cursor: isMet ? 'pointer' : 'not-allowed',
                        flexShrink: 0,
                        boxShadow: isMet ? '0 3px 10px rgba(255, 89, 88, 0.25)' : 'none',
                        alignSelf: 'center'
                      }}
                    >
                      {isSelected ? 'Applied' : (isMet ? 'APPLY' : 'LOCKED')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
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