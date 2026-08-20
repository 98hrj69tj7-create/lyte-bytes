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
import MemberAuthModal from './MemberAuthModal';

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

/* ==========================================================================
   MAIN CUSTOMER VIEW COMPONENT
   ========================================================================== */
export default function CustomerView({
  theme = {},
  onBack,
  setView,
  customer = {},
  backButtonStyle = {}
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  
  const [liveCustomerData, setLiveCustomerData] = useState({
    name: customer.name || 'Guest User',
    phone: customer.phone || '',
    tier: 'Blue',
    loyaltyScore: 0,
    totalSpent: 0,
    dob: '',
    firstOrderDate: '',
    orders: [],
    isRecognizedGuest: false
  });

  const [selectedDob, setSelectedDob] = useState('');
  const [isSavingDob, setIsSavingDob] = useState(false);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(16px, 4vw, 20px)' // 💡 FLUID RADIUS
  };

  const handleBack = onBack || (() => setView && setView('home'));

  const performLookup = async (phoneToLookup) => {
    setIsLoading(true);
    const rawRows = await fetchHistoricalOrders();
    setCsvRows(rawRows);

    const targetPhone = (phoneToLookup || '').trim();

    let matchedCustomer = {
      name: 'Valued Guest',
      phone: targetPhone,
      tier: 'Blue',
      loyaltyScore: 0,
      totalSpent: 0,
      dob: '',
      firstOrderDate: '',
      orders: [],
      isRecognizedGuest: true
    };

    let foundMatch = false;

    if (Array.isArray(rawRows) && targetPhone) {
      rawRows.forEach((row) => {
        const phone = getField(row, ['Cust_Mobile', 'Customer_Mobile', 'Mobile', 'Phone', 'Cust Mobile']);
        
        if (phone && phone === targetPhone) {
          foundMatch = true;
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

    if (!foundMatch) {
      matchedCustomer.name = targetPhone ? 'New Member / Guest' : 'Guest Account';
      matchedCustomer.isRecognizedGuest = false;
    }

    setLiveCustomerData(matchedCustomer);
    if (liveCustomerData.dob) setSelectedDob(liveCustomerData.dob);
    setIsLoading(false);
  };

  useEffect(() => {
    performLookup(customer.phone || '');
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
  const milestone = getMilestoneInfo(liveCustomerData.loyaltyScore);
  const nextTierStyle = getTierStyles(milestone.nextTierName);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      overflowX: 'hidden',
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif" 
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          type="button"
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: '1px solid rgba(197, 160, 89, 0.35)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
            fontWeight: '600', 
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
          fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.8px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          My Account
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '10px' }}>
          <Loader2 size={26} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '600' }}>Syncing data from Orders Engine...</p>
        </div>
      ) : (
        <div style={{ 
          border: '1.5px solid rgba(197, 160, 89, 0.45)', 
          borderRadius: activeTheme.radius,
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)', 
          padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
          boxShadow: '0 12px 32px rgba(44, 34, 30, 0.07)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          boxSizing: 'border-box', 
          width: '100%'
        }}>
          
          {/* USER ACCOUNT CARD */}
          <div style={{ 
            background: '#FFFFFF',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '16px',
            padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
            boxSizing: 'border-box'
          }}>
            {/* 💡 BULLETPROOF FLEX: minWidth: 0 prevents long names from breaking layout */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                <div style={{ 
                  backgroundColor: tierStyle.bg, border: `1px solid ${tierStyle.border}`, width: '44px', height: '44px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <User size={22} color={tierStyle.accentColor} />
                </div>
                <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                  <h3 style={{ 
                    margin: 0, fontSize: 'var(--font-body)', fontWeight: '700', color: activeTheme.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                  }}>
                    {liveCustomerData.name}
                  </h3>
                  <span style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500' }}>
                    {liveCustomerData.phone || 'No phone registered'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#8A6D2B', fontWeight: '800', textTransform: 'uppercase', display: 'block', letterSpacing: '0.8px' }}>Total Spend</span>
                <span style={{ fontSize: 'var(--font-body)', fontWeight: '800', color: activeTheme.text }}>₹{liveCustomerData.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            {/* Smart Sign Up Banner */}
            {(!liveCustomerData.phone || liveCustomerData.orders.length === 0) ? (
              <div style={{ 
                background: 'rgba(197, 160, 89, 0.1)', border: '1px solid rgba(197, 160, 89, 0.3)', 
                borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' 
              }}>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#8A6D2B' }}>Have past orders or want rewards?</div>
                  <div style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#78716C' }}>Link your mobile number to view history.</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: '#C5A059', color: '#FFF', border: 'none', padding: '6px 12px',
                    borderRadius: '10px', fontSize: 'var(--font-caption)', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  Sign In
                </button>
              </div>
            ) : liveCustomerData.isRecognizedGuest && (
              <div style={{ 
                background: '#ECFDF5', border: '1px solid #059669', 
                borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' 
              }}>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: '#065F46' }}>History Found! Claim Account</div>
                  <div style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#047857', fontWeight: '500' }}>Sign in to secure your profile.</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    backgroundColor: '#059669', color: '#FFF', border: 'none', padding: '6px 12px',
                    borderRadius: '10px', fontSize: 'var(--font-caption)', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)', flexShrink: 0
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Loyalty Status Card */}
          <div style={{ 
            background: '#FFFFFF',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '16px',
            padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
            boxSizing: 'border-box',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#8A6D2B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Loyalty Quest
                </span>
                <div style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: activeTheme.text, marginTop: '1px' }}>
                  {liveCustomerData.tier} Tier
                </div>
              </div>
              <span style={{ fontSize: 'var(--font-body)', fontWeight: '800', color: '#2563EB' }}>
                {liveCustomerData.loyaltyScore} <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700' }}>PTS</span>
              </span>
            </div>

            <div style={{ width: '100%', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ height: '100%', width: `${milestone.progressPercent}%`, background: tierStyle.progressFill, borderRadius: '4px', transition: 'width 0.8s ease' }} />
            </div>

            <div style={{ fontSize: 'var(--font-caption)', color: '#1E40AF', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={13} color="#2563EB" fill="#2563EB" style={{ flexShrink: 0 }} />
              {milestone.isMax ? (
                <span style={{ color: tierStyle.accentColor, fontWeight: '800' }}>👑 Maximum Elite Tier Achieved!</span>
              ) : (
                <span>Only <strong style={{ color: '#2563EB', fontWeight: '800' }}>{milestone.ptsRemaining} Pts</strong> away from <strong style={{ color: '#B45309', fontWeight: '800' }}>{milestone.nextTierName}</strong>!</span>
              )}
            </div>
          </div>

          {/* Flavor Stamps & Rewards Component Integration */}
          <FlavorStampsRewards 
            orders={liveCustomerData.orders} 
            theme={activeTheme} 
            customerPhone={liveCustomerData.phone} 
            webAppUrl={WEB_APP_URL} 
            tier={liveCustomerData.tier}
          />

          {/* Birthday Vault */}
          <div style={{ 
            background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '16px', padding: 'clamp(12px, 3.5vw, 16px)', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box',
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Gift size={22} color={activeTheme.brand} style={{ flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block' }}>Mystery Vault</span>
                  <span style={{ fontSize: 'var(--font-caption)', fontWeight: '600', color: activeTheme.text }}>
                    {liveCustomerData.dob ? `🎂 Birthday Registered: ${liveCustomerData.dob}` : 'Unlock Your Treat'}
                  </span>
                </div>
              </div>
            </div>

            {!liveCustomerData.dob ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                <select 
                  value={selectedDob} 
                  onChange={(e) => setSelectedDob(e.target.value)}
                  style={{ 
                    flex: 1, minWidth: 0, padding: '8px 30px 8px 10px', borderRadius: '10px', 
                    border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#FFFFFF', 
                    fontSize: 'var(--font-caption)', outline: 'none', color: activeTheme.text, fontWeight: '600', cursor: 'pointer',
                    appearance: 'none', 
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' 
                  }}
                >
                  <option value="">Select birth month...</option>
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <button 
                  type="button"
                  onClick={handleSaveDob} 
                  disabled={isSavingDob || !selectedDob}
                  style={{ 
                    background: activeTheme.brand, color: '#FFFFFF', border: 'none', padding: '8px 14px', 
                    borderRadius: '10px', fontWeight: '700', fontSize: 'var(--font-caption)', cursor: 'pointer',
                    flexShrink: 0 
                  }}
                >
                  {isSavingDob ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 'var(--font-caption)', color: '#059669', fontWeight: '700', textAlign: 'left' }}>
                ✅ Birthday month registered successfully!
              </div>
            )}
          </div>

          {/* Order History */}
          <div style={{ marginTop: '2px' }}>
            <h3 style={{ margin: '0 0 8px 2px', color: activeTheme.text, fontSize: 'var(--font-caption)', fontWeight: '800', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Order History ({liveCustomerData.orders.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveCustomerData.orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 16px', color: '#78716C', fontSize: 'var(--font-caption)', fontWeight: '600', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(197, 160, 89, 0.4)' }}>
                  No historical orders found for this account. Sign in to load past orders.
                </div>
              ) : (
                liveCustomerData.orders.map((order, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
                    background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', 
                    borderRadius: '16px', boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)', boxSizing: 'border-box', width: '100%', gap: '8px'
                  }}>
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: activeTheme.text, wordBreak: 'break-all' }}>{order.id}</div>
                      <div style={{ fontSize: 'var(--font-caption)', color: activeTheme.brand, fontWeight: '700', marginTop: '2px' }}>{order.item}</div>
                      <div style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#78716C', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        <Clock size={11} style={{ flexShrink: 0 }} /> {order.date} • Qty: {order.qty}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 'var(--font-body)', fontWeight: '800', color: activeTheme.text, marginBottom: '4px' }}>₹{order.total}</div>
                      <span style={{ 
                        display: 'inline-block', fontSize: 'clamp(9px, 2.5vw, 10px)', fontWeight: '800', color: order.color,
                        backgroundColor: order.bg, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase'
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

      {/* Auth Modal Popup */}
      <MemberAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialPhone={liveCustomerData.phone}
        csvRows={csvRows} 
        webAppUrl={WEB_APP_URL}
        onLoginSuccess={(userData) => {
          performLookup(userData.phone);
        }}
      />
    </div>
  );
}