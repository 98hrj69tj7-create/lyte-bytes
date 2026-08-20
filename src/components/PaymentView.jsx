import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

const APP_CONFIG = {
  'Google Pay': {
    logo: '/logos/gpay.png',
    vpa: 'rosemarycloney-3@okicici',
    getScheme: (params) => `tez://upi/pay?${params}`
  },
  'PhonePe': {
    logo: '/logos/phonepe.png',
    vpa: 'florianfrancis@ibl',
    getScheme: (params) => `phonepe://pay?${params}`
  },
  'Paytm': {
    logo: '/logos/paytm.png',
    vpa: '9108286886@ptaxis',
    getScheme: (params) => `paytmmp://pay?${params}`
  }
};

export default function PaymentView({
  theme = {},
  setView,
  payment = 'UPI',
  setPayment = () => {},
  upiApp,
  setUpiApp = () => {},
  upiId,
  setUpiId = () => {},
  setPressedBtn = () => {},
  getPressStyle = () => ({}),
  backButtonStyle = {},
  actionButtonStyle = {},
  secondaryButtonStyle = {},
  orderTotal = 0,
  cartTotal = 0,
  deliveryFee = 0,
  cart = [],
  total = 0,
  customer = {},
  onPlaceOrder
}) {
  const containerRef = useRef(null);
  const topAnchorRef = useRef(null);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(16px, 4vw, 20px)', // 💡 FLUID RADIUS
    buttonBg: theme?.buttonBg || '#FF5958'
  };

  useEffect(() => {
    if (!upiApp) {
      setUpiApp('Google Pay');
      if (APP_CONFIG['Google Pay']) {
        setUpiId(APP_CONFIG['Google Pay'].vpa);
      }
    }
  }, [upiApp, setUpiApp, setUpiId]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 10);
    return () => clearTimeout(t);
  }, []);

  const calculatedItemsTotal = cartTotal || total || (Array.isArray(cart) ? cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0) : 0);
  
  const calculatedDeliveryFee = (() => {
    if (deliveryFee !== undefined && deliveryFee !== null && deliveryFee !== '' && Number(deliveryFee) > 0) {
      return Number(deliveryFee);
    }
    if (customer?.deliveryFee !== undefined && customer?.deliveryFee !== null && Number(customer.deliveryFee) > 0) {
      return Number(customer.deliveryFee);
    }
    if (customer?.fulfillmentType === 'PICKUP' || customer?.deliveryMode === 'Self Pickup') {
      return 0;
    }
    return Number(deliveryFee) || Number(customer?.deliveryFee) || 0;
  })();

  const calculatedGrandTotal = (orderTotal !== undefined && orderTotal > 0 && orderTotal > calculatedItemsTotal) 
    ? orderTotal 
    : (Number(calculatedItemsTotal) + Number(calculatedDeliveryFee));

  const handleAppLaunch = (app) => {
    const targetApp = app || 'Google Pay';
    setUpiApp(targetApp);
    const appData = APP_CONFIG[targetApp];
    if (!appData) return;

    setUpiId(appData.vpa);

    const payeeName = "Lyte Store";
    const queryParams = new URLSearchParams({
      pa: appData.vpa,
      pn: payeeName,
      am: Number(calculatedGrandTotal).toFixed(2),
      cu: 'INR'
    }).toString();

    const specificAppUri = appData.getScheme(queryParams);
    const genericUpiUri = `upi://pay?${queryParams}`;

    window.location.href = specificAppUri;

    const fallbackTimer = setTimeout(() => {
      if (!document.hidden) {
        window.location.href = genericUpiUri;
      }
    }, 1200);

    window.addEventListener('pagehide', () => clearTimeout(fallbackTimer), { once: true });
  };

  const handlePaymentSubmit = () => {
    const selectedApp = upiApp || 'Google Pay';
    setPayment('UPI');

    if (typeof onPlaceOrder === 'function') {
      onPlaceOrder();
    }

    handleAppLaunch(selectedApp);
    setView('track');
  };

  const currentSelectedApp = upiApp || 'Google Pay';

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto', 
        flex: 1, 
        paddingBottom: '140px', 
        paddingTop: '6px',
        boxSizing: 'border-box',
        width: '100%',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div ref={topAnchorRef} style={{ height: 0, width: 0, overflow: 'hidden' }} />

      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0', gap: '8px' }}>
        <button 
          onClick={() => setView('delivery')} 
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
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={15} style={{ flexShrink: 0 }}/> Delivery
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
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingLeft: '80px',
          paddingRight: '80px'
        }}>
          Payment
        </h2>
      </div>

      {/* ================= MAIN CONTAINER CARD ================= */}
      <div style={{ 
        border: '1px solid rgba(197, 160, 89, 0.4)', 
        borderRadius: activeTheme.radius, 
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
        padding: 'clamp(14px, 4vw, 18px)', // 💡 FLUID PADDING
        boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0
      }}>

        {/* Bill Summary Sub-Section */}
        <div style={{ borderBottom: '1px solid rgba(197, 160, 89, 0.35)', paddingBottom: '12px', minWidth: 0 }}>
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', textAlign: 'left' }}>
            Bill Summary
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', marginBottom: '8px', minWidth: 0, gap: '8px' }}>
            <span style={{ whiteSpace: 'nowrap' }}>Items Total</span>
            <span style={{ color: activeTheme.text, fontWeight: '600', whiteSpace: 'nowrap' }}>₹{Number(calculatedItemsTotal).toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', marginBottom: '8px', minWidth: 0, gap: '8px' }}>
            <span style={{ whiteSpace: 'nowrap' }}>Delivery Charges</span>
            <span style={{ fontSize: '11.5px', color: calculatedDeliveryFee === 0 ? '#059669' : activeTheme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
              {calculatedDeliveryFee === 0 ? 'FREE (₹0)' : `₹${calculatedDeliveryFee}`}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed rgba(197, 160, 89, 0.4)', fontSize: 'clamp(15px, 4vw, 16px)', fontWeight: '700', color: activeTheme.text, minWidth: 0, gap: '8px' }}>
            <span style={{ whiteSpace: 'nowrap' }}>Grand Total</span>
            <span style={{ color: activeTheme.brand, whiteSpace: 'nowrap' }}>₹{Number(calculatedGrandTotal).toFixed(2)}</span>
          </div>
        </div>

        {/* UPI App Selection */}
        <div style={{ 
          border: '1px solid rgba(197, 160, 89, 0.3)', 
          borderRadius: '14px', 
          background: '#FFFFFF', 
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          textAlign: 'left',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Tap to Select UPI App
            </span>
            <span style={{ color: '#059669', fontSize: '10.5px', background: '#ECFDF5', padding: '2px 8px', borderRadius: '8px', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Auto-fills ₹{Number(calculatedGrandTotal).toFixed(2)}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', boxSizing: 'border-box' }}>
            {Object.keys(APP_CONFIG).map((app) => {
              const isSelected = currentSelectedApp === app;
              return (
                <button
                  key={app}
                  type="button"
                  onClick={() => {
                    setUpiApp(app);
                    setUpiId(APP_CONFIG[app].vpa);
                  }}
                  style={{
                    height: '78px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                    background: isSelected ? '#FFF5F5' : '#FFFDF9',
                    boxShadow: isSelected ? '0 3px 8px rgba(255, 89, 88, 0.15)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 4px',
                    gap: '4px',
                    transition: 'all 0.18s ease',
                    boxSizing: 'border-box',
                    minWidth: 0
                  }}
                >
                  <div style={{ height: '32px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
                    <img 
                      src={APP_CONFIG[app].logo} 
                      alt={app} 
                      style={{ maxHeight: '36px', maxWidth: '80%', objectFit: 'contain' }} 
                    />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? activeTheme.brand : activeTheme.text, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '2px', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                    {app} <ExternalLink size={9} color={isSelected ? activeTheme.brand : '#78716C'} style={{ flexShrink: 0 }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: 'var(--font-caption)', color: '#78716C', fontStyle: 'italic', fontWeight: '500' }}>
          <ShieldCheck size={14} color="#059669" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap' }}>Direct bank settlement</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px', boxSizing: 'border-box' }}>
          <button 
            type="button"
            onClick={handlePaymentSubmit} 
            onMouseDown={() => setPressedBtn('place-order')}
            onMouseUp={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn('place-order')}
            onTouchEnd={() => setPressedBtn(null)}
            style={{ 
              ...actionButtonStyle, 
              ...(getPressStyle ? getPressStyle('place-order') : {}), 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
              color: '#FFFFFF',
              marginBottom: 0, 
              padding: '14px', 
              fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
              fontWeight: '600',
              borderRadius: '14px', 
              width: '100%', 
              boxSizing: 'border-box', 
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)',
              cursor: 'pointer'
            }}
          >
            Pay ₹{Number(calculatedGrandTotal).toFixed(2)} via {currentSelectedApp}
          </button>
          
          <button 
            type="button"
            onClick={() => setView('home')} 
            onMouseDown={() => setPressedBtn('continue-pay')}
            onMouseUp={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn('continue-pay')}
            onTouchEnd={() => setPressedBtn(null)}
            style={{ 
              ...secondaryButtonStyle, 
              ...(getPressStyle ? getPressStyle('continue-pay') : {}), 
              backgroundColor: 'rgba(197, 160, 89, 0.1)',
              color: activeTheme.text,
              border: '1px solid rgba(197, 160, 89, 0.3)',
              marginBottom: 0, 
              padding: '12px', 
              fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
              fontWeight: '600',
              borderRadius: '14px', 
              width: '100%', 
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}