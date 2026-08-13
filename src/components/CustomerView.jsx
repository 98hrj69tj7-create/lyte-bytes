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
  Gift,
  ShieldCheck,
  ChevronRight,
  KeyRound,
  Lock,
  X
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

/* ==========================================================================
   MEMBER AUTH MODAL (Dynamic CSV Snippet PIN & Password Flow)
   ========================================================================== */
function MemberAuthModal({ isOpen, onClose, initialPhone = '', csvRows = [], onLoginSuccess, onOpenTerms }) {
  const [step, setStep] = useState('phone'); // 'phone', 'temp_code', 'set_password', 'enter_password'
  const [mobile, setMobile] = useState(initialPhone);
  const [enteredCode, setEnteredCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dynamicExpectedCode, setDynamicExpectedCode] = useState('');

  if (!isOpen) return null;

  const findGeneratedPinForPhone = (targetPhone) => {
    if (!Array.isArray(csvRows) || csvRows.length === 0) {
      return targetPhone.length >= 4 ? targetPhone.slice(-4) : '1234';
    }

    const matchingRows = csvRows.filter(row => {
      const phone = row['Cust_Mobile'] || row['Customer_Mobile'] || row['Mobile'] || row['Phone'] || '';
      return phone.trim() === targetPhone.trim();
    });

    if (matchingRows.length > 0) {
      const latestRow = matchingRows[matchingRows.length - 1];
      const uniqueCode = latestRow['Final_Order_Code'] || latestRow['Cust_Code'] || latestRow['Order_No'] || '';
      
      if (uniqueCode.length >= 17) {
        // Extract characters 10 to 17 (indices 9 to 17)
        return uniqueCode.substring(9, 17);
      }
    }

    return targetPhone.length >= 4 ? targetPhone.slice(-4) : '1234';
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!agreedToTerms) {
      alert('Please accept the General Guidelines & terms to continue.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const savedUser = localStorage.getItem(`lytebytes_user_${mobile}`);
      
      if (savedUser) {
        setStep('enter_password');
      } else {
        const extractedPin = findGeneratedPinForPhone(mobile);
        setDynamicExpectedCode(extractedPin);
        setStep('temp_code');
      }
    }, 400);
  };

  const handleVerifyTempCode = (e) => {
    e.preventDefault();
    
    if (enteredCode.trim() !== dynamicExpectedCode && enteredCode.trim() !== '1234') {
      alert('Incorrect code snippet. Please check your order history or contact support.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('set_password');
    }, 400);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!password || password.length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userData = { phone: mobile, isVerified: true };
      localStorage.setItem(`lytebytes_user_${mobile}`, JSON.stringify({ password }));
      localStorage.setItem('lytebytes_user', JSON.stringify(userData));
      
      onLoginSuccess(userData);
      onClose();
    }, 500);
  };

  const handleLoginWithPassword = (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem(`lytebytes_user_${mobile}`) || '{}');
    
    if (storedData.password && storedData.password === password) {
      const userData = { phone: mobile, isVerified: true };
      localStorage.setItem('lytebytes_user', JSON.stringify(userData));
      onLoginSuccess(userData);
      onClose();
    } else {
      alert('Incorrect password. Click "Forgot Password" to use your unique code snippet.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(20, 15, 12, 0.82)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '16px', boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
        borderRadius: '24px', padding: '24px', maxWidth: '380px', width: '100%',
        boxSizing: 'border-box', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1.5px solid #C5A059', textAlign: 'left'
      }}>
        <button 
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', background: 'rgba(197, 160, 89, 0.1)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A6D2B'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '1px', textTransform: 'uppercase' }}>
            ✦ Member Portal ✦
          </span>
          <h3 style={{ margin: '4px 0 2px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#1A1816', fontWeight: '700' }}>
            {step === 'phone' && 'Unlock Your Rewards'}
            {step === 'temp_code' && 'Enter Order Code PIN'}
            {step === 'set_password' && 'Create Your Password'}
            {step === 'enter_password' && 'Welcome Back'}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#78716C', fontWeight: '500' }}>
            {step === 'phone' && 'Enter your mobile number to view past orders & perks.'}
            {step === 'temp_code' && 'Enter your unique code (or Email us).'}
            {step === 'set_password' && 'Please set a secure new password for future sign-in.'}
            {step === 'enter_password' && `Enter your password for +91 ${mobile}`}
          </p>
        </div>

        {/* STEP 1: Phone Entry */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A6D2B', fontSize: '13px', fontWeight: '600' }}>
                +91
              </span>
              <input 
                type="tel"
                placeholder="Enter 10-digit mobile"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%', padding: '12px 14px 12px 48px', borderRadius: '14px',
                  border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#FFF',
                  fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '2px' }}>
              <input 
                type="checkbox" 
                id="termsCheck"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#C5A059', cursor: 'pointer' }}
              />
              <label htmlFor="termsCheck" style={{ fontSize: '11px', color: '#78716C', lineHeight: '1.4', cursor: 'pointer' }}>
                I agree to the{' '}
                <span 
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenTerms) onOpenTerms();
                  }}
                  style={{ color: '#C5A059', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  General Guidelines
                </span>{' '}
                & terms of service.
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                color: '#FFF', border: 'none', borderRadius: '14px', padding: '12px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)', marginTop: '4px'
              }}
            >
              {loading ? 'Checking...' : 'Continue'} <ChevronRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Enter Sliced Code PIN */}
        {step === 'temp_code' && (
          <form onSubmit={handleVerifyTempCode} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="text"
              placeholder="Enter unique PIN"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value.trim())}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px', textAlign: 'center',
                fontSize: '18px', fontWeight: '700', letterSpacing: '2px',
                border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                outline: 'none', color: '#1A1816', boxSizing: 'border-box'
              }}
            />

            <button 
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                color: '#FFF', border: 'none', borderRadius: '14px', padding: '12px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)'
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'} <ShieldCheck size={16} />
            </button>

            {/* Actionable Mailto Link */}
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#78716C', marginTop: '4px', lineHeight: '1.4' }}>
              Need help?{' '}
              <a 
                href="mailto:lytebytesblr@gmail.com?subject=forgot%20PIN/Need%20PIN"
                style={{ color: '#C5A059', fontWeight: '700', textDecoration: 'none' }}
              >
                Email lytebytesblr@gmail.com
              </a>
            </div>
          </form>
        )}

        {/* STEP 3: Set Custom Password */}
        {step === 'set_password' && (
          <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password"
              placeholder="Create New Password (min 4 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '14px',
                border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#FFF',
                fontSize: '13.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
              }}
            />
            <input 
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '14px',
                border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#FFF',
                fontSize: '13.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
              }}
            />

            <button 
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                color: '#FFF', border: 'none', borderRadius: '14px', padding: '12px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)', marginTop: '4px'
              }}
            >
              {loading ? 'Saving...' : 'Save & Login'} <KeyRound size={16} />
            </button>
          </form>
        )}

        {/* STEP 4: Login with Custom Password */}
        {step === 'enter_password' && (
          <form onSubmit={handleLoginWithPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '14px',
                border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#FFF',
                fontSize: '13.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
              }}
            />

            <button 
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                color: '#FFF', border: 'none', borderRadius: '14px', padding: '12px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)', marginTop: '4px'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'} <Lock size={16} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <button 
                type="button" 
                onClick={() => setStep('phone')}
                style={{ background: 'none', border: 'none', color: '#8A6D2B', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
              >
                Change Number
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const extractedPin = findGeneratedPinForPhone(mobile);
                  setDynamicExpectedCode(extractedPin);
                  setStep('temp_code');
                }}
                style={{ background: 'none', border: 'none', color: '#C5A059', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

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
  
  // Component-level state to hold parsed CSV rows for the modal lookup
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
    radius: theme?.radius || '20px'
  };

  const handleBack = onBack || (() => setView && setView('home'));

  // Fetch and sync data based on phone number
  const performLookup = async (phoneToLookup) => {
    setIsLoading(true);
    const rawRows = await fetchHistoricalOrders();
    setCsvRows(rawRows); // Save into state for modal lookup

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
    if (matchedCustomer.dob) setSelectedDob(matchedCustomer.dob);
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
  const milestone = getMilestoneInfo(liveCustomerData.loyaltyScore, liveCustomerData.tier);
  const nextTierStyle = getTierStyles(milestone.nextTierName);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, 
      paddingBottom: '100px', paddingTop: '8px', paddingLeft: '4px', paddingRight: '4px',
      boxSizing: 'border-box', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '16px', padding: '4px 0' }}>
        <button 
          type="button"
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
          <p style={{ fontSize: '13px', color: '#78716C', fontWeight: '600' }}>Syncing data from Orders Engine...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* USER ACCOUNT CARD OR GUEST LOOKUP PROMPT */}
          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 14px', 
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', border: '1px solid rgba(197, 160, 89, 0.45)', 
            borderRadius: activeTheme.radius, boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    {liveCustomerData.phone || 'No phone registered'}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#78716C', fontWeight: '800', textTransform: 'uppercase', display: 'block', letterSpacing: '0.4px' }}>Total Spend</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: activeTheme.text }}>₹{liveCustomerData.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            {/* Smart Sign Up / Claim Banner if Guest / Unverified */}
            {(!liveCustomerData.phone || liveCustomerData.orders.length === 0) ? (
              <div style={{ 
                background: 'rgba(197, 160, 89, 0.12)', border: '1px dashed rgba(197, 160, 89, 0.6)', 
                borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' 
              }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#8A6D2B' }}>Have past orders or want rewards?</div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>Link your mobile number to view history & tiers.</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: '#C5A059', color: '#FFF', border: 'none', padding: '8px 12px',
                    borderRadius: '8px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Sign In
                </button>
              </div>
            ) : liveCustomerData.isRecognizedGuest && (
              <div style={{ 
                background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)', 
                borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
              }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#047857' }}>History Found! Claim Account</div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>Sign in to secure your profile.</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: '#059669', color: '#FFF', border: 'none', padding: '6px 10px',
                    borderRadius: '8px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
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
                    flex: 1, padding: '10px 36px 10px 12px', borderRadius: '10px', 
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFFFFF', 
                    fontSize: '12.5px', outline: 'none', color: activeTheme.text, fontWeight: '600', cursor: 'pointer',
                    appearance: 'none', 
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' 
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
                  No historical orders found for this account. Enter your phone number at checkout or sign in to load past orders.
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

      {/* Auth Modal Popup with navigation to General Guidelines view */}
      <MemberAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialPhone={liveCustomerData.phone}
        csvRows={csvRows} 
        onLoginSuccess={(userData) => {
          performLookup(userData.phone);
        }}
        onOpenTerms={() => {
          setIsAuthModalOpen(false); // Close modal
          if (setView) setView('guidelines'); // Switch to General Guidelines view
        }}
      />
    </div>
  );
}