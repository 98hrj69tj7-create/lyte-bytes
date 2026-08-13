import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Award, 
  Package, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Crown,
  Loader2,
  Sparkles
} from 'lucide-react';

/* ==========================================================================
   CONFIG & DATA FETCHING HELPERS (Orders_Engine Sync)
   ========================================================================== */

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";

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

async function fetchHistoricalOrders() {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error("Failed to fetch historical orders CSV:", error);
    return [];
  }
}

export default function CustomerView({
  theme = {},
  onBack,
  setView,
  customer = {},
  backButtonStyle = {}
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [liveCustomerData, setLiveCustomerData] = useState({
    name: customer.name || 'Valued Customer',
    phone: customer.phone || '',
    tier: 'Blue',
    loyaltyScore: 0,
    totalSpent: 0,
    orders: []
  });

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '20px'
  };

  const handleBack = onBack || (() => setView && setView('home'));

  // Fetch and sync data directly from the Orders_Engine CSV
  useEffect(() => {
    async function syncWithOrdersEngine() {
      setIsLoading(true);
      const rawRows = await fetchHistoricalOrders();
      const targetPhone = (customer.phone || '').trim();

      let matchedCustomer = {
        name: customer.name || 'Valued Customer',
        phone: targetPhone,
        tier: 'Blue',
        loyaltyScore: 0,
        totalSpent: 0,
        orders: []
      };

      if (Array.isArray(rawRows) && targetPhone) {
        rawRows.forEach((row) => {
          const phone = getField(row, ['Cust_Mobile', 'Customer_Mobile', 'Mobile', 'Phone', 'Cust Mobile']);
          
          // Match by phone number
          if (phone && phone === targetPhone) {
            const name = getField(row, ['Cust_Name', 'Customer_Name', 'Name', 'Customer', 'Cust Name']);
            if (name && name !== 'Unknown') matchedCustomer.name = name;

            const amountStr = getField(row, ['Amount', 'Total', 'Price', 'Grand_Total']);
            const amount = parseFloat(amountStr) || 0;
            const paymentStatus = getField(row, ['Payment_Status', 'Status', 'Payment']) || 'Paid';
            const isPaid = paymentStatus.toLowerCase() === 'paid';

            if (isPaid || amount > 0) {
              matchedCustomer.totalSpent += amount;
            }

            const rowScore = parseInt(getField(row, ['Loyalty_Score', 'Score', 'Points']), 10);
            if (!isNaN(rowScore) && rowScore > matchedCustomer.loyaltyScore) {
              matchedCustomer.loyaltyScore = rowScore;
            }

            const medal = getField(row, ['Loyalty_Medal', 'Medal', 'Tier']);
            if (medal && medal !== 'None') {
              matchedCustomer.tier = medal;
            }

            const itemDesc = getField(row, ['Variety / Item', 'Item', 'Product', 'Variety']) || 'Item';
            const packInfo = getField(row, ['Qty_vol', 'Pack_Type', 'Size', 'Volume']) || 'Standard';

            matchedCustomer.orders.push({
              id: getField(row, ['Final_Order_Code', 'Order_No', 'Order No', 'Invoice']) || `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
              date: getField(row, ['Order_Date', 'Date', 'Timestamp']) || 'Recent Order',
              item: `${itemDesc} (${packInfo})`,
              qty: getField(row, ['Qty', 'Quantity']) || '1',
              total: amount,
              status: paymentStatus,
              color: paymentStatus.toLowerCase() === 'paid' ? '#059669' : '#DC2626',
              bg: paymentStatus.toLowerCase() === 'paid' ? '#ECFDF5' : 'rgba(239, 68, 68, 0.1)'
            });
          }
        });
      }

      setLiveCustomerData(matchedCustomer);
      setIsLoading(false);
    }

    syncWithOrdersEngine();
  }, [customer]);

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
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '13px', 
            fontWeight: '600', 
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease',
            ...backButtonStyle
          }}
        >
          <ArrowLeft size={15}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '21px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          My Account
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px' }}>
          <Loader2 size={30} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: '13px', color: '#78716C', fontWeight: '600' }}>Syncing live data from Orders Engine...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* --- USER PROFILE CARD --- */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '18px 20px', 
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
            border: '1px solid rgba(197, 160, 89, 0.45)', 
            borderRadius: activeTheme.radius, 
            boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                backgroundColor: 'rgba(217, 119, 6, 0.12)', 
                border: '1px solid rgba(217, 119, 6, 0.3)',
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0 
              }}>
                <User size={24} color="#D97706" />
              </div>

              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>
                  {liveCustomerData.name}
                </h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '12.5px', fontWeight: '500' }}>
                  {liveCustomerData.phone}
                </p>
              </div>
            </div>

            {/* Lifetime Spend Badge */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#78716C', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>Total Spend</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: activeTheme.text }}>₹{liveCustomerData.totalSpent.toLocaleString()}</span>
            </div>
          </div>

          {/* --- GAMIFIED LOYALTY TIER CARD --- */}
          <div style={{ 
            padding: '20px 22px', 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)', 
            border: '1.5px solid rgba(217, 119, 6, 0.4)', 
            borderRadius: activeTheme.radius, 
            boxShadow: '0 10px 28px rgba(217, 119, 6, 0.12)',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-10px', bottom: '-15px', opacity: 0.04, pointerEvents: 'none' }}>
              <Crown size={120} color="#D97706" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '0.9px', textTransform: 'uppercase' }}>
                    ELITE REWARD TIER
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 0 0', color: '#854D0E', fontSize: '22px', fontWeight: '800', fontFamily: "'Cormorant Garamond', serif" }}>
                  {liveCustomerData.tier} Member
                </h3>
              </div>
              
              <div style={{ 
                backgroundColor: '#D97706', 
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                width: '44px', 
                height: '44px', 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Crown size={22} color="#FFFFFF" />
              </div>
            </div>

            {/* Live Score Display */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: '#854D0E', marginBottom: '6px' }}>
                <span>{liveCustomerData.loyaltyScore} Pts</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={12} color="#D97706" fill="#D97706" />
                  <span>Score Active</span>
                </span>
              </div>

              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(197, 160, 89, 0.2)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.35)', padding: '1px' }}>
                <div style={{ width: `${Math.min(100, (liveCustomerData.loyaltyScore / 500) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)', borderRadius: '4px', boxShadow: '0 0 8px rgba(217, 119, 6, 0.5)' }} />
              </div>
            </div>
          </div>

          {/* --- RECENT ORDERS --- */}
          <div style={{ marginTop: '4px' }}>
            <h3 style={{ margin: '0 0 10px 4px', color: activeTheme.text, fontSize: '16px', fontWeight: '700', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Cormorant Garamond', serif" }}>
              Order History ({liveCustomerData.orders.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {liveCustomerData.orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#78716C', fontSize: '13px', fontWeight: '600' }}>
                  No historical orders found for this account.
                </div>
              ) : (
                liveCustomerData.orders.map((order, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '14px 16px', 
                      background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
                      border: '1px solid rgba(197, 160, 89, 0.4)', 
                      borderRadius: activeTheme.radius, 
                      boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ 
                      backgroundColor: 'rgba(197, 160, 89, 0.12)', 
                      border: '1px solid rgba(197, 160, 89, 0.3)',
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '12px', 
                      marginRight: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <Package size={18} color="#78716C" />
                    </div>

                    <div style={{ textAlign: 'left', flex: 1, paddingRight: '10px' }}>
                      <h4 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {order.id}
                      </h4>
                      <p style={{ margin: '0 0 2px 0', color: activeTheme.brand, fontSize: '12.5px', fontWeight: '700' }}>
                        {order.item}
                      </p>
                      <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>
                        {order.date} • Qty: {order.qty}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: activeTheme.text, marginBottom: '4px' }}>
                        ₹{order.total}
                      </div>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: order.color,
                        backgroundColor: order.bg,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}>
                        {order.status.toLowerCase() === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}