import React from 'react';
import { ArrowLeft, MapPin, Info, ChevronUp, ChevronDown } from 'lucide-react';

export default function DeliveryView({
  theme,
  setView,
  customer,
  setCustomer,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  showConditions,
  setShowConditions,
  handleProceedToPayment,
  setPressedBtn,
  getPressStyle,
  backButtonStyle,
  actionButtonStyle,
  secondaryButtonStyle,
  inputStyle,
  accordionHeaderStyle
}) {
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
        <button onClick={() => setView('cart')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start', whiteSpace: 'nowrap' }}>
          <ArrowLeft size={18}/> Back
        </button>
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: '700', whiteSpace: 'nowrap' }}>Delivery Details</h2>
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
        gap: '12px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        {/* Input Fields with Explicit High-Contrast Text Color */}
        <input 
          type="text" 
          placeholder="Name (Required)" 
          style={{ ...inputStyle, border: theme.border, background: theme.bg, color: theme.text, boxSizing: 'border-box', width: '100%' }} 
          value={customer.name} 
          onChange={(e) => setCustomer({...customer, name: e.target.value})} 
        />
        
        <input 
          type="tel" 
          maxLength="10" 
          placeholder="Mobile Number (10 digits required)" 
          style={{ ...inputStyle, border: theme.border, background: theme.bg, color: theme.text, boxSizing: 'border-box', width: '100%' }} 
          value={customer.phone} 
          onChange={(e) => setCustomer({...customer, phone: e.target.value.replace(/[^0-9]/g, '')})} 
        />
        
        <input 
          type="email" 
          placeholder="Email (Optional)" 
          style={{ ...inputStyle, border: theme.border, background: theme.bg, color: theme.text, boxSizing: 'border-box', width: '100%' }} 
          value={customer.email} 
          onChange={(e) => setCustomer({...customer, email: e.target.value})} 
        />
        
        <textarea 
          placeholder="Full postal address" 
          style={{ ...inputStyle, border: theme.border, background: theme.bg, color: theme.text, height: '80px', resize: 'none', boxSizing: 'border-box', width: '100%', fontFamily: 'inherit' }} 
          value={customer.address} 
          onChange={(e) => setCustomer({...customer, address: e.target.value})} 
        />
          
        {/* Interactive Map Pin Selector Trigger */}
        <button 
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
                },
                () => {
                  window.open('https://www.google.com/maps', '_blank');
                },
                { timeout: 10000, enableHighAccuracy: true }
              );
            } else {
              window.open('https://www.google.com/maps', '_blank');
            }
          }} 
          style={{ 
            ...inputStyle, 
            marginTop: '0px', 
            marginBottom: '5px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            border: `1.5px dashed ${theme.brand}`,
            color: theme.brand,
            background: 'rgba(210, 40, 55, 0.03)',
            cursor: 'pointer',
            fontWeight: '600',
            boxSizing: 'border-box', 
            width: '100%'
          }}
        >
          <MapPin size={18} /> Drop Location Pin
        </button>

        {/* UNIFORM PREFERRED DELIVERY CONTAINER */}
        <div style={{ margin: '14px 0 0 0', borderTop: `1px dashed #E5D6B5`, paddingTop: '16px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: theme.brand || '#FF5958', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            Preferred Delivery (Optional)
          </div>

          <div style={{ 
            border: theme.border, 
            borderRadius: theme.radius || '12px', 
            background: '#FFFBF2', 
            padding: '12px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            boxSizing: 'border-box',
            width: '100%',
            alignItems: 'center'
          }}>
            
            {/* Date Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', boxSizing: 'border-box', borderRight: '1px solid #E5D6B5', paddingRight: '10px' }}>
              <label style={{ fontSize: '10px', fontWeight: '700', color: '#776E62', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Date</label>
              <input 
                type="date" 
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  color: theme.text, 
                  fontSize: '13px', 
                  fontWeight: '500',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '4px 0',
                  fontFamily: 'inherit'
                }} 
              />
            </div>

            {/* Time Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', boxSizing: 'border-box', paddingLeft: '2px' }}>
              <label style={{ fontSize: '10px', fontWeight: '700', color: '#776E62', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Time</label>
              <input 
                type="time" 
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  color: theme.text, 
                  fontSize: '13px', 
                  fontWeight: '500',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '4px 0',
                  fontFamily: 'inherit'
                }} 
              />
            </div>

          </div>

          <div style={{ fontSize: '11px', color: '#8C8275', fontStyle: 'italic', textAlign: 'center', marginTop: '8px' }}>
            *Leave blank for earliest delivery.
          </div>
        </div>

        {/* Delivery Conditions Section */}
        <div style={{ marginBottom: '10px', boxSizing: 'border-box', width: '100%', marginTop: '10px' }}>
          <div onClick={() => setShowConditions(!showConditions)} style={{ ...accordionHeaderStyle, border: theme.border, background: theme.bg, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: theme.text, fontSize: '13px' }}>
              <Info size={16} color={theme.brand} /> Delivery Conditions
            </span>
            {showConditions ? <ChevronUp size={16} color={theme.brand}/> : <ChevronDown size={16} color={theme.brand}/>}
          </div>
          {showConditions && (
            <div style={{ marginTop: '8px', padding: '12px', border: theme.border, borderRadius: '8px', backgroundColor: '#FFFBF2', fontSize: '12px', textAlign: 'left', color: '#2B2B2B', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4', boxSizing: 'border-box', width: '100%' }}>
              <p style={{ margin: 0 }}><strong>Delivery Slots:</strong> We offer morning (8–11am), afternoon (12–2pm), and evening (5–8pm) slots. Please specify your preferred slot in the address field.</p>
              <p style={{ margin: 0 }}><strong>Delivery Days:</strong> Deliveries are made on all days except public holidays. Please check our holiday schedule for exceptions.</p>
              <p style={{ margin: 0 }}><strong>Order Tracking:</strong> After placing your order, you can track its status in the 'Track' section.</p>
              <p style={{ margin: 0 }}><strong>Timelines:</strong> Standard delivery takes 24–48 hours from order confirmation.</p>
              <p style={{ margin: 0 }}><strong>Areas:</strong> We currently deliver within Bengaluru.</p>
              <p style={{ margin: 0 }}><strong>Delivery Partners:</strong> We partner with reliable local delivery services to ensure timely deliveries.</p>
              <p style={{ margin: 0 }}><strong>Fees:</strong> Delivery charges are calculated at checkout based on location.</p>
              <p style={{ margin: 0 }}><strong>Address Accuracy:</strong> Please ensure your delivery address is complete and accurate to avoid delays.</p>
              <p style={{ margin: 0 }}><strong>Delivery Delays:</strong> While we strive for timely deliveries, unforeseen circumstances (e.g., traffic, weather) may cause delays.</p>
              <p style={{ margin: 0 }}><strong>Customer Support:</strong> For any delivery-related queries, please contact us via WhatsApp at +91 91082 86886 or email us at lytebytesblr@gmail.com</p>               
            </div>
          )}
        </div>

        {/* Action Buttons with Haptic Press Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
          <button 
            onClick={handleProceedToPayment} 
            onMouseDown={() => setPressedBtn('payment')}
            onMouseUp={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn('payment')}
            onTouchEnd={() => setPressedBtn(null)}
            style={{ 
              ...actionButtonStyle, 
              ...getPressStyle('payment'), 
              border: theme.border, 
              marginBottom: 0, 
              padding: '14px', 
              fontSize: '15px', 
              borderRadius: theme.radius, 
              width: '100%', 
              boxSizing: 'border-box' 
            }}
          >
            Proceed to Payment
          </button>
          <button 
            onClick={() => setView('home')} 
            onMouseDown={() => setPressedBtn('continue-del')}
            onMouseUp={() => setPressedBtn(null)}
            onTouchStart={() => setPressedBtn('continue-del')}
            onTouchEnd={() => setPressedBtn(null)}
            style={{ 
              ...secondaryButtonStyle, 
              ...getPressStyle('continue-del'), 
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