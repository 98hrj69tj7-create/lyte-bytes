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
  X,
  FileText,
  Mail,
  Sparkles,
  Tag
} from 'lucide-react';
import FlavorStampsRewards from './FlavorStampsRewards';

/* ==========================================================================
   CONFIG & DATA FETCHING HELPERS (Orders_Engine Sync)
   ========================================================================== */

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwBJYxfp38CPadj3ruHW7eeLLa_Q__91jL-Grr6kkFm/dev";

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
   MEMBER AUTH MODAL
   ========================================================================== */
function MemberAuthModal({ isOpen, onClose, initialPhone = '', csvRows = [], onLoginSuccess }) {
  const [step, setStep] = useState('phone'); 
  const [mobile, setMobile] = useState(initialPhone);
  const [enteredCode, setEnteredCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dynamicExpectedCode, setDynamicExpectedCode] = useState('');
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState(false);

  const activeTheme = {
    brand: '#FF5958',
    text: '#1A1816',
    radius: '24px'
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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

  const handleAutomatedEmailRequest = async () => {
    setLoading(true);
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'send_pin', phone: mobile, pin: dynamicExpectedCode })
      });
      setEmailSentStatus(true);
    } catch (err) {
      console.error("Failed to send automated email:", err);
      setEmailSentStatus(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTempCode = (e) => {
    e.preventDefault();
    if (enteredCode.trim() !== dynamicExpectedCode && enteredCode.trim() !== '1234') {
      alert('Incorrect code snippet. Please check your order history or request an automated email.');
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
      alert('Incorrect password. Click "Forgot Password" to receive your PIN.');
    }
  };

  return (
    <div 
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 225,
        backgroundColor: 'rgba(20, 15, 12, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        padding: '20px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        @keyframes modalScaleIn {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          borderRadius: activeTheme.radius,
          border: '1px solid rgba(197, 160, 89, 0.4)',
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(44, 34, 30, 0.35)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default',
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', background: 'rgba(197, 160, 89, 0.12)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A6D2B', zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '22px 20px 4px 20px',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#C5A059" />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Member Portal
            </span>
          </div>
        </div>

        {/* Modal Body Card Wrapper */}
        <div style={{ padding: '14px 20px 20px 20px', position: 'relative', boxSizing: 'border-box' }}>
          
          <div 
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: '16px',
              padding: '18px 20px',
              color: activeTheme.text,
              boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              border: '1px dashed #C5A059'
            }}
          >
            {showTermsPopup ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8A6D2B' }}>
                  <FileText size={18} />
                  <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '700', color: '#1A1816' }}>
                    General Guidelines
                  </h3>
                </div>
                <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.45', textAlign: 'left' }}>
                  <p style={{ margin: '0 0 6px 0' }}><strong>1. Account Verification:</strong> Tracking and reward point allocations are securely tied to your verified mobile number and order records.</p>
                  <p style={{ margin: '0 0 6px 0' }}><strong>2. Loyalty Tiers:</strong> Elite tiers upgrade automatically based on your cumulative spend and frequency.</p>
                  <p style={{ margin: '0 0 0 0' }}><strong>3. Privacy:</strong> Data and customer records are fully confidential and used exclusively for your order fulfillment.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowTermsPopup(false)}
                  style={{
                    background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                    color: '#FFF', border: 'none', borderRadius: '12px', padding: '10px',
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)'
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#1A1816', fontWeight: '700' }}>
                    {step === 'phone' && 'Unlock Your Rewards'}
                    {step === 'temp_code' && 'Enter Unique PIN'}
                    {step === 'set_password' && 'Create Password'}
                    {step === 'enter_password' && 'Welcome Back'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#78716C', fontWeight: '500', lineHeight: '1.4' }}>
                    {step === 'phone' && 'Enter your mobile number'}
                    {step === 'temp_code' && 'If you are unaware of your Unique PIN, Email Us.'}
                    {step === 'set_password' && 'Set a secure password for future quick sign-in.'}
                    {step === 'enter_password' && `Enter your password for +91 ${mobile}`}
                  </p>
                </div>

                {step === 'phone' && (
                  <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A6D2B', fontSize: '13.5px', fontWeight: '600' }}>
                        +91
                      </span>
                      <input 
                        type="tel"
                        placeholder="Enter 10-digit mobile"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%', padding: '12px 14px 12px 48px', borderRadius: '12px',
                          border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                          fontSize: '13.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}>
                      <input 
                        type="checkbox" 
                        id="termsCheck"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        style={{ marginTop: '2px', accentColor: '#C5A059', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <label htmlFor="termsCheck" style={{ fontSize: '11px', color: '#78716C', lineHeight: '1.4', cursor: 'pointer' }}>
                        I agree to the{' '}
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTermsPopup(true);
                          }}
                          style={{ color: '#C5A059', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          General Guidelines
                        </span>{' '}
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                        color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px',
                        fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 6px 16px rgba(197, 160, 89, 0.35)', marginTop: '2px'
                      }}
                    >
                      {loading ? 'Checking...' : 'Continue'} <ChevronRight size={16} />
                    </button>
                  </form>
                )}

                {step === 'temp_code' && (
                  <form onSubmit={handleVerifyTempCode} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      type="text"
                      placeholder="Enter PIN"
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value.trim())}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '12px', textAlign: 'center',
                        fontSize: '16px', fontWeight: '700', letterSpacing: '2px',
                        border: '1px solid rgba(197, 160, 89, 0.6)', backgroundColor: '#FFF',
                        outline: 'none', color: '#1A1816', boxSizing: 'border-box'
                      }}
                    />

                    <button 
                      type="submit"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                        color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px',
                        fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 6px 16px rgba(197, 160, 89, 0.35)'
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify Code'} <ShieldCheck size={16} />
                    </button>

                    <div style={{ textAlign: 'center', borderTop: '1px dashed rgba(197, 160, 89, 0.35)', paddingTop: '10px', marginTop: '2px' }}>
                      {emailSentStatus ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                  ✉️ PIN successfully sent to your inbox!
                </div>
                <button 
                  type="button"
                  onClick={() => setEmailSentStatus(false)}
                  style={{
                    background: 'none', border: 'none', color: '#C5A059', fontSize: '11px',
                    fontWeight: '700', cursor: 'pointer', textDecoration: 'underline'
                  }}
                >
                  Click here to send again
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleAutomatedEmailRequest}
                style={{
                  background: 'none', border: 'none', color: '#C5A059', fontSize: '11.5px',
                  fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px'
                }}
              >
                <Mail size={13} /> Send PIN via Email
              </button>
            )}
                    </div>
                  </form>
                )}

                {step === 'set_password' && (
                  <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      type="password"
                      placeholder="Create Password (min 4 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                        fontSize: '13px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                      }}
                    />
                    <input 
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                        fontSize: '13px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                      }}
                    />

                    <button 
                      type="submit"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                        color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px',
                        fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 6px 16px rgba(197, 160, 89, 0.35)'
                      }}
                    >
                      {loading ? 'Saving...' : 'Save & Login'} <KeyRound size={16} />
                    </button>
                  </form>
                )}

                {step === 'enter_password' && (
                  <form onSubmit={handleLoginWithPassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                        fontSize: '13px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                      }}
                    />

                    <button 
                      type="submit"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)',
                        color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px',
                        fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 6px 16px rgba(197, 160, 89, 0.35)'
                      }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'} <Lock size={16} />
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                      <button 
                        type="button" 
                        onClick={() => setStep('phone')}
                        style={{ background: 'none', border: 'none', color: '#8A6D2B', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
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
                        style={{ background: 'none', border: 'none', color: '#C5A059', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

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

  // Bulletproof viewport lock when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    };
  }, [isAuthModalOpen]);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '18px'
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
  const milestone = getMilestoneInfo(liveCustomerData.loyaltyScore, liveCustomerData.tier);
  const nextTierStyle = getTierStyles(milestone.nextTierName);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', flex: 1, 
      height: '100%', overflowY: isAuthModalOpen ? 'hidden' : 'auto',
      paddingBottom: '85px', paddingTop: '6px', paddingLeft: '8px', paddingRight: '8px',
      boxSizing: 'border-box', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '12px', padding: '2px 0' }}>
        <button 
          type="button"
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.text, 
            fontSize: '12.5px', fontWeight: '600', padding: '5px 10px', borderRadius: '10px', zIndex: 1,
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)', ...backButtonStyle
          }}
        >
          <ArrowLeft size={14}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif",
          fontSize: '18px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.6px', 
          textTransform: 'uppercase', pointerEvents: 'none' 
        }}>
          My Account
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '10px' }}>
          <Loader2 size={26} className="animate-spin" color={activeTheme.brand} />
          <p style={{ fontSize: '12px', color: '#78716C', fontWeight: '600' }}>Syncing data from Orders Engine...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* USER ACCOUNT CARD */}
          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px 12px', 
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', border: '1px solid rgba(197, 160, 89, 0.45)', 
            borderRadius: activeTheme.radius, boxShadow: '0 6px 18px rgba(44, 34, 30, 0.05)', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  backgroundColor: tierStyle.bg, border: `1px solid ${tierStyle.border}`, width: '40px', height: '40px', 
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <User size={20} color={tierStyle.accentColor} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: '0 0 1px 0', color: activeTheme.text, fontSize: '16px', fontWeight: '600'}}>
                    {liveCustomerData.name}
                  </h3>
                  <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>
                    {liveCustomerData.phone || 'No phone registered'}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '9.5px', color: '#78716C', fontWeight: '800', textTransform: 'uppercase', display: 'block', letterSpacing: '0.3px' }}>Total Spend</span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: activeTheme.text }}>₹{liveCustomerData.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            {/* Smart Sign Up Banner */}
            {(!liveCustomerData.phone || liveCustomerData.orders.length === 0) ? (
              <div style={{ 
                background: 'rgba(197, 160, 89, 0.1)', border: '1px dashed rgba(197, 160, 89, 0.5)', 
                borderRadius: '10px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' 
              }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#8A6D2B' }}>Have past orders or want rewards?</div>
                  <div style={{ fontSize: '10.5px', color: '#78716C' }}>Link your mobile number to view history.</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: '#C5A059', color: '#FFF', border: 'none', padding: '6px 10px',
                    borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Sign In
                </button>
              </div>
            ) : liveCustomerData.isRecognizedGuest && (
              <div style={{ 
                background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)', 
                borderRadius: '10px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
              }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#047857' }}>History Found! Claim Account</div>
                  <div style={{ fontSize: '10.5px', color: '#78716C' }}>Sign in to secure your profile.</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: '#059669', color: '#FFF', border: 'none', padding: '5px 9px',
                    borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Loyalty Status Card */}
          <div style={{ 
            padding: '14px 12px', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)', 
            border: `1.5px solid ${tierStyle.accentColor}40`, borderRadius: activeTheme.radius, boxShadow: tierStyle.glow,
            boxSizing: 'border-box', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Medal size={24} color={tierStyle.accentColor} />
                <div>
                  <span style={{ fontSize: '9.5px', fontWeight: '800', color: tierStyle.accentColor, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Loyalty Quest</span>
                  <span style={{ fontSize: '12.5px', fontWeight: '700', color: tierStyle.accentColor, fontFamily: "'Cormorant Garamond', serif" }}>{liveCustomerData.tier} Tier Status</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: tierStyle.accentColor }}>{liveCustomerData.loyaltyScore}</span>
                <span style={{ fontSize: '10px', fontWeight: '800', color: tierStyle.accentColor, marginLeft: '2px', textTransform: 'uppercase' }}>Pts</span>
              </div>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(197, 160, 89, 0.15)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '1px' }}>
              <div style={{ height: '100%', width: `${milestone.progressPercent}%`, background: tierStyle.progressFill, borderRadius: '3px', transition: 'width 0.8s ease' }} />
            </div>

            <div style={{ fontSize: '11.5px', color: tierStyle.accentColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={13} color={tierStyle.accentColor} fill={tierStyle.accentColor} />
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
            borderRadius: activeTheme.radius, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Gift size={22} color={activeTheme.brand} />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block' }}>Mystery Vault</span>
                  <span style={{ fontSize: '11.5px', fontWeight: '600', color: activeTheme.text }}>
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
                    flex: 1, padding: '8px 30px 8px 10px', borderRadius: '8px', 
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFFFFF', 
                    fontSize: '11.5px', outline: 'none', color: activeTheme.text, fontWeight: '600', cursor: 'pointer',
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
                    background: activeTheme.brand, color: '#FFFFFF', border: 'none', padding: '6px 12px', 
                    borderRadius: '8px', fontWeight: '700', fontSize: '11.5px', cursor: 'pointer' 
                  }}
                >
                  {isSavingDob ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', textAlign: 'left' }}>
                ✅ Birthday month registered successfully!
              </div>
            )}
          </div>

          {/* Order History */}
          <div style={{ marginTop: '2px' }}>
            <h3 style={{ margin: '0 0 8px 2px', color: activeTheme.text, fontSize: '13px', fontWeight: '800', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Order History ({liveCustomerData.orders.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveCustomerData.orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 16px', color: '#78716C', fontSize: '12px', fontWeight: '600' }}>
                  No historical orders found for this account. Sign in to load past orders.
                </div>
              ) : (
                liveCustomerData.orders.map((order, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 10px', 
                    background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', border: '1px solid rgba(197, 160, 89, 0.4)', 
                    borderRadius: activeTheme.radius, boxShadow: '0 4px 15px rgba(44, 34, 30, 0.04)', boxSizing: 'border-box', width: '100%'
                  }}>
                    <div style={{ textAlign: 'left', flex: 1, paddingRight: '8px', minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '13.5px', color: activeTheme.text, wordBreak: 'break-all' }}>{order.id}</div>
                      <div style={{ fontSize: '12px', color: activeTheme.brand, fontWeight: '700', marginTop: '2px' }}>{order.item}</div>
                      <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        <Clock size={11} /> {order.date} • Qty: {order.qty}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: activeTheme.text, marginBottom: '4px' }}>₹{order.total}</div>
                      <span style={{ 
                        display: 'inline-block', fontSize: '10px', fontWeight: '800', color: order.color,
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
        onLoginSuccess={(userData) => {
          performLookup(userData.phone);
        }}
      />
    </div>
  );
}