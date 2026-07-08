import React, { useState, useEffect } from 'react';
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
  const [isNonVeg, setIsNonVeg] = useState(false);   // In your state declarations
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
  useEffect(() => {
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR35Ed3Gcjjj3SLQvZWaLEahaM9QYPmdVvnGoFOefqmA544Jtcr3xR2QVj8Yy1tk-mjh4DVQarYB7Yh/pub?gid=0&single=true&output=csv';
    
    Papa.parse(CSV_URL, {
  download: true,
  header: true,
  complete: (results) => {
    // 1. Initialize 'transformed' here so it exists for the whole function
    const transformed = {}; 

    results.data.forEach((row) => {
      // 2. Availability Check
      if (row.Availability?.toUpperCase() !== 'TRUE') return;
      if (!row.Category) return;

      // 3. Initialize Category if it doesn't exist
      if (!transformed[row.Category]) {
        transformed[row.Category] = { 
          imageUrl: categoryImages[row.Category] || "/catering.jpg",
          subcategories: {} 
        };
      }

      // 4. Initialize Sub_Category if it doesn't exist
      if (!transformed[row.Category].subcategories[row.Sub_Category]) {
        transformed[row.Category].subcategories[row.Sub_Category] = [];
      }

      // 5. Push the item data
      transformed[row.Category].subcategories[row.Sub_Category].push({
      name: row.Item_Name,
      price: parseFloat(row.Price) || 0,
      description: row.Description || "",    // Now maps directly to your Description column
      highlights: row.Highlights || "",      // Now maps directly to your new Highlights column
      unit: row.Unit || "",
      variation: row.Variation || "",
      imageUrl: row.Img_name
      });
    });
    // 6. Update state once parsing is complete
    setMenuData(transformed);
  }
});
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.name === item.name);
      return exists ? prev.map(i => i.name === item.name ? {...i, qty: i.qty + 1} : i) : [...prev, {...item, qty: 1}];
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

     <header style={{ 
  height: '60px', 
  padding: '0 15px', 
  borderBottom: theme.border, 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between' 
}}>
  {/* Left side: Logo and Brand Name */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
    <h2 style={{ fontSize: '25px', margin: 0, color: theme.brand, fontWeight: '900' }}>LYTE BYTES</h2>
  </div>

{/* Right Side: Vertical Trust Block */}
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'flex-end', 
  justifyContent: 'center',
  gap: '4px' // Small gap between FSSAI and Halal lines
}}>
  
  {/* FSSAI Row */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <span style={{ fontSize: '9px', fontWeight: 'bold', color: theme.text }}>{/* Optional: Add FSSAI label here */}</span>
    <img src="/Fssai.png" alt="FSSAI" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
    <span style={{ fontSize: '11px', fontWeight: '900', color: theme.text }}>21225008002806</span>
  </div>

  {/* Halal Text Row */}
  <span style={{ 
    fontSize: '11px', 
    fontWeight: '900', 
    color: theme.text,
    lineHeight: '1' 
  }}>
    Halal Compliant
  </span>
</div>
</header>

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
      <span style={{ fontSize: '13px', fontWeight: '700', color: isNonVeg ? '#aaa' : '#2D8A56' }}>VEG</span>
      <div 
        onClick={() => setIsNonVeg(!isNonVeg)}
        style={{ 
          width: '50px', height: '26px', background: isNonVeg ? '#D32F2F' : '#2D8A56', 
          borderRadius: '25px', position: 'relative', cursor: 'pointer', transition: '0.4s ease' 
        }}
      >
        <div style={{ 
          width: '22px', height: '22px', background: 'white', borderRadius: '50%', 
          position: 'absolute', top: '2px', left: isNonVeg ? '26px' : '2px', transition: '0.4s ease' 
        }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: '700', color: isNonVeg ? '#D32F2F' : '#aaa' }}>NON-VEG</span>
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
          const v = item.variation ? item.variation.trim().toLowerCase() : '';
          
          if (!isNonVeg) {
            // VEG MODE: Show Veg OR Egg
            return matchesSearch && (v === 'veg' || v === 'egg');
          } else {
            // NON-VEG MODE: Show Non-Veg OR Egg
            return matchesSearch && (v === 'non-veg' || v === 'egg');
          }
        })
        .map((item, i) => (
        <div key={i} style={{ padding: '12px', border: theme.border, borderRadius: '16px', display: 'flex', flexDirection: layout === 'grid' ? 'column' : 'row', gap: '12px', backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          
          <div onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer', flexShrink: 0 }}>
            <img src={resolveImagePath(item.imageUrl, 'menu-items')} alt={item.name} style={{ width: layout === 'grid' ? '100%' : '90px', height: layout === 'grid' ? '120px' : '90px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              {item.variation && (
                <img 
                  src={`/menu-items/${item.variation.trim().toLowerCase() === 'non-veg' ? 'non-veg' : item.variation.trim().toLowerCase()}.png`} 
                  alt={item.variation} 
                  style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                />
              )}
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#36281E' }}>{item.name}</div>
            </div>

            <div style={{ fontSize: '12px', color: '#FF5958', fontWeight: '700', fontStyle: 'italic', marginBottom: '8px' }}>{item.unit}</div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <div style={{ color: '#FF5958', fontWeight: '600', fontSize: '15px' }}>₹{item.price}</div>
              <button onClick={() => addToCart(item)} style={{ backgroundColor: '#FF5958', color: '#FFFFFF', border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Add</button>
            </div>
          </div>
        </div>
      ))}
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
      ₹{item.price * item.qty}
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

      <footer style={{ height: '70px', borderTop: theme.border, display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: theme.bg, flexShrink: 0, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
        {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'cart', icon: ShoppingBag, label: 'Bag', count: totalQty },
            { id: 'track', icon: Truck, label: 'Track' },
            { id: 'info', icon: Info, label: 'Info' }
        ].map((item) => (
            <div 
                key={item.id} 
                onClick={() => setView(item.id)} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: theme.buttonBg, flex: 1 }}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={22} style={{ marginBottom: '4px' }}/>
                    {item.count > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.brand, color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {item.count}
                        </span>
                    )}
                </div>
                {item.label}
            </div>
        ))}
      </footer>
      {/* --- OPTIMIZED PREMIUM POPUP MODAL --- */}
{selectedItem && (
  <div 
    onClick={() => setSelectedItem(null)} // Clicking background closes it
    style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.85)', // Slightly darker for better contrast
      display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1000 
    }}
  >
    <div style={{ backgroundColor: 'white', margin: '20px', borderRadius: '16px', overflow: 'hidden', maxWidth: '500px', width: '90%', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
      {/* Image Block - now with display:block to remove spacing */}
      <img src={resolveImagePath(selectedItem.imageUrl, 'menu-items')} alt={selectedItem.name} style={{ width: '100%', display: 'block' }} />

      {/* --- INTEGRATED PREMIUM BEIGE BANNER (Replaces white part) --- */}
      <div style={{ 
        backgroundColor: '#F7E7D4', // The warm beige background you requested
        padding: '24px', // More padding for premium feel
        textAlign: 'center',
        borderTop: '4px solid #E6D6C4' // Premium accent border
      }}>
        {/* Item Title, integrated here */}
        <h2 style={{ 
          margin: '0 0 16px 0', // Spacing before the description
          fontSize: '22px', 
          color: '#36281E', // Dark Charcoal Font
          fontWeight: '700'
        }}>
          {selectedItem.name}
        </h2>

        {/* Catchy Description, shown here (removed middle block) */}
        <p style={{ 
          color: '#36281E', // Dark Charcoal Font Color
          margin: 0, 
          fontSize: '14px', 
          lineHeight: '1.6', // Improved readability
          fontWeight: '500' // Medium weight
        }}>
          Slow, soulful, and with a generous hand of love. Every plate celebrates fresh produce, gentle spices and brings the warmth to your table.
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
