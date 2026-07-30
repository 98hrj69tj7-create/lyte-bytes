import React, { useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';

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
  theme,
  setView,
  payment = 'UPI',
  setPayment = () => {},
  upiApp,
  setUpiApp,
  upiId,
  setUpiId,
  setPressedBtn,
  getPressStyle,
  backButtonStyle,
  actionButtonStyle,
  secondaryButtonStyle,
  orderTotal = 0,
  cartTotal = 0,
  deliveryFee = 0,
  cart = [],
  total = 0,
  customer = {}
}) {
  const containerRef = useRef(null);
  const topAnchorRef = useRef(null);

  // Absolute scroll wipe to force view to start at the very top
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    // Backup timer to override late browser scroll restorations
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 10);
    return () => clearTimeout(t);
  }, []);

  // Robust calculations: accurately picking up delivery fee from props or customer object
  const calculatedItemsTotal = cartTotal || total || (Array.isArray(cart) ? cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0) : 0);
  
  const calculatedDeliveryFee = (() => {
    if (deliveryFee !== undefined && deliveryFee !== null && deliveryFee !== '' && Number(deliveryFee) > 0) {
      return Number(deliveryFee);
    }
    if (customer?.deliveryFee !== undefined && customer?.deliveryFee !== null && Number(customer.deliveryFee) > 0) {
      return Number(customer.deliveryFee);
    }
    if (customer?.deliveryMode === 'Self Pickup') {
      return 0;
    }
    return Number(deliveryFee) || Number(customer?.deliveryFee) || 0;
  })();

  const calculatedGrandTotal = (orderTotal !== undefined && orderTotal > 0 && orderTotal > calculatedItemsTotal) 
    ? orderTotal 
    : (Number(calculatedItemsTotal) + Number(calculatedDeliveryFee));

  // Function to handle opening the specific native UPI app directly
  const handleAppLaunch = (app) => {
    setUpiApp(app);
    const appData = APP_CONFIG[app];
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

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto', 
        flex: 1, 
        paddingBottom: '85px', 
        paddingTop: '2px',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Invisible anchor at absolute top to force scroll alignment */}
      <div ref={topAnchorRef} style={{ height: 0, width: 0, overflow: 'hidden' }} />

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 2fr auto', alignItems: 'center', marginBottom: '12px', gap: '4px' }}>
        <button onClick={() => setView('delivery')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start', whiteSpace: 'nowrap' }}>
          <ArrowLeft size={18}/> Back
        </button>
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '17px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600', whiteSpace: 'nowrap' }}>
          Payment Method
        </h2>
        <div style={{ width: '75px' }}></div>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: '1px solid #E53935', 
        borderRadius: '16px', 
        background: '#FFFBF2', 
        padding: '16px 14px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
        width: '100%'
      }}>

        {/* Quick Order Summary Breakdown */}
        <div style={{ background: '#FFF5F5', border: '1px dashed #E53935', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#E53935', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
            Bill Summary
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5A4A3E' }}>
            <span>Items Total</span>
            <span style={{ fontWeight: '600' }}>₹{Number(calculatedItemsTotal).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5A4A3E' }}>
            <span>Delivery Charges</span>
            <span style={{ fontWeight: '600' }}>{calculatedDeliveryFee === 0 ? 'FREE (₹0)' : `₹${calculatedDeliveryFee}`}</span>
          </div>
          <div style={{ borderTop: '1px solid #F5C6C6', marginTop: '4px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: '800', color: theme.brand }}>
            <span>Grand Total</span>
            <span>₹{Number(calculatedGrandTotal).toFixed(2)}</span>
          </div>
        </div>

        {/* Expanded UPI Apps & VPA Section */}
        <div style={{ 
          border: '1px solid rgba(0,0,0,0.08)', 
          borderRadius: '14px', 
          background: '#FFF9F2', 
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#E53935', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Tap to Launch & Pay
            </span>
            <span style={{ color: '#137333', fontSize: '10px', background: '#E6F4EA', padding: '2px 6px', borderRadius: '6px', fontWeight: '700' }}>
              Auto-fills ₹{Number(calculatedGrandTotal).toFixed(2)}
            </span>
          </div>
          
          {/* Uniform UPI App Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {Object.keys(APP_CONFIG).map((app) => (
              <button
                key={app}
                onClick={() => handleAppLaunch(app)}
                style={{
                  height: '78px',
                  borderRadius: '12px',
                  border: upiApp === app ? `2px solid ${theme.brand}` : '1px solid rgba(0,0,0,0.08)',
                  background: upiApp === app ? '#FFF5F5' : '#FFFBF2',
                  boxShadow: upiApp === app ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
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
                    style={{ 
                      maxHeight: '36px', 
                      maxWidth: '80%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#332E2B', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {app} <ExternalLink size={9} color={theme.brand} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#7A6E65', fontStyle: 'italic' }}>
          <ShieldCheck size={14} color="#137333" />
          <span>Direct bank settlement</span>
        </div>

        {/* Main Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '2px' }}>
          <button 
            onClick={() => { 
              setPayment('UPI');
              setView('track'); 
            }} 
            onMouseDown={() => setPressedBtn('place-order')}
            onMouseUp={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn('place-order')}
            onTouchEnd={() => setPressedBtn(null)}
            style={{ 
              ...actionButtonStyle, 
              ...getPressStyle('place-order'), 
              border: theme.border, 
              marginBottom: 0, 
              padding: '14px', 
              fontSize: '15px', 
              fontWeight: '600',
              borderRadius: theme.radius, 
              width: '100%', 
              boxSizing: 'border-box', 
              boxShadow: '0 4px 14px rgba(229, 57, 53, 0.25)'
            }}
          >
            Pay ₹{Number(calculatedGrandTotal).toFixed(2)} via UPI App
          </button>
          <button 
            onClick={() => setView('home')} 
            onMouseDown={() => setPressedBtn('continue-pay')}
            onMouseUp={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn('continue-pay')}
            onTouchEnd={() => setPressedBtn(null)}
            style={{ 
              ...secondaryButtonStyle, 
              ...getPressStyle('continue-pay'), 
              border: '1px solid rgba(0,0,0,0.12)', 
              background: '#FFFBF2',
              marginBottom: 0, 
              padding: '13px', 
              fontSize: '15px', 
              fontWeight: '600',
              borderRadius: theme.radius, 
              width: '100%', 
              boxSizing: 'border-box' 
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}