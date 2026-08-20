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
  Award,
  Zap,
  ArrowUpDown,
  Trophy,
  Star,
  ShieldCheck,
  Crown,
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
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.35)',
      badgeBg: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#4F46E5',
      progressFill: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
      glow: '0 0 12px rgba(79, 70, 229, 0.3)',
      icon: Crown
    };
  }
  if (t.includes('gold')) {
    return {
      bg: 'rgba(217, 119, 6, 0.12)',
      border: 'rgba(217, 119, 6, 0.35)',
      badgeBg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#D97706',
      progressFill: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
      glow: '0 0 12px rgba(217, 119, 6, 0.3)',
      icon: Trophy
    };
  }
  if (t.includes('silver')) {
    return {
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.35)',
      badgeBg: 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#64748B',
      progressFill: 'linear-gradient(90deg, #64748B 0%, #94A3B8 100%)',
      glow: '0 0 12px rgba(100, 116, 139, 0.3)',
      icon: Medal
    };
  }
  if (t.includes('bronze')) {
    return {
      bg: 'rgba(194, 65, 12, 0.12)',
      border: 'rgba(194, 65, 12, 0.35)',
      badgeBg: 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#C2410C',
      progressFill: 'linear-gradient(90deg, #C2410C 0%, #EA580C 100%)',
      glow: '0 0 12px rgba(194, 65, 12, 0.3)',
      icon: Award
    };
  }
  
  return {
    bg: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.35)',
    badgeBg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    badgeText: '#FFFFFF',
    accentColor: '#2563EB',
    progressFill: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
    glow: '0 0 12px rgba(37, 99, 235, 0.3)',
    icon: Star
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

  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('orders_desc');

  const containerRef = useRef(null);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(16px, 4vw, 22px)' // 💡 FLUID RADIUS
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
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
                highestOrder: 0,
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
              if (amount > customerMap[phone].highestOrder) {
                customerMap[phone].highestOrder = amount;
              }
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

  const filteredCustomers = customersData.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm) ||
      (c.custCode && c.custCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedTierFilter === 'ALL') return matchesSearch;
    return matchesSearch && c.tier.toLowerCase().includes(selectedTierFilter.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'orders_desc') return b.ordersCount - a.ordersCount;
    if (sortBy === 'spend_desc') return b.totalSpent - a.totalSpent;
    if (sortBy === 'highest_order_desc') return b.highestOrder - a.highestOrder;
    if (sortBy === 'score_desc') return b.loyaltyScore - a.loyaltyScore;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleBack = onBack || (() => setView && setView('home'));

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        flex: 1, padding: 'clamp(16px, 4vw, 24px)', backgroundColor: '#FFFDF9', minHeight: '85vh', // 💡 FLUID PADDING
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ 
          width: '100%', maxWidth: '380px', backgroundColor: '#FFFFFF', 
          border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: activeTheme.radius, 
          padding: 'clamp(24px, 6vw, 36px) clamp(16px, 5vw, 24px)', textAlign: 'center', boxShadow: '0 12px 32px rgba(44, 34, 30, 0.08)'
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            backgroundColor: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto' 
          }}>
            <Lock size={28} color={activeTheme.brand} />
          </div>
          {/* 💡 FLUID TYPOGRAPHY */}
          <h3 style={{ margin: '0 0 6px 0', fontSize: 'var(--font-h2)', fontWeight: '700', color: activeTheme.text }}>Admin Portal</h3>
          <p style={{ margin: '0 0 24px 0', fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500' }}>Enter your secure passcode to access elite customer files.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password" 
              placeholder="••••" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '14px', 
                border: pinError ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)', 
                backgroundColor: '#FFFFFF', fontSize: '18px', outline: 'none', 
                textAlign: 'center', letterSpacing: '4px', fontWeight: '700', color: activeTheme.text, boxSizing: 'border-box'
              }}
            />
            {pinError && <span style={{ fontSize: 'var(--font-caption)', color: '#FF5958', fontWeight: '600' }}>Incorrect PIN. Please try again.</span>}
            <button 
              type="submit" 
              style={{ 
                width: '100%', padding: '15px', backgroundColor: activeTheme.brand, color: '#FFFFFF', 
                border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: 'var(--font-body)', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255, 89, 88, 0.3)' 
              }}
            >
              Unlock Dashboard
            </button>
          </form>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#78716C', fontSize: 'var(--font-caption)', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}>
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        /* 💡 FLUID OUTER PADDING: Adapts gracefully on smaller screens */
        padding: 'clamp(12px, 3vw, 16px) clamp(8px, 2vw, 16px) 88px clamp(8px, 2vw, 16px)', 
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        position: 'relative', 
        marginBottom: '12px',
        minHeight: '30px'
      }}>
        <button 
          onClick={handleBack} 
          style={{ 
            position: 'absolute',
            left: '2px',
            background: 'rgba(255, 255, 255, 0.9)', 
            border: '1px solid rgba(197, 160, 89, 0.2)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
            fontWeight: '600', 
            padding: '4px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <ArrowLeft size={13}/> Home
        </button>

        <h2 style={{ 
          fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '800', 
          letterSpacing: '1px', 
          textTransform: 'uppercase', 
          textAlign: 'center'
        }}>
          CUSTOMERS ({filteredCustomers.length})
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '14px' }}>
          <Loader2 size={34} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: 'var(--font-body)', color: '#78716C', fontWeight: '600', letterSpacing: '0.3px' }}>Syncing elite customer records...</p>
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
              border: '1px solid rgba(197, 160, 89, 0.2)',
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '1px', 
              color: activeTheme.text,
              fontSize: 'var(--font-caption)', 
              fontWeight: '600', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              marginLeft: '2px' 
            }}
          >
            <ArrowLeft size={15} /> Directory
          </button>

          {(() => {
            const tierStyle = getTierStyles(selectedCustomer.tier);
            const milestone = getMilestoneInfo(selectedCustomer.loyaltyScore, selectedCustomer.tier);
            const TierIconComponent = tierStyle.icon;
            
            const nextTierStyle = getTierStyles(milestone.nextTierName);

            return (
              <div style={{ 
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
                border: '1px solid rgba(197, 160, 89, 0.45)', 
                boxShadow: '0 12px 32px rgba(44, 34, 30, 0.08)',
                borderRadius: activeTheme.radius, 
                /* 💡 FLUID PADDING: Protects card borders on mobile */
                padding: 'clamp(12px, 4vw, 16px)', 
                boxSizing: 'border-box',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '18px', 
                position: 'relative', 
                textAlign: 'left', 
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                  
                  {/* 💡 BULLETPROOF FLEX: minWidth: 0 prevents long text from breaking flex boundaries */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1 1 auto', minWidth: 0 }}>
                    <div style={{ 
                      backgroundColor: tierStyle.bg, 
                      border: `1px solid ${tierStyle.border}`,
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0  // Prevents icon from squishing
                    }}>
                      <User size={24} color={tierStyle.accentColor} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <h3 style={{ margin: 0, color: activeTheme.text, fontSize: 'var(--font-h2)', fontWeight: '700', lineHeight: '1.25', wordBreak: 'break-word' }}>
                        {selectedCustomer.name}
                      </h3>
                      <p style={{ margin: 0, color: '#78716C', fontSize: 'var(--font-caption)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} color={tierStyle.accentColor} /> {selectedCustomer.phone}
                      </p>
                      {selectedCustomer.custCode && (
                        <div style={{ 
                          fontSize: 'var(--font-caption)', 
                          fontWeight: '700', 
                          color: '#78716C', 
                          fontFamily: 'monospace, sans-serif', 
                          letterSpacing: '0.2px', 
                          marginTop: '0px',
                          marginLeft: '-50px', 
                          wordBreak: 'break-all',
                          whiteSpace: 'normal',
                          lineHeight: '1.4'
                        }}>
                          {selectedCustomer.custCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 💡 BULLETPROOF FLEX: flexShrink: 0 protects the badge from text collision */}
                  <div style={{ 
                    background: tierStyle.badgeBg, 
                    color: tierStyle.badgeText,
                    padding: '4px 10px', 
                    borderRadius: '10px', 
                    fontSize: 'var(--font-caption)', 
                    fontWeight: '800',
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase', 
                    flexShrink: 0, 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
                    display: 'flex', 
                    marginTop: '32px',
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    <TierIconComponent size={12} color="#FFFFFF" />
                    {selectedCustomer.tier}
                  </div>
                </div>

                {/* LOYALTY SECTION */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)',
                  border: `1.5px solid ${tierStyle.accentColor}40`, 
                  borderRadius: '16px', 
                  padding: '12px 14px', // Slightly adjusted for breathing room
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px', 
                  boxShadow: tierStyle.glow, 
                  boxSizing: 'border-box' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{ borderRadius: '10px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Medal size={26} color={tierStyle.accentColor} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 'clamp(9px, 2.5vw, 10.5px)', fontWeight: '800', color: tierStyle.accentColor, textTransform: 'uppercase', letterSpacing: '0.9px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Loyalty Quest</span>
                        <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: tierStyle.accentColor }}>{selectedCustomer.tier} Status</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: '900', color: tierStyle.accentColor }}>{selectedCustomer.loyaltyScore}</span>
                      <span style={{ fontSize: 'var(--font-caption)', fontWeight: '800', color: tierStyle.accentColor, marginLeft: '3px', textTransform: 'uppercase' }}>Pts</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(197, 160, 89, 0.15)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '1px' }}>
                    <div style={{ height: '100%', width: `${milestone.progressPercent}%`, background: tierStyle.progressFill, borderRadius: '5px', boxShadow: `0 0 8px ${tierStyle.accentColor}`, transition: 'width 0.8s ease' }} />
                  </div>

                  <div style={{ fontSize: 'var(--font-caption)', color: tierStyle.accentColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color={tierStyle.accentColor} fill={tierStyle.accentColor} />
                    {milestone.isMax ? (
                      <span style={{ color: tierStyle.accentColor, fontWeight: '800' }}>👑 Maximum Elite Tier Achieved!</span>
                    ) : (
                      <span>Only <strong style={{ color: tierStyle.accentColor, fontWeight: '800' }}>{milestone.ptsRemaining} Pts</strong> away from <strong style={{ color: nextTierStyle.accentColor, fontWeight: '700' }}>{milestone.nextTierName}</strong>!</span>
                    )}
                  </div>
                </div>

                {/* STATS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', padding: '14px 12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Lifetime Spend</span>
                    <div style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: '800', color: activeTheme.text, marginTop: '4px' }}>₹{selectedCustomer.totalSpent.toLocaleString()}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', padding: '14px 12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Highest Order</span>
                    <div style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: '800', color: activeTheme.text, marginTop: '4px' }}>₹{selectedCustomer.highestOrder.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          <h3 style={{ margin: '8px 0 0 2px', color: activeTheme.text, fontSize: 'var(--font-body)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'left' }}>
            Order History ({selectedCustomer.orders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {selectedCustomer.orders.map((ord, i) => {
              const isPaid = ord.status.toLowerCase() === 'paid';
              return (
                <div key={i} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: activeTheme.radius,            
                  background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
                  padding: 'clamp(12px, 3vw, 16px)', // 💡 FLUID PADDING                          
                  boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)', boxSizing: 'border-box', width: '100%', gap: '12px'
                }}>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: activeTheme.text, wordBreak: 'break-all' }}>{ord.orderNo}</div>
                    <div style={{ fontSize: 'var(--font-caption)', color: activeTheme.brand, fontWeight: '700', marginTop: '3px', whiteSpace: 'normal' }}>{ord.item}</div>
                    <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '600', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                      <Calendar size={12} /> {ord.date} • Qty: {ord.qty}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: 'var(--font-body)', color: activeTheme.text, marginBottom: '6px' }}>₹{ord.total}</div>
                    <span style={{ 
                      fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: isPaid ? '#059669' : '#DC2626',
                      backgroundColor: isPaid ? '#ECFDF5' : 'rgba(239, 68, 68, 0.1)',
                      padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase', display: 'inline-block'
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
           1. DIRECTORY LIST CONTAINER
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          
          {/* SEARCH & SORT HEADER ROW */}
          <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            {/* 💡 BULLETPROOF FLEX: Ensure input takes up space but doesn't blow out the container */}
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <Search size={16} color="#78716C" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '13px 14px 13px 40px', borderRadius: '14px',              
                  border: '1px solid rgba(197, 160, 89, 0.45)', backgroundColor: '#FFFFFF',                    
                  fontSize: 'var(--font-body)', outline: 'none', color: activeTheme.text, fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ position: 'relative', width: 'clamp(130px, 35vw, 160px)', flexShrink: 0 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%', padding: '13px 10px', borderRadius: '14px',
                  border: '1px solid rgba(197, 160, 89, 0.45)', backgroundColor: '#FFFFFF',
                  color: activeTheme.text, fontSize: 'var(--font-caption)', fontWeight: '700',
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)', boxSizing: 'border-box'
                }}
              >
                <option value="orders_desc">Most Orders</option>
                <option value="spend_desc">Highest Spend</option>
                <option value="highest_order_desc">Highest Order</option>
                <option value="score_desc">Loyalty Score</option>
              </select>
              <ArrowUpDown size={14} color="#78716C" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* TIER FILTER PILLS */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {[
              { label: 'All Tiers', value: 'ALL' },
              { label: 'Platinum', value: 'PLATINUM' },
              { label: 'Gold', value: 'GOLD' },
              { label: 'Silver', value: 'SILVER' },
              { label: 'Bronze', value: 'BRONZE' },
              { label: 'Blue', value: 'BLUE' }
            ].map((tier) => {
              const active = selectedTierFilter === tier.value;
              return (
                <button
                  key={tier.value}
                  onClick={() => setSelectedTierFilter(tier.value)}
                  style={{
                    padding: '8px 12px', borderRadius: '12px',
                    border: active ? '1px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                    background: active ? '#FF5958' : '#FFFFFF', color: active ? '#FFFFFF' : '#78716C',
                    fontSize: 'var(--font-caption)', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: active ? '0 4px 12px rgba(255, 89, 88, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease', flexShrink: 0 // Prevent pills from compressing
                  }}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>

          {/* CUSTOMER LIST CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#78716C', fontSize: 'var(--font-body)', fontWeight: '600' }}>
                No customer records found matching your filter criteria.
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const tierStyle = getTierStyles(customer.tier);
                const TierIconComponent = tierStyle.icon;
                
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
                      padding: 'clamp(12px, 3vw, 16px)', // 💡 FLUID PADDING
                      cursor: 'pointer', 
                      boxShadow: '0 8px 24px rgba(44, 34, 30, 0.05)',      
                      gap: '12px', 
                      boxSizing: 'border-box', 
                      width: '100%', 
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    {/* Left: Avatar with Icon-only Tier Medal badge at bottom corner, Name fully wrapped/visible */}
                    {/* 💡 BULLETPROOF FLEX: minWidth: 0 prevents customer name from pushing numbers off screen */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ 
                          backgroundColor: tierStyle.bg, 
                          border: `1px solid ${tierStyle.border}`,
                          width: '46px', 
                          height: '46px', 
                          borderRadius: '14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <User size={20} color={tierStyle.accentColor} />
                        </div>
                        <div 
                          title={`${customer.tier} Tier`}
                          style={{
                            position: 'absolute', bottom: '-4px', right: '-4px',
                            background: tierStyle.badgeBg, borderRadius: '50%',
                            width: '20px', height: '20px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            border: '2px solid #FFFDF9', boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
                          }}
                        >
                          <TierIconComponent size={10} color="#FFFFFF" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <h4 style={{ 
                          margin: 0, 
                          color: activeTheme.text, 
                          fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY 
                          fontWeight: '700', 
                          whiteSpace: 'normal', 
                          wordBreak: 'break-word', 
                          lineHeight: '1.3' 
                        }}>
                          {customer.name}
                        </h4>

                        <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '600' }}>
                          {customer.phone}
                        </div>
                      </div>
                    </div>

                    {/* Right: Dynamic Metric & Chevron */}
                    {/* 💡 BULLETPROOF FLEX: flexShrink: 0 locks this to the right wall */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <div style={{ 
                        fontSize: 'clamp(9px, 2.5vw, 11px)', // Keeps numeric badges compact
                        fontWeight: '800', 
                        color: activeTheme.brand, 
                        backgroundColor: 'rgba(255, 89, 88, 0.09)', 
                        padding: '6px 10px', 
                        borderRadius: '10px', 
                        whiteSpace: 'nowrap', 
                        letterSpacing: '0.3px',
                        boxShadow: '0 2px 6px rgba(255,89,88,0.1)'
                      }}>
                        {sortBy === 'orders_desc' && `${customer.ordersCount} ${customer.ordersCount === 1 ? 'Order' : 'Orders'}`}
                        {sortBy === 'spend_desc' && `₹${customer.totalSpent.toLocaleString()}`}
                        {sortBy === 'highest_order_desc' && `₹${customer.highestOrder.toLocaleString()}`}
                        {sortBy === 'score_desc' && `${customer.loyaltyScore} Pts`}
                      </div>

                      <ChevronRight size={16} color="#78716C" style={{ opacity: 0.8 }} />
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