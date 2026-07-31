import React, { useState, useEffect } from 'react';
import HomeAndSubCategoryView from './components/HomeAndSubCategoryView';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import MultiVariantDrawer from './components/MultiVariantDrawer';
import StickyCartBar from './components/StickyCartBar';
import OffersTab from './components/OffersTab';
import ItemsView from './components/ItemsView';
import CartView from './components/CartView';
import DeliveryView from './components/DeliveryView';
import PaymentView from './components/PaymentView';
import TrackView from './components/TrackView';
import SupportInfoView from './components/SupportInfoView';
import Header from './components/Header';
import Footer from './components/Footer';
import LimitedOfferModal from './components/LimitedOfferModal';
import { trackAbandonedLead } from './components/leadTracker';
import Papa from 'papaparse';
import { ArrowLeft } from 'lucide-react';

// --- IMAGE RESOLVER ---
const resolveImagePath = (path, folder = '') => {
  if (!path) return "/catering.jpg";
  if (path.startsWith('http')) return path;
  
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

// --- SHARED STYLES WITH FOCUS/TAP RESETS ---
const navButtonStyle = { 
  width: '100%', padding: '16px', marginBottom: '12px', backgroundColor: appTheme.buttonBg, color: appTheme.bg, border: 'none', borderRadius: appTheme.radius, fontWeight: '600', fontSize: '18px', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', outline: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none'
};

const actionButtonStyle = { 
  width: '100%', padding: '16px', marginBottom: '12px', backgroundColor: appTheme.buttonBg, color: appTheme.bg, border: 'none', borderRadius: appTheme.radius, fontWeight: '600', fontSize: '18px', cursor: 'pointer', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', outline: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none'
};

const secondaryButtonStyle = {
  ...actionButtonStyle, backgroundColor: 'transparent', border: `1px solid ${appTheme.buttonBg}`, color: appTheme.buttonBg,
};

const backButtonStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', padding: '4px 0', cursor: 'pointer', marginBottom: '20px', fontSize: '16px', color: appTheme.text, WebkitTapHighlightColor: 'transparent', userSelect: 'none'
};

const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '12px', borderRadius: appTheme.radius, border: appTheme.border, fontSize: '16px', boxSizing: 'border-box', outline: 'none'
};

const accordionHeaderStyle = { 
  display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', padding: '12px 15px', border: appTheme.border, borderRadius: appTheme.radius, cursor: 'pointer', color: appTheme.brand, fontWeight: 'bold', backgroundColor: 'transparent', marginBottom: '10px', outline: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none'
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
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  
  // Haptic Micro-Feedback State
  const [pressedBtn, setPressedBtn] = useState(null);
  const getPressStyle = (id) => ({
    transform: pressedBtn === id ? 'scale(0.96)' : 'scale(1)',
    transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.1s ease',
  });
  
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
    "Ammi's Achar": "pickles.png",
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

  useEffect(() => {
    const timestamp = new Date().getTime();
    const CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vR35Ed3Gcjjj3SLQvZWaLEahaM9QYPmdVvnGoFOefqmA544Jtcr3xR2QVj8Yy1tk-mjh4DVQarYB7Yh/pub?output=csv&t=${timestamp}`;

    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
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

  // --- UPDATED removeFromCart supporting both name and unit ---
  const removeFromCart = (name, unit) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item.name === name && item.unit === unit) {
        if (item.qty > 1) acc.push({...item, qty: item.qty - 1});
      } else {
        acc.push(item);
      }
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

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.bg, color: theme.text, fontFamily: 'system-ui, sans-serif' }}>
      <LimitedOfferModal theme={theme} />
      <Header theme={theme} />
      
      <main style={{ flex: 1, paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', overflowY: 'auto' }}>
        {/* Render Offers Tab */}
        {view === 'offers' && <OffersTab theme={theme} />}

        {/* Render Category List & Grid */}
        {(view === 'home' || view === 'subcat') && (
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

        {/* Render Individual Subcategory Items */}
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

        {/* Render Bag / Cart View */}
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

        {/* Render Order Status / Tracking */}
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

        {/* Render Delivery Details Form */}
        {view === 'delivery' && (
          <DeliveryView 
            theme={theme}
            setView={setView}
            customer={customer}
            setCustomer={setCustomer}
            deliveryDate={deliveryDate}
            setDeliveryDate={setDeliveryDate}
            deliveryTime={deliveryTime}
            setDeliveryTime={setDeliveryTime}
            showConditions={showConditions}
            setShowConditions={setShowConditions}
            handleProceedToPayment={handleProceedToPayment}
            handleFieldBlur={handleFieldBlur}
            setPressedBtn={setPressedBtn}
            getPressStyle={getPressStyle}
            backButtonStyle={backButtonStyle}
            actionButtonStyle={actionButtonStyle}
            secondaryButtonStyle={secondaryButtonStyle}
            inputStyle={inputStyle}
            accordionHeaderStyle={accordionHeaderStyle}
          />
        )}

        {/* Render Payment Method Selection */}
        {view === 'payment' && (
          <PaymentView 
            theme={theme}
            setView={setView}
            cart={cart}
            total={total}
            customer={customer}
            payment={payment}
            setPayment={setPayment}
            upiApp={upiApp}
            setUpiApp={setUpiApp}
            upiId={upiId}
            setUpiId={setUpiId}
            upiMappings={UPI_MAPPINGS}
            handleUPIPayment={handleUPIPayment}
            setPressedBtn={setPressedBtn}
            getPressStyle={getPressStyle}
            backButtonStyle={backButtonStyle}
            actionButtonStyle={actionButtonStyle}
            secondaryButtonStyle={secondaryButtonStyle}
          />
        )}

        {/* Render Support & Info / T&C / Privacy */}
        {view?.toLowerCase() === 'info' && (
          <SupportInfoView 
            theme={theme}
            setView={setView}
            showTC={showTC}
            setShowTC={setShowTC}
            showPrivacy={showPrivacy}
            setShowPrivacy={setShowPrivacy}
            backButtonStyle={backButtonStyle}
            accordionHeaderStyle={accordionHeaderStyle}
          />
        )}
      </main>

      {/* Floating Interactive Sticky Cart Bar */}
      {!['cart', 'delivery', 'payment', 'track'].includes(view) && (
        <StickyCartBar 
          cart={cart} 
          onViewCart={() => setView('cart')} 
        />
      )}

      {/* Floating Interactive Footer Dock */}
      <Footer view={view} setView={setView} theme={theme} cart={cart} />

      {/* Item Image Zoom Modal */}
      {activeModal.type === 'ZOOM' && (
        <ItemModal 
          selectedItem={activeModal.data} 
          setSelectedItem={closeModal} 
          addToCart={addToCart}
          theme={theme}
          resolveImagePath={resolveImagePath} 
        />
      )}

      {/* Multi-Variant Selection Drawer */}
      {activeModal.type === 'VARIANTS' && (
        <MultiVariantDrawer 
          selectedItem={activeModal.type === 'VARIANTS' ? activeModal.data : null} 
          setSelectedItem={(item) => setActiveModal({ type: item ? 'VARIANTS' : null, data: item })} 
          addToCart={addToCart} 
        />
      )}
    </div>
  );
}