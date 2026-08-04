import React, { useState, useEffect } from 'react';
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

// Live Google Sheets CSV Export URL for Orders_Engine
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";

/**
 * Helper to calculate milestone targets based on current Loyalty Score and Tier
 */
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
  } else { // Blue Tier
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

/**
 * Dynamic Liquid Glass Styles for Tiers (iOS Frosted Glass Engine)
 */
function getTierStyles(tierName) {
  const t = (tierName || 'Blue').toLowerCase();

  if (t.includes('platinum')) {
    return {
      bg: 'linear-gradient(135deg, rgba(238, 242, 255, 0.85) 0%, rgba(224, 231, 255, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.95)',
      glowShadow: '0 16px 36px -10px rgba(99, 102, 241, 0.2), 0 2px 6px rgba(0,0,0,0.02)',
      badgeBg: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#4F46E5',
      progressFill: 'linear-gradient(90deg, #6366F1 0%, #4338CA 100%)',
      glassBoxBg: 'rgba(255, 255, 255, 0.72)'
    };
  }
  if (t.includes('gold')) {
    return {
      bg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.85) 0%, rgba(253, 230, 138, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.95)',
      glowShadow: '0 16px 36px -10px rgba(245, 158, 11, 0.2), 0 2px 6px rgba(0,0,0,0.02)',
      badgeBg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#D97706',
      progressFill: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
      glassBoxBg: 'rgba(255, 255, 255, 0.72)'
    };
  }
  if (t.includes('silver')) {
    return {
      bg: 'linear-gradient(135deg, rgba(243, 244, 246, 0.85) 0%, rgba(229, 231, 235, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.95)',
      glowShadow: '0 16px 36px -10px rgba(107, 114, 128, 0.15), 0 2px 6px rgba(0,0,0,0.02)',
      badgeBg: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#4B5563',
      progressFill: 'linear-gradient(90deg, #9CA3AF 0%, #4B5563 100%)',
      glassBoxBg: 'rgba(255, 255, 255, 0.72)'
    };
  }
  if (t.includes('bronze')) {
    return {
      bg: 'linear-gradient(135deg, rgba(255, 237, 213, 0.85) 0%, rgba(254, 215, 170, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.95)',
      glowShadow: '0 16px 36px -10px rgba(249, 115, 22, 0.2), 0 2px 6px rgba(0,0,0,0.02)',
      badgeBg: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#EA580C',
      progressFill: 'linear-gradient(90deg, #F97316 0%, #C2410C 100%)',
      glassBoxBg: 'rgba(255, 255, 255, 0.72)'
    };
  }
  
  // DEFAULT: Blue Tier (Liquid Glass Ultra Blue)
  return {
    bg: 'linear-gradient(135deg, rgba(224, 242, 254, 0.8) 0%, rgba(186, 230, 253, 0.55) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.95)',
    glowShadow: '0 16px 36px -10px rgba(37, 99, 235, 0.18), 0 2px 6px rgba(0,0,0,0.02)',
    badgeBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    badgeText: '#FFFFFF',
    accentColor: '#2563EB',
    progressFill: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)',
    glassBoxBg: 'rgba(255, 255, 255, 0.72)'
  };
}

/**
 * CSV Parsing Utilities
 */
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
  // Authentication & Passcode States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Data & Interface States
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Active UI Theme Config
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.6)',
    bg: theme?.bg || '#FFFBF2',
    radius: theme?.radius || '18px'
  };

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
    if (pinInput === '1981' || pinInput === 'admin') {
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
        backgroundColor: '#FFFFFF', 
        minHeight: '80vh' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '380px', 
          backgroundColor: '#FFFBF2', 
          border: '1px solid #FF5958', 
          borderRadius: activeTheme.radius, 
          padding: '32px 24px', 
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            backgroundColor: '#FFF8E7', 
            border: '1px solid #E5D6B5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px auto' 
          }}>
            <Lock size={26} color={activeTheme.brand} />
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: activeTheme.text }}>Admin Portal</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#776E62' }}>Enter your passcode to view customer records.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="password" 
              placeholder="Enter PIN" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '12px', 
                border: pinError ? '1.5px solid #FF5958' : '1px solid #D8C7A5', 
                backgroundColor: '#FFFFFF', 
                fontSize: '16px', 
                outline: 'none', 
                textAlign: 'center', 
                letterSpacing: '3px', 
                fontWeight: '700', 
                color: activeTheme.text,
                boxSizing: 'border-box'
              }}
            />
            {pinError && <span style={{ fontSize: '12px', color: '#FF5958', fontWeight: '600' }}>Incorrect PIN.</span>}
            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '14px', 
                backgroundColor: activeTheme.brand, 
                color: '#FFFFFF', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '700', 
                fontSize: '15px', 
                cursor: 'pointer' 
              }}
            >
              Unlock Dashboard
            </button>
          </form>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#776E62', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}>
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '12px 16px 80px 16px', 
      boxSizing: 'border-box' 
    }}>

      {/* HEADER SECTION */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '85px 1fr 85px', 
        alignItems: 'center', 
        width: '100%', 
        position: 'relative',
        marginBottom: '16px',
        gap: '2px'
      }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '13.5px', 
            fontWeight: '700', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            backgroundColor: 'rgba(0,0,0,0.04)', 
            zIndex: 1
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
          DATA ({customersData.length})
        </h2>

        {/* Empty column spacer to keep Title perfectly centered */}
        <div /> 
      </div>

      {isLoading ? (
        /* LOADING STATE */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '14px' }}>
          <Loader2 size={32} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: '14px', color: '#776E62', fontWeight: '500' }}>Syncing customer records...</p>
        </div>
      ) : selectedCustomer ? (
        
        /* ==========================================================================
           2. DETAILED CUSTOMER CONTAINER (iOS Liquid Glass Dashboard)
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          
          {/* 🔙 BACK TO DIRECTORY BUTTON */}
          <button 
            onClick={() => setSelectedCustomer(null)}
            style={{
              alignSelf: 'flex-start',
              background: '#EAE4D9',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: activeTheme.text,
              fontSize: '13px',
              fontWeight: '700',
              padding: '8px 16px',
              borderRadius: '20px'
            }}
          >
            <ArrowLeft size={15} /> Directory
          </button>

          {/* 🪞 MAIN LIQUID GLASS PROFILE CARD */}
          {(() => {
            const tierStyle = getTierStyles(selectedCustomer.tier);
            const milestone = getMilestoneInfo(selectedCustomer.loyaltyScore, selectedCustomer.tier);

            return (
              <div style={{ 
                /* 🎨 CUSTOMIZATION: Change background gradient, borders, or soft shadows */
                background: tierStyle.bg,
                border: tierStyle.border,
                boxShadow: tierStyle.glowShadow,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '24px',
                padding: '20px 22px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                position: 'relative',
                overflow: 'hidden'
              }}>

                {/* HEADER ROW: Left Aligned Contact Info + Right Aligned Loyalty Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', width: '100%' }}>
                  
                  {/* LEFT STACK: Avatar + Name, Phone, Code */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: '1 1 auto', minWidth: 0 }}>
                    
                    {/* 🖼️ CUSTOMIZATION: Avatar Icon Size & Background */}
                    <div style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      border: '1px solid rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                      width: '54px',                           /* 📍 Change avatar width */
                      height: '54px',                          /* 📍 Change avatar height */
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center',
                      marginTop: '-12px',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={25} color={tierStyle.accentColor} />
                    </div>

                    {/* 📝 CUSTOMIZATION: Details Stack (Name, Phone, Code) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 }}>
                      
                      {/* NAME - Truncates smoothly if too long */}
                      <h3 style={{ 
                        margin: 0, 
                        color: '#0F172A', 
                        fontSize: '18px',                      /* 📍 Change Name font size */
                        fontWeight: '600', 
                        marginTop: '-10px',
                        letterSpacing: '-0.3px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {selectedCustomer.name}
                      </h3>
                      
                      {/* PHONE NUMBER */}
                      <p style={{ 
                        margin: 0, 
                        color: '#475569', 
                        fontSize: '13.5px',                    /* 📍 Change Phone font size */
                        fontWeight: '600', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}>
                        <Phone size={13} color={tierStyle.accentColor} /> {selectedCustomer.phone}
                      </p>

                      {/* CUSTOMER CODE - Aligned left directly under Phone Icon */}
                      {selectedCustomer.custCode && (
  <div style={{ 
    marginTop: '6px', 
    fontSize: '12px',                       /* Reduced slightly to fit long codes */
    fontWeight: '700', 
    color: '#64748B', 
    letterSpacing: '0.2px',                 /* Tighter letter spacing */
    fontFamily: 'monospace, sans-serif',
    whiteSpace: 'nowrap',
    marginLeft: '-55px',                    /* Aligns directly under avatar icon */
    width: 'calc(100% + 68px)',             /* Restores the right boundary width */
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }}>
    {selectedCustomer.custCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🏷️ CUSTOMIZATION: Right Loyalty Badge (Clean Text Only, No Dots) */}
                  <div style={{ 
                    background: tierStyle.badgeBg,
                    color: tierStyle.badgeText,
                    padding: '6px 12px',                       /* 📍 Adjust Badge padding */
                    borderRadius: '20px',                      /* 📍 Adjust Badge corner radius */
                    fontSize: '11px',                          /* 📍 Adjust Badge text size */
                    fontWeight: '600',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                    marginTop: '20px'
                  }}>
                    {selectedCustomer.tier}
                  </div>

                </div>

                {/* 🚀 GAMIFIED LOYALTY MILESTONE SECTION */}
                <div style={{ 
                  border: '1px solid #FF5958',
                  borderRadius: '16px',
                  marginTop: '-10px',
                  padding: '10px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Medal size={15} color={tierStyle.accentColor} />
                      <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Loyalty Score
                      </span>
                    </div>

                    <div style={{ fontSize: '17px', fontWeight: '800', color: tierStyle.accentColor }}>
                      {selectedCustomer.loyaltyScore} <span style={{ fontSize: '12px', fontWeight: '700' }}>Pts</span>
                    </div>
                  </div>

                  {/* PROGRESS BAR CONTAINER */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    margin: '2px 0'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${milestone.progressPercent}%`,
                      background: tierStyle.progressFill,
                      borderRadius: '10px',
                      transition: 'width 0.4s ease-in-out'
                    }} />
                  </div>

                  {/* MILESTONE SUBTEXT */}
                  <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                    {milestone.isMax ? (
                      <span>🎉 Maximum Loyalty Tier Reached!</span>
                    ) : (
                      <span>
                        🔥 Need <strong>{milestone.ptsRemaining} Pts</strong> to unlock <strong>{milestone.nextTierName} Tier</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* 📊 RESTRUCTURED STATS GRID (Lifetime Spend & Total Orders) */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '-6px',
                  marginBottom: '-10px'
                }}>
                  {/* STAT TILE 1: LIFETIME SPEND */}
                  <div style={{ 
                    border: '1px solid #4A443A',
                    padding: '8px 14px', 
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Lifetime Spend
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                      ₹{selectedCustomer.totalSpent.toLocaleString()}
                    </div>
                  </div>

                  {/* STAT TILE 2: TOTAL ORDERS HISTORY */}
                  <div style={{
                    border: '1px solid #4A443A',
                    padding: '8px 14px', 
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShoppingBag size={11} color="#64748B" />
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Total Orders
                      </span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                      {selectedCustomer.ordersCount} {selectedCustomer.ordersCount === 1 ? 'Order' : 'Orders'}
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* 📦 ORDER HISTORY SECTION */}
          <h3 style={{ margin: '8px 0 0 2px', color: activeTheme.text, fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Order History ({selectedCustomer.orders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedCustomer.orders.map((ord, i) => (
              
              /* 🧾 INDIVIDUAL ORDER CARD */
              <div 
                key={i}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  border: activeTheme.border,
                  borderRadius: activeTheme.radius,            
                  background: activeTheme.bg,                         
                  padding: '8px 14px',                          
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: activeTheme.text }}>
                    {ord.orderNo}
                  </div>
                  <div style={{ fontSize: '12px', color: activeTheme.brand, fontWeight: '600', marginTop: '1px' }}>
                    {ord.item}
                  </div>
                  <div style={{ fontSize: '11px', color: '#776E62', fontWeight: '500', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> {ord.date} • Qty: {ord.qty}
                  </div>
                </div>

                {/* ORDER AMOUNT & PAID STATUS BADGE */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: activeTheme.text, marginBottom: '2px' }}>
                    ₹{ord.total}
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: '700', 
                    color: ord.status.toLowerCase() === 'paid' ? '#059669' : '#D97706',
                    backgroundColor: ord.status.toLowerCase() === 'paid' ? '#ECFDF5' : '#FFFBEB',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        
        /* ==========================================================================
           1. DIRECTORY LIST CONTAINER (Main Clean View)
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          
          {/* 🔍 SEARCH BAR CONTAINER */}
          <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <Search size={16} color="#A39688" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 38px',                
                borderRadius: activeTheme.radius,              
                border: activeTheme.border,   
                backgroundColor: activeTheme.bg,                    
                fontSize: '13.5px',                            
                outline: 'none',
                boxSizing: 'border-box',
                color: activeTheme.text,
                fontWeight: '500',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>

          {/* 📋 CUSTOMER CARDS WRAPPER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#776E62', fontSize: '13.5px', fontWeight: '500' }}>
                No customer records found matching your search.
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                
                /* ==========================================================================
                   🎴 DIRECTORY LIST ITEM: SIMPLIFIED (Name, Number, Total Orders, Avatar Icon)
                   ========================================================================== */
                <div 
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  style={{ 
                    /* 🎨 CUSTOMIZATION: Card Background, Border, Padding & Corner Radius */
                    display: 'flex', 
                    alignItems: 'left', 
                    justifyContent: 'left',
                    border: activeTheme.border, 
                    borderRadius: activeTheme.radius,            
                    background: activeTheme.bg,                       
                    padding: '10px 14px',                        /* 📍 Adjust list item inner spacing */
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',      
                    gap: '12px',                                 
                    boxSizing: 'border-box'
                  }}
                >
                  {/* 📍 LEFT STACK: Contact Avatar + (Name & Number) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    
                    {/* 🖼️ CUSTOMIZATION: Contact Avatar Icon Container */}
                    <div style={{ 
                      backgroundColor: '#FFF8E7',              /* 📍 Change avatar circle background */
                      border: '1px solid #4A443A',             /* 📍 Change avatar border */
                      width: '42px',                           /* 📍 Change avatar width */
                      height: '42px',                          /* 📍 Change avatar height */
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <User size={20} color={activeTheme.brand} /> {/* 📍 Change Icon size or color */}
                    </div>

                    {/* 📝 CUSTOMIZATION: Customer Name & Phone Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                      
                      {/* 1. CUSTOMER NAME */}
                      <h4 style={{ 
                        margin: 0, 
                        color: activeTheme.text, 
                        fontSize: '15px',                      /* 📍 Change Name font size */
                        fontWeight: '700', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {customer.name}
                      </h4>

                      {/* 2. PHONE NUMBER */}
                      <div style={{ 
                        fontSize: '12px',                      /* 📍 Change Phone font size */
                        color: '#776E62', 
                        fontWeight: '500' 
                      }}>
                        {customer.phone}
                      </div>

                    </div>
                  </div>

                  {/* 📍 RIGHT STACK: Total Orders Pill & Navigation Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    
                    {/* 3. TOTAL ORDERS PILL */}
                    <div style={{ 
                      fontSize: '12px',                        /* 📍 Change Order count font size */
                      fontWeight: '700', 
                      color: activeTheme.brand, 
                      backgroundColor: 'rgba(255, 89, 88, 0.08)', /* 📍 Change order badge pill background */
                      padding: '3px 11px',                     /* 📍 Change order badge padding */
                      borderRadius: '12px',                    /* 📍 Change badge rounded corners */
                      whiteSpace: 'nowrap'
                    }}>
                      {customer.ordersCount} {customer.ordersCount === 1 ? 'Order' : 'Orders'}
                    </div>

                    <ChevronRight size={18} color="#A39688" style={{ flexShrink: 0 }} />
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