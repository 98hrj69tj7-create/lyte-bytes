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
      accentColor: '#8468b8',
      progressFill: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
      glow: '0 0 12px rgba(79, 70, 229, 0.3)',
      icon: Medal
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
      icon: Medal
    };
  }
  if (t.includes('silver')) {
    return {
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.35)',
      badgeBg: 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#555960ad',
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
      icon: Medal
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
    icon: Medal
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
    radius: 'clamp(16px, 4vw, 22px)'
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
        flex: 1, padding: 'clamp(16px, 4vw, 24px)', backgroundColor: '#FFFDF9', minHeight: '85vh', 
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
        marginBottom: '16px',
        minHeight: '32px'
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
            gap: '2px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', 
            fontWeight: '600', 
            padding: '7px 12px',  
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <ArrowLeft size={14}/> Home
        </button>

        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "sans-serif",
          fontSize: 'var(--font-h2)', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '600', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <button 
            onClick={() => setSelectedCustomer(null)}
            style={{
              alignSelf: 'flex-start', 
              background: 'rgba(197, 160, 89, 0.12)', 
              border: '1px solid rgba(197, 160, 89, 0.2)',
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              color: activeTheme.text,
              fontSize: 'var(--font-caption)', 
              fontWeight: '600', 
              padding: '6px 10px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              marginLeft: '2px' 
            }}
          >
            <ArrowLeft size={14} /> Directory
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
                padding: 'clamp(16px, 4vw, 20px)', 
                boxSizing: 'border-box',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '18px', 
                position: 'relative', 
                textAlign: 'left', 
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: '1 1 auto', minWidth: 0 }}>
                    <div style={{ 
                      backgroundColor: tierStyle.bg, 
                      border: `1px solid ${tierStyle.border}`,
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0  
                    }}>
                      <User size={30} color={tierStyle.accentColor} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <h3 style={{ margin: 0, color: activeTheme.text, fontSize: 'var(--font-h2)', fontWeight: '700', lineHeight: '1.25', wordBreak: 'break-word' }}>
                        {selectedCustomer.name}
                      </h3>
                      <p style={{ margin: 0, color: '#78716C', fontSize: 'var(--font-caption)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={12} color={tierStyle.accentColor} /> {selectedCustomer.phone}
                      </p>
                      {selectedCustomer.custCode && (
                        <div style={{ 
                          fontSize: 'var(--font-caption)', 
                          fontWeight: '700', 
                          color: '#78716C', 
                          fontFamily: 'monospace, sans-serif', 
                          letterSpacing: '0.2px', 
                          marginTop: '2px',
                          wordBreak: 'break-all',
                          whiteSpace: 'normal',
                          lineHeight: '1.4'
                        }}>
                          {selectedCustomer.custCode}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ 
                    background: tierStyle.badgeBg, 
                    color: tierStyle.badgeText,
                    padding: '4px 10px', 
                    borderRadius: '10px', 
                    marginTop: '40px',
                    marginRight: '0px',
                    fontSize: 'var(--font-caption)', 
                    fontWeight: '800',
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase', 
                    flexShrink: 0, 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    {selectedCustomer.tier}
                  </div>
                </div>

                {/* LOYALTY SECTION */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)',
                  border: `1.5px solid ${tierStyle.accentColor}40`, 
                  borderRadius: '16px', 
                  padding: '14px 16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  boxShadow: tierStyle.glow, 
                  boxSizing: 'border-box' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{ borderRadius: '12px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Medal size={30} color={tierStyle.accentColor} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 'clamp(9px, 2.5vw, 10.5px)', fontWeight: '800', color: tierStyle.accentColor, textTransform: 'uppercase', letterSpacing: '0.9px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Loyalty Quest</span>
                        <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: tierStyle.accentColor }}>{selectedCustomer.tier} Status</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: '900', color: tierStyle.accentColor }}>{selectedCustomer.loyaltyScore}</span>
                      <span style={{ fontSize: 'var(--font-caption)', fontWeight: '700', color: tierStyle.accentColor, marginLeft: '4px', textTransform: 'uppercase' }}>Pts</span>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', padding: '14px 16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Lifetime Spend</span>
                    <div style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: '600', color: activeTheme.text, marginTop: '4px' }}>₹{selectedCustomer.totalSpent.toLocaleString()}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', padding: '14px 16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Highest Order</span>
                    <div style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: '600', color: activeTheme.text, marginTop: '4px' }}>₹{selectedCustomer.highestOrder.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          <h3 style={{ margin: '8px 0 0 2px', color: activeTheme.text, fontSize: 'var(--font-body)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'left' }}>
            Order History ({selectedCustomer.orders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {selectedCustomer.orders.map((ord, i) => {
              const isPaid = ord.status.toLowerCase() === 'paid';
              return (
                <div key={i} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: activeTheme.radius,            
                  background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
                  padding: 'clamp(14px, 3vw, 18px)',                           
                  boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)', boxSizing: 'border-box', width: '100%', gap: '12px'
                }}>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: activeTheme.text, wordBreak: 'break-all' }}>{ord.orderNo}</div>
                    <div style={{ fontSize: 'var(--font-caption)', color: activeTheme.brand, fontWeight: '700', marginTop: '3px', whiteSpace: 'normal' }}>{ord.item}</div>
                    <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          
          {/* SEARCH & SORT HEADER ROW */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <Search size={16} color="#78716C" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '13px 14px 13px 42px', borderRadius: '14px',              
                  border: '1px solid rgba(197, 160, 89, 0.45)', backgroundColor: '#FFFFFF',                    
                  fontSize: 'var(--font-body)', outline: 'none', color: activeTheme.text, fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ position: 'relative', width: 'clamp(140px, 35vw, 170px)', flexShrink: 0 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%', padding: '13px 12px', borderRadius: '14px',
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
              <ArrowUpDown size={14} color="#78716C" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* TIER FILTER PILLS (Icon Badges + All Tiers Text) */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', alignItems: 'center' }}>
            {[
              { value: 'ALL', label: 'All Tiers', isText: true },
              { value: 'PLATINUM', label: 'Platinum', icon: Medal },
              { value: 'GOLD', label: 'Gold', icon: Medal },
              { value: 'SILVER', label: 'Silver', icon: Medal },
              { value: 'BRONZE', label: 'Bronze', icon: Medal },
              { value: 'BLUE', label: 'Blue', icon: Medal }
            ].map((tier) => {
              const active = selectedTierFilter === tier.value;
              
              let pillStyle = {};
              if (tier.isText) {
                pillStyle = {
                  padding: '9px 16px',
                  height: '40px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  border: active ? '1px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                  background: active ? '#FF5958' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#78716C',
                  boxShadow: active ? '0 4px 12px rgba(255, 89, 88, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)'
                };
              } else {
                const ts = getTierStyles(tier.value);
                pillStyle = {
                  padding: '8px',
                  width: '40px',
                  height: '40px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: active ? `1.5px solid ${ts.accentColor}` : `1px solid ${ts.border}`,
                  background: active ? ts.badgeBg : ts.bg,
                  color: active ? '#FFFFFF' : ts.accentColor,
                  boxShadow: active ? ts.glow : '0 2px 6px rgba(0,0,0,0.02)'
                };
              }

              const IconComponent = tier.icon;

              return (
                <button
                  key={tier.value}
                  onClick={() => setSelectedTierFilter(tier.value)}
                  title={tier.label}
                  style={{
                    borderRadius: '12px',
                    fontSize: 'var(--font-caption)', 
                    fontWeight: '800', 
                    cursor: 'pointer', 
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease', 
                    flexShrink: 0,
                    ...pillStyle
                  }}
                >
                  {tier.isText ? tier.label : <IconComponent size={20} color={active ? '#FFFFFF' : getTierStyles(tier.value).accentColor} />}
                </button>
              );
            })}
          </div>

          {/* CUSTOMER LIST CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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
                      padding: 'clamp(10px, 3vw, 18px)', 
                      cursor: 'pointer', 
                      boxShadow: '0 8px 24px rgba(44, 34, 30, 0.05)',      
                      gap: '14px', 
                      boxSizing: 'border-box', 
                      width: '100%', 
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ 
                          backgroundColor: tierStyle.bg, 
                          border: `1px solid ${tierStyle.border}`,
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <User size={30} color={tierStyle.accentColor} />
                        </div>
                        <div 
                          title={`${customer.tier} Tier`}
                          style={{
                            position: 'absolute', bottom: '-4px', right: '-4px',
                            background: tierStyle.badgeBg, borderRadius: '50%',
                            width: '20px', height: '20px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            border: '1px solid #FFFDF9', boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
                          }}
                        >
                          <TierIconComponent size={15} color="#FFFFFF" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <h4 style={{ 
                          margin: 0, 
                          color: activeTheme.text, 
                          fontSize: 'var(--font-h2)', 
                          fontWeight: '500', 
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

                    <div style={{ display: 'flex', alignItems: 'right', gap: '10px', flexShrink: 0 }}>
                      <div style={{ 
                        fontSize: 'clamp(11.5px, 2.5vw, 11px)', 
                        fontWeight: '600', 
                        color: activeTheme.brand, 
                        letterSpacing: '0.3px',
                      }}>
                        {sortBy === 'orders_desc' && `${customer.ordersCount} ${customer.ordersCount === 1 ? 'Order' : 'Orders'}`}
                        {sortBy === 'spend_desc' && `₹${customer.totalSpent.toLocaleString()}`}
                        {sortBy === 'highest_order_desc' && `₹${customer.highestOrder.toLocaleString()}`}
                        {sortBy === 'score_desc' && `${customer.loyaltyScore} Pts`}
                      </div>

                      <ChevronRight size={14} color="#78716C" style={{ opacity: 0.8 }} />
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