import React, { useState, useEffect } from 'react';
import HomeAndSubCategoryView from './components/HomeAndSubCategoryView';
import ItemModal from './components/ItemModal';
import MultiVariantDrawer from './components/MultiVariantDrawer';
import StickyCartBar from './components/StickyCartBar';
import OffersTab from './components/OffersTab';
import ItemsView from './components/ItemsView';
import CartView from './components/CartView';
import DeliveryView from './components/DeliveryView';
import PaymentView from './components/PaymentView';
import PaymentVerificationView from './components/PaymentVerificationView';
import TrackView from './components/TrackView';
import SupportInfoView from './components/SupportInfoView';
import CustomerView from './components/CustomerView';
import AdminCustomerDashboard from './components/AdminCustomerDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import LimitedOfferModal from './components/LimitedOfferModal';
import InstallPrompt from './components/InstallPrompt';
import { trackAbandonedLead } from './components/leadTracker';
import Papa from 'papaparse';

// --- IMAGE RESOLVER ---
const resolveImagePath = (path, folder = '') => {
  if (!path) return "/catering.jpg";
  if (path.startsWith('http')) return path;
  const base = folder ? `/${folder}/` : "/";
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

// --- SHARED STYLES WITH FOCUS/TAP RESETS ---
const actionButtonStyle = {
  width: '100%', 
  padding: '14px', 
  marginBottom: '12px', 
  backgroundColor: '#FF5958', 
  backgroundImage: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
  color: '#FFFFFF', 
  border: '1px solid rgba(255, 255, 255, 0.2)', 
  borderRadius: '14px', 
  fontWeight: '600', 
  fontSize: '15px', 
  cursor: 'pointer', 
  textAlign: 'center', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  gap: '10px', 
  outline: 'none', 
  WebkitTapHighlightColor: 'transparent', 
  userSelect: 'none',
  boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)',
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const secondaryButtonStyle = {
  ...actionButtonStyle, 
  backgroundColor: 'rgba(197, 160, 89, 0.1)', 
  backgroundImage: 'none',
  border: '1px solid rgba(197, 160, 89, 0.3)', 
  color: '#1A1816',
  boxShadow: 'none'
};

const backButtonStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', outline: 'none', boxShadow: 'none', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', marginBottom: '20px', fontSize: '13px', fontWeight: '600', color: '#1A1816', WebkitTapHighlightColor: 'transparent', userSelect: 'none', transition: 'all 0.2s ease', fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const inputStyle = {
  width: '100%', padding: '12px 14px', marginBottom: '12px', borderRadius: '12px', border: '1px solid rgba(197, 160, 89, 0.4)', fontSize: '13px', fontWeight: '500', boxSizing: 'border-box', outline: 'none', background: '#FFFFFF', color: '#1A1816', fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const accordionHeaderStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', padding: '12px 15px', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '14px', cursor: 'pointer', color: '#FF5958', fontWeight: '700', backgroundColor: '#FFFFFF', marginBottom: '10px', outline: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif"
};

// --- PAGE TRANSITION WRAPPER FOR SMOOTH FLOW ---
function PageTransition({ children, viewKey }) {
  return (
    <div key={viewKey} style={{
      animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
}

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
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  
  // Custom Back Warning Modal State
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  
  // State to track whether the "Our Story & Our Promise" card is expanded
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  // Reset story expansion when navigating away from home view
  useEffect(() => {
    if (view !== 'home') {
      setIsStoryExpanded(false);
    }
  }, [view]);

  // --- PWA BROWSER BACK BUTTON CUSTOM MODAL INTERCEPTOR ---
  useEffect(() => {
    if (view !== 'home') {
      window.history.pushState({ view }, '', window.location.href);
    }

    const handlePopState = (event) => {
      if (view !== 'home') {
        window.history.pushState({ view }, '', window.location.href);
        setIsBackModalOpen(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);
  
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

  const [currentStage] = useState(1);

  // --- THEME ---
  const theme = {
    bg: '#FFFDF9',
    text: '#1A1816',
    brand: '#FF5958',
    buttonBg: '#FF5958',
    border: '1px solid rgba(197, 160, 89, 0.4)',
    radius: '20px'
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
            if (!existingItem.tags && (row.Tags || row.tags)) {
              existingItem.tags = row.Tags || row.tags;
            }
            if (!existingItem.rating && (row.Rating || row.rating)) {
              existingItem.rating = row.Rating || row.rating;
            }

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
              tags: row.Tags || row.tags || "", 
              rating: row.Rating || row.rating || "", 
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

  const handlePaymentComplete = () => {
    setView('verifying');
  };

  const handleUPIPayment = () => {
    const upiLink = "upi://pay?pa=rosemarycloney-3@okicici&pn=LyteBytes&cu=INR";
    window.location.href = upiLink;
  };

  if (!menuData) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading menu...</div>;

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.bg, color: theme.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <LimitedOfferModal theme={theme} setView={setView} />
      <Header theme={theme} setView={setView} />
      <main style={{ flex: 1, paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '80px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {view === 'offers' && (
          <PageTransition viewKey="offers">
            <OffersTab theme={theme} />
          </PageTransition>
        )}

        {(view === 'home' || view === 'subcat') && (
          <PageTransition viewKey={view}>
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
              onStoryToggle={setIsStoryExpanded}
            />
          </PageTransition>
        )}

        {view === 'items' && (
          <PageTransition viewKey="items">
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
          </PageTransition>
        )}

        {view === 'cart' && (
          <PageTransition viewKey="cart">
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
          </PageTransition>
        )}

        {view === 'verifying' && (
          <PageTransition viewKey="verifying">
            <PaymentVerificationView
              theme={theme}
              onVerificationComplete={() => setView('track')}
            />
          </PageTransition>
        )}

        {view === 'track' && (
          <PageTransition viewKey="track">
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
          </PageTransition>
        )}

        {view === 'delivery' && (
          <PageTransition viewKey="delivery">
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
          </PageTransition>
        )}

        {view === 'payment' && (
          <PageTransition viewKey="payment">
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
              handlePaymentComplete={handlePaymentComplete}
              setPressedBtn={setPressedBtn}
              getPressStyle={getPressStyle}
              backButtonStyle={backButtonStyle}
              actionButtonStyle={actionButtonStyle}
              secondaryButtonStyle={secondaryButtonStyle}
            />
          </PageTransition>
        )}

        {view?.toLowerCase() === 'info' && (
          <PageTransition viewKey="info">
            <SupportInfoView
              theme={theme}
              setView={setView}
            />
          </PageTransition>
        )}

        {(view === 'account' || view === 'profile') && (
          <PageTransition viewKey={view}>
            <CustomerView
              onBack={() => setView('home')}
              customer={customer}
            />
          </PageTransition>
        )}

        {view === 'admin-customers' && (
          <PageTransition viewKey="admin-customers">
            <AdminCustomerDashboard
              theme={theme}
              onBack={() => setView('home')}
              setView={setView}
            />
          </PageTransition>
        )}
      </main>

      {!['cart', 'delivery', 'payment', 'verifying', 'track', 'profile', 'account', 'admin-customers'].includes(view) && !isStoryExpanded && (
        <StickyCartBar
          cart={cart}
          onViewCart={() => setView('cart')}
        />
      )}

      {/* PWA Install Prompt Banner */}
      <InstallPrompt theme={theme} />

      {!isStoryExpanded && (
        <Footer view={view} setView={setView} theme={theme} cart={cart} />
      )}

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

      {/* ================= CUSTOM BRANDED BACK WARNING MODAL ================= */}
      {isBackModalOpen && (
        <div 
          onClick={() => setIsBackModalOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(20, 15, 12, 0.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '16px', boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
              borderRadius: '24px', 
              padding: '24px',
              maxWidth: '360px', 
              width: '100%', 
              boxSizing: 'border-box',
              position: 'relative', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: '21px', 
              fontWeight: '700', 
              color: '#1A1816', 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Leave Current Page?
            </h3>
            <p style={{ 
              fontSize: '12.5px', 
              color: '#78716C', 
              margin: 0, 
              lineHeight: '1.45',
              fontWeight: '500' 
            }}>
              Are you sure you want to go back? Your current order progress or form entries may be lost.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button 
                onClick={() => setIsBackModalOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(197, 160, 89, 0.1)',
                  color: '#1A1816',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '14px',
                  cursor: 'pointer'
                }}
              >
                Stay Here
              </button>
              <button 
                onClick={() => {
                  setIsBackModalOpen(false);
                  setView('home');
                }}
                style={{
                  flex: 1,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                  color: '#FFFFFF',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
                }}
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}