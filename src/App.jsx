import React, { useState, useEffect } from 'react';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import VariantDrawer from './components/VariantDrawer';
import Header from './components/Header';
import Footer from './components/Footer';
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
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Veg', 'Non-Veg'
  const [isNonVeg, setIsNonVeg] = useState(null);   // In your state declarations
  const [layout, setLayout] = useState('list');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [payment, setPayment] = useState(null);
  const [showConditions, setShowConditions] = useState(false);
  const [showTC, setShowTC] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null); // Tracks 'Cash' or 'UPI'
  const categoryImages = {
  "Ammis Achar": "pickles.png",
  "Bakery & Cakes": "bakery.png",
  "Catering": "catering.png",
  "Finger Foods": "finger-foods.png",
  "Jams & Spreads": "jams.png",  
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
        
      {zoomImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setZoomImage(null)}>
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}><X size={24}/></button>
          <img src={zoomImage} alt="Zoomed" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}
      <Header theme={theme} />
      <main style={{ flex: 1, paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px', overflowY: 'auto' }}>
        {view === 'home' && (
  <div>
    <h1 style={unifiedTaglineStyle}>Freshly crafted for YOU</h1>
    {Object.keys(menuData).map(cat => (
      <div 
        key={cat} 
        onClick={() => { setActiveCat(cat); setView('subcat'); }} 
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px', 
            marginBottom: '12px', 
            backgroundColor: theme.buttonBg, 
            border: theme.border, 
            borderRadius: theme.radius, 
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src={resolveImagePath(menuData[cat].imageUrl)} 
          alt={cat} 
          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }} 
        />
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#E8E4D9' }}>
          {cat}
        </div>
      </div>
    ))}
  </div>
)}

        {view === 'subcat' && (
          <div>
            <button onClick={() => setView('home')} style={backButtonStyle}><ArrowLeft size={20}/> Back</button>
            <h2 style={{ color: theme.brand }}>{activeCat}</h2>
            {Object.keys(menuData[activeCat].subcategories).map(sub => (
              <button key={sub} onClick={() => { setActiveSub(sub); setView('items'); }} style={navButtonStyle}>{sub}</button>
            ))}
          </div>
        )}
{view === 'items' && (
  <>
  {/* ADD THIS BACK BUTTON */}
    <button 
      onClick={() => setView('subcat')} 
      style={{ ...backButtonStyle, marginBottom: '10px' }}
    >
      <ArrowLeft size={20}/> Back
    </button>

    {/* 1. Global Search Bar */}
    <div style={{ marginBottom: '15px' }}>
      <input 
        type="text" 
        placeholder="Search all items..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ ...inputStyle, width: '100%' }}
      />
    </div>

    {/* 2. Premium Slide Toggle Switch */}
   {/* Toggle Switch */}
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
      <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer' }}>
        <ListIcon size={20} color={layout === 'list' ? 'white' : theme.text}/>
      </button>
      <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer' }}>
        <Grid size={20} color={layout === 'grid' ? 'white' : theme.text}/>
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
        : menuData[activeCat].subcategories[activeSub]
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
            addToCart={addToCart} 
            setSelectedItem={setSelectedItem} 
            layout={layout} 
            resolveImagePath={resolveImagePath} 
          />
        ))
      }
    </div>
  </>
)}
        {view === 'cart' && (
          <div>
            <button onClick={() => setView('home')} style={backButtonStyle}><ArrowLeft size={20}/> Menu</button>
            <h2 style={{ color: theme.brand }}>Your Bag</h2>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Your bag is empty.</p>
                <button onClick={() => setView('home')} style={actionButtonStyle}>Go to Menu</button>
              </div>
            ) : (
              <>
                {cart.map(item => (
  <div key={item.name} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '12px', border: theme.border, borderRadius: '6px' }}>
    
    {/* Item Name and Unit */}
    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontWeight: '800', fontSize: '16px', color: '#4A443A' }}>{item.name}</div>
        <div style={{ fontSize: '13px', color: '#4A443A', fontWeight: '700', fontStyle: 'italic' }}>{item.unit}</div>
      </div>
    </div>

    {/* Price */}
    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#FF5958', minWidth: '50px' }}>
    ₹{(item.price || 0) * item.qty}
    </div>

    {/* Quantity Controls */}
    <div style={{ display: 'flex', alignItems: 'center', border: theme.border, borderRadius: '6px', overflow: 'hidden' }}>
      <button onClick={() => removeFromCart(item.name)} style={{ border: 'none', background: '#FDF6E3', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '16px', color: 'red' }}>-</button>
      <span style={{ padding: '0 10px', fontSize: '15px', fontWeight: 'bold' }}>{item.qty}</span>
      <button onClick={() => addToCart(item)} style={{ border: 'none', background: '#FDF6E3', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '16px', color: 'green' }}>+</button>
    </div>
  </div>
))}
                <div style={{ borderTop: theme.border, marginTop: '20px', paddingTop: '10px', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>Total: ₹{total}</div>
                <button onClick={handleProceedToDelivery} style={actionButtonStyle}>Proceed to Delivery</button>
                <button onClick={() => setView('home')} style={secondaryButtonStyle}>Continue Shopping</button>
              </>
            )}
          </div>
        )}

        {view === 'delivery' && (
          <div>
            <button onClick={() => setView('cart')} style={backButtonStyle}><ArrowLeft size={20}/> Back to Bag</button>
            <h2 style={{ color: theme.brand }}>Delivery Details</h2>
            <input type="text" placeholder="Name (Required)" style={inputStyle} value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
            <input type="tel" maxLength="10" placeholder="Mobile Number (10 digits required)" style={inputStyle} value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value.replace(/[^0-9]/g, '')})} />
            <input type="email" placeholder="Email (Optional)" style={inputStyle} value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} />
            <textarea placeholder="Full postal address" style={{...inputStyle, height: '80px'}} value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
              
            <button onClick={() => alert("Location detected!")} style={{...secondaryButtonStyle, marginTop: '-5px', marginBottom: '15px'}}>
              <MapPin size={18} /> Drop Location Pin
            </button>
            {/* --- ALIGNED DELIVERY SELECTOR --- */}
<div style={{ margin: '15px 0' }}>
  <h2 style={{ color: theme.brand }}>Preferred Delivery (optional)</h2>
  
  {/* Date Field with Aligned Label */}
  <div style={{ marginBottom: '10px' }}>
    <label style={{ fontSize: '18px', color: '#2B2B2B', marginBottom: '4px', display: 'block' }}>Date</label>
    <input 
      type="date" 
      onChange={(e) => setDeliveryDate(e.target.value)}
      style={{ ...inputStyle, width: '100%' }} 
    />
  </div>

  {/* Time Field with Aligned Label */}
  <div style={{ marginBottom: '10px' }}>
    <label style={{ fontSize: '18px', color: '#2B2B2B', marginBottom: '4px', display: 'block' }}>Time</label>
    <input 
      type="time" 
      onChange={(e) => setDeliveryTime(e.target.value)}
      style={{ ...inputStyle, width: '100%' }} 
    />
  </div>
  
  <p style={{ fontSize: '15px', color: '#2B2B2B', marginTop: '5px' }}>
    *Leave blank for earliest delivery.
  </p>
</div>
            <div style={{ marginBottom: '20px' }}>
              <div onClick={() => setShowConditions(!showConditions)} style={accordionHeaderStyle}>
                <Info size={16} /> Delivery Conditions {showConditions ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </div>
              {showConditions && (
                <div style={{ marginTop: '10px', padding: '12px', border: '1px dashed #D8C7A5', borderRadius: '8px', backgroundColor: '#FFFBF2', fontSize: '14px', textAlign: 'left', color: '#2B2B2B' }}>
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
            <button onClick={handleProceedToPayment} style={actionButtonStyle}>Proceed to Payment</button>
            <button onClick={() => setView('home')} style={secondaryButtonStyle}>Continue Shopping</button>
          </div>
        )}

        {view === 'payment' && (
          <div>
            <button onClick={() => setView('delivery')} style={backButtonStyle}><ArrowLeft size={20}/> Back to Details</button>
            <h2 style={{ color: theme.brand }}>Payment Method</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {/* --- CASH BUTTON --- */}
            <button 
                onClick={() => setPayment('COD')}
                style={{ flex: 1, padding: '15px', borderRadius: theme.radius, border: payment === 'COD' ? `2px solid ${theme.brand}` : theme.border, background: 'transparent' }}
>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: theme.text }}>₹</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '600' }}>Cash</div>
            </button>
                {/* --- UPI BUTTON --- */}
            <button 
                onClick={() => { setPayment('UPI'); handleUPIPayment(); }}
                style={{ flex: 1, padding: '15px', borderRadius: theme.radius, border: payment === 'UPI' ? `2px solid ${theme.brand}` : theme.border, background: 'transparent' }}
>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', color: theme.text }}>UPI</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '600' }}>Payment</div>
            </button>
            </div>
            <button onClick={() => {if (!payment) {alert("Please select a payment method (Cash or UPI) to proceed.");return;}setView('track');}} 
                    style={{ ...actionButtonStyle, marginTop: '30px', opacity: payment ? 1 : 0.6 }}> Place Order</button>
            <button onClick={() => setView('home')} style={secondaryButtonStyle}>Continue Shopping</button>
          </div>
        )}

        {view === 'info' && (
            <div>
                <button onClick={() => setView('home')} style={backButtonStyle}><ArrowLeft size={20}/> Back</button>
                <h2 style={{ color: theme.brand }}>Support & Info</h2>
                  
                <div style={{ marginBottom: '30px' }}>
                    <a href="https://wa.me/9108286886" style={{ textDecoration: 'none' }}><button style={actionButtonStyle}><MessageSquare size={18}/> Contact Customer Support</button></a>
                    <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none' }}><button style={actionButtonStyle}><Mail size={18}/> Raise a Request</button></a>
                    <a href="https://g.page/r/CRodKxCU6unDEBM/review" style={{ textDecoration: 'none' }}><button style={actionButtonStyle}><CheckCircle size={18}/> Give Feedback</button></a>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div onClick={() => setShowTC(!showTC)} style={accordionHeaderStyle}>
                        Terms & Conditions {showTC ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                    {showTC && (
                        <div style={{ padding: '15px', fontSize: '14px',textAlign: 'left', border: theme.border, borderRadius: theme.radius, background: '#FFFFFF', marginBottom: '10px' }}>
                            <p><strong>Order Acceptance:</strong> All orders are subject to availability. We reserve the right to refuse or cancel orders.</p>
                            <p><strong>Order Cut-off Time:</strong> orders must be placed a certain time in advance (e.g., 24 hours) to ensure freshness.</p>
                            <p><strong>FSSAI Registration:</strong> Lyte Bytes hold a valid FSSAI Registration (or License) required for manufacturing, storage, and distribution.</p>
                            <p><strong>Allergen Warning:</strong> Our food is prepared in a home kitchen that may handle common allergens (e.g., nuts, gluten, dairy).</p>
                            <p><strong>Liability Limitation:</strong> Lyte Bytes is not responsible for any adverse reactions due to undisclosed allergies.</p>
                            <p><strong>Hygiene Standards:</strong> Ourfood is prepared in a clean, hygienic home kitchen, adhering to health standards.</p>
                            <p><strong>No Return Policy:</strong> Due to the perishable nature of food, typically, returns are not accepted.</p>
                            <p><strong>Refunds & Cancellations:</strong> Due to the perishable nature of our products, we do not accept cancellations or offer refunds once an order is placed.</p>
                            <p><strong>Payments:</strong> Payments must be made in full at the time of order placement.</p>
                            <p><strong>Modifications:</strong> We reserve the right to change prices and availability without notice.</p>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div onClick={() => setShowPrivacy(!showPrivacy)} style={accordionHeaderStyle}>
                        Privacy Policy {showPrivacy ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                    {showPrivacy && (
                        <div style={{ padding: '15px', fontSize: '14px', textAlign: 'left', border: theme.border, borderRadius: theme.radius, background: '#FFFFFF', marginBottom: '10px' }}>
                            <p><strong>Data Collection:</strong> We collect your name, phone number, and address only to process your orders and facilitate deliveries.</p>
                            <p><strong>Data Usage:</strong> Your information is used solely for order fulfillment and customer support. We do not use your data for marketing or analytics.</p>
                            <p><strong>Data Storage:</strong> We retain your data only as long as necessary to fulfill your orders and provide support.</p>
                            <p><strong>Third Parties:</strong> We do not sell your personal data. We only share necessary delivery information with our logistics partners.</p>
                            <p><strong>Security:</strong> We take reasonable precautions to protect your information.</p>
                            <p><strong>Communication:</strong> We may contact you regarding your orders or support requests.</p>
                            <p><strong>Cookies:</strong> We do not use cookies or tracking technologies on our application/website.</p>
                            <p><strong>Children's Privacy:</strong> Our services are not directed to individuals under 18. We do not knowingly collect data from children.</p>
                            <p><strong>Policy Changes:</strong> We may update our policies occasionally. Continued use of our services constitutes acceptance of those changes.</p>   
                            <p><strong>Your Rights:</strong> You can request deletion of your data by contacting us at lytebytesblr@gmail.com or via WhatsApp at +91 91082 86886.</p> 
                        </div>
                    )}
                </div>
            </div>
        )}

        {view === 'track' && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <CheckCircle size={80} color={theme.brand} />
            <h2 style={{ marginTop: '20px' }}>Order Placed!</h2>
            <p style={unifiedTaglineStyle}>
                Your order is in, and we’re crafting it with LOVE. 
                <br/><br/>
                Thank you for choosing to SHOP LOCAL and support our small‑batch kitchen.
            </p>
            <button onClick={() => { setCart([]); setView('home'); }} style={actionButtonStyle}>Back to Home</button>
          </div>
        )}
        
      </main>
        <Footer setView={setView} cart={cart} theme={theme} />
      <ItemModal 
      selectedItem={selectedItem} 
      setSelectedItem={setSelectedItem} 
      addToCart={addToCart} 
      theme={theme}
      resolveImagePath={resolveImagePath} 
/>
    {/* 2. New Variant Drawer */}
    {selectedItem && selectedItem.variants && (
    <VariantDrawer 
    selectedItem={selectedItem} 
    setSelectedItem={setSelectedItem} 
    addToCart={addToCart} 
    resolveImagePath={resolveImagePath} 
  />
)}
    </div>
  );
}