import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, MapPin, Info, ChevronUp, ChevronDown, 
  ShoppingBag, Calendar, Clock, 
  Bike, Navigation, CheckCircle2, AlertCircle, MessageCircle
} from 'lucide-react';

const KITCHEN_LAT = 13.0232;
const KITCHEN_LNG = 77.6492;

const calculateDeliveryFare = (distKm) => {
  if (distKm <= 5) return 50;
  const extraKm = distKm - 5;
  return Math.round(50 + (extraKm * 12));
};

const getDrivingDistanceKm = (lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - KITCHEN_LAT) * (Math.PI / 180);
  const dLon = (lon2 - KITCHEN_LNG) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(KITCHEN_LAT * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c * 1.25).toFixed(1));
};

// Expanded Area Keyword Lookup with Bengaluru Restriction & 3-25+ km Bands
const estimateFeeByAreaName = (text) => {
  const addr = (text || '').toLowerCase().trim();
  if (!addr) return { fee: 50, km: 'Enter area for estimate', zone: 'Standard', invalid: false };

  // Guard against non-Bangalore cities
  const nonBangaloreCities = [
    'mumbai', 'delhi', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 
    'jaipur', 'surat', 'lucknow', 'kanpur', 'nagpur', 'patna', 'indore', 
    'thane', 'bhopal', 'visakhapatnam', 'vadodara', 'ghaziabad', 'ludhiana', 
    'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 
    'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi', 
    'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 
    'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli', 
    'mysore', 'tiruchirappalli', 'bareilly', 'moradabad', 'gurgaon', 'gurugram', 
    'noida', 'new york', 'london', 'dubai', 'singapore'
  ];

  if (nonBangaloreCities.some(city => addr.includes(city))) {
    return { fee: 0, km: 'Out of Coverage', zone: 'Out of Coverage', invalid: true };
  }

  // 3-5 km range
  if (
    addr.includes('babusahibpalya') || addr.includes('prakruti') || addr.includes('horamavu') || 
    addr.includes('kalyan nagar') || addr.includes('kammanahalli') || addr.includes('ramamurthy nagar') || 
    addr.includes('banaswadi') || addr.includes('hennur')
  ) {
    return { fee: calculateDeliveryFare(4), km: '3-5 km', zone: 'Local', invalid: false };
  }

  // 6-8 km range
  if (
    addr.includes('hebbal') || addr.includes('ulsoor') || addr.includes('manyata') || 
    addr.includes('rt nagar') || addr.includes('frazer town') || addr.includes('cox town') || 
    addr.includes('richards town') || addr.includes('cooke town') || addr.includes('cv raman nagar') ||
    addr.includes('nagavara') || addr.includes('kr puram') || addr.includes('TC Palya')
  ) {
    return { fee: calculateDeliveryFare(7), km: '6-8 km', zone: 'Central Inner', invalid: false };
  }

  // 9-11 km range
  if (
    addr.includes('indiranagar') || addr.includes('mg road') || addr.includes('shivajinagar') || 
    addr.includes('domlur') || addr.includes('sadashivanagar') || addr.includes('malleshwaram') || addr.includes('kasturi nagar') ||
    addr.includes('tin factory') || addr.includes('HAL 2nd Stage') || addr.includes('HAL 3rd Stage') || addr.includes('HAL 4th Stage')
  ) {
    return { fee: calculateDeliveryFare(10), km: '9-11 km', zone: 'Central Extended', invalid: false };
  }

  // 12-14 km range
  if (
    addr.includes('koramangala') || addr.includes('btm') || addr.includes('jayanagar') || 
    addr.includes('jp nagar') || addr.includes('jaya prakash nagar') || addr.includes('basavanagudi') || 
    addr.includes('rajajinagar') || addr.includes('vijayanagar') || addr.includes('thanisandra') || addr.includes('yeshwanthpur')
  ) {
    return { fee: calculateDeliveryFare(13), km: '12-14 km', zone: 'Extended Zone', invalid: false };
  }

  // 15-25 km range (Outer Area)
  if (
    addr.includes('whitefield') || addr.includes('electronic city') || addr.includes('yelahanka') || 
    addr.includes('sarjapur') || addr.includes('marathahalli') || addr.includes ('yemlur')|| addr.includes('bellandur') || 
    addr.includes('bannerghatta') || addr.includes('peenya') || addr.includes('kengeri') || 
    addr.includes('hoskote') || addr.includes('devanahalli') || addr.includes('airport') || addr.includes('HSR layout')
  ) {
    return { fee: calculateDeliveryFare(20), km: '15-25 km', zone: 'Outer Area', invalid: false };
  }

  // Default fallback for unmatched Bengaluru locations (~5-8 km est)
  return { fee: calculateDeliveryFare(6), km: '~5-8 km est.', zone: 'Standard Delivery', invalid: false };
};

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
  secondaryButtonStyle
}) {
  const currentMode = customer.fulfillmentType || 'DELIVERY';

  // Synchronous calculation: recalculated immediately on every render/keystroke
  const distanceInfo = useMemo(() => {
    if (currentMode === 'PICKUP') {
      return { km: '0 km', fee: 0, source: 'pickup', invalid: false };
    }
    if (customer.detectedKm) {
      const calculatedFee = calculateDeliveryFare(customer.detectedKm);
      return { km: `${customer.detectedKm} km`, fee: calculatedFee, source: 'gps', invalid: false };
    }
    const areaEst = estimateFeeByAreaName(customer.address);
    return { km: areaEst.km, fee: areaEst.fee, source: 'area', invalid: areaEst.invalid };
  }, [customer.address, currentMode, customer.detectedKm]);

  // Handle address input change with real-time fee assignment
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    const est = estimateFeeByAreaName(newAddress);
    
    setCustomer(prev => ({
      ...prev,
      address: newAddress,
      deliveryFee: currentMode === 'PICKUP' ? 0 : est.fee
    }));
  };

  const setFulfillmentMode = (mode) => {
    setCustomer(prev => ({ 
      ...prev, 
      fulfillmentType: mode,
      deliveryFee: mode === 'PICKUP' ? 0 : distanceInfo.fee
    }));
  };

  const isPhoneValid = customer.phone && customer.phone.length === 10;
  const isNameValid = customer.name && customer.name.trim().length > 0;
  const isAddressValid = currentMode === 'PICKUP' || (customer.address && customer.address.trim().length > 0 && !distanceInfo.invalid);
  const isFormValid = isNameValid && isPhoneValid && isAddressValid;

  const sleekInput = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #E53935',
    background: '#FFFBF2',
    color: (theme && theme.text) || '#2C221E',
    fontSize: '13px',
    fontWeight: '500',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingBottom: '90px', paddingTop: '4px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 2fr auto', alignItems: 'center', marginBottom: '14px', gap: '4px' }}>
        <button onClick={() => setView('cart')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start', whiteSpace: 'nowrap' }}>
          <ArrowLeft size={18}/> Back
        </button>
        <h2 style={{ color: '#E53935', margin: 0, fontSize: '15px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '800', whiteSpace: 'nowrap' }}>
          Order & Delivery
        </h2>
        <div style={{ width: '75px' }}></div>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: '1px solid #E53935', 
        borderRadius: '16px', 
        background: '#FFFBF2', 
        padding: '18px 16px',
        boxShadow: '0 6px 18px rgba(229, 57, 53, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box',
        width: '100%'
      }}>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            1. Contact Info <span style={{ color: '#E53935' }}>*</span>
          </div>

          <input 
            type="text" 
            placeholder="Full Name *" 
            style={sleekInput} 
            value={customer.name || ''} 
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })} 
          />
          <input 
            type="tel" 
            maxLength="10" 
            placeholder="Mobile Number (10 digits) *" 
            style={sleekInput} 
            value={customer.phone || ''} 
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/[^0-9]/g, '') })} 
          />
          <input 
            type="email" 
            placeholder="Email Address (Optional)" 
            style={sleekInput} 
            value={customer.email || ''} 
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })} 
          />
        </div>

        {/* Delivery Mode Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            2. Delivery Mode
          </div>

          <div style={{ display: 'flex', background: '#EFE7DA', padding: '4px', borderRadius: '12px', gap: '4px', border: '1px solid #E53935', boxSizing: 'border-box' }}>
            <button 
              type="button"
              onClick={() => setFulfillmentMode('DELIVERY')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '9px',
                border: 'none',
                background: currentMode === 'DELIVERY' ? '#FFFBF2' : 'transparent',
                color: currentMode === 'DELIVERY' ? '#E53935' : '#8C7A6B',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: currentMode === 'DELIVERY' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bike size={15} /> Delivery
              </div>
              <span style={{ fontSize: '9.5px', color: currentMode === 'DELIVERY' ? '#E53935' : '#7A6E65', fontWeight: '700' }}>
                Est. ₹{distanceInfo.fee}
              </span>
            </button>

            <button 
              type="button"
              onClick={() => setFulfillmentMode('PICKUP')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '9px',
                border: 'none',
                background: currentMode === 'PICKUP' ? '#FFFBF2' : 'transparent',
                color: currentMode === 'PICKUP' ? '#E53935' : '#8C7A6B',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: currentMode === 'PICKUP' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={15} /> Self Pickup
              </div>
              <span style={{ fontSize: '9px', background: '#E6F4EA', color: '#137333', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>
                FREE (₹0)
              </span>
            </button>
          </div>

          {currentMode === 'DELIVERY' && (
            <div style={{ fontSize: '10.5px', color: '#6E5D4F', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '2px' }}>
              <Navigation size={11} color="#E53935" />
              Bengaluru deliveries only (Up to 30 km via distance model).
            </div>
          )}
        </div>

        {/* Address and Live Fee Display */}
        {currentMode === 'DELIVERY' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            <textarea 
              placeholder="Full Bengaluru Delivery Address (Include Area/Landmark) *" 
              rows={3}
              style={{ ...sleekInput, height: '80px', resize: 'none', fontFamily: 'inherit', lineHeight: '1.4' }} 
              value={customer.address || ''} 
              onChange={handleAddressChange} 
            />

            <button 
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const lat = position.coords.latitude;
                      const lng = position.coords.longitude;
                      const distKm = getDrivingDistanceKm(lat, lng);
                      const calculatedFee = calculateDeliveryFare(distKm);
                      const pinUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

                      setCustomer(prev => ({ 
                        ...prev, 
                        address: prev.address ? `${prev.address}\n📍 GPS Pin: ${pinUrl}` : `📍 GPS Pin: ${pinUrl}`, 
                        detectedKm: distKm,
                        deliveryFee: calculatedFee 
                      }));
                    },
                    () => alert("Could not retrieve GPS pin. Fee estimated via address text.")
                  );
                }
              }} 
              style={{ 
                width: '100%', padding: '11px', borderRadius: '10px', border: '1px dashed #E53935',
                background: '#FFFBF2', color: '#E53935', cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxSizing: 'border-box'
              }}
            >
              <MapPin size={16} /> Auto-Calculate via Google Maps Pin
            </button>

            {/* REAL-TIME BADGE */}
            <div style={{ 
              background: distanceInfo.invalid ? '#FFEBEE' : (distanceInfo.source === 'gps' ? '#E6F4EA' : '#FFF0F0'), 
              border: `1px solid ${distanceInfo.invalid ? '#C62828' : (distanceInfo.source === 'gps' ? '#137333' : '#E53935')}`, 
              borderRadius: '8px', padding: '9px 12px', display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', fontSize: '11.5px', color: '#2C221E', boxSizing: 'border-box'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {distanceInfo.invalid && <AlertCircle size={14} color="#C62828" />}
                {distanceInfo.source === 'gps' && !distanceInfo.invalid && <CheckCircle2 size={14} color="#137333" />}
                <strong>{distanceInfo.invalid ? 'Notice:' : 'Est. Distance:'}</strong> {distanceInfo.km}
              </span>
              <span style={{ fontWeight: '800', color: distanceInfo.invalid ? '#C62828' : (distanceInfo.source === 'gps' ? '#137333' : '#E53935') }}>
                {distanceInfo.invalid ? 'Not Deliverable' : `Fee: ₹${distanceInfo.fee}`}
              </span>
            </div>

            {/* OUT OF COVERAGE NOTIFICATION & ALTERNATIVE ACTIONS */}
            {distanceInfo.invalid && (
              <div style={{
                background: '#FFF3F3',
                border: '1px dashed #C62828',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '2px',
                boxSizing: 'border-box'
              }}>
                <div style={{ fontSize: '11px', color: '#C62828', fontWeight: '500', lineHeight: '1.4' }}>
                  This location is outside our delivery zone. You can switch to **Self Pickup** or reach out to us directly via WhatsApp to coordinate special arrangements.
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('PICKUP')}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: '#E53935',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <ShoppingBag size={13} /> Switch to Pickup
                  </button>

                  <a
                    href="https://wa.me/?text=Hi,%20I%20am%20trying%20to%20order%20from%20an%20out-of-coverage%20location%20and%20would%20like%20to%20discuss%20options."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: '#25D366',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <MessageCircle size={13} /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: '#FFFBF2', padding: '14px', borderRadius: '12px', border: '1px solid #E53935', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', boxSizing: 'border-box' }}>
            <div style={{ background: '#FFF5F5', padding: '10px', borderRadius: '10px' }}>
              <MapPin size={22} color="#E53935" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#2C221E' }}>Lyte Bytes Kitchen</div>
              <div style={{ fontSize: '11px', color: '#8C7A6B', marginTop: '2px' }}>
                Prakruti Township, Babusahibpalya, Bengaluru • <strong style={{ color: '#137333' }}>₹0 Delivery Fee</strong>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Container */}
        <div style={{ borderTop: `1px dashed #E53935`, paddingTop: '14px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#E53935', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            {currentMode === 'DELIVERY' ? 'Preferred Delivery Time (Optional)' : 'Preferred Pickup Time (Optional)'}
          </div>

          <div style={{ border: '1px solid #E53935', borderRadius: '12px', background: '#FFFBF2', padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', alignItems: 'center', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderRight: '1px solid #E53935', paddingRight: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '9px', fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={10} /> Date
              </label>
              <input type="date" value={deliveryDate || ''} onChange={(e) => setDeliveryDate(e.target.value)} style={{ border: 'none', background: 'transparent', color: '#2C221E', fontSize: '12px', fontWeight: '600', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px', textAlign: 'left' }}>
              <label style={{ fontSize: '9px', fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} /> Slot / Time
              </label>
              <input type="time" value={deliveryTime || ''} onChange={(e) => setDeliveryTime(e.target.value)} style={{ border: 'none', background: 'transparent', color: '#2C221E', fontSize: '12px', fontWeight: '600', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button 
            type="button"
            onClick={isFormValid ? handleProceedToPayment : () => alert(distanceInfo.invalid ? "Delivery is only available within Bengaluru. Please switch to Self Pickup or contact via WhatsApp." : "Please complete contact details and address.")} 
            disabled={!isFormValid}
            style={{ 
              ...actionButtonStyle, 
              border: 'none', 
              background: '#E53935',
              color: '#FFFFFF',
              padding: '15px', 
              fontSize: '14px', 
              fontWeight: '800',
              borderRadius: (theme && theme.radius) || '12px', 
              width: '100%', 
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              boxSizing: 'border-box'
            }}
          >
            Proceed to Payment {distanceInfo.fee > 0 && !distanceInfo.invalid ? `(Incl. ₹${distanceInfo.fee} Delivery)` : ''}
          </button>
        </div>

      </div>
    </div>
  );
}