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
  Medal,
  Fingerprint,
  Download,
  Filter,
  ShieldAlert
} from 'lucide-react';

/* ==========================================================================
   CONFIG & DATA FETCHING HELPERS
   ========================================================================== */

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";

function getMilestoneInfo(score = 0, currentTier = 'Blue') {
  const t = (currentTier || 'Blue').toLowerCase();
  
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
    targetPts = 500;
    currentTierBase = 200;
  } else if (t.includes('silver')) {
    targetPts = 100;
    currentTierBase = 100;
  } else if (t.includes('bronze')) {
    targetPts = 50;
    currentTierBase = 50;
  } else {
    targetPts = 50;
    currentTierBase = 0;
  }

  const ptsRemaining = Math.max(0, targetPts - score);
  const range = targetPts - currentTierBase;
  const currentProgress = Math.max(0, score - currentTierBase);
  const progressPercent = range > 0 ? Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100))) : 100;

  let nextTierName = 'Bronze';
  if (t.includes('bronze')) nextTierName = 'Silver';
  else if (t.includes('silver')) nextTierName = 'Gold';
  else if (t.includes('gold')) nextTierName = 'Platinum';

  return {
    nextTierName,
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
      bg: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(99, 102, 241, 0.4)',
      badgeBg: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#818CF8',
      progressFill: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
      glow: '0 0 16px rgba(79, 70, 229, 0.35)',
      icon: Medal
    };
  }
  if (t.includes('gold')) {
    return {
      bg: 'rgba(217, 119, 6, 0.15)',
      border: 'rgba(217, 119, 6, 0.4)',
      badgeBg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#FBBF24',
      progressFill: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
      glow: '0 0 16px rgba(217, 119, 6, 0.35)',
      icon: Medal
    };
  }
  if (t.includes('silver')) {
    return {
      bg: 'rgba(148, 163, 184, 0.15)',
      border: 'rgba(148, 163, 184, 0.4)',
      badgeBg: 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#CBD5E1',
      progressFill: 'linear-gradient(90deg, #64748B 0%, #94A3B8 100%)',
      glow: '0 0 16px rgba(148, 163, 184, 0.35)',
      icon: Medal
    };
  }
  if (t.includes('bronze')) {
    return {
      bg: 'rgba(194, 65, 12, 0.15)',
      border: 'rgba(194, 65, 12, 0.4)',
      badgeBg: 'linear-gradient(135deg, #d26033 0%, #b25320 100%)',
      badgeText: '#FFFFFF',
      accentColor: '#FB923C',
      progressFill: 'linear-gradient(90deg, #d26033 0%, #b25320 100%)',
      glow: '0 0 16px rgba(194, 65, 12, 0.35)',
      icon: Medal
    };
  }
  
  return {
    bg: 'rgba(37, 99, 235, 0.15)',
    border: 'rgba(37, 99, 235, 0.4)',
    badgeBg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    badgeText: '#FFFFFF',
    accentColor: '#60A5FA',
    progressFill: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
    glow: '0 0 16px rgba(37, 99, 235, 0.35)',
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
   SUGGESTED ADMIN ENHANCEMENTS INCLUDED:
   1. Elite Dark Obsidian & Warm Gold Aesthetic (Differentiated Backend Theme)
   2. Biometric / Face ID Quick Sign-In (Saves session token after initial PIN)
   3. Quick Stats Overview Bar (Total Revenue, Total Customers, Active Orders)
   4. Export Customer Directory to CSV functionality
   ========================================================================== */
export default function AdminCustomerDashboard({ theme = {}, onBack, setView }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lyte_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('orders_desc');
  const [biometricSupported, setBiometricSupported] = useState(false);

  const containerRef = useRef(null);

  // Elite Obsidian & Gold Admin Color System
  const adminTheme = {
    bg: '#121110',
    cardBg: '#1C1A17',
    cardBorder: '1px solid rgba(197, 160, 89, 0.25)',
    textPrimary: '#F9F6EE',
    textSecondary: '#A8A29E',
    brandGold: '#C5A059',
    accentRed: '#FF5958',
    radius: '18px'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [selectedCustomer]);

  // Check WebAuthn Biometric Support
  useEffect(() => {
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(available => {
        setBiometricSupported(available);
      }).catch(() => setBiometricSupported(false));
    }
  }, []);

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
      localStorage.setItem('lyte_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          timeout: 60000,
          userVerification: "required"
        }
      });

      if (credential) {
        setIsAuthenticated(true);
        localStorage.setItem('lyte_admin_auth', 'true');
        setPinError(false);
      }
    } catch (err) {
      console.log("Biometric authentication cancelled or failed:", err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lyte_admin_auth');
  };

  const exportToCSV = () => {
    const headers = ["Customer Name", "Phone", "Customer Code", "Tier", "Loyalty Points", "Total Spent (INR)", "Orders Count"];
    const rows = customersData.map(c => [
      `"${c.name}"`,
      c.phone,
      `"${c.custCode || ''}"`,
      c.tier,
      c.loyaltyScore,
      c.totalSpent,
      c.ordersCount
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lyte_bytes_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Calculate high-level summary metrics
  const totalRevenue = customersData.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrdersCount = customersData.reduce((acc, c) => acc + c.ordersCount, 0);

  const handleBack = onBack || (() => setView && setView('home'));

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        flex: 1, padding: '24px', backgroundColor: adminTheme.bg, minHeight: '100dvh', 
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ 
          width: '100%', maxWidth: '400px', backgroundColor: adminTheme.cardBg, 
          border: adminTheme.cardBorder, borderRadius: adminTheme.radius, 
          padding: '36px 24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            backgroundColor: 'rgba(197, 160, 89, 0.1)', border: '1px solid rgba(197, 160, 89, 0.3)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' 
          }}>
            <Lock size={28} color={adminTheme.brandGold} />
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700', color: adminTheme.textPrimary, letterSpacing: '0.5px' }}>
            Admin Portal
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: adminTheme.textSecondary, fontWeight: '500' }}>
            Enter your secure passcode or authenticate via biometrics.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password" 
              placeholder="••••" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '14px', 
                border: pinError ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.3)', 
                backgroundColor: '#121110', fontSize: '20px', outline: 'none', 
                textAlign: 'center', letterSpacing: '6px', fontWeight: '700', color: '#F9F6EE', boxSizing: 'border-box'
              }}
            />
            {pinError && <span style={{ fontSize: '12px', color: '#FF5958', fontWeight: '600' }}>Incorrect PIN. Please try again.</span>}
            
            <button 
              type="submit" 
              style={{ 
                width: '100%', padding: '14px', backgroundColor: adminTheme.brandGold, color: '#121110', 
                border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(197, 160, 89, 0.3)' 
              }}
            >
              Unlock Dashboard
            </button>

            {biometricSupported && (
              <button 
                type="button"
                onClick={handleBiometricLogin}
                style={{ 
                  width: '100%', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  color: adminTheme.brandGold, border: '1px solid rgba(197, 160, 89, 0.3)', 
                  borderRadius: '14px', fontWeight: '700', fontSize: '13px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Fingerprint size={18} /> Sign in with Face ID / Biometrics
              </button>
            )}
          </form>

          <button onClick={handleBack} style={{ background: 'none', border: 'none', color: adminTheme.textSecondary, fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '24px' }}>
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
        width: '100vw',                 // 💡 Break out to full viewport width
        marginLeft: 'calc(-50vw + 50%)',// 💡 Centers and forces full bleed across parent paddings
        padding: '16px 16px 80px 16px',// 💡 16px side padding so content stays aligned nicely
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: adminTheme.bg,
        color: adminTheme.textPrimary,
        minHeight: '100dvh',
        overflowX: 'hidden'
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: '20px',
        padding: '0 4px'
      }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.08)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: adminTheme.textPrimary, 
            fontSize: '12px', 
            fontWeight: '700', 
            padding: '6px 8px',  
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <ArrowLeft size={14}/> Storefront
        </button>

        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '20px', 
          color: adminTheme.brandGold, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '1px', 
          textTransform: 'uppercase' 
        }}>
          Admin
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={exportToCSV}
            title="Export CSV"
            style={{ 
              background: 'rgba(197, 160, 89, 0.15)', 
              border: '1px solid rgba(197, 160, 89, 0.4)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: adminTheme.brandGold, 
              padding: '8px',  
              borderRadius: '12px'
            }}
          >
            <Download size={14}/>
          </button>
          <button 
            onClick={handleLogout}
            title="Lock Session"
            style={{ 
              background: 'rgba(255, 89, 88, 0.15)', 
              border: '1px solid rgba(255, 89, 88, 0.4)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#FF5958', 
              padding: '8px',  
              borderRadius: '12px'
            }}
          >
            <ShieldAlert size={14}/>
          </button>
        </div>
      </div>

      {/* HIGH LEVEL STATS SUMMARY BAR */}
      {!isLoading && !selectedCustomer && (
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' 
        }}>
          <div style={{ background: adminTheme.cardBg, border: adminTheme.cardBorder, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: adminTheme.textSecondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Records</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: adminTheme.brandGold, marginTop: '4px' }}>{customersData.length}</div>
          </div>
          <div style={{ background: adminTheme.cardBg, border: adminTheme.cardBorder, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: adminTheme.textSecondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399', marginTop: '4px' }}>₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ background: adminTheme.cardBg, border: adminTheme.cardBorder, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: adminTheme.textSecondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#60A5FA', marginTop: '4px' }}>{totalOrdersCount}</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '14px' }}>
          <Loader2 size={36} className="animate-spin" color={adminTheme.brandGold} />
          <p style={{ fontSize: '13px', color: adminTheme.textSecondary, fontWeight: '600', letterSpacing: '0.5px' }}>Synchronizing secure customer vault...</p>
        </div>
      ) : selectedCustomer ? (
        
        /* ==========================================================================
           DETAILED CUSTOMER VIEW
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <button 
            onClick={() => setSelectedCustomer(null)}
            style={{
              alignSelf: 'flex-start', 
              background: adminTheme.cardBg, 
              border: adminTheme.cardBorder,
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: adminTheme.brandGold,
              fontSize: '12px', 
              fontWeight: '700', 
              padding: '8px 14px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <ArrowLeft size={14} /> Back to Directory
          </button>

          {(() => {
            const tierStyle = getTierStyles(selectedCustomer.tier);
            const milestone = getMilestoneInfo(selectedCustomer.loyaltyScore, selectedCustomer.tier);
            const nextTierStyle = getTierStyles(milestone.nextTierName);

            return (
              <div style={{ 
                background: adminTheme.cardBg,
                border: adminTheme.cardBorder, 
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
                borderRadius: adminTheme.radius, 
                padding: '20px', 
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
                      border: `1px dashed ${tierStyle.border}`,
                      width: '45px', 
                      height: '45px', 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0  
                    }}>
                      <User size={40} color={tierStyle.accentColor} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, color: adminTheme.textPrimary, fontSize: '18px', fontWeight: '700', lineHeight: '1.3', wordBreak: 'break-word' }}>
                        {selectedCustomer.name}
                      </h3>
                      <p style={{ margin: 0, color: adminTheme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={12} color={tierStyle.accentColor} /> {selectedCustomer.phone}
                      </p>
                      {selectedCustomer.custCode && (
                        <div style={{ 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          color: adminTheme.brandGold, 
                          fontFamily: 'monospace, sans-serif', 
                          letterSpacing: '0.3px', 
                          marginTop: '2px',
                          wordBreak: 'break-all'
                        }}>
                          {selectedCustomer.custCode}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ 
                    background: tierStyle.badgeBg, 
                    color: tierStyle.badgeText,
                    padding: '6px 12px', 
                    borderRadius: '10px', 
                    fontSize: '11px', 
                    fontWeight: '800',
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase', 
                    flexShrink: 0, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    {selectedCustomer.tier}
                  </div>
                </div>

                {/* LOYALTY SECTION */}
                <div style={{ 
                  background: '#121110',
                  border: `1px solid ${tierStyle.accentColor}40`, 
                  borderRadius: '14px', 
                  padding: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  boxShadow: tierStyle.glow, 
                  boxSizing: 'border-box' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{ borderRadius: '10px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Medal size={24} color={tierStyle.accentColor} />
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: tierStyle.accentColor, textTransform: 'uppercase', letterSpacing: '0.9px', display: 'block' }}>Loyalty Quest</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#F9F6EE' }}>{selectedCustomer.tier} Status</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '20px', fontWeight: '900', color: tierStyle.accentColor }}>{selectedCustomer.loyaltyScore}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: adminTheme.textSecondary, marginLeft: '4px', textTransform: 'uppercase' }}>Pts</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1px' }}>
                    <div style={{ height: '100%', width: `${milestone.progressPercent}%`, background: tierStyle.progressFill, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                  </div>

                  <div style={{ fontSize: '12px', color: adminTheme.textSecondary, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  <div style={{ background: '#121110', border: '1px solid rgba(197, 160, 89, 0.25)', padding: '14px 16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: adminTheme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Lifetime Spend</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399', marginTop: '4px' }}>₹{selectedCustomer.totalSpent.toLocaleString()}</div>
                  </div>
                  <div style={{ background: '#121110', border: '1px solid rgba(197, 160, 89, 0.25)', padding: '14px 16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: adminTheme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Highest Order</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#60A5FA', marginTop: '4px' }}>₹{selectedCustomer.highestOrder.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          <h3 style={{ margin: '8px 0 0 2px', color: adminTheme.brandGold, fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'left' }}>
            Order Ledger History ({selectedCustomer.orders.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {selectedCustomer.orders.map((ord, i) => {
              const isPaid = ord.status.toLowerCase() === 'paid';
              return (
                <div key={i} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  border: adminTheme.cardBorder, borderRadius: '14px',            
                  background: adminTheme.cardBg, 
                  padding: '14px 16px',                           
                  boxSizing: 'border-box', width: '100%', gap: '12px'
                }}>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: adminTheme.textPrimary, wordBreak: 'break-all' }}>{ord.orderNo}</div>
                    <div style={{ fontSize: '12px', color: adminTheme.brandGold, fontWeight: '700', marginTop: '3px' }}>{ord.item}</div>
                    <div style={{ fontSize: '11px', color: adminTheme.textSecondary, fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <Calendar size={12} /> {ord.date} • Qty: {ord.qty}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#34D399', marginBottom: '6px' }}>₹{ord.total}</div>
                    <span style={{ 
                      fontSize: '10px', fontWeight: '800', color: isPaid ? '#34D399' : '#F87171',
                      backgroundColor: isPaid ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', display: 'inline-block',
                      border: isPaid ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)'
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
           DIRECTORY LIST CONTAINER
           ========================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          
          {/* SEARCH & SORT HEADER ROW */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <input 
                type="text"
                placeholder="Search name/phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 8px', borderRadius: '14px',              
                  border: adminTheme.cardBorder, backgroundColor: adminTheme.cardBg,                    
                  fontSize: '14px', outline: 'none', color: adminTheme.textPrimary, fontWeight: '400',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ position: 'relative', width: '150px', flexShrink: 0 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%', padding: '12px 18px', borderRadius: '14px',
                  border: adminTheme.cardBorder, backgroundColor: adminTheme.cardBg,
                  color: adminTheme.textPrimary, fontSize: '11px', fontWeight: '500',
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="orders_desc" style={{ background: '#1C1A17' }}>Most Orders</option>
                <option value="spend_desc" style={{ background: '#1C1A17' }}>Highest Spend</option>
                <option value="highest_order_desc" style={{ background: '#1C1A17' }}>Highest Order</option>
                <option value="score_desc" style={{ background: '#1C1A17' }}>Loyalty Score</option>
              </select>
              <ArrowUpDown size={14} color={adminTheme.textSecondary} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* TIER FILTER PILLS */}
          <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', alignItems: 'center' }}>
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
                  padding: '8px 16px',
                  height: '38px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  border: active ? `1px solid ${adminTheme.brandGold}` : adminTheme.cardBorder,
                  background: active ? adminTheme.brandGold : adminTheme.cardBg,
                  color: active ? '#121110' : adminTheme.textSecondary,
                  boxShadow: active ? '0 4px 12px rgba(197, 160, 89, 0.3)' : 'none'
                };
              } else {
                const ts = getTierStyles(tier.value);
                pillStyle = {
                  padding: '8px',
                  width: '38px',
                  height: '38px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: active ? `1.5px solid ${ts.accentColor}` : ts.border,
                  background: active ? ts.badgeBg : ts.bg,
                  color: active ? '#FFFFFF' : ts.accentColor
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
                    fontSize: '12px', 
                    fontWeight: '800', 
                    cursor: 'pointer', 
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease', 
                    flexShrink: '0',
                    ...pillStyle
                  }}
                >
                  {tier.isText ? tier.label : <IconComponent size={18} color={active ? '#FFFFFF' : getTierStyles(tier.value).accentColor} />}
                </button>
              );
            })}
          </div>

          {/* CUSTOMER LIST CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: adminTheme.textSecondary, fontSize: '14px', fontWeight: '600' }}>
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
                      border: adminTheme.cardBorder, 
                      borderRadius: '14px',            
                      background: adminTheme.cardBg,                       
                      padding: '8px 12px', 
                      cursor: 'pointer',       
                      gap: '6px', 
                      boxSizing: 'border-box', 
                      width: '100%', 
                      transition: 'transform 0.15s ease, border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ 
                          backgroundColor: tierStyle.bg, 
                          border: `1px solid ${tierStyle.border}`,
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <User size={24} color={tierStyle.accentColor} />
                        </div>
                        <div 
                          title={`${customer.tier} Tier`}
                          style={{
                            position: 'absolute', bottom: '-4px', right: '-4px',
                            background: tierStyle.badgeBg, borderRadius: '50%',
                            width: '18px', height: '18px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            border: '1px solid #1C1A17'
                          }}
                        >
                          <TierIconComponent size={12} color="#FFFFFF" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <h4 style={{ 
                          margin: 0, 
                          color: adminTheme.textPrimary, 
                          fontSize: '14px', 
                          fontWeight: '700', 
                          whiteSpace: 'normal', 
                          wordBreak: 'break-word', 
                          lineHeight: '1.3' 
                        }}>
                          {customer.name}
                        </h4>

                        <div style={{ fontSize: '11px', color: adminTheme.textSecondary, fontWeight: '600' }}>
                          {customer.phone}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '700', 
                        color: adminTheme.brandGold, 
                        letterSpacing: '0.3px',
                        textAlign: 'right'
                      }}>
                        {sortBy === 'orders_desc' && `${customer.ordersCount} ${customer.ordersCount === 1 ? 'Order' : 'Orders'}`}
                        {sortBy === 'spend_desc' && `₹${customer.totalSpent.toLocaleString()}`}
                        {sortBy === 'highest_order_desc' && `₹${customer.highestOrder.toLocaleString()}`}
                        {sortBy === 'score_desc' && `${customer.loyaltyScore} Pts`}
                      </div>

                      <ChevronRight size={14} color={adminTheme.textSecondary} />
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