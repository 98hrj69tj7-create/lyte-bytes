import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, X, Tag, Check, Sparkles, ChevronRight } from 'lucide-react';
import PolicyModal from './PolicyModal';

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
  backButtonStyle = {},
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
    brand: theme?.brand || '#E53935',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #E0D3C1',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '12px',
    buttonBg: theme?.buttonBg || '#E53935'
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
      paddingBottom: '120px', 
      paddingTop: '5px',
      boxSizing: 'border-box' 
    }}>
      {/* ================= HEADER SECTION ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => setView('home')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start' }}>
          <ArrowLeft size={18}/> Menu
        </button>
        <h2 style={{ color: activeTheme.brand, margin: 0, fontSize: '17px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Your Bag</h2>
        <div style={{ width: '75px' }}></div>
      </div>

      {/* ================= EMPTY CART STATE ================= */}
      {safeCart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '30px 20px', border: '1px solid #E53935', borderRadius: activeTheme.radius, background: 'transparent' }}>
          <ShoppingBag size={40} color={activeTheme.buttonBg} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px', color: activeTheme.text, fontWeight: '400', marginBottom: '15px' }}>Your bag is empty</p>
          <button onClick={() => setView('home')} style={actionButtonStyle}>Go to Menu</button>
        </div>
      ) : (
        /* ================= POPULATED CART CONTAINER ================= */
        <div style={{ 
          border: '1px solid #E53935', 
          borderRadius: activeTheme.radius, 
          background: '#FFFBF2', 
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {/* Loop through cart items */}
          {safeCart.map((item, index) => (
            <div key={`${item.name}-${item.unit || 'default'}`} style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: index < safeCart.length - 1 ? `1px solid rgba(0,0,0,0.06)` : 'none', 
              gap: '12px'
            }}>
              {/* Left Side: Item Name & Unit Info */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left', padding: '2px' }}>
                <span style={{ fontWeight: '600', fontSize: '15px', color: activeTheme.text, lineHeight: '1.3' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '12px', color: '#776E62', fontWeight: '500', fontStyle: 'italic', marginTop: '1px' }}>
                  {item.unit}
                </span>
              </div>

              {/* Right Side Group: Counter, Price, and Delete Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, paddingTop: '2px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: '#EFECE6', 
                  borderRadius: '20px', 
                  gap: '3px',
                  padding: '1px 14px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  marginLeft: '14px',
                  marginRight: '-22px'
                }}>
                  <button 
                    onClick={() => removeFromCart(item.name, item.unit)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: activeTheme.text, fontWeight: '600', padding: '0 2px' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 6px', fontSize: '13px', fontWeight: '600', color: activeTheme.text, minWidth: '14px', textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button 
                    onClick={() => addToCart(item)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: activeTheme.brand, fontWeight: '600', padding: '0 2px' }}
                  >
                    +
                  </button>
                </div>

                <span style={{ fontWeight: '600', fontSize: '15px', color: activeTheme.brand, minWidth: '55px', textAlign: 'right', marginRight: '-10px', padding: '2px'}}>
                  ₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}
                </span>

                <button 
                  onClick={() => removeFromCart(item.name, item.unit)} 
                  style={{ background: 'none', border: 'none', color: activeTheme.brand, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', marginRight: '-9px' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* ================= LIVE COUPONS SECTION ================= */}
          <div style={{ marginTop: '16px', marginBottom: '12px' }}>
            {!activeAppliedCoupon ? (
              /* Trigger Button / Card to view coupons */
              <button 
                onClick={() => setIsCouponDrawerOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px dashed #E53935',
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
              /* Applied Coupon Banner */
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
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
            
            {/* Items Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '6px' }}>
              <span>Item Total</span>
              <span>₹{total}</span>
            </div>

            {/* Discount Row (Shown if coupon applied) */}
            {activeAppliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669', fontWeight: '600', marginBottom: '6px' }}>
                <span>Coupon Discount ({activeAppliedCoupon.discountPercent}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            {/* Delivery Fee Notice */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '6px' }}>
              <span>Delivery Fee</span>
              <span style={{ fontSize: '12px', color: activeTheme.brand, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Calculated next</span>
            </div>

            {/* Grand Total Amount */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px dashed ${activeTheme.brand}`, fontSize: '16px', fontWeight: '700', color: activeTheme.text, marginBottom: '16px' }}>
              <span>Total Amount</span>
              <span style={{ color: activeTheme.brand }}>₹{grandTotal}</span>
            </div>

            {/* Terms and Conditions Notice Link Trigger */}
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
            {/* Header */}
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

            {/* Coupons List */}
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

      {/* ================= POLICY BOTTOM SHEET MODAL ================= */}
      <PolicyModal 
        isOpen={isPolicyOpen} 
        onClose={() => setIsPolicyOpen(false)} 
        title="Order & Checkout Terms" 
        theme={activeTheme}
      >
        <p><strong>Advance Ordering & Cut-Off:</strong> All items are freshly prepared; orders must be placed in advance to ensure quality and availability.</p>
        <p><strong>Payment Terms:</strong> Full payment is required at checkout to confirm your order placement.</p>
        <p><strong>Cancellations & Refunds:</strong> Due to the perishable and fresh nature of our food, orders are non-cancellable and non-refundable once confirmed.</p>
        <p><strong>Modifications & Substitutions:</strong> Orders can be modified prior to dispatch. In rare cases of fresh ingredient shortages, minor substitutions or immediate item refunds may apply.</p>
        <p><strong>Fair Usage:</strong> We reserve the right to cancel or block accounts associated with fraudulent, unverified, or repeated fake bookings.</p>
      </PolicyModal>
    </div>
  );
}