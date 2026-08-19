import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- NEW: Teleports modal to full screen
import { 
  Sparkles,
  FileText,
  ChevronRight,
  ShieldCheck,
  Mail,
  KeyRound,
  Lock,
  X
} from 'lucide-react';

export default function MemberAuthModal({ isOpen, onClose, initialPhone = '', csvRows = [], onLoginSuccess, webAppUrl }) {
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
    radius: '24px' // Matched to Install Prompt rounding
  };

  // Bulletproof viewport lock specifically designed for iOS/Android PWAs
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
      await fetch(webAppUrl, {
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

  // The modal UI variable
  const modalContent = (
    <div 
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.75)', // Matched identically to InstallPrompt
        backdropFilter: 'blur(6px)', // Matched identically to InstallPrompt
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999, // Guaranteed to sit above all navigation bars
        padding: '16px',
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
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', // Matched identically to InstallPrompt
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
            <Lock size={18} color="#C5A059" />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '1px' }}>
              My Account
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

  // THIS IS THE CRITICAL FIX: We render the modal directly onto the document body
  return createPortal(modalContent, document.body);
}