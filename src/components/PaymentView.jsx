import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

// --- CENTRALIZED APP CONFIGURATION (LOCAL PUBLIC PATHS) ---
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
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px',
    buttonBg: theme?.buttonBg || '#FF5958'
  };

  // Default selection to Google Pay on mount if none selected
  useEffect(() => {
    if (!upiApp) {
      setUpiApp('Google Pay');
      if (APP_CONFIG['Google Pay']) {
        setUpiId(APP_CONFIG['Google Pay'].vpa);
      }
    }
  }, [upiApp, setUpiApp, setUpiId]);

  // Absolute scroll wipe to force view to start at the top
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

  // Calculation logic for cart items and delivery
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

  // Function to handle launching native UPI apps directly
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

  // Triggers deep link + places order + opens track view
  const handlePaymentSubmit = () => {
    const selectedApp = upiApp || 'Google Pay';
    
    // 1. Set UPI Payment state
    setPayment('UPI');

    // 2. Execute Order Placement callback if available
    if (typeof onPlaceOrder === 'function') {
      onPlaceOrder();
    }

    // 3. Launch selected UPI App (Google Pay by default)
    handleAppLaunch(selectedApp);

    // 4. Navigate to live tracking
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
        width: '100%'
      }}
    >
      <div ref={topAnchorRef} style={{ height: 0, width: 0, overflow: 'hidden' }} />

      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('delivery')} 
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
          <ArrowLeft size={16}/> Delivery
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontSize: '16px', 
          color: activeTheme.brand, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Payment Method
        </h2>
      </div>

      {/* ================= MAIN CONTAINER CARD ================= */}
      <div style={{ 
        border: `1px solid ${activeTheme.brand}`, 
        borderRadius: activeTheme.radius, 
        background: '#FFFBF2', 
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box',
        width: '100%'
      }}>

        {/* Bill Summary Sub-Section */}
        <div style={{ borderBottom: `1px dashed ${activeTheme.brand}`, paddingBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#776E62', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', textAlign: 'left' }}>
            Bill Summary
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '6px' }}>
            <span>Items Total</span>
            <span>₹{Number(calculatedItemsTotal).toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#776E62', fontWeight: '500', marginBottom: '6px' }}>
            <span>Delivery Charges</span>
            <span style={{ fontSize: '12px', color: calculatedDeliveryFee === 0 ? '#059669' : activeTheme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {calculatedDeliveryFee === 0 ? 'FREE (₹0)' : `₹${calculatedDeliveryFee}`}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px dashed ${activeTheme.brand}`, fontSize: '16px', fontWeight: '700', color: activeTheme.text }}>
            <span>Grand Total</span>
            <span style={{ color: activeTheme.brand }}>₹{Number(calculatedGrandTotal).toFixed(2)}</span>
          </div>
        </div>

        {/* UPI App Selection */}
        <div style={{ 
          border: '1px solid rgba(0,0,0,0.08)', 
          borderRadius: '12px', 
          background: '#FFF9F2', 
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#776E62', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Tap to Select UPI App
            </span>
            <span style={{ color: '#059669', fontSize: '10px', background: '#ECFDF5', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>
              Auto-fills ₹{Number(calculatedGrandTotal).toFixed(2)}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
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
                    borderRadius: '10px',
                    border: isSelected ? `2px solid ${activeTheme.brand}` : '1px solid #D8C7A5',
                    background: isSelected ? '#FFF5F5' : '#FFFFFF',
                    boxShadow: isSelected ? '0 3px 8px rgba(255, 89, 88, 0.15)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 4px',
                    gap: '4px',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{ height: '32px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={APP_CONFIG[app].logo} 
                      alt={app} 
                      style={{ maxHeight: '36px', maxWidth: '80%', objectFit: 'contain' }} 
                    />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? activeTheme.brand : activeTheme.text, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {app} <ExternalLink size={9} color={isSelected ? activeTheme.brand : '#776E62'} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#7A6E65', fontStyle: 'italic' }}>
          <ShieldCheck size={14} color="#059669" />
          <span>Direct bank settlement</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
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
              border: 'none', 
              background: activeTheme.brand,
              color: '#FFFFFF',
              marginBottom: 0, 
              padding: '16px', 
              fontSize: '16px', 
              fontWeight: '700',
              borderRadius: activeTheme.radius, 
              width: '100%', 
              boxSizing: 'border-box', 
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.25)',
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
              background: '#FFFFFF',
              color: '#3B322C',
              border: '1.5px solid #D8C7A5',
              marginBottom: 0, 
              padding: '16px', 
              fontSize: '16px', 
              fontWeight: '700',
              borderRadius: activeTheme.radius, 
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