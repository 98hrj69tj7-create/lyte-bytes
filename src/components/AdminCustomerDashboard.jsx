import React, { useState, useEffect } from 'react';

import { 
  Lock, 
  User, 
  Award, 
  Package, 
  ArrowLeft, 
  ShieldCheck, 
  Phone, 
  DollarSign,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Apps Script API URL updated to latest deployment
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjR5KBDf8iB9e5Dh4ye5TxmIsbcirJsevDjMWma6B_Ine3HCYwC1ImeXgmr0XdVI9FZg/exec";

// Fetch function for Google Sheets historical orders
async function fetchHistoricalOrders() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch historical orders:", error);
    return [];
  }
}

export default function AdminCustomerDashboard({ theme = {}, onBack, setView }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Data & Loading State
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2',
    radius: theme?.radius || '16px',
  };

  // Fetch and transform Google Sheets data upon successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      async function loadSheetData() {
        setIsLoading(true);
        const rawRows = await fetchHistoricalOrders();
        
        // Transform flat spreadsheet rows into grouped customer profiles
        const customerMap = {};
        
        if (Array.isArray(rawRows)) {
          rawRows.forEach((row) => {
            const phone = row.Cust_Mobile || row.phone || row.Phone || 'Unknown';
            const name = row.Cust_Name || row.name || row.Name || 'Valued Customer';
            
            if (!customerMap[phone]) {
              customerMap[phone] = {
                id: phone,
                name: name,
                phone: phone,
                totalSpent: 0,
                ordersCount: 0,
                loyaltyScore: 0,
                orders: []
              };
            }
            
            const orderTotal = parseFloat(row.Total || row.total || (row.Price * row.Qty) || 0);
            customerMap[phone].totalSpent += orderTotal;
            customerMap[phone].ordersCount += 1;
            customerMap[phone].loyaltyScore += Math.floor(orderTotal / 10); // Dynamic loyalty calculation based on spend
            
            customerMap[phone].orders.push({
              id: row.Order_ID || row.id || `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
              date: row.Timestamp || row.date || 'Recent Order',
              itemsCount: parseInt(row.Qty || row.itemsCount || 1, 10),
              total: orderTotal,
              status: row.Status || row.status || 'Delivered'
            });
          });
        }

        // Assign tiers based on aggregated loyalty scores (Platinum, Gold, Silver, Bronze, Blue)
        const formattedCustomers = Object.values(customerMap).map(cust => {
          let tier = 'Blue';
          if (cust.loyaltyScore > 2000) tier = 'Platinum';
          else if (cust.loyaltyScore > 1000) tier = 'Gold';
          else if (cust.loyaltyScore > 500) tier = 'Silver';
          else if (cust.loyaltyScore > 200) tier = 'Bronze';

          return { ...cust, tier };
        });

        setCustomersData(formattedCustomers);
        setIsLoading(false);
      }

      loadSheetData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1984' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const filteredCustomers = customersData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleBack = onBack || (() => setView && setView('home'));

  // ================= PASSWORD PROMPT SCREEN =================
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: activeTheme.bg,
        minHeight: '80vh'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '380px', 
          backgroundColor: '#FFFFFF', 
          border: activeTheme.border, 
          borderRadius: activeTheme.radius, 
          padding: '28px 24px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            backgroundColor: '#FFF8E7', 
            border: '1px solid #E5D6B5',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px auto' 
          }}>
            <Lock size={24} color={activeTheme.brand} />
          </div>

          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: activeTheme.text }}>
            Admin Portal
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#776E62' }}>
            Enter your secure passcode to access synced customer directories.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="password" 
              placeholder="Enter PIN (e.g. 1984)" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: pinError ? '1.5px solid #FF5958' : activeTheme.border,
                backgroundColor: '#FFFBF2',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                textAlign: 'center',
                letterSpacing: '2px',
                fontWeight: '700'
              }}
            />
            {pinError && (
              <span style={{ fontSize: '11.5px', color: '#FF5958', fontWeight: '600' }}>
                Incorrect PIN. Please try again.
              </span>
            )}
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: activeTheme.brand,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '14.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 89, 88, 0.3)',
                marginTop: '4px'
              }}
            >
              Unlock Dashboard
            </button>
          </form>

          <button 
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#776E62',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // ================= ADMIN DASHBOARD VIEW =================
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      width: '100%',
      paddingLeft: '16px',
      paddingRight: '16px'
    }}>

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: '#EAE4D9', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '14px', 
            fontWeight: '700', 
            padding: '8px 14px', 
            borderRadius: '8px',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={16}/> Home
        </button>
        <h2 style={{ 
          fontSize: '16px', 
          color: activeTheme.brand, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase' 
        }}>
          Customer Directory
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px' }}>
          <Loader2 size={32} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: '14px', color: '#776E62', fontWeight: '600' }}>Syncing customer data from Google Sheets...</p>
        </div>
      ) : selectedCustomer ? (
        // ================= CUSTOMER DETAIL VIEW =================
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={() => setSelectedCustomer(null)}
            style={{
              alignSelf: 'flex-start',
              background: '#FFF8E7',
              border: '1px solid #E5D6B5',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '700',
              color: activeTheme.text,
              cursor: 'pointer',
              marginBottom: '4px'
            }}
          >
            ← Back to Directory List
          </button>

          {/* Profile Card */}
          <div style={{ 
            padding: '18px 20px', 
            backgroundColor: '#FFFBF2', 
            border: activeTheme.border, 
            borderRadius: activeTheme.radius, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ 
                backgroundColor: '#FFF8E7', 
                border: '1px solid #E5D6B5',
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0 
              }}>
                <User size={24} color={activeTheme.brand} />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '17px', fontWeight: '800' }}>
                  {selectedCustomer.name}
                </h3>
                <p style={{ margin: 0, color: '#776E62', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> {selectedCustomer.phone}
                </p>
              </div>
              <span style={{ 
                background: selectedCustomer.tier === 'Platinum' ? '#E0E7FF' : selectedCustomer.tier === 'Gold' ? '#FEF3C7' : selectedCustomer.tier === 'Silver' ? '#F3F4F6' : '#EFF6FF',
                color: selectedCustomer.tier === 'Platinum' ? '#3730A3' : selectedCustomer.tier === 'Gold' ? '#B45309' : selectedCustomer.tier === 'Silver' ? '#374151' : '#1D4ED8',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase'
              }}>
                {selectedCustomer.tier}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px dashed #E5D6B5', paddingTop: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase' }}>Lifetime Spend</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: activeTheme.text, marginTop: '2px' }}>
                  ₹{selectedCustomer.totalSpent}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#776E62', textTransform: 'uppercase' }}>Loyalty Score</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
                  {selectedCustomer.loyaltyScore} Pts
                </div>
              </div>
            </div>
          </div>

          {/* Customer Order History */}
          <h3 style={{ margin: '6px 0 2px 4px', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>
            Customer Order History ({selectedCustomer.orders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedCustomer.orders.map((ord, i) => (
              <div 
                key={i}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '14px 16px', 
                  backgroundColor: '#FFFBF2', 
                  border: activeTheme.border, 
                  borderRadius: activeTheme.radius, 
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: activeTheme.text }}>
                    {ord.id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#776E62', fontWeight: '500', marginTop: '2px' }}>
                    {ord.date} • {ord.itemsCount} Items
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: activeTheme.text, marginBottom: '2px' }}>
                    ₹{ord.total}
                  </div>
                  <span style={{ 
                    fontSize: '10.5px', 
                    fontWeight: '700', 
                    color: ord.status === 'Delivered' ? '#059669' : '#D97706',
                    backgroundColor: ord.status === 'Delivered' ? '#ECFDF5' : '#FFFBEB',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ================= CUSTOMER DIRECTORY LIST =================
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <input 
              type="text"
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: activeTheme.radius,
                border: activeTheme.border,
                backgroundColor: '#FFFBF2',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                color: activeTheme.text,
                fontWeight: '500'
              }}
            />
          </div>

          {/* Directory Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#776E62', fontSize: '14px' }}>
                No customer records found matching your search.
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div 
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px 16px', 
                    backgroundColor: '#FFFBF2', 
                    border: activeTheme.border, 
                    borderRadius: activeTheme.radius, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                    <div style={{ 
                      backgroundColor: '#FFF8E7', 
                      border: '1px solid #E5D6B5',
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <User size={18} color={activeTheme.brand} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700' }}>
                        {customer.name}
                      </h4>
                      <p style={{ margin: 0, color: '#776E62', fontSize: '12px', fontWeight: '500' }}>
                        {customer.phone} • <span style={{ color: '#D97706', fontWeight: '700' }}>{customer.loyaltyScore} Pts</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: activeTheme.text }}>
                        ₹{customer.totalSpent}
                      </div>
                      <span style={{ fontSize: '11px', color: '#776E62', fontWeight: '600' }}>
                        {customer.ordersCount} Orders
                      </span>
                    </div>
                    <ChevronRight size={18} color="#A39688" />
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}