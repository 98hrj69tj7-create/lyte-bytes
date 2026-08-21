import React, { useState, useEffect, useRef } from 'react';
import HomeAndSubCategoryView from './components/HomeAndSubCategoryView';
import SubscriptionPassView from './components/SubscriptionPassView';
import SubscriptionDashboardView from './components/SubscriptionDashboardView';
import ItemModal from './components/ItemModal';
import MultiVariantDrawer from './components/MultiVariantDrawer';
import StickyCartBar from './components/StickyCartBar';
import OffersTab from './components/OffersTab';
import ItemsView from './components/ItemsView';
import CartView from './components/CartView';
import DeliveryView from './components/DeliveryView';
import PaymentView from './components/PaymentView';
import PaymentVerificationView from './components/PaymentVerificationView';
import ConciergeChatView from './components/ConciergeChatView';
import TrackView from './components/TrackView';
import SupportInfoView from './components/SupportInfoView';
import WallOfLoveView from './components/WallOfLoveView';
import CustomerView from './components/CustomerView';
import AdminCustomerDashboard from './components/AdminCustomerDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import LimitedOfferModal from './components/LimitedOfferModal';
import InstallPrompt from './components/InstallPrompt';
import { trackAbandonedLead } from './components/leadTracker';
import Papa from 'papaparse';
import { Star, X } from 'lucide-react';

// --- IMAGE RESOLVER ---
const resolveImagePath = (path, folder = '') => {
  if (!path) return "/catering.jpg";
  if (path.startsWith('http')) return path;
  const base = folder ? `/${folder}/` : "/";
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

// --- FLUID SHARED STYLES WITH FOCUS/TAP RESETS ---
const actionButtonStyle = {
  width: '100%', 
  padding: 'clamp(12px, 3.5vw, 14px) clamp(14px, 4vw, 18px)', 
  marginBottom: '12px', 
  backgroundColor: '#FF5958', 
  backgroundImage: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
  color: '#FFFFFF', 
  border: '1px solid rgba(255, 255, 255, 0.2)', 
  borderRadius: '14px', 
  fontWeight: '600', 
  fontSize: 'clamp(13.5px, 4vw, 15px)', 
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
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  boxSizing: 'border-box',
  minWidth: 0
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
  display: 'inline-flex', 
  alignItems: 'center', 
  gap: '6px', 
  background: 'rgba(255, 255, 255, 0.6)', 
  border: '1px solid rgba(197, 160, 89, 0.3)', 
  outline: 'none', 
  boxShadow: 'none', 
  padding: 'clamp(5px, 1.5vw, 6px) clamp(10px, 3vw, 12px)', 
  borderRadius: '12px', 
  cursor: 'pointer', 
  marginBottom: '20px', 
  fontSize: 'clamp(11.5px, 3.2vw, 13px)', 
  fontWeight: '600', 
  color: '#1A1816', 
  WebkitTapHighlightColor: 'transparent', 
  userSelect: 'none', 
  transition: 'all 0.2s ease', 
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  flexShrink: 0
};

const inputStyle = {
  width: '100%', 
  padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
  marginBottom: '12px', 
  borderRadius: '12px', 
  border: '1px solid rgba(197, 160, 89, 0.4)', 
  fontSize: 'clamp(11.5px, 3.2vw, 13px)', 
  fontWeight: '500', 
  boxSizing: 'border-box', 
  outline: 'none', 
  background: '#FFFFFF', 
  color: '#1A1816', 
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  minWidth: 0
};

const accordionHeaderStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'flex-start', 
  gap: '10px', 
  padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 15px)', 
  border: '1px solid rgba(197, 160, 89, 0.4)', 
  borderRadius: '14px', 
  cursor: 'pointer', 
  color: '#FF5958', 
  fontWeight: '700', 
  backgroundColor: '#FFFFFF', 
  marginBottom: '10px', 
  outline: 'none', 
  WebkitTapHighlightColor: 'transparent', 
  userSelect: 'none', 
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  boxSizing: 'border-box',
  minWidth: 0
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
  // --- 1. VIEW STATE DECLARED FIRST (Prevents ReferenceError) ---
  const [view, setView] = useState('home');

  // --- UNIVERSAL CROSS-OS SCROLL-TO-TOP ENGINE ---
  const mainContainerRef = useRef(null);

  useEffect(() => {
    // 1. Instant window scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Instant container scroll reset
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0;
      mainContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // 3. Micro-timeout fallback for mobile WebKit / iOS Safari layout paints
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTop = 0;
        mainContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }, 15);

    return () => clearTimeout(timer);
  }, [view]);

  // --- 12-HOUR GAP CACHE REFRESH GUARD FOR ANDROID / iOS PWA ---
  useEffect(() => {
    const LAST_OPEN_KEY = 'lyte_last_open_timestamp';
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();
    const lastOpenTime = localStorage.getItem(LAST_OPEN_KEY);

    if (lastOpenTime) {
      const timeDifference = now - parseInt(lastOpenTime, 10);
      
      if (timeDifference > TWELVE_HOURS_MS) {
        localStorage.setItem(LAST_OPEN_KEY, now.toString());
        window.location.reload();
        return;
      }
    } else {
      localStorage.setItem(LAST_OPEN_KEY, now.toString());
    }
  }, []);

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
  
  // Wall of Love Review State with Randomization
  const [selectedReview, setSelectedReview] = useState(null);
  const INITIAL_FALLBACK_REVIEWS = [
    { id: 1, source: 'google', text: 'The best pickles and homemade treats! Authentic taste and amazing packaging.', author: 'Priya S.', rating: 5 },
    { id: 2, source: 'facebook', text: 'This customised wedding cake made our day extra special because the taste was beyond comparison!', author: 'Deborah Sarkar', rating: 5 },
    { id: 3, source: 'instagram', text: 'Loved the Jam and pickles! Super quick delivery and top-notch quality.', author: 'Lizy Priya', rating: 5 },
    { id: 4, source: 'whatsapp', text: 'Received the order safely today. The tomato pickle reminds me of home!', author: 'Angelina.', rating: 5 },
    { id: 5, source: 'email', text: 'Inquired about a bulk corporate hamper through email, and the response and curation were flawless!', author: 'Rahul V.', rating: 5 }
  ];

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const cached = localStorage.getItem('lytebytes_cached_reviews');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed].sort(() => Math.random() - 0.5);
        }
      }
    } catch (e) {
      console.error('Error reading cache', e);
    }
    return [...INITIAL_FALLBACK_REVIEWS].sort(() => Math.random() - 0.5);
  });

  // Fetch reviews background sync & randomise
  useEffect(() => {
    const fetchFreshReviews = async () => {
      try {
        const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxdXpaz1SsK_mPTIfYAWK_yXQnHNiAUDtQS8g6ZrgqgP0bR6cPbr-bnuS2whC-lG8T_/exec';
        if (SHEET_API_URL.includes('YOUR_GOOGLE_')) return;
        
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const normalizedReviews = data
            .map(item => ({
              id: item.id || item.ID || Math.random(),
              text: item.text || item.Text || '',
              author: item.author || item.Author || 'Customer',
              source: (item.source || item.Source || 'google').toLowerCase(),
              rating: parseInt(item.rating || item.Rating || 5),
              imageUrl: item.image || item.Image || item.Photo || item.photo || item.imageUrl || item['Image URL'] || null
            }))
            .filter(item => item.text && item.text.trim().length > 0);
          
          if (normalizedReviews.length > 0) {
            const randomized = [...normalizedReviews].sort(() => Math.random() - 0.5);
            setTestimonials(randomized);
            localStorage.setItem('lytebytes_cached_reviews', JSON.stringify(normalizedReviews));
          }
        }
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    };
    fetchFreshReviews();
  }, []);

  // Custom Back Warning Modal State
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

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
      
      {/* Scrollable Main Viewport with Ref attached */}
      <main ref={mainContainerRef} style={{ flex: 1, paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '80px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
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

        {view === 'subscription-pass' && (
          <SubscriptionPassView 
            theme={theme} 
            customer={customer} 
            setView={setView} 
            setCart={setCart} 
          />
        )}

        {view === 'subscription-dashboard' && (
          <SubscriptionDashboardView 
            theme={theme} 
            customer={customer} 
            setView={setView} 
          />
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

        {view === 'info' && (
          <PageTransition viewKey="info">
            <SupportInfoView
              theme={theme}
              setView={setView}
            />
          </PageTransition>
        )}

        {view === 'wall_of_love' && (
          <PageTransition viewKey="wall_of_love">
            <WallOfLoveView
              theme={theme}
              setView={setView}
              testimonials={testimonials}
              onSelectReview={(item) => setSelectedReview(item)}
            />
          </PageTransition>
        )}

        {view === 'chatbot' && (
          <PageTransition viewKey="chatbot">
            <ConciergeChatView 
              theme={theme}
              onBack={() => setView('info')}
              setView={setView}
            />
          </PageTransition>
        )}

        {view === 'concierge' && (
          <PageTransition viewKey="concierge">
            <ConciergeChatView 
              theme={theme}
              onBack={() => setView('home')}
              setView={setView}
            />
          </PageTransition>
        )}

        {(view === 'account' || view === 'profile') && (
          <PageTransition viewKey={view}>
            <CustomerView
              onBack={() => setView('home')}
              customer={customer}
              setView={setView}
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

    {/* 💡 StickyCartBar only shows on allowed shopping and tracking tabs */}
{['home', 'subcat', 'items', 'offers', 'track'].includes(view) && !isStoryExpanded && (
  <StickyCartBar
    cart={cart}
    view={view}
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

      {/* ================= SINGLE REVIEW DETAILS POPUP MODAL ================= */}
      {selectedReview && (
        <div 
          onClick={() => setSelectedReview(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(20, 15, 12, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100000, padding: '16px', boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
              borderRadius: '24px', padding: '26px', maxWidth: '380px', width: '100%', boxSizing: 'border-box',
              position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1.5px solid #FF5958',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '85vh', overflowY: 'auto',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={13} fill="#C5A059" color="#C5A059" />
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Verified {selectedReview.source} Review
                </span>
              </div>
              <button 
                onClick={() => setSelectedReview(null)}
                style={{ background: 'rgba(197, 160, 89, 0.12)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A6D2B' }}
              >
                <X size={14} />
              </button>
            </div>

            {selectedReview.imageUrl && (
              <div style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#000' }}>
                <img src={selectedReview.imageUrl} alt={`Review by ${selectedReview.author}`} style={{ width: '100%', maxHeight: '230px', objectFit: 'cover', display: 'block' }} />
              </div>
            )}

            <p style={{ margin: 0, fontSize: '13px', color: theme.text, lineHeight: '1.6', fontWeight: '500' }}>
              "{selectedReview.text}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <span style={{ fontWeight: '700', color: '#FF5958', fontSize: '13px' }}>{selectedReview.author}</span>
            </div>
          </div>
        </div>
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