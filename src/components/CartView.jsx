import React from 'react';
import { ArrowLeft, ShoppingBag, X } from 'lucide-react';

export default function CartView({
  setView,
  backButtonStyle,
  theme,
  cart,
  removeFromCart,
  addToCart,
  total,
  handleProceedToDelivery,
  actionButtonStyle,
  secondaryButtonStyle
}) {
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
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '18px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Your Bag</h2>
        <div style={{ width: '75px' }}></div>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '30px 20px', border: theme.border, borderRadius: theme.radius, background: 'transparent' }}>
          <ShoppingBag size={40} color={theme.buttonBg} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', color: theme.text, fontWeight: '600', marginBottom: '15px' }}>Your bag is empty</p>
          <button onClick={() => setView('home')} style={actionButtonStyle}>Go to Menu</button>
        </div>
      ) : (
        <div style={{ 
          border: theme.border, 
          borderRadius: theme.radius, 
          background: '#FFFBF2', 
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {cart.map((item, index) => (
            <div key={`${item.name}-${item.unit}`} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: index < cart.length - 1 ? `1px dashed #E5D6B5` : 'none', 
              gap: '12px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontWeight: '700', fontSize: '15px', color: theme.text, lineHeight: '1.3' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '12px', color: '#776E62', fontWeight: '600', fontStyle: 'italic', marginTop: '2px' }}>
                  {item.unit}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: theme.border, borderRadius: '8px', overflow: 'hidden', background: theme.bg }}>
                  <button onClick={() => removeFromCart(item.name)} style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', color: theme.brand, fontWeight: 'bold' }}>-</button>
                  <span style={{ padding: '0 2px', fontSize: '13px', fontWeight: '700', color: theme.text, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => addToCart(item)} style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', color: '#2D8A56', fontWeight: 'bold' }}>+</button>
                </div>

                <span style={{ fontWeight: '700', fontSize: '15px', color: theme.brand, minWidth: '50px', textAlign: 'right' }}>
                  ₹{(item.price || 0) * item.qty}
                </span>

                <button onClick={() => removeFromCart(item.name)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${theme.brand}`, marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '8px' }}>
              <span>Item Total</span>
              <span>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '12px' }}>
              <span>Delivery Fee</span>
              <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Calculated next</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px dashed ${theme.brand}`, fontSize: '16px', fontWeight: '800', color: theme.text, marginBottom: '20px' }}>
              <span>Total Amount</span>
              <span style={{ color: theme.brand }}>₹{total}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleProceedToDelivery} style={{ ...actionButtonStyle, marginBottom: 0, padding: '14px', fontSize: '16px', borderRadius: theme.radius }}>
              Proceed to Delivery
            </button>
            <button onClick={() => setView('home')} style={{ ...secondaryButtonStyle, marginBottom: 0, padding: '14px', fontSize: '16px', borderRadius: theme.radius }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}