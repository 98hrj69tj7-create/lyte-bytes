import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, X } from 'lucide-react';
import PolicyModal from './PolicyModal';

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
  secondaryButtonStyle = {}
}) {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const activeTheme = {
    brand: theme?.brand || '#E53935',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #E0D3C1',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '12px',
    buttonBg: theme?.buttonBg || '#E53935'
  };

  const safeCart = Array.isArray(cart) ? cart : [];

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
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => setView('home')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start' }}>
          <ArrowLeft size={18}/> Menu
        </button>
        <h2 style={{ color: activeTheme.brand, margin: 0, fontSize: '17px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Your Bag</h2>
        <div style={{ width: '75px' }}></div>
      </div>

      {safeCart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '30px 20px', border: '1px solid #E53935', borderRadius: activeTheme.radius, background: 'transparent' }}>
          <ShoppingBag size={40} color={activeTheme.buttonBg} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', color: activeTheme.text, fontWeight: '600', marginBottom: '15px' }}>Your bag is empty</p>
          <button onClick={() => setView('home')} style={actionButtonStyle}>Go to Menu</button>
        </div>
      ) : (
        <div style={{ 
          border: '1px solid #E53935', 
          borderRadius: activeTheme.radius, 
          background: '#FFFBF2', 
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {safeCart.map((item, index) => (
            <div key={`${item.name}-${item.unit || 'default'}`} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: index < safeCart.length - 1 ? `1px solid rgba(0,0,0,0.06)` : 'none', 
              gap: '12px'
            }}>
              {/* Left: Name & Unit */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontWeight: '600', fontSize: '15px', color: activeTheme.text, lineHeight: '1.3' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '12px', color: '#776E62', fontWeight: '500', fontStyle: 'italic', marginTop: '2px' }}>
                  {item.unit}
                </span>
              </div>

              {/* Right Group: Instagram-style Pill Counter Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: '#EFECE6', 
                  borderRadius: '20px', 
                  padding: '4px 10px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <button 
                    onClick={() => removeFromCart(item.name, item.unit)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: activeTheme.text, fontWeight: '600', padding: '0 4px' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: '700', color: activeTheme.text, minWidth: '16px', textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button 
                    onClick={() => addToCart(item)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: activeTheme.brand, fontWeight: '600', padding: '0 4px' }}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <span style={{ fontWeight: '700', fontSize: '15px', color: activeTheme.brand, minWidth: '55px', textAlign: 'right' }}>
                  ₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}
                </span>

                {/* Delete Icon Button */}
                <button 
                  onClick={() => removeFromCart(item.name, item.unit)} 
                  style={{ background: 'none', border: 'none', color: activeTheme.text, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', opacity: 0.5 }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${activeTheme.brand}`, marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '8px' }}>
              <span>Item Total</span>
              <span>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '12px' }}>
              <span>Delivery Fee</span>
              <span style={{ fontSize: '11px', color: activeTheme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Calculated next</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px dashed ${activeTheme.brand}`, fontSize: '16px', fontWeight: '800', color: activeTheme.text, marginBottom: '16px' }}>
              <span>Total Amount</span>
              <span style={{ color: activeTheme.brand }}>₹{total}</span>
            </div>

            {/* Terms and Conditions Notice Link */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11.5px', color: '#776E62' }}>
                By proceeding, you agree to our{' '}
                <span 
                  onClick={() => setIsPolicyOpen(true)}
                  style={{ 
                    color: activeTheme.brand, 
                    cursor: 'pointer', 
                    fontWeight: '700',
                    textDecoration: 'underline' 
                  }}
                >
                  Order Conditions
                </span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleProceedToDelivery} style={{ ...actionButtonStyle, marginBottom: 0, padding: '14px', fontSize: '16px', borderRadius: activeTheme.radius }}>
              Proceed to Delivery
            </button>
            <button onClick={() => setView('home')} style={{ ...secondaryButtonStyle, marginBottom: 0, padding: '14px', fontSize: '16px', borderRadius: activeTheme.radius }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Policy Bottom Sheet Modal */}
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