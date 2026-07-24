import React, { useState, useEffect } from 'react';
import HomeAndSubCategoryView from './components/HomeAndSubCategoryView';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import MultiVariantDrawer from './components/MultiVariantDrawer';
import StickyCartBar from './components/StickyCartBar';
import OffersTab from './components/OffersTab';
import ItemsView from './components/ItemsView';
import CartView from './components/CartView';
import TrackView from './components/TrackView';
import Header from './components/Header';
import Footer from './components/Footer';
import { trackAbandonedLead } from './components/leadTracker';
import Papa from 'papaparse';
import { Home, ShoppingBag, Truck, ArrowLeft, Plus, Minus, MapPin, CheckCircle, Info, ChevronDown, ChevronUp, Grid, List as ListIcon, Phone, Mail, MessageSquare, X } from 'lucide-react';

// --- IMAGE RESOLVER ---
const resolveImagePath = (path, folder = '') => {
  if (!path) return "/catering.jpg";
  if (path.startsWith('http')) return path;
  
  // If a folder is specified (like 'menu-items'), prepend it
  const base = folder ? `/${folder}/` : "/";
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${base}${cleanPath}`;
};

// --- THEME ---
const appTheme = {
  bg: '#FDF6E3',
  text: '#2B2B2B',
  brand: '#FF5958',
  buttonBg: '#4A443A',
  border: '1px solid #D8C7A5',
  radius: '12px'
};

// --- SHARED STYLES ---
const navButtonStyle = { 
  width: '100%', padding: '16px', marginBottom: '12px', backgroundColor: appTheme.buttonBg, color: appTheme.bg, border: 'none', borderRadius: appTheme.radius, fontWeight: '600', fontSize: '18px', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
};

const actionButtonStyle = { 
  width: '100%', padding: '16px', marginBottom: '12px', backgroundColor: appTheme.buttonBg, color: appTheme.bg, border: 'none', borderRadius: appTheme.radius, fontWeight: '600', fontSize: '18px', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
};

const secondaryButtonStyle = {
  ...actionButtonStyle, backgroundColor: 'transparent', border: `1px solid ${appTheme.buttonBg}`, color: appTheme.buttonBg,
};

const unifiedTaglineStyle = { 
  fontSize: '20px', color: appTheme.brand, textAlign: 'center', margin: '15px 0', fontWeight: '500', letterSpacing: '0.5px' 
};

const backButtonStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '16px', color: appTheme.text
};

const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '12px', borderRadius: appTheme.radius, border: appTheme.border, fontSize: '16px', boxSizing: 'border-box'
};

const accordionHeaderStyle = { 
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', padding: '12px 15px', border: appTheme.border, borderRadius: appTheme.radius, cursor: 'pointer', color: appTheme.brand, fontWeight: 'bold', backgroundColor: 'transparent', marginBottom: '10px'
};

// --- HELPER FOR PERSISTENCE ---
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [view, setView] = useState('home');
  const [activeModal, setActiveModal] = useState({ type: null, data: null });
  const openModal = (type, data) => setActiveModal({ type, data });
  const closeModal = () => setActiveModal({ type: null, data: null });
  const [activeTab, setActiveTab] = useState('home');
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isNonVeg, setIsNonVeg] = useState(null);
  const [layout, setLayout] = useState('list');
  const [cart, setCart] = useLocalStorage('app_cart', []);
  const [customer, setCustomer] = useLocalStorage('app_customer', { name: '', phone: '', email: '', address: '' });
  const [payment, setPayment] = useState(null);
  const [showConditions, setShowConditions] = useState(false);
  const [showTC, setShowTC] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMode, setPaymentMode] = useState(null);
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const UPI_MAPPINGS = {
    'Google Pay': 'rosemarycloney-3@okicici',
    'PhonePe': '9108286886',
    'Paytm': '9108286886@ptaxis'
  };

  const [currentStage, setCurrentStage] = useState(1);

  // --- THEME ---
  const theme = {
    bg: '#FDF6E3',          // Warm Beige
    text: '#2B2B2B',        // Main text
    brand: '#FF5958',       // Brand Red
    buttonBg: '#4A443A',    // Deep Earthy Coffee
    border: '1px solid #D8C7A5',
    radius: '12px'
  };

  useEffect(() => {
    if (view === 'track') {
      const styleTag = document.getElementById('confetti-restart-style') || document.createElement('style');
      styleTag.id = 'confetti-restart-style';
      styleTag.innerHTML = `
        @keyframes fallRandom {
          0% { transform: translateY(-30px) translateX(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.9; }
          70% { opacity: 0.9; }
          100% { transform: translateY(400px) translateX(-8px) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, [view]);

  const categoryImages = {
    "Ammis Achar": "pickles.png",
    "Bakery & Cakes": "bakery.png",
    "Catering": "catering.png",
    "Finger Foods": "finger-foods.png",
    "Jams & Spreads": "jams.png",  
  };

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuPMBHUCj8co8CfPSr-SmsXsB3cWZEfi0rcViHNjLeFiVXX85X7a_aNiCz57sSp0Qf/exec';

  const handleFieldBlur = (fieldName, value) => {
    trackAbandonedLead(fieldName, value, customer, cart, GOOGLE_SCRIPT_URL);
  };

  // --- GOOGLE SHEET DATA FETCHING ---
  const [menuData, setMenuData] = useState(null);

  // 1. UPDATED useEffect (Handles variants/grouping)
  useEffect(() => {
    const timestamp = new Date().getTime();
    const CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vR35Ed3Gcjjj3SLQvZWaLEahaM9QYPmdVvnGoFOefqmA544Jtcr3xR2QVj8Yy1tk-mjh4DVQarYB7Yh/pub?output=csv&t=${timestamp}`;

    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("Full Data Received:", results.data);
        const transformed = {};

        results.data.forEach((row) => {
          if (row.Availability?.toString().trim().toUpperCase() !== 'TRUE') return;
          if (!row.Category) return;

          if (!transformed[row.Category]) {
            transformed[row.Category] = { 
              imageUrl: categoryImages[row.Category] || "/catering.jpg", 
              subcategories: {} 
            };
          } 
          if (!transformed[row.Category].subcategories[row.Sub_Category]) {
            transformed[row.Category].subcategories[row.Sub_Category] = [];
          }

          const subList = transformed[row.Category].subcategories[row.Sub_Category];
          const existingItem = subList.find(i => i.name === row.Item_Name);

          if (existingItem) {
            if (!existingItem.variants) {
              existingItem.variants = [
                { label: existingItem.unit, price: existingItem.price },
                { label: row.Unit, price: parseFloat(row.Price) || 0 }
              ];
              delete existingItem.unit;
              delete existingItem.price;
            } else {
              existingItem.variants.push({ label: row.Unit, price: parseFloat(row.Price) || 0 });
            }
          } else {
            subList.push({
              name: row.Item_Name,
              price: parseFloat(row.Price) || 0,
              description: row.Description || "",
              highlights: row.Highlights || "",
              unit: row.Unit || "",
              variation: row.Variation || "",
              imageUrl: row.Img_name,
              isCustomisable: row.Customisable?.trim().toLowerCase() === 'yes'
            });
          }
        });

        setMenuData(transformed);
      }
    });
  }, []);

  // 2. UPDATED addToCart (Handles variants)
  const addToCart = (item) => {
    setCart((prev) => {
      const itemPrice = parseFloat(item.price) || 0;
      const exists = prev.find(i => i.name === item.name && i.unit === item.unit);
      
      if (exists) {
        return prev.map((i) =>
          (i.name === item.name && i.unit === item.unit)
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            qty: 1,
            price: itemPrice,
            unit: item.unit || ""
          }
        ];
      }
    });
  };

  const removeFromCart = (name) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item.name === name) {
        if (item.qty > 1) acc.push({...item, qty: item.qty - 1});
      } else acc.push(item);
      return acc;
    }, []));
  };

  const handleProceedToDelivery = () => {
    if (cart.length === 0) {
        alert("Your bag is empty! Please add items to proceed.");
        return;
    }
    setView('delivery');
  };

  const handleProceedToPayment = () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert("Please provide your Name and Mobile Number to proceed.");
      return;
    }
    if (!/^\d{10}$/.test(customer.phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    setView('payment');
  };

  const handleUPIPayment = () => {
      const upiLink = "upi://pay?pa=rosemarycloney-3@okicici&pn=LyteBytes&cu=INR";
      window.location.href = upiLink;
  };

  if (!menuData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading menu...</div>;

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor: theme.bg, color: theme.text, fontFamily: 'system-ui, sans-serif' }}>
      <Header theme={theme} />
      <main style={{ flex: 1, paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', overflowY: 'auto' }}>
  {/* Main views/content render here */}
{/* Render Offers Tab */}
{view === 'offers' && <OffersTab theme={theme} />}

{/* Render Home / Cart / Subcategories when view is 'home' or related sub-views */}
{(view === 'home' || view === 'subcat' || view === 'items') && (
  <HomeAndSubCategoryView 
    view={view}
    theme={theme}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    layout={layout}
    setLayout={setLayout}
    menuData={menuData}
    activeCat={activeCat}
    setActiveCat={setActiveCat}
    setActiveSub={setActiveSub}
    setView={setView}
    openModal={openModal}
    addToCart={addToCart}
    resolveImagePath={resolveImagePath}
  />
)}

{view === 'items' && (
  <ItemsView 
    setView={setView}
    backButtonStyle={backButtonStyle}
    theme={theme}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    isNonVeg={isNonVeg}
    setIsNonVeg={setIsNonVeg}
    layout={layout}
    setLayout={setLayout}
    menuData={menuData}
    activeCat={activeCat}
    activeSub={activeSub}
    openModal={openModal}
    addToCart={addToCart}
    resolveImagePath={resolveImagePath}
  />
)}

{view === 'cart' && (
  <CartView 
    setView={setView}
    backButtonStyle={backButtonStyle}
    theme={theme}
    cart={cart}
    removeFromCart={removeFromCart}
    addToCart={addToCart}
    total={total}
    handleProceedToDelivery={handleProceedToDelivery}
    actionButtonStyle={actionButtonStyle}
    secondaryButtonStyle={secondaryButtonStyle}
  />
)}

{view === 'track' && (
  <TrackView 
    setView={setView}
    currentStage={currentStage}
    theme={theme}
    backButtonStyle={backButtonStyle}
    actionButtonStyle={actionButtonStyle}
    secondaryButtonStyle={secondaryButtonStyle}
    setCart={setCart}
    cart={cart}
  />
)}

  {view === 'delivery' && (
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
        <ArrowLeft size={18}/> Back to Bag
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
        
      {/* Google Maps Location Pin Prompt & Launcher */}
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
          ...secondaryButtonStyle, 
          marginTop: '0px', 
          marginBottom: '5px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          border: `2px dashed ${theme.brand}`,
          color: theme.brand,
          background: 'transparent',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        <MapPin size={18} /> Drop Location Pin
      </button>

      {/* ALIGNED PREFERRED DELIVERY SELECTOR */}
      <div style={{ margin: '5px 0', borderTop: `1px dashed #E5D6B5`, paddingTop: '12px', boxSizing: 'border-box', width: '100%' }}>
        <h2 style={{ color: theme.brand, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Preferred Delivery (optional)</h2>
        
        {/* Date Field */}
        <div style={{ marginBottom: '10px', boxSizing: 'border-box', width: '90%' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Date</label>
          <input 
            type="date" 
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            style={{ ...inputStyle, border: theme.border, width: '100%', background: theme.bg, color: theme.text, boxSizing: 'border-box' }} 
          />
        </div>

        {/* Time Field */}
        <div style={{ marginBottom: '6px', boxSizing: 'border-box', width: '90%' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Time</label>
          <input 
            type="time" 
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            style={{ ...inputStyle, border: theme.border, width: '100%', background: theme.bg, color: theme.text, boxSizing: 'border-box' }} 
          />
        </div>
        
        <p style={{ fontSize: '11px', color: '#776E62', fontStyle: 'italic', marginTop: '4px' }}>
          *Leave blank for earliest delivery.
        </p>
      </div>

      {/* Delivery Conditions Section */}
      <div style={{ marginBottom: '10px', boxSizing: 'border-box', width: '100%' }}>
        <div onClick={() => setShowConditions(!showConditions)} style={{ ...accordionHeaderStyle, border: theme.border, background: theme.bg, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: theme.text, fontSize: '13px' }}>
            <Info size={16} color={theme.brand} /> Delivery Conditions
          </span>
          {showConditions ? <ChevronUp size={16} color={theme.brand}/> : <ChevronDown size={16} color={theme.brand}/>}
        </div>
        {showConditions && (
          <div style={{ marginTop: '8px', padding: '12px', border: theme.border, borderRadius: '8px', backgroundColor: '#FFFBF2', fontSize: '12px', textAlign: 'left', color: '#2B2B2B', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4', boxSizing: 'border-box', width: '100%' }}>
            <p style={{ margin: 0 }}><strong>Delivery Slots:</strong> We offer morning (8–11am), afternoon (12–2pm), and evening (5–8pm) slots. Please specify your preferred slot in the address field.</p>
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

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
        <button onClick={handleProceedToPayment} style={{ ...actionButtonStyle, border: theme.border, marginBottom: 0, padding: '14px', fontSize: '15px', borderRadius: theme.radius, width: '100%', boxSizing: 'border-box' }}>
          Proceed to Payment
        </button>
        <button onClick={() => setView('home')} style={{ ...secondaryButtonStyle, border: theme.border, marginBottom: 0, padding: '14px', fontSize: '15px', borderRadius: theme.radius, width: '100%', boxSizing: 'border-box' }}>
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
)}
        {view === 'payment' && (
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

      {/* Expanded UPI Options & Auto-Pick Section */}
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
    <span style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase' }}>Choose UPI App or Enter ID</span>
    
    {/* Specific Apps Selection Grid with Auto-Linked Handles */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
      {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
        <button
          key={app}
          onClick={() => {
            setUpiApp(app);
            setUpiId(UPI_MAPPINGS[app]);
          }}
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
          {app}
        </button>
      ))}
    </div>

    {/* Manual / Auto-Selected UPI ID Display */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase' }}>Selected UPI ID / VPA</label>
        <span style={{ fontSize: '11px', fontWeight: '700', color: theme.brand }}>
          {upiApp ? `${upiApp} Linked` : 'Select an app above'}
        </span>
      </div>
      <input 
        type="text"
        placeholder="e.g. username@okhdfcbank"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        style={{ ...inputStyle, border: theme.border, background: '#FFFBF2', color: theme.text, fontSize: '13px', boxSizing: 'border-box', width: '100%', padding: '10px' }}
      />
    </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%', marginTop: '10px' }}>
        <button 
          onClick={() => { if (!payment) { alert("Please select a payment method (Cash or UPI) to proceed."); return; } setView('track'); }} 
          style={{ ...actionButtonStyle, border: theme.border, marginBottom: 0, padding: '14px', fontSize: '15px', borderRadius: theme.radius, width: '100%', boxSizing: 'border-box', opacity: payment ? 1 : 0.6 }}
        >
          Place Order
        </button>
        <button 
          onClick={() => setView('home')} 
          style={{ ...secondaryButtonStyle, border: theme.border, marginBottom: 0, padding: '14px', fontSize: '15px', borderRadius: theme.radius, width: '100%', boxSizing: 'border-box' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
)}

{view?.toLowerCase() === 'info' && (
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
              <h2 style={{ color: theme.brand, margin: 0, fontSize: '18px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Support & Info</h2>
              <div style={{ width: '75px' }}></div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px', padding: '0 4px' }}>
              <p style={{ color: '#776E62', fontSize: '13.5px', margin: 0, lineHeight: '1.4' }}>We're here to help. Reach out to us or review our policies below.</p>
            </div>

            {/* Aligned Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <a href="https://wa.me/9108286886" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#FFFFFF', border: theme.border, borderRadius: theme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ backgroundColor: '#E8F5E9', width: '44px', height: '44px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageSquare size={22} color="#2D8A56" />
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '15px', fontWeight: '700' }}>WhatsApp Support</h3>
                    <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>Quickest way to get assistance</p>
                  </div>
                </div>
              </a>

              <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#FFFFFF', border: theme.border, borderRadius: theme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ backgroundColor: '#FFF0F0', width: '44px', height: '44px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={22} color={theme.brand} />
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '15px', fontWeight: '700' }}>Email Us</h3>
                    <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>For detailed queries and requests</p>
                  </div>
                </div>
              </a>

              <a href="https://g.page/r/CRodKxCU6unDEBM/review" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#FFFFFF', border: theme.border, borderRadius: theme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ backgroundColor: '#FFFBF2', width: '44px', height: '44px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle size={22} color="#F5B041" />
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '15px', fontWeight: '700' }}>Give Feedback</h3>
                    <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>Rate your experience with us</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Legal & Policies */}
            <h3 style={{ color: theme.text, fontSize: '15px', fontWeight: '700', marginBottom: '12px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal & Policies</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* T&C Accordion */}
              <div>
                <div onClick={() => setShowTC(!showTC)} style={{ ...accordionHeaderStyle, backgroundColor: '#FFFFFF', padding: '18px 20px', marginBottom: 0, justifyContent: 'space-between', color: theme.text, boxShadow: '0 1px 4px rgba(0,0,0,0.02)', zIndex: 2, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Info size={18} color={theme.buttonBg} /> 
                    <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Terms & Conditions</span>
                  </div>
                  {showTC ? <ChevronUp size={18} color={theme.brand}/> : <ChevronDown size={18} color={theme.brand}/>}
                </div>
                {showTC && (
                  <div style={{ padding: '20px', fontSize: '13px', lineHeight: '1.6', color: '#4A4A4A', border: theme.border, borderTop: 'none', borderRadius: `0 0 ${theme.radius} ${theme.radius}`, background: '#FAFAFA', marginTop: '-8px' }}>
                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                      <li><strong>Order Acceptance:</strong> All orders are subject to availability. We reserve the right to refuse or cancel orders.</li>
                      <li><strong>Order Cut-off Time:</strong> Orders must be placed in advance to ensure freshness.</li>
                      <li><strong>FSSAI Registration:</strong> Lyte Bytes holds a valid FSSAI Registration for manufacturing, storage, and distribution.</li>
                      <li><strong>Allergen Warning:</strong> Prepared in a home kitchen that may handle common allergens (nuts, gluten, dairy).</li>
                      <li><strong>Hygiene Standards:</strong> Prepared in a clean, hygienic home kitchen adhering to strict health standards.</li>
                      <li><strong>Refunds & Cancellations:</strong> Due to perishable food nature, returns, cancellations, and refunds are not accepted once placed.</li>
                      <li><strong>Payments:</strong> Payments must be made in full at the time of order placement.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Privacy Policy Accordion */}
              <div>
                <div onClick={() => setShowPrivacy(!showPrivacy)} style={{ ...accordionHeaderStyle, backgroundColor: '#FFFFFF', padding: '18px 20px', marginBottom: 0, justifyContent: 'space-between', color: theme.text, boxShadow: '0 1px 4px rgba(0,0,0,0.02)', zIndex: 2, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={18} color={theme.buttonBg} /> 
                    <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Privacy Policy</span>
                  </div>
                  {showPrivacy ? <ChevronUp size={18} color={theme.brand}/> : <ChevronDown size={18} color={theme.brand}/>}
                </div>
                {showPrivacy && (
                  <div style={{ padding: '20px', fontSize: '13px', lineHeight: '1.6', color: '#4A4A4A', border: theme.border, borderTop: 'none', borderRadius: `0 0 ${theme.radius} ${theme.radius}`, background: '#FAFAFA', marginTop: '-8px' }}>
                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                      <li><strong>Data Collection:</strong> We collect your name, phone number, and address strictly to fulfill your orders and deliveries.</li>
                      <li><strong>Third Parties:</strong> We do not sell your personal data; delivery info is shared only with logistics partners.</li>
                      <li><strong>Security:</strong> We take all reasonable precautions to secure your data and retain it only as long as necessary.</li>
                      <li><strong>Cookies:</strong> We do not use tracking cookies on our application.</li>
                      <li><strong>Your Rights:</strong> Request deletion of your data anytime via WhatsApp or email.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


</main>
    {/* Floating Interactive Footer Dock */}
    <Footer view={view} setView={setView} theme={theme} />
      {activeModal.type === 'ZOOM' && (
        <ItemModal 
          selectedItem={activeModal.data} 
          setSelectedItem={closeModal} 
          addToCart={addToCart}
          theme={theme}
          resolveImagePath={resolveImagePath} 
        />
      )}

      {activeModal.type === 'VARIANTS' && (
        <MultiVariantDrawer 
          selectedItem={activeModal.type === 'VARIANTS' ? activeModal.data : null} 
          setSelectedItem={(item) => setActiveModal({ type: item ? 'VARIANTS' : null, data: item })} 
          addToCart={addToCart} 
        />
      )}
{/* Hides the pill when inside Cart, Delivery, Payment, or Tracking views */}
      {!['cart', 'delivery', 'payment', 'track'].includes(view) && (
        <StickyCartBar 
          cart={cart} 
          onViewCart={() => setView('cart')} 
        />
      )}
    </div>
  );
}