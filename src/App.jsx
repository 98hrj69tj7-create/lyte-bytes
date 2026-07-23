import React, { useState, useEffect } from 'react';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import MultiVariantDrawer from './components/MultiVariantDrawer';
import StickyCartBar from './components/StickyCartBar';
import Header from './components/Header';
import Footer from './components/Footer';
import { trackAbandonedLead } from './components/leadTracker';
import Papa from 'papaparse';
import { Home, ShoppingBag, Truck, ArrowLeft, Plus, Minus, MapPin, CheckCircle, Info, ChevronDown, ChevronUp, Grid, List as ListIcon, Phone, Mail, MessageSquare, X } from 'lucide-react';

// --- THEME ---
const theme = { 
  bg: '#FDF6E3',        // Warm Beige
  text: '#2B2B2B',        // Main text
  brand: '#FF5958',       // Brand Red
  buttonBg: '#4A443A',    // Deep Earthy Coffee
  border: '1px solid #D8C7A5',
  radius: '12px' 
};

// --- IMAGE RESOLVER ---
const resolveImagePath = (path, folder = '') => {
  if (!path) return "/catering.jpg";
  if (path.startsWith('http')) return path;
  
  // If a folder is specified (like 'menu-items'), prepend it
  const base = folder ? `/${folder}/` : "/";
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${base}${cleanPath}`;
};

// --- SHARED STYLES ---
const navButtonStyle = { 
  width: '100%', padding: '16px', marginBottom: '12px', backgroundColor: theme.buttonBg, color: theme.bg, border: 'none', borderRadius: theme.radius, fontWeight: '600', fontSize: '18px', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
};

const actionButtonStyle = { 
  width: '100%', padding: '16px', marginBottom: '12px', backgroundColor: theme.buttonBg, color: theme.bg, border: 'none', borderRadius: theme.radius, fontWeight: '600', fontSize: '18px', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
};

const secondaryButtonStyle = {
  ...actionButtonStyle, backgroundColor: 'transparent', border: `1px solid ${theme.buttonBg}`, color: theme.buttonBg,
};

const unifiedTaglineStyle = { 
  fontSize: '20px', color: theme.brand, textAlign: 'center', margin: '15px 0', fontWeight: '500', letterSpacing: '0.5px' 
};

const backButtonStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '16px', color: theme.text
};

const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '12px', borderRadius: theme.radius, border: theme.border, fontSize: '16px', boxSizing: 'border-box'
};

const accordionHeaderStyle = { 
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', padding: '12px 15px', border: theme.border, borderRadius: theme.radius, cursor: 'pointer', color: theme.brand, fontWeight: 'bold', backgroundColor: 'transparent', marginBottom: '10px'
};

export default function App() {
  const [view, setView] = useState('home');
  const [activeModal, setActiveModal] = useState({ type: null, data: null }); // Replace your separate states with this one
  const openModal = (type, data) => setActiveModal({ type, data }); // Helper to open a specific modal
  const closeModal = () => setActiveModal({ type: null, data: null }); // Helper to open a specific modal
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Veg', 'Non-Veg'
  const [isNonVeg, setIsNonVeg] = useState(null);   // In your state declarations
  const [layout, setLayout] = useState('list');
  const [cart, setCart] = useLocalStorage('app_cart', []);
  const [customer, setCustomer] = useLocalStorage('app_customer', { name: '', phone: '', email: '', address: '' });
  const [payment, setPayment] = useState(null);
  const [showConditions, setShowConditions] = useState(false);
  const [showTC, setShowTC] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMode, setPaymentMode] = useState(null); // Tracks 'Cash' or 'UPI'
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const UPI_MAPPINGS = {
  'Google Pay': 'rosemarycloney-3@okicici',
  'PhonePe': '9108286886',
  'Paytm': '9108286886@ptaxis'};
  const [currentStage, setCurrentStage] = useState(2); // Set default active stage (1 to 5)
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
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuPMBHUCj8co8CfPSr-SmsXsB3cWZEfi0rcViHNjLeFiVXX85X7a_aNiCz57sSp0Qf/exec'// Paste your actual script URL here
const handleFieldBlur = (fieldName, value) => {
  trackAbandonedLead(fieldName, value, customer, cart, GOOGLE_SCRIPT_URL);};

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
        // Availability Check
        if (row.Availability?.toString().trim().toUpperCase() !== 'TRUE') return;
        if (!row.Category) return;

        // Initialize structures
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
    // 1. Ensure price is a clean number
    const itemPrice = parseFloat(item.price) || 0;
    
    // 2. Identify the item uniquely by its name AND its specific unit/variant
    // This prevents 500g and 1000g from being merged incorrectly
    const exists = prev.find(i => i.name === item.name && i.unit === item.unit);
    
    if (exists) {
      // If it exists, just increment the quantity
      return prev.map((i) =>
        (i.name === item.name && i.unit === item.unit)
          ? { ...i, qty: i.qty + 1 }
          : i
      );
    } else {
      // 3. If new, add to cart with the specific price and unit
      return [
        ...prev,
        {
          ...item,
          qty: 1,
          price: itemPrice, // This is the numeric price passed from the modal/card
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
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position:'fixed',top:0, left:0, right:0, bottom:0,backgroundColor: theme.bg, color: theme.text, fontFamily: 'system-ui, sans-serif' }}>
      <Header theme={theme} />
      <main style={{ flex: 1, paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px', overflowY: 'auto' }}>
        
{view === 'home' && (
  <div style={{ paddingBottom: '20px' }}>
    <h1 style={{ 
      fontSize: '17px', 
      color: theme.brand, 
      textAlign: 'center', 
      margin: '10px 0 10px 0', 
      fontWeight: '600', 
      letterSpacing: '0.5px',
      textTransform: 'uppercase' 
    }}>
      Freshly crafted for YOU
    </h1>

    {/* Perfectly Aligned Catchy Pulsing Search Bar */}
    <div style={{ marginBottom: '20px', padding: '0 2px' }}>
      <input 
        type="text"
        placeholder="Search all items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="catchy-search-input"
        style={{
          width: '100%',
          padding: '14px 18px',
          border: '2px solid #ff5958',
          borderRadius: theme.radius,
          backgroundColor: theme.bg,
          color: theme.text,
          fontSize: '15px',
          fontWeight: '500',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>

    {/* If typing in search, show matching items instantly */}
    {searchQuery.trim() ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: theme.text }}>Search Results</span>
          <button 
            onClick={() => setSearchQuery('')} 
            style={{ background: 'none', border: 'none', color: theme.brand, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            Clear
          </button>
        </div>

        {/* Layout Toggles for Search */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '4px' }}>
          <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ListIcon size={18} color={layout === 'list' ? theme.bg : theme.text}/>
          </button>
          <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Grid size={18} color={layout === 'grid' ? theme.bg : theme.text}/>
          </button>
        </div>

        <div style={{ 
          display: layout === 'grid' ? 'grid' : 'flex', 
          gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', 
          flexDirection: 'column', 
          gap: '14px' 
        }}>
          {Object.values(menuData).flatMap(cat => Object.values(cat.subcategories).flat())
            .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((item, i) => (
              <ItemCard 
                key={i}
                item={item} 
                openModal={openModal} 
                addToCart={addToCart} 
                resolveImagePath={resolveImagePath} 
                layout={layout}
                theme={theme}
              />
            ))}
        </div>
      </div>
    ) : (
      /* Polished Category List Cards */
<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '30px' }}>
  {Object.keys(menuData).map(cat => (
    <div 
      key={cat} 
      onClick={() => { setActiveCat(cat); setActiveSub(null); setView('subcat'); }} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '5px 16px', 
        backgroundColor: theme.buttonBg, 
        border: theme.border, 
        borderRadius: theme.radius, 
        cursor: 'pointer',
        boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.1s ease'
      }}
    >
      <img 
        src={resolveImagePath(menuData[cat].imageUrl)} 
        alt={cat} 
        style={{ 
          width: '56px', 
          height: '56px', 
          objectFit: 'cover', 
          borderRadius: '10px', 
          marginRight: '16px', 
          flexShrink: 0 
        }} 
      />
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        color: '#E8E4D9', 
        letterSpacing: '0.4px' 
      }}>
        {cat}
      </div>
    </div>
  ))}
</div>
    )}
  </div>
)}

{view === 'subcat' && (
  <div style={{ paddingBottom: '90px' }}>
    <button 
      onClick={() => setView('home')} 
      style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        color: theme.text, 
        fontSize: '15px',
        fontWeight: '600',
        padding: '4px 0',
        marginBottom: '6px'
      }}
    >
      <ArrowLeft size={18}/> Back
    </button>
    <h2 style={{ 
      fontSize: '18px', 
      color: theme.brand, 
      margin: '8px 0 16px 0', 
      fontWeight: '700', 
      letterSpacing: '0.5px',
      textAlign: 'center',
      textTransform: 'uppercase'
    }}>
      {activeCat}
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {activeCat && menuData[activeCat]?.subcategories && Object.keys(menuData[activeCat].subcategories).map(sub => (
        <button 
          key={sub} 
          onClick={() => { setActiveSub(sub); setView('items'); }} 
          style={{ 
            width: '100%', 
            padding: '14px 18px', 
            textAlign: 'left', 
            fontSize: '15px', 
            fontWeight: '600', 
            backgroundColor: theme.buttonBg, 
            border: theme.border, 
            borderRadius: theme.radius, 
            color: '#E8E4D9',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
        >
          {sub}
        </button>
      ))}
    </div>
  </div>
)}

{view === 'items' && (
  <div style={{ paddingBottom: '90px' }}>
    <button 
      onClick={() => setView('subcat')} 
      style={{ ...backButtonStyle, marginBottom: '10px' }}
    >
      <ArrowLeft size={20}/> Back
    </button>

    {/* 1. Uniform Global Search Bar */}
    <div style={{ marginBottom: '18px', padding: '0 2px' }}>
      <input 
        type="text"
        placeholder="Search all items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="catchy-search-input"
        style={{
          width: '100%',
          padding: '14px 18px',
          border: '2px solid #ff5958',
          borderRadius: theme.radius,
          backgroundColor: theme.bg,
          color: '#3E3328',
          fontSize: '15px',
          fontWeight: '500',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>

    {/* 2. Premium Slide Toggle Switch */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
      <span 
        onClick={() => setIsNonVeg(false)}
        style={{ fontSize: '13px', fontWeight: '700', color: isNonVeg === false ? '#2D8A56' : '#aaa', cursor: 'pointer' }}
      >VEG</span>
      
      <div 
        onClick={() => setIsNonVeg(isNonVeg === null ? false : !isNonVeg)}
        style={{ 
          width: '50px', height: '26px', 
          background: isNonVeg === null ? '#ccc' : (isNonVeg ? '#D32F2F' : '#2D8A56'), 
          borderRadius: '25px', position: 'relative', cursor: 'pointer', transition: '0.4s' 
        }}
      >
        <div style={{ 
          width: '22px', height: '22px', background: 'white', borderRadius: '50%', 
          position: 'absolute', top: '2px', left: isNonVeg === null ? '14px' : (isNonVeg ? '26px' : '2px'), transition: '0.4s' 
        }} />
      </div>
      
      <span 
        onClick={() => setIsNonVeg(true)}
        style={{ fontSize: '13px', fontWeight: '700', color: isNonVeg === true ? '#D32F2F' : '#aaa', cursor: 'pointer' }}
      >NON-VEG</span>
    </div>

    {/* 3. Grid/List Layout Toggles */}
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '15px' }}>
      <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <ListIcon size={20} color={layout === 'list' ? '#E8E4D9' : theme.text}/>
      </button>
      <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <Grid size={20} color={layout === 'grid' ? '#E8E4D9' : theme.text}/>
      </button>
    </div>

    {/* 4. Filtered Item List */}
    <div style={{ 
      display: layout === 'grid' ? 'grid' : 'flex', 
      gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : 'none', 
      flexDirection: 'column', 
      gap: '16px' 
    }}>
      {(searchQuery 
        ? Object.values(menuData).flatMap(cat => Object.values(cat.subcategories).flat())
        : (activeCat && activeSub && menuData[activeCat]?.subcategories[activeSub] ? menuData[activeCat].subcategories[activeSub] : [])
      )
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (isNonVeg === null) return matchesSearch;
        const v = item.variation ? item.variation.trim().toLowerCase() : '';
        if (!isNonVeg) return matchesSearch && (v === 'veg' || v === 'egg');
        return matchesSearch && (v === 'non-veg' || v === 'egg');
      })
      .map((item, i) => (
        <ItemCard 
          key={i}
          item={item} 
          openModal={openModal} 
          addToCart={addToCart} 
          resolveImagePath={resolveImagePath} 
          layout={layout}
          theme={theme}
        />
      ))}
    </div>
  </div>
)}

{view === 'cart' && (
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
        {/* Uniformly Aligned Item List with Theme Colors */}
        {cart.map((item, index) => (
          <div key={`${item.name}-${item.unit}`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: index < cart.length - 1 ? `1px dashed #E5D6B5` : 'none', 
            gap: '12px'
          }}>
            {/* Left: Name & Unit anchored flush left */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
              <span style={{ fontWeight: '700', fontSize: '15px', color: theme.text, lineHeight: '1.3' }}>
                {item.name}
              </span>
              <span style={{ fontSize: '12px', color: '#776E62', fontWeight: '600', fontStyle: 'italic', marginTop: '2px' }}>
                {item.unit}
              </span>
            </div>

            {/* Right Group: Quantity Pill Controls, Price, and Delete Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {/* Quantity Pill Controls */}
              <div style={{ display: 'flex', alignItems: 'center', border: theme.border, borderRadius: '8px', overflow: 'hidden', background: theme.bg }}>
                <button onClick={() => removeFromCart(item.name)} style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', color: theme.brand, fontWeight: 'bold' }}>-</button>
                <span style={{ padding: '0 2px', fontSize: '13px', fontWeight: '700', color: theme.text, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => addToCart(item)} style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', color: '#2D8A56', fontWeight: 'bold' }}>+</button>
              </div>

              {/* Price */}
              <span style={{ fontWeight: '700', fontSize: '15px', color: theme.brand, minWidth: '50px', textAlign: 'right' }}>
                ₹{(item.price || 0) * item.qty}
              </span>

              {/* Delete Button */}
              <button onClick={() => removeFromCart(item.name)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Bill Summary Section */}
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

        {/* Action Buttons */}
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
        placeholder="Enter WhatsApp / Mobile Number"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        onBlur={(e) => handleFieldBlur('phone', e.target.value)}
        style={inputStyle}
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
        <div style={{ marginBottom: '10px', boxSizing: 'border-box', width: '100%' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Date</label>
          <input 
            type="date" 
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            style={{ ...inputStyle, border: theme.border, width: '90%', background: theme.bg, color: theme.text, boxSizing: 'border-box' }} 
          />
        </div>

        {/* Time Field */}
        <div style={{ marginBottom: '6px', boxSizing: 'border-box', width: '100%' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Time</label>
          <input 
            type="time" 
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            style={{ ...inputStyle, border: theme.border, width: '90%', background: theme.bg, color: theme.text, boxSizing: 'border-box' }} 
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
            <p><strong>Delivery Slots:</strong> We offer morning (8–11am), afternoon (12–2pm), and evening (5–8pm) slots. Please specify your preferred slot in the address field.</p>
            <p><strong>Order Tracking:</strong> After placing your order, you can track its status in the 'Track' section.</p>
            <p><strong>Timelines:</strong> Standard delivery takes 24–48 hours from order confirmation.</p>
            <p><strong>Areas:</strong> We currently deliver within Bengaluru.</p>
            <p><strong>Delivery Partners:</strong> We partner with reliable local delivery services to ensure timely deliveries.</p>
            <p><strong>Fees:</strong> Delivery charges are calculated at checkout based on location.</p>
            <p><strong>Address Accuracy:</strong> Please ensure your delivery address is complete and accurate to avoid delays.</p>
            <p><strong>Delivery Delays:</strong> While we strive for timely deliveries, unforeseen circumstances (e.g., traffic, weather) may cause delays.</p>
            <p><strong>Customer Support:</strong> For any delivery-related queries, please contact us via WhatsApp at +91 91082 86886 or email us at lytebytesblr@gmail.com</p>               
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

{view === 'track' && (
  <div 
    key={view + '-' + Date.now()}
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '139px', 
      paddingTop: '5px',
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden'
    }}
  >
    {/* Stage-Specific Randomized Falling Elements Layer */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '420px',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10,
      maskImage: 'linear-gradient(to bottom, ${theme.brand} 60%, rgba(0,0,0,0) 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, ${theme.brand} 60%, rgba(0,0,0,0) 100%)'
    }}>
      {/* Stage 1: Papers, Receipts, Kitchen Order Tickets */}
      {currentStage === 1 && [
        { icon: '📝', left: '8%', delay: '0s', duration: '2.4s', size: '24px' },
        { icon: '🧾', left: '22%', delay: '0.8s', duration: '2.9s', size: '22px' },
        { icon: '📄', left: '38%', delay: '0.3s', duration: '2.1s', size: '26px' },
        { icon: '📋', left: '55%', delay: '1.2s', duration: '3.2s', size: '23px' },
        { icon: '📝', left: '70%', delay: '0.5s', duration: '2.6s', size: '25px' },
        { icon: '🧾', left: '85%', delay: '1.0s', duration: '2.3s', size: '24px' }
      ].map((item, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: item.left,
          top: '-40px',
          fontSize: item.size,
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          animation: `fallRandom ${item.duration} infinite ease-in-out`,
          animationDelay: item.delay
        }}>{item.icon}</span>
      ))}

      {/* Stage 2: Chef Hat, Ladle, Rolling Pin, Spoons */}
      {currentStage === 2 && [
        { icon: '👨‍🍳', left: '6%', delay: '0.2s', duration: '2.6s', size: '26px' },
        { icon: '🥄', left: '24%', delay: '0.9s', duration: '2.2s', size: '22px' },
        { icon: '🥖', left: '40%', delay: '0.4s', duration: '3.0s', size: '24px' },
        { icon: '🥣', left: '58%', delay: '1.1s', duration: '2.5s', size: '25px' },
        { icon: '👨‍🍳', left: '75%', delay: '0.7s', duration: '2.8s', size: '23px' },
        { icon: '🥄', left: '88%', delay: '0.1s', duration: '2.1s', size: '24px' }
      ].map((item, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: item.left,
          top: '-40px',
          fontSize: item.size,
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          animation: `fallRandom ${item.duration} infinite ease-in-out`,
          animationDelay: item.delay
        }}>{item.icon}</span>
      ))}

      {/* Stage 3: Carton Boxes Only */}
      {currentStage === 3 && [
        { icon: '📦', left: '10%', delay: '0.5s', duration: '2.7s', size: '26px' },
        { icon: '📦', left: '28%', delay: '0.1s', duration: '2.2s', size: '24px' },
        { icon: '📦', left: '45%', delay: '0.9s', duration: '3.1s', size: '28px' },
        { icon: '📦', left: '62%', delay: '0.3s', duration: '2.4s', size: '25px' },
        { icon: '📦', left: '80%', delay: '1.2s', duration: '2.9s', size: '27px' }
      ].map((item, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: item.left,
          top: '-40px',
          fontSize: item.size,
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          animation: `fallRandom ${item.duration} infinite ease-in-out`,
          animationDelay: item.delay
        }}>{item.icon}</span>
      ))}

      {/* Stage 4: Bikes, Location Symbol, Bike Helmet, Riders Gloves */}
      {currentStage === 4 && [
        { icon: '🛵', left: '8%', delay: '0.2s', duration: '2.0s', size: '26px' },
        { icon: '📍', left: '25%', delay: '0.8s', duration: '2.5s', size: '22px' },
        { icon: '🪖', left: '42%', delay: '0.4s', duration: '2.2s', size: '25px' },
        { icon: '🧤', left: '60%', delay: '1.0s', duration: '2.8s', size: '23px' },
        { icon: '🛵', left: '78%', delay: '0.1s', duration: '2.1s', size: '27px' },
        { icon: '📍', left: '90%', delay: '0.6s', duration: '2.4s', size: '24px' }
      ].map((item, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: item.left,
          top: '-40px',
          fontSize: item.size,
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          animation: `fallRandom ${item.duration} infinite linear`,
          animationDelay: item.delay
        }}>{item.icon}</span>
      ))}

      {/* Stage 5: Claps, Smiley, Happy Customer, Hearts Fireworks */}
      {currentStage === 5 && [
        { icon: '👏', left: '8%', delay: '0.3s', duration: '2.3s', size: '26px' },
        { icon: '😊', left: '24%', delay: '0.9s', duration: '2.7s', size: '24px' },
        { icon: '🥳', left: '40%', delay: '0.1s', duration: '2.1s', size: '28px' },
        { icon: '💖', left: '58%', delay: '0.6s', duration: '2.5s', size: '25px' },
        { icon: '🎆', left: '74%', delay: '1.1s', duration: '3.0s', size: '27px' },
        { icon: '👏', left: '88%', delay: '0.4s', duration: '2.2s', size: '25px' }
      ].map((item, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: item.left,
          top: '-40px',
          fontSize: item.size,
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          animation: `fallRandom ${item.duration} infinite ease-in`,
          animationDelay: item.delay
        }}>{item.icon}</span>
      ))}
    </div>

    {/* Header */}
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 2fr auto', alignItems: 'center', marginBottom: '16px', gap: '4px', zIndex: 2, position: 'relative' }}>
      <button onClick={() => setView('home')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start', whiteSpace: 'nowrap' }}>
        <ArrowLeft size={18}/> Back to Home
      </button>
      <h2 style={{ color: theme.brand, margin: 0, fontSize: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: '700', whiteSpace: 'nowrap' }}>Live Order Track</h2>
      <div style={{ width: '75px' }}></div>
    </div>

    {/* Main Container Card */}
    <div style={{ 
      border: theme.border, 
      borderRadius: theme.radius, 
      background: '#FFFBF2', 
      padding: '20px 16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxSizing: 'border-box',
      width: '100%',
      alignItems: 'center',
      textAlign: 'center',
      zIndex: 2,
      position: 'relative'
    }}>
      {/* Animated Pulsing Status Icon */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
        <div style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: theme.brand,
          opacity: 0.2,
          animation: 'pulse 2s infinite'
        }} />
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: theme.bg,
          border: theme.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.brand,
          zIndex: 1,
          fontSize: '24px',
          animation: 'bounce 1s infinite alternate'
        }}>
          {currentStage === 1 ? '📝' : currentStage === 2 ? '👨‍🍳' : currentStage === 3 ? '📦' : currentStage === 4 ? '🛵' : '🎉'}
        </div>
      </div>

      <div>
        <h3 style={{ color: theme.brand, margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
          {currentStage === 5 ? 'Order Delivered!' : 'Order Placed Successfully!'}
        </h3>
        <p style={{ color: theme.text, fontSize: '13px', margin: 0, lineHeight: '1.4', fontWeight: '500' }}>
          Your order is in, and we're crafting it with <span style={{ color: theme.brand, fontWeight: '700' }}>LOVE</span>. Thank you for choosing to SHOP LOCAL and support our small-batch kitchen.
        </p>
      </div>

      {/* 5-Stage Emoticon & Animated Visual Timeline */}
      <div style={{ width: '100%', borderTop: `1px dashed #E5D6B5`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
          Live Status Progression
        </span>

        {[
          { step: 1, icon: '📝', title: 'Order Recieved', desc: 'Written down on a paper slip & queued' },
          { step: 2, icon: '👨‍🍳', title: 'Preparing', desc: 'Fresh baking & mixing underway', animate: true },
          { step: 3, icon: '📦', title: 'Packing', desc: 'Carton box folding & pristine sealing' },
          { step: 4, icon: '🛵', title: 'Out for Delivery', desc: 'Rider on a bike with wind gushing' },
          { step: 5, icon: '🎉', title: 'Completed', desc: 'Customer receiving & celebrating!' }
        ].map((item, index) => {
          const isCompleted = item.step < currentStage;
          const isCurrent = item.step === currentStage;

          return (
            <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCompleted || isCurrent ? theme.bg : '#FFFBF2',
                  border: theme.border,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(225, 112, 85, 0.15)' : 'none',
                  animation: (isCurrent && item.animate) ? 'bounce 1s infinite alternate' : 'none'
                }}>
                  {item.icon}
                </div>
                {index < 4 && (
                  <div style={{
                    width: '2px',
                    height: '28px',
                    background: item.step < currentStage ? theme.brand : '#E5D6B5',
                    margin: '2px 0'
                  }} />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: isCurrent ? theme.brand : theme.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.title} 
                  {isCurrent && (
                    <span style={{ fontSize: '9px', background: '#FFF1EE', color: theme.brand, padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#776E62', marginTop: '2px' }}>{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%', marginTop: '10px' }}>
        <button 
          onClick={() => window.open('https://wa.me/9108286886?text=Hi,%20I%20want%20an%20update%20on%20my%20recent%20order!', '_blank')} 
          style={{ ...actionButtonStyle, border: theme.border, marginBottom: 0, padding: '14px', fontSize: '15px', borderRadius: theme.radius, width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <MessageSquare size={18} /> Get WhatsApp Live Update
        </button>
        <button 
          onClick={() => setView('home')} 
          style={{ ...secondaryButtonStyle, border: theme.border, marginBottom: 0, padding: '14px', fontSize: '15px', borderRadius: theme.radius, width: '100%', boxSizing: 'border-box' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
)}
        
      </main>
        <Footer view={view} setView={setView} cart={cart} theme={theme} />
{/* Unified Modal Rendering - Centralized UI Logic */}
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
  