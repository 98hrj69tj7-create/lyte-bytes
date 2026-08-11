import React, { useState } from 'react';
import { 
  ArrowLeft, ShoppingBag, X, Tag, Check, Sparkles, ChevronRight 
} from 'lucide-react';
import PolicyModal from './PolicyModal';
import { CartViewPolicyModalContent } from './PolicyContents';

// Default Live Coupons (Fallback if not passed via props)
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
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  
  // Internal state if parent component does not manage applied coupon state
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

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px',
    buttonBg: theme?.buttonBg || '#FF5958'
  };

  const safeCart = Array.isArray(cart) ? cart : [];

  // Calculate discount and grand total
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
      boxSizing: 'border-box' 
    }}>
      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '14px', 
            fontWeight: '700', 
            padding: '4px 8px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(0,0,0,0.04)', 
            zIndex: 1 
          }}
        >
          <ArrowLeft size={16}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontSize: '16px', 
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

      {/* ================= EMPTY CART STATE ================= */}
      {safeCart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '30px 20px', border: '1px solid #FF5958', borderRadius: activeTheme.radius, background: 'transparent' }}>
          <ShoppingBag size={40} color={activeTheme.buttonBg} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px', color: activeTheme.text, fontWeight: '400', marginBottom: '15px' }}>Your bag is empty</p>
          <button onClick={() => setView('home')} style={actionButtonStyle}>Go to Menu</button>
        </div>
      ) : (
        /* ================= POPULATED CART CONTAINER ================= */
        <div style={{ 
          border: '1px solid #FF5958', 
          borderRadius: activeTheme.radius, 
          background: '#FFFBF2', 
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {/* Loop through cart items */}
          {safeCart.map((item, index) => (
            <div key={`${item.name}-${item.unit || 'default'}`} style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: index < safeCart.length - 1 ? `1px solid rgba(0,0,0,0.06)` : 'none', 
              gap: '10px'
            }}>
              {/* Left Side: Item Name & Unit Info */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontWeight: '700', fontSize: '15px', color: activeTheme.text, lineHeight: '1.3' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '12px', color: '#776E62', fontWeight: '500', fontStyle: 'italic', marginTop: '2px' }}>
                  {item.unit}
                </span>
              </div>

              {/* Right Side Group: Counter, Price, and Delete Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* Quantity Controller Pill */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: '#EFECE6', 
                  borderRadius: '20px', 
                  padding: '2px 8px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  gap: '4px'
                }}>
                  <button 
                    onClick={() => removeFromCart(item.name, item.unit)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: activeTheme.text, fontWeight: '600', padding: '0 4px' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: activeTheme.text, minWidth: '16px', textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button 
                    onClick={() => addToCart(item)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: activeTheme.brand, fontWeight: '600', padding: '0 4px' }}
                  >
                    +
                  </button>
                </div>

                {/* Item Total Price */}
                <span style={{ fontWeight: '700', fontSize: '15px', color: activeTheme.brand, minWidth: '50px', textAlign: 'right' }}>
                  ₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}
                </span>

                {/* Remove Item Icon */}
                <button 
                  onClick={() => removeFromCart(item.name, item.unit)} 
                  style={{ background: 'none', border: 'none', color: activeTheme.brand, cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* ================= LIVE COUPONS SECTION ================= */}
          <div style={{ marginTop: '16px', marginBottom: '12px' }}>
            {!activeAppliedCoupon ? (
              <button 
                onClick={() => setIsCouponDrawerOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px dashed #FF5958',
                  backgroundColor: '#FFF5F5',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} color={activeTheme.brand} />
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: activeTheme.text }}>
                    Apply Coupon
                  </span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    color: '#854D0E',
                    backgroundColor: '#FEF3C7',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {coupons.length} Available
                  </span>
                </div>
                <ChevronRight size={18} color={activeTheme.brand} />
              </button>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #059669',
                backgroundColor: '#ECFDF5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                  <div style={{
                    backgroundColor: '#059669',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={14} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#065F46' }}>
                      '{activeAppliedCoupon.code}' Applied!
                    </div>
                    <div style={{ fontSize: '11px', color: '#047857', fontWeight: '500' }}>
                      You saved ₹{discountAmount} on this order
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleRemove}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ================= BILL SUMMARY SUB-SECTION ================= */}
          <div style={{ borderTop: `1px solid ${activeTheme.brand}`, paddingTop: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '6px' }}>
              <span>Item Total</span>
              <span>₹{total}</span>
            </div>

            {activeAppliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669', fontWeight: '600', marginBottom: '6px' }}>
                <span>Coupon Discount ({activeAppliedCoupon.discountPercent}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '6px' }}>
              <span>Delivery Fee</span>
              <span style={{ fontSize: '12px', color: activeTheme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Calculated next</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px dashed ${activeTheme.brand}`, fontSize: '16px', fontWeight: '700', color: activeTheme.text, marginBottom: '16px' }}>
              <span>Total Amount</span>
              <span style={{ color: activeTheme.brand }}>₹{grandTotal}</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: '#776E62' }}>
                By proceeding, you agree to our{' '}
                <span 
                  onClick={() => setIsPolicyOpen(true)}
                  style={{ 
                    color: activeTheme.brand, 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    textDecoration: 'underline' 
                  }}
                >
                  Order Conditions
                </span>
              </span>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleProceedToDelivery} style={{ ...actionButtonStyle, marginBottom: 0, padding: '14px', fontSize: '16px', borderRadius: activeTheme.radius }}>
              Proceed to Delivery • ₹{grandTotal}
            </button>
            <button onClick={() => setView('home')} style={{ ...secondaryButtonStyle, marginBottom: 0, padding: '14px', fontSize: '16px', borderRadius: activeTheme.radius }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* ================= COUPONS SELECTION BOTTOM SHEET ================= */}
      {isCouponDrawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxHeight: '80vh',
            backgroundColor: '#FFFDF9',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={18} color={activeTheme.brand} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: activeTheme.text }}>Available Coupons</h3>
              </div>
              <button 
                onClick={() => setIsCouponDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} color={activeTheme.text} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {coupons.map((coupon) => {
                const isSelected = activeAppliedCoupon?.code === coupon.code;
                const couponSaveAmount = Math.round((Number(total) * Number(coupon.discountPercent)) / 100);

                return (
                  <div 
                    key={coupon.code} 
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #059669' : '1px dashed #D8C7A5',
                      backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ textAlign: 'left', flex: 1, paddingRight: '10px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: activeTheme.brand, letterSpacing: '0.5px' }}>
                        {coupon.tag}
                      </span>
                      <h4 style={{ margin: '2px 0 2px 0', fontSize: '14.5px', fontWeight: '700', color: activeTheme.text }}>
                        {coupon.title} ({coupon.discountPercent}% OFF)
                      </h4>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11.5px', color: '#776E62' }}>
                        {coupon.description}
                      </p>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669' }}>
                        Saves ₹{couponSaveAmount} on current total
                      </span>
                    </div>

                    <button 
                      onClick={() => handleApply(coupon)}
                      style={{
                        backgroundColor: isSelected ? '#059669' : activeTheme.brand,
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        flexShrink: 0
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

      {/* ================= POLICY BOTTOM SHEET MODAL (USING SHARED CONTENT) ================= */}
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