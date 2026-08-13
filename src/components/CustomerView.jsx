import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Award, 
  Clock, 
  Zap, 
  Crown,
  Loader2,
  Trophy,
  Medal,
  Star,
  Gift
} from 'lucide-react';
import FlavorStampsRewards from './FlavorStampsRewards';

/* ==========================================================================
   CONFIG & DATA FETCHING HELPERS (Orders_Engine Sync)
   ========================================================================== */

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjR5KBDf8iB9e5Dh4ye5TxmIsbcirJsevDjMWma6B_Ine3HCYwC1ImeXgmr0XdVI9FZg/exec";

function getMilestoneInfo(score = 0, currentTier = 'Blue') {
  const t = (currentTier || 'Blue').toLowerCase();
  
  let nextTier = 'Bronze';
  let targetPts = 50;
  let currentTierBase = 0;

  if (t.includes('platinum')) {
    return { nextTierName: 'Max Tier', targetPts: score, ptsRemaining: 0, progressPercent: 100, isMax: true };
  } else if (t.includes('gold')) {
    nextTier = 'Platinum'; targetPts = 500; currentTierBase = 200;
  } else if (t.includes('silver')) {
    nextTier = 'Gold'; targetPts = 100; currentTierBase = 100;
  } else if (t.includes('bronze')) {
    nextTier = 'Silver'; targetPts = 100; currentTierBase = 50;
  } else {
    nextTier = 'Bronze'; targetPts = 50; currentTierBase = 0;
  }

  const ptsRemaining = Math.max(0, targetPts - score);
  const range = targetPts - currentTierBase;
  const currentProgress = Math.max(0, score - currentTierBase);
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  return { nextTierName: nextTier, targetPts, ptsRemaining, progressPercent, isMax: false };
}

function getTierStyles(tierName) {
  const t = (tierName || 'Blue').toLowerCase();

  if (t.includes('platinum')) {
    return { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.35)', accentColor: '#4F46E5', progressFill: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)', glow: '0 0 12px rgba(79, 70, 229, 0.3)', icon: Crown };
  }
  if (t.includes('gold')) {
    return { bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.35)', accentColor: '#D97706', progressFill: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)', glow: '0 0 12px rgba(217, 119, 6, 0.3)', icon: Trophy };
  }
  if (t.includes('silver')) {
    return { bg: 'rgba(100, 116, 139, 0.12)', border: 'rgba(100, 116, 139, 0.35)', accentColor: '#64748B', progressFill: 'linear-gradient(90deg, #64748B 0%, #94A3B8 100%)', glow: '0 0 12px rgba(100, 116, 139, 0.3)', icon: Medal };
  }
  if (t.includes('bronze')) {
    return { bg: 'rgba(194, 65, 12, 0.12)', border: 'rgba(194, 65, 12, 0.35)', accentColor: '#C2410C', progressFill: 'linear-gradient(90deg, #C2410C 0%, #EA580C 100%)', glow: '0 0 12px rgba(194, 65, 12, 0.3)', icon: Award };
  }
  
  return { bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.35)', accentColor: '#2563EB', progressFill: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)', glow: '0 0 12px rgba(37, 99, 235, 0.3)', icon: Star };
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
    dob: '',
    firstOrderDate: '',
    orders: []
  });

  const [selectedDob, setSelectedDob] = useState('');
  const [isSavingDob, setIsSavingDob] = useState(false);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '20px'
  };

  const handleBack = onBack || (() => setView && setView('home'));

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
        dob: '',
        firstOrderDate: '',
        orders: []
      };

      if (Array.isArray(rawRows) && targetPhone) {
        rawRows.forEach((row) => {
          const phone = getField(row, ['Cust_Mobile', 'Customer_Mobile', 'Mobile', 'Phone', 'Cust Mobile']);
          
          if (phone && phone === targetPhone) {
            const name = getField(row, ['Cust_Name', 'Customer_Name', 'Name', 'Customer', 'Cust Name']);
            if (name && name !== 'Unknown') matchedCustomer.name = name;

            const dobVal = getField(row, ['Cust_DOB', 'DOB', 'Birth_Month']);
            if (dobVal) matchedCustomer.dob = dobVal;

            const foVal = getField(row, ['Cust_FO', 'First_Order', 'FO']);
            if (foVal) matchedCustomer.firstOrderDate = foVal;

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

            const orderDate = getField(row, ['Order_Date', 'Date', 'Timestamp']) || 'Recent Order';
            
            if (!matchedCustomer.firstOrderDate) {
              matchedCustomer.firstOrderDate = orderDate;
            }

            const itemDesc = getField(row, ['Variety / Item', 'Item', 'Product', 'Variety']) || 'Item';
            const packInfo = getField(row, ['Qty_vol', 'Pack_Type', 'Size', 'Volume']) || 'Standard';

            matchedCustomer.orders.push({
              id: getField(row, ['Final_Order_Code', 'Order_No', 'Order No', 'Invoice']) || `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
              date: orderDate,
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
      if (matchedCustomer.dob) setSelectedDob(matchedCustomer.dob);
      setIsLoading(false);
    }

    syncWithOrdersEngine();
  }, [customer]);

  const handleSaveDob = async () => {
    if (!selectedDob) return;
    setIsSavingDob(true);
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ phone: liveCustomerData.phone, dob: selectedDob })
      });
      setLiveCustomerData(prev => ({ ...prev, dob: selectedDob }));
    } catch (err) {
      console.error("Failed to save DOB:", err);
    } finally {
      setIsSavingDob(false);
    }
  };

  const tierStyle = getTierStyles(liveCustomerData.tier);
  const milestone = getMilestoneInfo(liveCustomerData.loyaltyScore, liveCustomerData.tier);
  const nextTierStyle = getTierStyles(milestone.nextTierName);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, 
      paddingBottom: '100px', paddingTop: '8px', paddingLeft: '4px', paddingRight: '4px',
      boxSizing: 'border-box', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '16px', padding: '4px 0' }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.text, 
            fontSize: '13px', fontWeight: '600', padding: '6px 12px', borderRadius: '12px', zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)', ...backButtonStyle
          }}
        >
          <ArrowLeft size={15}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif",
          fontSize: '20px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.8px', 
          textTransform: 'uppercase', pointerEvents: 'none' 
        }}>
          My Account
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px' }}>
          <Loader2 size={30} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: '13px', color: '#78716C', fontWeight: '600' }}>Syncing live data from Orders Engine...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 14px', 
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', border: '1px solid rgba(197, 160, 89, 0.45)', 
            borderRadius: activeTheme.radius, boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                backgroundColor: tierStyle.bg, border: `1px solid ${tierStyle.border}`, width: '46px', height: '46px', 
                borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
              }}>
                <User size={22} color={tierStyle.accentColor} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '600'}}>
                  {liveCustomerData.name}
                </h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '12px', fontWeight: '500' }}>
                  {liveCustomerData.phone}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#78716C', fontWeight: '800', textTransform: 'uppercase', display: 'block', letterSpacing: '0.4px' }}>Total Spend</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: activeTheme.text }}>₹{liveCustomerData.totalSpent.toLocaleString()}</span>
            </div>
          </div>

          {/* Loyalty Status Card */}
          <div style={{ 
            padding: '16px 14px', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)', 
            border: `1.5px solid ${tierStyle.accentColor}40`, borderRadius: activeTheme.radius, boxShadow: tierStyle.glow,
            boxSizing: 'border-box', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ borderRadius: '10px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Medal size={28} color={tierStyle.accentColor} />
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: tierStyle.accentColor, textTransform: 'uppercase', letterSpacing: '0.9px', display: 'block' }}>Loyalty Quest</span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: tierStyle.accentColor, fontFamily: "'Cormorant Garamond', serif" }}>{liveCustomerData.tier} Tier Status</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: tierStyle.accentColor }}>{liveCustomerData.loyaltyScore}</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: tierStyle.accentColor, marginLeft: '3px', textTransform: 'uppercase' }}>Pts</span>
              </div>
            </div>

            <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(197, 160, 89, 0.15)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '1px' }}>
              <div style={{ height: '100%', width: `${milestone.progressPercent}%`, background: tierStyle.progressFill, borderRadius: '5px', boxShadow: `0 0 8px ${tierStyle.accentColor}`, transition: 'width 0.8s ease' }} />
            </div>

            <div style={{ fontSize: '12px', color: tierStyle.accentColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color={tierStyle.accentColor} fill={tierStyle.accentColor} />
              {milestone.isMax ? (
                <span style={{ color: tierStyle.accentColor, fontWeight: '800' }}>👑 Maximum Elite Tier Achieved!</span>
              ) : (
                <span>Only <strong style={{ color: tierStyle.accentColor, fontWeight: '800' }}>{milestone.ptsRemaining} Pts</strong> away from <strong style={{ color: nextTierStyle.accentColor, fontWeight: '800' }}>{milestone.nextTierName}</strong>!</span>
              )}
            </div>
          </div>

          {/* Flavor Stamps & Rewards Component Integration */}
          <FlavorStampsRewards 
            orders={liveCustomerData.orders} 
            theme={activeTheme} 
            customerPhone={liveCustomerData.phone} 
            webAppUrl={WEB_APP_URL} 
          />

          {/* Birthday Vault */}
          <div style={{ 
            background: 'linear-gradient(135deg, #FAF4EB 0%, #FFFDF9 100%)', border: '1.5px dashed rgba(197, 160, 89, 0.6)',
            borderRadius: activeTheme.radius, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '12px', display: 'flex' }}>
                  <Gift size={25} color={activeTheme.brand} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Mystery Vault</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: activeTheme.text }}>
                    {liveCustomerData.dob ? `🎂 Birthday Registered: ${liveCustomerData.dob}` : 'Unlock Your Treat'}
                  </span>
                </div>
              </div>
            </div>

            {!liveCustomerData.dob ? (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <select 
                  value={selectedDob} 
                  onChange={(e) => setSelectedDob(e.target.value)}
                  style={{ 
                    flex: 1, 
                    padding: '10px 36px 10px 12px', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(197, 160, 89, 0.5)', 
                    backgroundColor: '#FFFFFF', 
                    fontSize: '12.5px', 
                    outline: 'none', 
                    color: activeTheme.text, 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    appearance: 'none', 
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center' 
                  }}
                >
                  <option value="">Select birth month...</option>
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <button 
                  onClick={handleSaveDob} 
                  disabled={isSavingDob || !selectedDob}
                  style={{ 
                    background: activeTheme.brand, color: '#FFFFFF', border: 'none', padding: '6px 14px', 
                    borderRadius: '10px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)' 
                  }}
                >
                  {isSavingDob ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: '700', marginTop: '2px', textAlign: 'left' }}>
                ✅ Thank you for sharing your birthday month!
              </div>
            )}
          </div>

          {/* Order History */}
          <div style={{ marginTop: '4px' }}>
            <h3 style={{ margin: '0 0 10px 2px', color: activeTheme.text, fontSize: '14px', fontWeight: '800', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Order History ({liveCustomerData.orders.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {liveCustomerData.orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#78716C', fontSize: '13px', fontWeight: '600' }}>
                  No historical orders found for this account.
                </div>
              ) : (
                liveCustomerData.orders.map((order, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 12px', 
                    background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', border: '1px solid rgba(197, 160, 89, 0.4)', 
                    borderRadius: activeTheme.radius, boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)', boxSizing: 'border-box', width: '100%'
                  }}>
                    <div style={{ textAlign: 'left', flex: 1, paddingRight: '10px', minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '14.5px', color: activeTheme.text, wordBreak: 'break-all' }}>{order.id}</div>
                      <div style={{ fontSize: '13px', color: activeTheme.brand, fontWeight: '700', marginTop: '3px' }}>{order.item}</div>
                      <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <Clock size={12} /> {order.date} • Qty: {order.qty}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: activeTheme.text, marginBottom: '6px' }}>₹{order.total}</div>
                      <span style={{ 
                        display: 'inline-block', fontSize: '11px', fontWeight: '800', color: order.color,
                        backgroundColor: order.bg, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase'
                      }}>
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