import React, { useState } from 'react';
import { Home, ShoppingBag, Truck, ArrowLeft, Plus, Minus, MapPin, CheckCircle, Info, ChevronDown, ChevronUp, Grid, List as ListIcon } from 'lucide-react';

// --- THEME ---
const theme = { 
  bg: '#FDF6E3',            // Warm Beige
  text: '#2B2B2B',          // Main text
  brand: '#FF5958',         // Brand Red
  buttonBg: '#4A443A',      // Deep Earthy Coffee
  border: '1px solid #D8C7A5',
  radius: '12px' 
};

// --- SHARED STYLES ---
const navButtonStyle = { // For Categories/Subcategories (Centered)
  width: '100%',
  padding: '16px',
  marginBottom: '12px',
  backgroundColor: theme.buttonBg,
  color: theme.bg,
  border: 'none',
  borderRadius: theme.radius,
  fontWeight: '600',
  fontSize: '18px', 
  cursor: 'pointer',
  textAlign: 'center', 
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',
  gap: '10px'
};

const actionButtonStyle = { // For generic actions
  width: '100%',
  padding: '16px',
  marginBottom: '12px',
  backgroundColor: theme.buttonBg,
  color: theme.bg,
  border: 'none',
  borderRadius: theme.radius,
  fontWeight: '600',
  fontSize: '18px', 
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px'
};

const secondaryButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: 'transparent',
  border: `1px solid ${theme.buttonBg}`,
  color: theme.buttonBg,
};

const unifiedTaglineStyle = { 
  fontSize: '20px', 
  color: theme.brand, 
  textAlign: 'center', 
  margin: '15px 0', 
  fontWeight: '500',
  letterSpacing: '0.5px' 
};

const backButtonStyle = {
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  background: 'none', 
  border: 'none', 
  cursor: 'pointer', 
  marginBottom: '20px', 
  fontSize: '16px',
  color: theme.text
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: theme.radius,
  border: theme.border,
  fontSize: '16px',
  boxSizing: 'border-box'
};

const MENU_DATA = {
  "Catering": {
    "Meals": [{ name: "Veg Meal", price: 120 }, { name: "Non-Veg Meal", price: 160 }],
    "Biryani": [{ name: "Mysore Egg", price: 185 }, { name: "Mysore Chicken", price: 235 }]
  },
  "Bakery": { 
    "Cakes": [{ name: "Rich Plum Cake", price: 950 }, { name: "Kulkul", price: 650 }, { name: "Rose Cookies", price: 650 }, { name: "Christmas Assorted Box", price: 600 }, { name: "Sponge Cake", price: 900 }, { name: "Banana Cake", price: 750 }],
    "Cookies": [{ name: "Highland Shortbreads", price: 750 }, { name: "Oat Meal", price: 75 }],
    "Red Wine": [{ name: "Non Alcoholic Grape Wine", price: 950 }]
  },
  "Finger Foods": {
    "Sandwich": [
      { name: "Veg Coleslaw", price: 40 }, { name: "Veg Coleslaw Premium", price: 75 }, 
      { name: "Bombay Masala", price: 40 }, { name: "Bombay Masala Premium", price: 80 },
      { name: "Paneer Tikka", price: 40 }, { name: "Paneer Tikka Premium", price: 80 },
      { name: "Besan Chilla", price: 40 }, { name: "Dahi Sandwich", price: 40 },
      { name: "Samosa Sandwich", price: 40 }, { name: "Corn & Spinach", price: 80 },
      { name: "Chicken Coleslaw", price: 95 }
    ]
  },
  "Jams & Spreads": {
    "Jams": [
      { name: "Mango Jam (100g)", price: 110 }, { name: "Mango Jam (250g)", price: 230 }
    ],
    "Spreads": [
      { name: "Ripe Mango Chutney (100g)", price: 119 }, { name: "Ripe Mango Chutney (250g)", price: 249 },
      { name: "Strawberry Chutney (100g)", price: 119 }, { name: "Strawberry Chutney (250g)", price: 249 }
    ]
  },
  "Ammis Achar": {
    "Pickles": [
      { name: "Mutton (100g)", price: 250 }, { name: "Mutton (250g)", price: 600 },
      { name: "Chicken (100g)", price: 120 }, { name: "Chicken (250g)", price: 300 },
      { name: "Prawn (100g)", price: 220 }, { name: "Prawn (250g)", price: 550 },
      { name: "Fish (100g)", price: 220 }, { name: "Fish (250g)", price: 550 },
      { name: "Tomato (100g)", price: 90 }, { name: "Tomato (250g)", price: 200 },
      { name: "Garlic (100g)", price: 110 }, { name: "Garlic (250g)", price: 250 }
    ]
  }
};

export default function App() {
  const [view, setView] = useState('home');
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [layout, setLayout] = useState('list'); // 'list' or 'grid'
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [payment, setPayment] = useState(null);
  const [showConditions, setShowConditions] = useState(false);

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

  const handleProceedToPayment = () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert("Please provide your Name and Mobile Number to proceed.");
      return;
    }
    setView('payment');
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: theme.bg, color: theme.text, fontFamily: 'system-ui, sans-serif' }}>
      
      <header style={{ height: '70px', padding: '0 20px', borderBottom: theme.border, display: 'flex', alignItems: 'center', backgroundColor: theme.bg, flexShrink: 0 }}>
        <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '15px', borderRadius: '8px' }} />
        <h2 style={{ margin: 0, color: theme.brand, fontWeight: '900', letterSpacing: '-0.5px' }}>LYTE BYTES</h2>
      </header>

      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {view === 'home' && (
          <div>
            <h1 style={unifiedTaglineStyle}>Freshly crafted for YOU</h1>
            {Object.keys(MENU_DATA).map(cat => (
              <button key={cat} onClick={() => { setActiveCat(cat); setView('subcat'); }} style={navButtonStyle}>{cat}</button>
            ))}
          </div>
        )}

        {view === 'subcat' && (
          <div>
            <button onClick={() => setView('home')} style={backButtonStyle}><ArrowLeft size={20}/> Back</button>
            <h2 style={{ color: theme.brand }}>{activeCat}</h2>
            {Object.keys(MENU_DATA[activeCat]).map(sub => (
              <button key={sub} onClick={() => { setActiveSub(sub); setView('items'); }} style={navButtonStyle}>{sub}</button>
            ))}
          </div>
        )}

        {view === 'items' && (
          <div>
            <button onClick={() => setView('subcat')} style={backButtonStyle}><ArrowLeft size={20}/> Back</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: theme.brand, margin: 0 }}>{activeSub}</h2>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => setLayout('list')} style={{ background: layout === 'list' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer' }}><ListIcon size={20} color={layout === 'list' ? 'white' : theme.text}/></button>
                    <button onClick={() => setLayout('grid')} style={{ background: layout === 'grid' ? theme.buttonBg : 'transparent', border: theme.border, borderRadius: '6px', padding: '5px', cursor: 'pointer' }}><Grid size={20} color={layout === 'grid' ? 'white' : theme.text}/></button>
                </div>
            </div>
            
            {/* ITEM DISPLAY: List vs Grid */}
            <div style={{ 
                display: layout === 'grid' ? 'grid' : 'block', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px' 
            }}>
                {MENU_DATA[activeCat][activeSub].map((item, i) => (
                    <div key={i} style={{ 
                        padding: '16px', 
                        marginBottom: layout === 'list' ? '12px' : '0', 
                        border: theme.border, 
                        borderRadius: theme.radius, 
                        display: 'flex', 
                        flexDirection: layout === 'grid' ? 'column' : 'row',
                        justifyContent: layout === 'list' ? 'space-between' : 'flex-start', 
                        alignItems: layout === 'list' ? 'center' : 'flex-start', 
                        backgroundColor: '#FFFFFF', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'left', marginBottom: layout === 'grid' ? '10px' : 0 }}>{item.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ color: theme.brand, fontWeight: 'bold' }}>₹{item.price}</div>
                          <button onClick={() => addToCart(item)} style={{ ...actionButtonStyle, width: 'auto', margin: 0, padding: '8px 20px', color: 'green', border: '1px solid green', backgroundColor: 'transparent' }}>Add</button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
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
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '12px', border: theme.border, borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ fontWeight: '500', flex: 2, textAlign: 'left' }}>{item.name}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '50px' }}>₹{item.price * item.qty}</div>
                    <div style={{ display: 'flex', alignItems: 'center', border: theme.border, borderRadius: '6px', overflow: 'hidden' }}>
                      <button onClick={() => removeFromCart(item.name)} style={{ border: 'none', background: '#FDF6E3', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'red' }}><Minus size={16}/></button>
                      <span style={{ padding: '0 10px', fontSize: '14px', fontWeight: 'bold' }}>{item.qty}</span>
                      <button onClick={() => addToCart(item)} style={{ border: 'none', background: '#FDF6E3', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'green' }}><Plus size={16}/></button>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: theme.border, marginTop: '20px', paddingTop: '10px', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>Total: ₹{total}</div>
                <button onClick={() => setView('delivery')} style={actionButtonStyle}>Proceed to Delivery</button>
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
            <input type="tel" placeholder="Phone Number (Required)" style={inputStyle} value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
            <input type="email" placeholder="Email (Optional)" style={inputStyle} value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} />
            
            <textarea placeholder="Full postal address" style={{...inputStyle, height: '80px'}} value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
            
            <button onClick={() => alert("Location detected!")} style={{...secondaryButtonStyle, marginTop: '-5px', marginBottom: '15px'}}>
              <MapPin size={18} /> Drop Pin
            </button>

            <div style={{ marginBottom: '20px' }}>
              <div
                onClick={() => setShowConditions(!showConditions)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: theme.brand, fontSize: '14px', fontWeight: 'bold' }}
              >
                <Info size={16} /> Delivery Conditions {showConditions ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </div>
              {showConditions && (
                <div style={{ marginTop: '10px', padding: '12px', border: '1px dashed #D8C7A5', borderRadius: '8px', backgroundColor: '#FFFBF2', fontSize: '13px', color: '#666' }}>
                  Orders are prepared fresh daily. Deliveries made within 3-5km radius.
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
                {[{id: 'COD', label: 'Cash', img: '/Cash.png'}, {id: 'UPI', label: 'UPI', img: '/UPI.png'}].map((opt) => (
                    <button key={opt.id} onClick={() => setPayment(opt.id)} style={{ flex: 1, padding: '15px', borderRadius: theme.radius, border: payment === opt.id ? `2px solid ${theme.brand}` : theme.border, backgroundColor: payment === opt.id ? '#FFF1F1' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>{opt.label}</span>
                        <img src={opt.img} alt={opt.label} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </button>
                ))}
            </div>
            <button onClick={() => setView('track')} style={{ ...actionButtonStyle, marginTop: '30px' }}>Place Order</button>
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
            { id: 'terms', icon: Info, label: 'T&C' }
        ].map((item) => (
            <div 
                key={item.id} 
                onClick={() => item.id === 'terms' ? alert("Terms & Conditions") : setView(item.id)} 
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
    </div>
  );
}