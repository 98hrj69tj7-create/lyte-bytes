import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, MapPin, Info, ChevronUp, ChevronDown, 
  ShoppingBag, Calendar, Clock, Search, X, Crosshair,
  Bike, Navigation, CheckCircle2, AlertCircle, MessageCircle
} from 'lucide-react';
import PolicyModal from './PolicyModal';

const KITCHEN_LAT = 13.0232;
const KITCHEN_LNG = 77.6492;
const GOOGLE_MAPS_API_KEY = 'AIzaSyB4OBzhmYFyGxikNk6ROGQk1pLBrP28QD8'; // Replace with your key

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

// Expanded Area Keyword Lookup with Bengaluru Restriction & Granular 3-28+ km Bands & Synonyms
const estimateFeeByAreaName = (text) => {
  const addr = (text || '').toLowerCase().trim();
  if (!addr) return { fee: 50, km: 'Enter area for estimate', zone: 'Standard', invalid: false };

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

  // 3–5 km range
  if (
    addr.includes('horamavu') || addr.includes('babusabipalya') || addr.includes('babusahibpalya') ||
    addr.includes('prakruthi') || addr.includes('prakruti') || addr.includes('kalyan nagar') ||
    addr.includes('kalyannagar') || addr.includes('kammanahalli') || addr.includes('kammana halli') ||
    addr.includes('ramamurthy nagar') || addr.includes('rm nagar') || addr.includes('banaswadi') ||
    addr.includes('banas wadi') || addr.includes('hennur') || addr.includes('hennur cross') ||
    addr.includes('hennur main road') || addr.includes('hrbr layout') || addr.includes('hrbr') ||
    addr.includes('geddalahalli')
  ) {
    return { fee: calculateDeliveryFare(4), km: '3-5 km', zone: 'Local', invalid: false };
  }

  // 6–8 km range
  if (
    addr.includes('hebbal') || addr.includes('nagavara') || addr.includes('manyata') ||
    addr.includes('manyata tech park') || addr.includes('rt nagar') || addr.includes('r t nagar') ||
    addr.includes('frazer town') || addr.includes('cox town') || addr.includes('richards town') ||
    addr.includes('cooke town') || addr.includes('ulsoor') || addr.includes('halasuru') ||
    addr.includes('cv raman nagar') || addr.includes('kr puram') || addr.includes('krpuram') ||
    addr.includes('k r puram') || addr.includes('tc palya') || addr.includes('t c palya') ||
    addr.includes('kasturi nagar')
  ) {
    return { fee: calculateDeliveryFare(7), km: '6-8 km', zone: 'Central Inner', invalid: false };
  }

  // 9–11 km range
  if (
    addr.includes('indiranagar') || addr.includes('domlur') || addr.includes('marathahalli') ||
    addr.includes('whitefield') || addr.includes('bellandur') || addr.includes('old airport road') ||
    addr.includes('old airport rd') || addr.includes('sahakar nagar') || addr.includes('sahakara nagar') ||
    addr.includes('yelahanka') || addr.includes('hebbal kempapura') || addr.includes('kempapura') ||
    addr.includes('thanisandra') || addr.includes('bagmane tech park') || addr.includes('rmz infinity') ||
    addr.includes('thippasandra') || addr.includes('mg road') || addr.includes('shivajinagar') ||
    addr.includes('jeevanbhima Nagar') || addr.includes('ngef') || addr.includes('tin factory') ||
    addr.includes('hal 2nd stage') || addr.includes('hal 3rd stage') || addr.includes('hal 4th stage') ||
    addr.includes('kadugodi')
  ) {
    return { fee: calculateDeliveryFare(10), km: '9-11 km', zone: 'Central Extended', invalid: false };
  }

  // 12–14 km range
  if (
    addr.includes('brigade road') || addr.includes('commercial street') || addr.includes('comm street') ||
    addr.includes('majestic') || addr.includes('richmond town') || addr.includes('koramangala') ||
    addr.includes('kormangala') || addr.includes('kormanagala') || addr.includes('hsr layout') ||
    addr.includes('hsr') || addr.includes('outer ring road') || addr.includes('yelahanka new town') ||
    addr.includes('yelahanka nt') || addr.includes('jakkur') || addr.includes('btm') ||
    addr.includes('jayanagar') || addr.includes('jaya nagar') || addr.includes('sadashivanagar') ||
    addr.includes('malleshwaram') || addr.includes('jp nagar') || addr.includes('j p nagar') ||
    addr.includes('basavanagudi') || addr.includes('rajajinagar') || addr.includes('vijayanagar') ||
    addr.includes('yemlur') || addr.includes('bel road') || addr.includes('hmt') ||
    addr.includes('ganganagar')
  ) {
    return { fee: calculateDeliveryFare(13), km: '12-14 km', zone: 'Extended Zone', invalid: false };
  }

  // 15–17 km range
  if (
    addr.includes('electronic city') || addr.includes('e city') || addr.includes('ecity') ||
    addr.includes('bommanahalli') || addr.includes('begur') || addr.includes('sarjapur road') ||
    addr.includes('sarjapur rd') || addr.includes('kadubeesanahalli') || addr.includes('varthur') ||
    addr.includes('yeshwanthpur')
  ) {
    return { fee: calculateDeliveryFare(16), km: '15-17 km', zone: 'Outer Area', invalid: false };
  }

  // 18–20 km range
  if (
    addr.includes('bannerghatta') || addr.includes('bannerghatta road') || addr.includes('arekere') ||
    addr.includes('hulimavu') || addr.includes('hoodi') || addr.includes('hoodi circle') ||
    addr.includes('whitefield hope farm') || addr.includes('hope farm') || addr.includes('attibele') ||
    addr.includes('ecoworld')
  ) {
    return { fee: calculateDeliveryFare(19), km: '18-20 km', zone: 'Outer Area', invalid: false };
  }

  // 21–23 km range
  if (
    addr.includes('devanahalli') || addr.includes('nelamangala') || addr.includes('hennagara') ||
    addr.includes('bommasandra') || addr.includes('chandapura')
  ) {
    return { fee: calculateDeliveryFare(22), km: '21-23 km', zone: 'Outer Periphery', invalid: false };
  }

  // 23–25 km range
  if (
    addr.includes('kempegowda airport') || addr.includes('airport road') || addr.includes('yelahanka air force base') ||
    addr.includes('sarjapur town') || addr.includes('malur') || addr.includes('airport')
  ) {
    return { fee: calculateDeliveryFare(24), km: '23-25 km', zone: 'Outer Periphery', invalid: false };
  }

  // 26–28 km range
  if (
    addr.includes('hoskote') || addr.includes('hosakote') || addr.includes('doddaballapur') ||
    addr.includes('anekal') || addr.includes('anikal') || addr.includes('vijayapura') ||
    addr.includes('kanakapura') || addr.includes('kanakapura road')
  ) {
    return { fee: calculateDeliveryFare(27), km: '26-28 km', zone: 'Extended Periphery', invalid: false };
  }

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
  const [isDeliveryPolicyOpen, setIsDeliveryPolicyOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  
  // Map Modal States
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [tempLat, setTempLat] = useState(KITCHEN_LAT);
  const [tempLng, setTempLng] = useState(KITCHEN_LNG);
  const [tempDistanceInfo, setTempDistanceInfo] = useState({ km: '0 km', fee: 50, invalid: false });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentMode = customer.fulfillmentType || 'DELIVERY';

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

  // Dynamically load Google Maps Script on demand (Zero Initial Lag)
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }
    if (document.getElementById('google-maps-script')) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Map inside Modal when opened
  useEffect(() => {
    if (!isMapModalOpen || !mapLoaded || !mapRef.current) return;

    const initialLat = customer.detectedLat || KITCHEN_LAT;
    const initialLng = customer.detectedLng || KITCHEN_LNG;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: initialLat, lng: initialLng },
      zoom: 14,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
    });
    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: { lat: initialLat, lng: initialLng },
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Reverse geocode & update coordinates on marker drag
    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      const lat = pos.lat();
      const lng = pos.lng();
      updateLocationData(lat, lng);
    });

    // Click map to reposition pin
    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      updateLocationData(lat, lng);
    });

    // Setup Places Autocomplete Search Bar
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'in' },
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          map.setCenter({ lat, lng });
          map.setZoom(16);
          marker.setPosition({ lat, lng });
          updateLocationData(lat, lng, place.formatted_address);
        }
      });
    }
  }, [isMapModalOpen, mapLoaded]);

  // Helper to calculate distance, fee, and reverse geocode address
  const updateLocationData = (lat, lng, explicitAddress = null) => {
    setTempLat(lat);
    setTempLng(lng);

    const distKm = getDrivingDistanceKm(lat, lng);
    const estFee = calculateDeliveryFare(distKm);

    if (explicitAddress) {
      const areaEst = estimateFeeByAreaName(explicitAddress);
      setTempAddress(explicitAddress);
      setTempDistanceInfo({ km: `${distKm} km`, fee: estFee, invalid: areaEst.invalid });
    } else {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const formatted = results[0].formatted_address;
          const areaEst = estimateFeeByAreaName(formatted);
          setTempAddress(formatted);
          setTempDistanceInfo({ km: `${distKm} km`, fee: estFee, invalid: areaEst.invalid });
        } else {
          setTempAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
          setTempDistanceInfo({ km: `${distKm} km`, fee: estFee, invalid: false });
        }
      });
    }
  };

  // Trigger browser GPS inside modal
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(16);
            markerRef.current.setPosition({ lat, lng });
          }
          updateLocationData(lat, lng);
        },
        () => alert("Unable to retrieve your GPS location. Please drop the pin manually.")
      );
    }
  };

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

  const activeTheme = {
    brand: theme?.brand || '#E53935',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #E0D3C1',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '12px',
    buttonBg: theme?.buttonBg || '#E53935'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingBottom: '90px', paddingTop: '4px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 2fr auto', alignItems: 'center', marginBottom: '14px', gap: '4px' }}>
        <button onClick={() => setView('cart')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start', whiteSpace: 'nowrap' }}>
          <ArrowLeft size={18}/> Back
        </button>
        <h2 style={{ color: '#E53935', margin: 0, fontSize: '17px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600', whiteSpace: 'nowrap' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              1. Contact Info <span style={{ color: '#E53935' }}>*</span>
            </div>
            <span 
              onClick={() => setIsPrivacyPolicyOpen(true)}
              style={{ fontSize: '10.5px', color: activeTheme.brand, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Privacy & Compliance
            </span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#8C7A6B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              2. Delivery Mode
            </div>
            <span 
              onClick={() => setIsDeliveryPolicyOpen(true)}
              style={{ fontSize: '10.5px', color: activeTheme.brand, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Delivery Conditions
            </span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '2px', paddingRight: '2px' }}>
              <div style={{ fontSize: '10.5px', color: '#6E5D4F', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={11} color="#E53935" />
                Bengaluru deliveries only (Up to 30 km).
              </div>
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

            {/* Interactive Map Floating Modal Trigger Button */}
            <button 
              type="button"
              onClick={() => {
                setTempAddress(customer.address || '');
                setIsMapModalOpen(true);
              }} 
              style={{ 
                width: '100%', padding: '11px', borderRadius: '10px', border: '1px dashed #E53935',
                background: '#FFFBF2', color: '#E53935', cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxSizing: 'border-box'
              }}
            >
              <MapPin size={16} /> Choose Location on Google Map
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
                      flex: 1, padding: '8px 10px', background: '#E53935', color: '#FFFFFF',
                      border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <ShoppingBag size={13} /> Switch to Pickup
                  </button>

                  <a
                    href="https://wa.me/?text=Hi,%20I%20am%20trying%20to%20order%20from%20an%20out-of-coverage%20location%20and%20would%20like%20to%20discuss%20options."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '8px 10px', background: '#25D366', color: '#FFFFFF',
                      border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                      textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
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
        <div style={{ borderTop: `1px dashed #E53935`, paddingTop: '8px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#E53935', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            {currentMode === 'DELIVERY' ? 'Preferred Delivery Time (Optional)' : 'Preferred Pickup Time (Optional)'}
          </div>

          <div style={{ border: '1px solid #E53935', borderRadius: '12px', background: '#FFFBF2', padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', alignItems: 'center', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderRight: '1px solid #E53935', paddingRight: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#8C7A6B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={15} /> Date
              </label>
              <input type="date" value={deliveryDate || ''} onChange={(e) => setDeliveryDate(e.target.value)} style={{ border: 'none', background: 'transparent', color: '#2C221E', fontSize: '12px', fontWeight: '600', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px', textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#8C7A6B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={15} /> Slot / Time
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

      {/* FLOATING GOOGLE MAP POPUP MODAL */}
      {isMapModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: '#FFFBF2', width: '100%', maxWidth: '480px', height: '85vh',
            borderRadius: '16px', border: '2px solid #E53935', display: 'flex',
            flexDirection: 'column', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '12px 16px', background: '#E53935', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'between'
            }}>
              <div style={{ fontWeight: '700', fontSize: '14px', flex: 1 }}>Select Delivery Location</div>
              <button 
                onClick={() => setIsMapModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Places Search Bar & Current GPS Button */}
<div style={{ padding: '10px 12px', background: '#FDF7ED', borderBottom: '1px solid #E0D3C1', display: 'flex', gap: '8px', alignItems: 'center' }}>
  <div style={{ position: 'relative', flex: 1 }}>
    <Search size={16} color="#8C7A6B" style={{ position: 'absolute', left: '10px', top: '12px', pointerEvents: 'none' }} />
    <input 
      ref={searchInputRef}
      type="text"
      placeholder="Search street, area, or landmark..."
      style={{
        width: '100%', 
        padding: '10px 10px 10px 34px', 
        borderRadius: '8px',
        border: '1px solid #E53935', 
        background: '#FFFFFF', 
        color: '#E53935',
        WebkitTextFillColor: '#E53935',
        fontSize: '12px', 
        outline: 'none', 
        boxSizing: 'border-box'
      }}
    />
  </div>
  <button 
    type="button"
    onClick={handleUseCurrentLocation}
    title="Use Current GPS Location"
    style={{
      padding: '10px 12px', background: '#E53935', color: '#FFFFFF', border: 'none',
      borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
  >
    <Crosshair size={16} />
  </button>
</div>

            {/* Google Map View Container */}
            <div ref={mapRef} style={{ flex: 1, width: '100%', background: '#eee' }} />

            {/* Selected Address & Fee Status Footer inside Modal */}
            <div style={{ padding: '12px 16px', background: '#FFFBF2', borderTop: '1px solid #E0D3C1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11.5px', color: '#2C221E', maxHeight: '50px', overflowY: 'auto' }}>
                <strong style={{ color: '#E53935' }}>Selected Address:</strong> {tempAddress || 'Drop pin or search area'}
              </div>

              <div style={{ 
                background: tempDistanceInfo.invalid ? '#FFEBEE' : '#E6F4EA', 
                border: `1px solid ${tempDistanceInfo.invalid ? '#C62828' : '#137333'}`, 
                borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', 
                justifyContent: 'space-between', fontSize: '11.5px'
              }}>
                <span style={{ fontWeight: '700', color: tempDistanceInfo.invalid ? '#C62828' : '#137333' }}>
                  {tempDistanceInfo.invalid ? 'Out of Bengaluru Coverage' : `Est. Distance: ${tempDistanceInfo.km}`}
                </span>
                <span style={{ fontWeight: '800', color: tempDistanceInfo.invalid ? '#C62828' : '#137333' }}>
                  {tempDistanceInfo.invalid ? 'Unavailable' : `Fee: ₹${tempDistanceInfo.fee}`}
                </span>
              </div>

              {/* Modal Action Buttons (Confirm vs WhatsApp Support if out of bounds) */}
              {tempDistanceInfo.invalid ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => setIsMapModalOpen(false)}
                    style={{ flex: 1, padding: '10px', background: '#8C7A6B', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <a
                    href="https://wa.me/?text=Hi,%20I%20am%20trying%20to%20order%20from%20an%20out-of-coverage%20location%20via%20map%20pin%20and%20would%20like%20to%20discuss%20options."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '10px', background: '#25D366', color: '#FFFFFF',
                      borderRadius: '8px', fontWeight: '700', fontSize: '12px', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <MessageCircle size={14} /> Chat on WhatsApp
                  </a>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => {
                    const pinUrl = `https://www.google.com/maps/search/?api=1&query=${tempLat},${tempLng}`;
                    const fullAddressWithPin = tempAddress ? `${tempAddress}\n📍 GPS Pin: ${pinUrl}` : `📍 GPS Pin: ${pinUrl}`;
                    
                    setCustomer(prev => ({
                      ...prev,
                      address: fullAddressWithPin,
                      detectedLat: tempLat,
                      detectedLng: tempLng,
                      detectedKm: parseFloat(tempDistanceInfo.km),
                      deliveryFee: tempDistanceInfo.fee
                    }));
                    setIsMapModalOpen(false);
                  }}
                  style={{
                    width: '100%', padding: '12px', background: '#E53935', color: '#FFFFFF',
                    border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Confirm Location & Fee (₹{tempDistanceInfo.fee})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delivery Conditions Modal */}
      <PolicyModal 
        isOpen={isDeliveryPolicyOpen} 
        onClose={() => setIsDeliveryPolicyOpen(false)} 
        title="Delivery Conditions" 
        theme={activeTheme}
      >
        <p><strong>Service Radius:</strong> We currently deliver exclusively within Bengaluru.</p>
        <p><strong>Delivery Slots & Timelines:</strong> Standard delivery takes 24–48 hours. Preferred slots (Morning: 8–11 AM, Afternoon: 12–2 PM, Evening: 5–8 PM) can be selected at checkout.</p>
        <p><strong>Fees & Tracking:</strong> Delivery charges are calculated dynamically at checkout. Real-time status tracking is available in the app.</p>
        <p><strong>Address Accuracy & Handover:</strong> Please provide precise address details. Due to product perishability, our delivery partners can wait a maximum of 10 minutes at the drop location; uncontactable orders cannot be refunded.</p>
        <p><strong>External Delays:</strong> While we prioritize punctuality, unforeseen local conditions (severe weather, heavy traffic blockades) may occasionally impact delivery windows.</p>
      </PolicyModal>

      {/* Privacy & Compliance Modal */}
      <PolicyModal 
        isOpen={isPrivacyPolicyOpen} 
        onClose={() => setIsPrivacyPolicyOpen(false)} 
        title="Privacy & Compliance" 
        theme={activeTheme}
      >
        <p><strong>Data Collection:</strong> We collect essential details (name, phone number, address) strictly for order fulfillment, logistics coordination, and customer support.</p>
        <p><strong>Data Sharing & Security:</strong> Your information is never sold. Data is shared exclusively with trusted local logistics partners. We do not use tracking cookies.</p>
        <p><strong>User Rights:</strong> You retain full control over your data and may request profile or data deletion anytime via WhatsApp or email.</p>
        <p><strong>FSSAI & Food Safety:</strong> Lyte Bytes operates as a certified FSSAI-registered kitchen adhering to strict hygiene standards. <strong>Allergy Notice:</strong> Prepared in a home kitchen that handles common allergens including nuts, dairy, and gluten.</p>
      </PolicyModal>
    </div>
  );
}