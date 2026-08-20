import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, MapPin, Info, ChevronUp, ChevronDown, 
  ShoppingBag, Calendar, Clock, Search, X, Crosshair,
  Bike, Navigation, CheckCircle2, AlertCircle, MessageCircle, Loader2
} from 'lucide-react';
import PolicyModal from './PolicyModal';
import { DeliveryPolicyModalContent, GeneralTermsModalContent, PrivacyPolicyModalContent } from './PolicyContents';

const KITCHEN_LAT = 13.0232;
const KITCHEN_LNG = 77.6492;
const GOOGLE_MAPS_API_KEY = 'AIzaSyB4OBzhmYFyGxikNk6ROGQk1pLBrP28QD8';
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";

// CSV Parsing Helpers for Auto-Lookup
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const testLine = parseCSVLine(lines[i]).map(h => h.toLowerCase());
    if (testLine.includes('cust_mobile') || testLine.includes('mobile') || testLine.includes('cust_name')) {
      headerRowIndex = i;
      break;
    }
  }
  const headers = parseCSVLine(lines[headerRowIndex]).map((h, i) => 
    i === 0 ? h.replace(/^\uFEFF/, '').trim() : h.trim()
  );
  const result = [];
  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentLine = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = currentLine[index]?.trim() || '';
    });
    result.push(obj);
  }
  return result;
}

function parseCSVLine(text) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(item => item.replace(/^"|"$/g, '').trim());
}

function getField(row, possibleKeys) {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== '') return row[key];
    const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') return row[foundKey];
  }
  return '';
}

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

  if (
    addr.includes('electronic city') || addr.includes('e city') || addr.includes('ecity') ||
    addr.includes('bommanahalli') || addr.includes('begur') || addr.includes('sarjapur road') ||
    addr.includes('sarjapur rd') || addr.includes('kadubeesanahalli') || addr.includes('varthur') ||
    addr.includes('yeshwanthpur')
  ) {
    return { fee: calculateDeliveryFare(16), km: '15-17 km', zone: 'Outer Area', invalid: false };
  }

  if (
    addr.includes('bannerghatta') || addr.includes('bannerghatta road') || addr.includes('arekere') ||
    addr.includes('hulimavu') || addr.includes('hoodi') || addr.includes('hoodi circle') ||
    addr.includes('whitefield hope farm') || addr.includes('hope farm') || addr.includes('attibele') ||
    addr.includes('ecoworld')
  ) {
    return { fee: calculateDeliveryFare(19), km: '18-20 km', zone: 'Outer Area', invalid: false };
  }

  if (
    addr.includes('devanahalli') || addr.includes('nelamangala') || addr.includes('hennagara') ||
    addr.includes('bommasandra') || addr.includes('chandapura')
  ) {
    return { fee: calculateDeliveryFare(22), km: '21-23 km', zone: 'Outer Periphery', invalid: false };
  }

  if (
    addr.includes('kempegowda airport') || addr.includes('airport road') || addr.includes('yelahanka air force base') ||
    addr.includes('sarjapur town') || addr.includes('malur') || addr.includes('airport')
  ) {
    return { fee: calculateDeliveryFare(24), km: '23-25 km', zone: 'Outer Periphery', invalid: false };
  }

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
  theme = {},
  setView = () => {},
  customer = {},
  setCustomer = () => {},
  deliveryDate = '',
  setDeliveryDate = () => {},
  deliveryTime = '',
  setDeliveryTime = () => {},
  handleProceedToPayment = () => {},
  actionButtonStyle = {},
  secondaryButtonStyle = {},
  backButtonStyle = {}
}) {
  const [isDeliveryPolicyOpen, setIsDeliveryPolicyOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  
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
  const whatsappNumber = "9108286886";

  useEffect(() => {
    const phoneTrimmed = (customer.phone || '').trim();
    if (phoneTrimmed.length === 10) {
      async function lookupCustomer() {
        setIsLookingUp(true);
        try {
          const response = await fetch(CSV_URL);
          const csvText = await response.text();
          const rows = parseCSV(csvText);

          let foundName = '';
          rows.forEach(row => {
            const p = getField(row, ['Cust_Mobile', 'Customer_Mobile', 'Mobile', 'Phone', 'Cust Mobile']);
            if (p === phoneTrimmed) {
              const n = getField(row, ['Cust_Name', 'Customer_Name', 'Name', 'Customer', 'Cust Name']);
              if (n && n !== 'Unknown' && n !== 'Valued Customer') {
                foundName = n;
              }
            }
          });

          if (foundName) {
            setCustomer(prev => ({
              ...prev,
              name: foundName
            }));
          }
        } catch (err) {
          console.error("Auto-lookup error:", err);
        } finally {
          setIsLookingUp(false);
        }
      }
      lookupCustomer();
    }
  }, [customer.phone]);

  const handleChatAndSave = (customText) => {
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Lyte Bytes',
      'ORG:Lyte Bytes - Gourmet Delights',
      'TEL;TYPE=WORK,VOICE:+919108286886',
      'NOTE:Handcrafted Goodness & Gourmet Delights Since 1995',
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Lyte_Bytes_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const message = customText || "Hi, I am trying to order from an out-of-coverage location and would like to discuss options.";
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(16px, 4vw, 20px)', // 💡 FLUID RADIUS
    buttonBg: theme?.buttonBg || '#FF5958'
  };

  const distanceInfo = useMemo(() => {
    if (currentMode === 'PICKUP') {
      return { km: '0 km', fee: 0, source: 'pickup', invalid: false };
    }
    if (customer.detectedKm) {
      const calculatedFee = calculateDeliveryFare(customer.detectedKm);
      const isOutOfBounds = customer.detectedKm > 30;
      return { km: `${customer.detectedKm} km`, fee: calculatedFee, source: 'gps', invalid: isOutOfBounds };
    }
    const areaEst = estimateFeeByAreaName(customer.address);
    return { km: areaEst.km, fee: areaEst.fee, source: 'area', invalid: areaEst.invalid };
  }, [customer.address, currentMode, customer.detectedKm]);

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

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      updateLocationData(pos.lat(), pos.lng());
    });

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      updateLocationData(lat, lng);
    });

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

  const updateLocationData = (lat, lng, explicitAddress = null) => {
    setTempLat(lat);
    setTempLng(lng);

    const distKm = getDrivingDistanceKm(lat, lng);
    const estFee = calculateDeliveryFare(distKm);
    const isOutOfBounds = distKm > 30;

    if (explicitAddress) {
      const areaEst = estimateFeeByAreaName(explicitAddress);
      setTempAddress(explicitAddress);
      setTempDistanceInfo({ km: `${distKm} km`, fee: estFee, invalid: areaEst.invalid || isOutOfBounds });
    } else {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const formatted = results[0].formatted_address;
          const areaEst = estimateFeeByAreaName(formatted);
          const nonBglrCheck = areaEst.invalid || isOutOfBounds;
          setTempAddress(formatted);
          setTempDistanceInfo({ km: `${distKm} km`, fee: estFee, invalid: nonBglrCheck });
        } else {
          setTempAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
          setTempDistanceInfo({ km: `${distKm} km`, fee: estFee, invalid: isOutOfBounds });
        }
      });
    }
  };

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
      deliveryFee: currentMode === 'PICKUP' ? 0 : est.fee,
      detectedKm: null
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
    padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', // 💡 FLUID PADDING
    borderRadius: '12px',
    border: '1px solid rgba(197, 160, 89, 0.4)',
    background: '#FFFFFF',
    color: activeTheme.text,
    fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
    fontWeight: '500',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', sans-serif" 
    }}>
      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('cart')} 
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
            padding: '6px 10px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={15}/> Bag
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
          pointerEvents: 'none' 
        }}>
          Delivery
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
        width: '100%'
      }}>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              1. Contact Info <span style={{ color: activeTheme.brand }}>*</span>
              {isLookingUp && <Loader2 size={12} className="animate-spin" color={activeTheme.brand} style={{ flexShrink: 0 }} />}
            </div>
            <span 
              onClick={() => setIsPrivacyPolicyOpen(true)}
              style={{ fontSize: 'clamp(9.5px, 2.5vw, 10.5px)', color: activeTheme.brand, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Privacy & Compliance
            </span>
          </div>

          <input 
            type="tel" 
            maxLength="10" 
            placeholder="Mobile Number (10 digits) *" 
            style={sleekInput} 
            value={customer.phone || ''} 
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/[^0-9]/g, '') })} 
          />

          <input 
            type="text" 
            placeholder="Full Name *" 
            style={sleekInput} 
            value={customer.name || ''} 
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })} 
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
            <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              2. Delivery Mode
            </div>
            <span 
              onClick={() => setIsDeliveryPolicyOpen(true)}
              style={{ fontSize: 'clamp(9.5px, 2.5vw, 10.5px)', color: activeTheme.brand, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Delivery Conditions
            </span>
          </div>

          <div style={{ display: 'flex', background: 'rgba(197, 160, 89, 0.12)', padding: '4px', borderRadius: '14px', gap: '4px', border: '1px solid rgba(197, 160, 89, 0.3)', boxSizing: 'border-box' }}>
            <button 
              type="button"
              onClick={() => setFulfillmentMode('DELIVERY')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                border: 'none',
                background: currentMode === 'DELIVERY' ? '#FFFFFF' : 'transparent',
                color: currentMode === 'DELIVERY' ? activeTheme.brand : '#78716C',
                fontWeight: '800',
                fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: currentMode === 'DELIVERY' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
                minWidth: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <Bike size={15} style={{ flexShrink: 0 }} /> 
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Delivery</span>
              </div>
              <span style={{ fontSize: 'clamp(8.5px, 2.5vw, 9.5px)', color: currentMode === 'DELIVERY' ? activeTheme.brand : '#78716C', fontWeight: '700', whiteSpace: 'nowrap' }}>
                Est. ₹{distanceInfo.fee}
              </span>
            </button>

            <button 
              type="button"
              onClick={() => setFulfillmentMode('PICKUP')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                border: 'none',
                background: currentMode === 'PICKUP' ? '#FFFFFF' : 'transparent',
                color: currentMode === 'PICKUP' ? activeTheme.brand : '#78716C',
                fontWeight: '800',
                fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: currentMode === 'PICKUP' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
                minWidth: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <ShoppingBag size={15} style={{ flexShrink: 0 }} /> 
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Self Pickup</span>
              </div>
              <span style={{ fontSize: 'clamp(8.5px, 2.5vw, 9.5px)', background: '#ECFDF5', color: '#059669', padding: '1px 6px', borderRadius: '6px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                FREE (₹0)
              </span>
            </button>
          </div>

          {currentMode === 'DELIVERY' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '2px', paddingRight: '2px' }}>
              <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={11} color={activeTheme.brand} style={{ flexShrink: 0 }} />
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

            <button 
              type="button"
              onClick={() => {
                setTempAddress(customer.address || '');
                setIsMapModalOpen(true);
              }} 
              style={{ 
                width: '100%', padding: '11px', borderRadius: '12px', border: '1.5px dashed rgba(197, 160, 89, 0.6)',
                background: '#FFFFFF', color: activeTheme.brand, cursor: 'pointer', fontWeight: '700', fontSize: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
            >
              <MapPin size={16} style={{ flexShrink: 0 }} /> Choose Location on Google Map
            </button>

            <div style={{ 
              background: distanceInfo.invalid ? '#FEF2F2' : (distanceInfo.source === 'gps' ? '#ECFDF5' : 'rgba(197, 160, 89, 0.1)'), 
              border: `1px solid ${distanceInfo.invalid ? '#DC2626' : (distanceInfo.source === 'gps' ? '#059669' : 'rgba(197, 160, 89, 0.4)')}`, 
              borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', fontSize: 'var(--font-body)', color: activeTheme.text, boxSizing: 'border-box', gap: '8px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                {distanceInfo.invalid && <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0 }} />}
                {distanceInfo.source === 'gps' && !distanceInfo.invalid && <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0 }} />}
                <strong style={{ whiteSpace: 'nowrap' }}>{distanceInfo.invalid ? 'Notice:' : 'Est. Distance:'}</strong> 
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{distanceInfo.km}</span>
              </span>
              <span style={{ fontWeight: '800', color: distanceInfo.invalid ? '#DC2626' : (distanceInfo.source === 'gps' ? '#059669' : activeTheme.brand), flexShrink: 0, whiteSpace: 'nowrap' }}>
                {distanceInfo.invalid ? 'Not Deliverable' : `Fee: ₹${distanceInfo.fee}`}
              </span>
            </div>

            {distanceInfo.invalid && (
              <div style={{
                background: '#FEF2F2',
                border: '1px dashed #DC2626',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '2px',
                boxSizing: 'border-box'
              }}>
                <div style={{ fontSize: 'var(--font-caption)', color: '#DC2626', fontWeight: '500', lineHeight: '1.4' }}>
                  This location is outside our delivery zone. You can switch to **Self Pickup** or reach out to us directly via WhatsApp to coordinate special arrangements.
                </div>
                {/* 💡 BULLETPROOF FLEX: minWidth: 0 ensures buttons wrap or scale nicely */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px', width: '100%', boxSizing: 'border-box' }}>
                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('PICKUP')}
                    style={{
                      flex: 1, minWidth: 0, padding: '9px 10px', background: activeTheme.brand, color: '#FFFFFF',
                      border: 'none', borderRadius: '10px', fontSize: 'var(--font-caption)', fontWeight: '800',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <ShoppingBag size={13} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Switch to Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChatAndSave("Hi, I am trying to order from an out-of-coverage location and would like to discuss options.")}
                    style={{
                      flex: 1, minWidth: 0, padding: '9px 10px', background: '#25D366', color: '#FFFFFF',
                      border: 'none', borderRadius: '10px', fontSize: 'var(--font-caption)', fontWeight: '800',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <MessageCircle size={13} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chat on WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid rgba(197, 160, 89, 0.4)', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', boxSizing: 'border-box' }}>
            <div style={{ background: 'rgba(255, 89, 88, 0.08)', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
              <MapPin size={22} color={activeTheme.brand} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: '700', color: activeTheme.text }}>Lyte Bytes Kitchen</div>
              <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', marginTop: '2px', wordBreak: 'break-word' }}>
                Prakruti Township, Babusahibpalya, Bengaluru • <strong style={{ color: '#059669', whiteSpace: 'nowrap' }}>₹0 Delivery Fee</strong>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Container */}
        <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.35)', paddingTop: '14px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: 'clamp(9.5px, 2.5vw, 11px)', fontWeight: '700', color: '#78716C', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            {currentMode === 'DELIVERY' ? 'Preferred Delivery Time (Optional)' : 'Preferred Pickup Time (Optional)'}
          </div>

          <div style={{ border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '12px', background: '#FFFFFF', padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', alignItems: 'center', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderRight: '1px solid rgba(197, 160, 89, 0.3)', paddingRight: '8px', textAlign: 'left', minWidth: 0 }}>
              <label style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '600', color: '#78716C', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} style={{ flexShrink: 0 }} /> Date
              </label>
              <input type="date" value={deliveryDate || ''} onChange={(e) => setDeliveryDate(e.target.value)} style={{ border: 'none', background: 'transparent', color: activeTheme.text, fontSize: 'var(--font-caption)', fontWeight: '600', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px', textAlign: 'left', minWidth: 0 }}>
              <label style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '600', color: '#78716C', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} style={{ flexShrink: 0 }} /> Slot / Time
              </label>
              <input type="time" value={deliveryTime || ''} onChange={(e) => setDeliveryTime(e.target.value)} style={{ border: 'none', background: 'transparent', color: activeTheme.text, fontSize: 'var(--font-caption)', fontWeight: '600', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
          <button 
            type="button"
            onClick={isFormValid ? handleProceedToPayment : () => alert(distanceInfo.invalid ? "Delivery is only available within Bengaluru. Please switch to Self Pickup or contact via WhatsApp." : "Please complete contact details and address.")} 
            disabled={!isFormValid}
            style={{ 
              ...actionButtonStyle, 
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: 'clamp(12px, 3.5vw, 15px)', 
              fontSize: 'var(--font-body)', 
              fontWeight: '600',
              borderRadius: '14px', 
              width: '100%', 
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
            }}
          >
            Proceed to Payment {distanceInfo.fee > 0 && !distanceInfo.invalid ? `(Incl. ₹${distanceInfo.fee})` : ''}
          </button>
          
          <button 
            type="button"
            onClick={() => setView('cart')}
            style={{ 
              ...secondaryButtonStyle, 
              backgroundColor: 'rgba(197, 160, 89, 0.1)', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              color: activeTheme.text,
              padding: 'clamp(10px, 3vw, 12px)', 
              fontSize: 'var(--font-body)', 
              fontWeight: '600',
              borderRadius: '14px', 
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            Back to Bag
          </button>
        </div>

      </div>

      {/* FLOATING GOOGLE MAP POPUP MODAL */}
      {isMapModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(20, 15, 12, 0.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', width: '100%', maxWidth: '480px', height: '85vh',
            borderRadius: '24px', border: '1px solid rgba(197, 160, 89, 0.4)', display: 'flex',
            flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              padding: '16px 20px', background: 'transparent', borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', fontSize: 'var(--font-h2)', color: '#FF5958', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Select Delivery Location</div>
              <button 
                onClick={() => setIsMapModalOpen(false)}
                style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}
              >
                <X size={16} color={activeTheme.text} />
              </button>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(197, 160, 89, 0.06)', borderBottom: '1px solid rgba(197, 160, 89, 0.2)', display: 'flex', gap: '8px', alignItems: 'center', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <Search size={16} color="#78716C" style={{ position: 'absolute', left: '12px', top: '12px', pointerEvents: 'none' }} />
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search street, area, or landmark..."
                  style={{
                    width: '100%', 
                    padding: '10px 10px 10px 36px', 
                    borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.4)', 
                    background: '#FFFFFF', 
                    color: activeTheme.text,
                    fontSize: 'var(--font-caption)', 
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
                  padding: '10px 14px', background: activeTheme.brand, color: '#FFFFFF', border: 'none',
                  borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255, 89, 88, 0.3)', flexShrink: 0
                }}
              >
                <Crosshair size={16} />
              </button>
            </div>

            <div ref={mapRef} style={{ flex: 1, width: '100%', background: '#eee' }} />

            <div style={{ padding: '16px 20px', background: 'transparent', borderTop: '1px solid rgba(197, 160, 89, 0.25)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: 'var(--font-caption)', color: activeTheme.text, maxHeight: '50px', overflowY: 'auto', textAlign: 'left' }}>
                <strong style={{ color: activeTheme.brand }}>Selected Address:</strong> {tempAddress || 'Drop pin or search area'}
              </div>

              <div style={{ 
                background: tempDistanceInfo.invalid ? '#FEF2F2' : '#ECFDF5', 
                border: `1px solid ${tempDistanceInfo.invalid ? '#DC2626' : '#059669'}`, 
                borderRadius: '10px', padding: '9px 12px', display: 'flex', alignItems: 'center', 
                justifyContent: 'space-between', fontSize: 'var(--font-caption)', gap: '8px'
              }}>
                <span style={{ fontWeight: '700', color: tempDistanceInfo.invalid ? '#DC2626' : '#059669', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tempDistanceInfo.invalid ? 'Out of Bengaluru Coverage' : `Est. Distance: ${tempDistanceInfo.km}`}
                </span>
                <span style={{ fontWeight: '800', color: tempDistanceInfo.invalid ? '#DC2626' : '#059669', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {tempDistanceInfo.invalid ? 'Unavailable' : `Fee: ₹${tempDistanceInfo.fee}`}
                </span>
              </div>

              {tempDistanceInfo.invalid ? (
                <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                  <button 
                    type="button"
                    onClick={() => setIsMapModalOpen(false)}
                    style={{ flex: 1, minWidth: 0, padding: '11px', background: '#78716C', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: 'var(--font-caption)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChatAndSave("Hi, I am trying to order from an out-of-coverage location via map pin and would like to discuss options.")}
                    style={{
                      flex: 1, minWidth: 0, padding: '11px', background: '#25D366', color: '#FFFFFF',
                      border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: 'var(--font-caption)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}
                  >
                    <MessageCircle size={14} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chat on WhatsApp</span>
                  </button>
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
                    width: '100%', padding: '13px', background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', color: '#FFFFFF',
                    border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: 'var(--font-body)', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
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
        <DeliveryPolicyModalContent brandColor={activeTheme.brand} />
      </PolicyModal>

      {/* Privacy & Compliance Modal */}
      <PolicyModal 
        isOpen={isPrivacyPolicyOpen} 
        onClose={() => setIsPrivacyPolicyOpen(false)} 
        title="Data Privacy" 
        theme={activeTheme}
      >
        <PrivacyPolicyModalContent brandColor={activeTheme.brand} />
      </PolicyModal>
    </div>
  );
}