import React from 'react';
import { ArrowLeft } from 'lucide-react';

// Centralized App Configurations with custom URI schemes and VPAs
const APP_CONFIG = {
  'Google Pay': {
    vpa: 'rosemarycloney-3@okicici',
    getScheme: (params) => `tez://upi/pay?${params}` // Tez scheme for GPay
  },
  'PhonePe': {
    vpa: '9108286886@ybl', // Verify handle suffix (@ybl / @ibl / @axl)
    getScheme: (params) => `phonepe://pay?${params}`
  },
  'Paytm': {
    vpa: '9108286886@ptaxis',
    getScheme: (params) => `paytmmp://pay?${params}`
  }
};

export default function PaymentView({
  theme,
  setView,
  payment,
  setPayment,
  upiApp,
  setUpiApp,
  upiId,
  setUpiId,
  setPressedBtn,
  getPressStyle,
  backButtonStyle,
  actionButtonStyle,
  secondaryButtonStyle,
  orderTotal = 1
}) {

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
      am: orderTotal.toString(),
      cu: 'INR'
    }).toString();

    const specificAppUri = appData.getScheme(queryParams);
    const genericUpiUri = `upi://pay?${queryParams}`;

    // 1. Try launching the specific app via custom scheme
    window.location.href = specificAppUri;

    // 2. Fallback to generic upi:// intent if app is not installed/fails to open
    const fallbackTimer = setTimeout(() => {
      if (!document.hidden) {
        window.location.href = genericUpiUri;
      }
    }, 1200);

    // Clear timer if page loses focus (meaning app opened successfully)
    window.addEventListener('pagehide', () => clearTimeout(fallbackTimer), { once: true });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '130px', 
      paddingTop: '5px',
      boxSizing: 'border-box' 
    }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 2fr auto', alignItems: 'center', marginBottom: '16px', gap: '4px' }}>
        <button onClick={() => setView('delivery')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start', whiteSpace: 'nowrap' }}>
          <ArrowLeft size={18}/> Back to Details
        </button>
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: '700', whiteSpace: 'nowrap' }}>Payment Method</h2>
        <div style={{ width: '75px' }}></div>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: theme.border, 
        borderRadius: theme.radius, 
        background: '#FFFBF2', 
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        {/* Payment Options Grid */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* --- CASH BUTTON --- */}
          <button 
            onClick={() => setPayment('COD')}
            style={{ 
              flex: 1, 
              padding: '15px', 
              borderRadius: '8px', 
              border: payment === 'COD' ? `2px solid ${theme.brand}` : theme.border, 
              background: payment === 'COD' ? theme.bg : '#FFFBF2',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: theme.text }}>₹</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '700', color: theme.text, textTransform: 'uppercase' }}>Cash</div>
          </button>

          {/* --- UPI BUTTON --- */}
          <button 
            onClick={() => setPayment('UPI')}
            style={{ 
              flex: 1, 
              padding: '15px', 
              borderRadius: '8px', 
              border: payment === 'UPI' ? `2px solid ${theme.brand}` : theme.border, 
              background: payment === 'UPI' ? theme.bg : '#FFFBF2',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: theme.text }}>UPI</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '700', color: theme.text, textTransform: 'uppercase' }}>Payment</div>
          </button>
        </div>

        {/* Expanded UPI Options & Direct App Launch Section */}
        {payment === 'UPI' && (
          <div style={{ 
            border: theme.border, 
            borderRadius: '8px', 
            background: theme.bg, 
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase' }}>Tap App to Launch & Pay</span>
            
            {/* Specific Apps Selection Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {Object.keys(APP_CONFIG).map((app) => (
                <button
                  key={app}
                  onClick={() => handleAppLaunch(app)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '6px',
                    border: upiApp === app ? `2px solid ${theme.brand}` : theme.border,
                    background: upiApp === app ? '#FFFBF2' : theme.bg,
                    color: theme.text,
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  🚀 {app}
                </button>
              ))}
            </div>

            {/* Selected UPI ID Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase' }}>Selected UPI ID / VPA</label>
                <span style={{ fontSize: '11px', fontWeight: '700', color: theme.brand }}>
                  {upiApp ? `${upiApp} Launched` : 'Select an app above'}
                </span>
              </div>
              <input 
                type="text"
                placeholder="e.g. username@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ border: theme.border, background: '#FFFBF2', color: theme.text, fontSize: '13px', boxSizing: 'border-box', width: '100%', padding: '10px', borderRadius: '6px' }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%', marginTop: '10px' }}>
          <button 
            onClick={() => { if (!payment) { alert("Please select a payment method (Cash or UPI) to proceed."); return; } setView('track'); }} 
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
              borderRadius: theme.radius, 
              width: '100%', 
              boxSizing: 'border-box', 
              opacity: payment ? 1 : 0.6 
            }}
          >
            Place Order
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
              border: theme.border, 
              marginBottom: 0, 
              padding: '14px', 
              fontSize: '15px', 
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