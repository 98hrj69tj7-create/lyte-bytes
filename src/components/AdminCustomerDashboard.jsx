import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  Phone, 
  ChevronRight,
  Loader2,
  Calendar,
  Search,
  Sparkles,
  ShoppingBag,
  Medal
} from 'lucide-react';

/* ==========================================================================
   CONFIG & DATA FETCHING HELPERS
   ========================================================================== */

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";

function getMilestoneInfo(score = 0, currentTier = 'Blue') {
  const t = (currentTier || 'Blue').toLowerCase();
  
  let nextTier = 'Bronze';
  let targetPts = 50;
  let currentTierBase = 0;

  if (t.includes('platinum')) {
    return {
      nextTierName: 'Max Tier',
      targetPts: score,
      ptsRemaining: 0,
      progressPercent: 100,
      isMax: true
    };
  } else if (t.includes('gold')) {
    nextTier = 'Platinum';
    targetPts = 500;
    currentTierBase = 200;
  } else if (t.includes('silver')) {
    nextTier = 'Gold';
    targetPts = 100;
    currentTierBase = 100;
  } else if (t.includes('bronze')) {
    nextTier = 'Silver';
    targetPts = 100;
    currentTierBase = 50;
  } else {
    nextTier = 'Bronze';
    targetPts = 50;
    currentTierBase = 0;
  }

  const ptsRemaining = Math.max(0, targetPts - score);
  const range = targetPts - currentTierBase;
  const currentProgress = Math.max(0, score - currentTierBase);
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  return {
    nextTierName: nextTier,
    targetPts,
    ptsRemaining,
    progressPercent,
    isMax: false
  };
}

function getTierStyles(tierName) {
  const t = (tierName || 'Blue').toLowerCase();

  if (t.includes('platinum')) {
    return {
      bg: 'rgba(79, 70, 229, 0.1)',
      border: 'rgba(79, 70, 229, 0.3)',
      badgeBg: '#4F46E5',
      badgeText: '#FFFFFF',
      accentColor: '#4F46E5',
      progressFill: '#4F46E5'
    };
  }
  if (t.includes('gold')) {
    return {
      bg: 'rgba(217, 119, 6, 0.1)',
      border: 'rgba(217, 119, 6, 0.3)',
      badgeBg: '#D97706',
      badgeText: '#FFFFFF',
      accentColor: '#D97706',
      progressFill: '#D97706'
    };
  }
  if (t.includes('silver')) {
    return {
      bg: 'rgba(75, 85, 99, 0.1)',
      border: 'rgba(75, 85, 99, 0.3)',
      badgeBg: '#4B5563',
      badgeText: '#FFFFFF',
      accentColor: '#4B5563',
      progressFill: '#4B5563'
    };
  }
  if (t.includes('bronze')) {
    return {
      bg: 'rgba(234, 88, 12, 0.1)',
      border: 'rgba(234, 88, 12, 0.3)',
      badgeBg: '#EA580C',
      badgeText: '#FFFFFF',
      accentColor: '#EA580C',
      progressFill: '#EA580C'
    };
  }
  
  // DEFAULT: Blue Tier
  return {
    bg: 'rgba(37, 99, 235, 0.1)',
    border: 'rgba(37, 99, 235, 0.3)',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    accentColor: '#2563EB',
    progressFill: '#2563EB'
  };
}

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

/* ==========================================================================
   MAIN COMPONENT: AdminCustomerDashboard
   ========================================================================== */
export default function AdminCustomerDashboard({ theme = {}, onBack, setView }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const topRef = useRef(null);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '22px'
  };

  // Bulletproof scroll anchor snap to top on selection change
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [selectedCustomer]);

  useEffect(() => {
    if (isAuthenticated) {
      async function loadSheetData() {
        setIsLoading(true);
        const rawRows = await fetchHistoricalOrders();
        const customerMap = {};
        
        if (Array.isArray(rawRows)) {
          rawRows.forEach((row) => {
            const phone = getField(row, ['Cust_Mobile', 'Customer_Mobile', 'Mobile', 'Phone', 'Cust Mobile']);
            const name = getField(row, ['Cust_Name', 'Customer_Name', 'Name', 'Customer', 'Cust Name']);
            const custCode = getField(row, ['Cust_Code', 'Customer_Code', 'Code', 'Cust Code']);
            
            if (!phone || !name || phone.toLowerCase() === 'unknown' || name.toLowerCase() === 'unknown') {
              return;
            }
            
            if (!customerMap[phone]) {
              customerMap[phone] = {
                id: phone,
                name: name,
                phone: phone,
                custCode: custCode,
                totalSpent: 0,
                ordersCount: 0,
                loyaltyScore: 0,
                tier: 'Blue',
                orders: []
              };
            } else {
              if (!customerMap[phone].custCode && custCode) {
                customerMap[phone].custCode = custCode;
              }
              if (customerMap[phone].name === 'Valued Customer' && name) {
                customerMap[phone].name = name;
              }
            }
            
            const amountStr = getField(row, ['Amount', 'Total', 'Price', 'Grand_Total']);
            const amount = parseFloat(amountStr) || 0;
            const paymentStatus = getField(row, ['Payment_Status', 'Status', 'Payment']) || 'Paid';
            const isPaid = paymentStatus.toLowerCase() === 'paid';
            
            if (isPaid || amount > 0) {
              customerMap[phone].totalSpent += amount;
            }
            
            customerMap[phone].ordersCount += 1;
            
            const rowScore = parseInt(getField(row, ['Loyalty_Score', 'Score', 'Points']), 10);
            if (!isNaN(rowScore) && rowScore > customerMap[phone].loyaltyScore) {
              customerMap[phone].loyaltyScore = rowScore;
            }

            const medal = getField(row, ['Loyalty_Medal', 'Medal', 'Tier']);
            if (medal && medal !== 'None') {
              customerMap[phone].tier = medal;
            }

            const itemDesc = getField(row, ['Variety / Item', 'Item', 'Product', 'Variety']) || 'Item';
            const packInfo = getField(row, ['Qty_vol', 'Pack_Type', 'Size', 'Volume']) || 'Standard';

            customerMap[phone].orders.push({
              orderNo: getField(row, ['Final_Order_Code', 'Order_No', 'Order No', 'Invoice']) || `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
              date: getField(row, ['Order_Date', 'Date', 'Timestamp']) || 'Recent Order',
              item: `${itemDesc} (${packInfo})`,
              qty: getField(row, ['Qty', 'Quantity']) || '1',
              total: amount,
              status: paymentStatus
            });
          });
        }

        setCustomersData(Object.values(customerMap));
        setIsLoading(false);
      }

      loadSheetData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '5983' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const filteredCustomers = customersData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    c.custCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = onBack || (() => setView && setView('home'));

  /* ==========================================================================
     RENDER: PASSCODE GATEWAY (UNAUTHENTICATED)
     ========================================================================== */
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        padding: '24px', 
        backgroundColor: '#FFFDF9', 
        minHeight: '85vh',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '380px', 
          backgroundColor: '#FFFFFF', 
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          borderRadius: activeTheme.radius, 
          padding: '36px 24px', 
          textAlign: 'center',
          boxShadow: '0 12px 32px rgba(44, 34, 30, 0.08)'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(197, 160, 89, 0.12)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 18px auto' 
          }}>
            <Lock size={28} color={activeTheme.brand} />
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '19px', fontWeight: '700', color: activeTheme.text, letterSpacing: '0.3px' }}>Admin Portal</h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#78716C', fontWeight: '500' }}>Enter your secure passcode to access elite customer files.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password" 
              placeholder="••••" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '14px', 
                border: pinError ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)', 
                backgroundColor: '#FFFFFF', 
                fontSize: '18px', 
                outline: 'none', 
                textAlign: 'center', 
                letterSpacing: '4px', 
                fontWeight: '700', 
                color: activeTheme.text,
                boxSizing: 'border-box'
              }}
            />
            {pinError && <span style={{ fontSize: '12px', color: '#FF5958', fontWeight: '600' }}>Incorrect PIN. Please try again.</span>}
            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '15px', 
                backgroundColor: activeTheme.brand, 
                color: '#FFFFFF', 
                border: 'none', 
                borderRadius: '14px', 
                fontWeight: '700', 
                fontSize: '15px', 
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255, 89, 88, 0.3)' 
              }}
            >
              Unlock Dashboard
            </button>
          </form>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#78716C', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}>
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     RENDER: DASHBOARD MAIN CONTAINER
     ========================================================================== */
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '16px 16px 88px 16px', 
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Scroll Anchor Target */}
      <div ref={topRef} />

      {/* HEADER SECTION */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '90px 1fr 90px', 
        alignItems: 'center', 
        width: '100%', 
        position: 'relative',
        marginBottom: '20px'
      }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            border: '1px solid rgba(197, 160, 89, 0.35)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '13px', 
            fontWeight: '600', 
            padding: '8px 14px', 
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <ArrowLeft size={15}/> Home
        </button>

        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontSize: '15px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '800', 
          letterSpacing: '1px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none'
        }}>
          CUSTOMERS ({customersData.length})
        </h2>

        <div /> 
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '14px' }}>
          <Loader2 size={34} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: '14px', color: '#78716C', fontWeight: '600', letterSpacing: '0.3px' }}>Syncing elite customer records...</p>
        </div>
      ) : selectedCustomer ? (
        
        /* ==========================================================================
           2. DETAILED CUSTOMER CONTAINER
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          
          <button 
            onClick={() => setSelectedCustomer(null)}
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(197, 160, 89, 0.12)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: activeTheme.text,
              fontSize: '13px',
              fontWeight: '600',
              padding: '8px 14px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <ArrowLeft size={15} /> Back to Directory
          </button>

          {/* MAIN PROFILE CARD */}
          {(() => {
            const tierStyle = getTierStyles(selectedCustomer.tier);
            const milestone = getMilestoneInfo(selectedCustomer.loyaltyScore, selectedCustomer.tier);

            return (
              <div style={{ 
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
                border: '1px solid rgba(197, 160, 89, 0.45)',
                boxShadow: '0 12px 32px rgba(44, 34, 30, 0.08)',
                borderRadius: activeTheme.radius,
                padding: '22px 24px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                position: 'relative',
                textAlign: 'left'
              }}>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: '1 1 auto', minWidth: 0, textAlign: 'left' }}>
                    
                    <div style={{ 
                      backgroundColor: tierStyle.bg, 
                      border: `1px solid ${tierStyle.border}`,
                      width: '52px', 
                      height: '52px', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={24} color={tierStyle.accentColor} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, alignItems: 'flex-start', textAlign: 'left' }}>
                      
                      <h3 style={{ 
                        margin: 0, 
                        color: activeTheme.text, 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'left',
                        width: '100%'
                      }}>
                        {selectedCustomer.name}
                      </h3>
                      
                      <p style={{ 
                        margin: 0, 
                        color: '#78716C', 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        textAlign: 'left'
                      }}>
                        <Phone size={13} color={tierStyle.accentColor} /> {selectedCustomer.phone}
                      </p>

                      {selectedCustomer.custCode && (
                        <div style={{ 
                          marginTop: '2px', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: '#78716C', 
                          fontFamily: 'monospace, sans-serif',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'left',
                          width: '100%',
                          opacity: 0.85
                        }}>
                          {selectedCustomer.custCode}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ 
                    background: tierStyle.badgeBg,
                    color: tierStyle.badgeText,
                    padding: '5px 12px', 
                    borderRadius: '10px', 
                    fontSize: '11px', 
                    fontWeight: '800',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {selectedCustomer.tier}
                  </div>

                </div>

                {/* GAMIFIED LOYALTY MILESTONE SECTION */}
                <div style={{ 
                  background: '#FFFFFF',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textAlign: 'left',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Medal size={16} color={tierStyle.accentColor} />
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Loyalty Score
                      </span>
                    </div>

                    <div style={{ fontSize: '17px', fontWeight: '800', color: tierStyle.accentColor }}>
                      {selectedCustomer.loyaltyScore} <span style={{ fontSize: '12px', fontWeight: '700' }}>Pts</span>
                    </div>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(197, 160, 89, 0.15)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(197, 160, 89, 0.3)'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${milestone.progressPercent}%`,
                      background: tierStyle.progressFill,
                      borderRadius: '4px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>

                  <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600' }}>
                    {milestone.isMax ? (
                      <span>🎉 Maximum Elite Loyalty Tier Reached!</span>
                    ) : (
                      <span>
                        🔥 Need <strong style={{ color: activeTheme.text }}>{milestone.ptsRemaining} Pts</strong> to unlock <strong style={{ color: tierStyle.accentColor }}>{milestone.nextTierName} Tier</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* STATS GRID */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div style={{ 
                    background: '#FFFFFF',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    padding: '12px 16px', 
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    textAlign: 'left'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      Lifetime Spend
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: activeTheme.text, marginTop: '4px' }}>
                      ₹{selectedCustomer.totalSpent.toLocaleString()}
                    </div>
                  </div>

                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    padding: '12px 16px', 
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ShoppingBag size={12} color="#78716C" />
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Total Orders
                      </span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: activeTheme.text, marginTop: '4px' }}>
                      {selectedCustomer.ordersCount} {selectedCustomer.ordersCount === 1 ? 'Order' : 'Orders'}
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ORDER HISTORY SECTION */}
          <h3 style={{ margin: '8px 0 0 2px', color: activeTheme.text, fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'left' }}>
            Order History ({selectedCustomer.orders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedCustomer.orders.map((ord, i) => {
              const isPaid = ord.status.toLowerCase() === 'paid';
              return (
                <div 
                  key={i}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    borderRadius: activeTheme.radius,            
                    background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',                         
                    padding: '16px 20px',                          
                    boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '14px', textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', fontSize: '14.5px', color: activeTheme.text, textAlign: 'left' }}>
                      {ord.orderNo}
                    </div>
                    <div style={{ fontSize: '13px', color: activeTheme.brand, fontWeight: '700', marginTop: '3px', textAlign: 'left' }}>
                      {ord.item}
                    </div>
                    <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', textAlign: 'left' }}>
                      <Calendar size={12} /> {ord.date} • Qty: {ord.qty}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: activeTheme.text, marginBottom: '6px' }}>
                      ₹{ord.total}
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: isPaid ? '#059669' : '#DC2626',
                      backgroundColor: isPaid ? '#ECFDF5' : 'rgba(239, 68, 68, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      display: 'inline-block',
                      letterSpacing: '0.4px'
                    }}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        
        /* ==========================================================================
           1. DIRECTORY LIST CONTAINER (Elite Styling with Loyalty-Colored Icons)
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          
          <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <Search size={17} color="#78716C" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search customers by name, phone, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',                
                borderRadius: '14px',              
                border: '1px solid rgba(197, 160, 89, 0.45)',   
                backgroundColor: '#FFFFFF',                    
                fontSize: '13.5px',                            
                outline: 'none',
                boxSizing: 'border-box',
                color: activeTheme.text,
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#78716C', fontSize: '13.5px', fontWeight: '600' }}>
                No customer records found matching your search.
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const tierStyle = getTierStyles(customer.tier);
                return (
                  <div 
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      border: '1px solid rgba(197, 160, 89, 0.4)', 
                      borderRadius: activeTheme.radius,            
                      background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',                       
                      padding: '16px 20px',                        
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(44, 34, 30, 0.05)',      
                      gap: '14px',                                 
                      boxSizing: 'border-box',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                      
                      {/* Loyalty-Colored Elite Avatar Icon Container */}
                      <div style={{ 
                        backgroundColor: tierStyle.bg,
                        border: `1px solid ${tierStyle.border}`,
                        width: '46px', 
                        height: '46px', 
                        borderRadius: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexShrink: 0 
                      }}>
                        <User size={20} color={tierStyle.accentColor} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, textAlign: 'left', alignItems: 'flex-start' }}>
                        
                        <h4 style={{ 
                          margin: 0, 
                          color: activeTheme.text, 
                          fontSize: '15.5px', 
                          fontWeight: '700', 
                          whiteSpace: 'nowrap',
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          textAlign: 'left'
                        }}>
                          {customer.name}
                        </h4>

                        <div style={{ 
                          fontSize: '12px', 
                          color: '#78716C', 
                          fontWeight: '600',
                          textAlign: 'left'
                        }}>
                          {customer.phone}
                        </div>

                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      
                      <div style={{ 
                        fontSize: '11.5px', 
                        fontWeight: '800', 
                        color: activeTheme.brand, 
                        backgroundColor: 'rgba(255, 89, 88, 0.09)', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.3px'
                      }}>
                        {customer.ordersCount} {customer.ordersCount === 1 ? 'Order' : 'Orders'}
                      </div>

                      <ChevronRight size={17} color="#78716C" style={{ flexShrink: 0, opacity: 0.8 }} />
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
}