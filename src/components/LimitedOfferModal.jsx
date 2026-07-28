import React, { useState, useEffect } from 'react';
import { Sparkles, X, Copy, Check, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function LimitedOfferModal({ theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Live Countdown Timer state for urgent flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Get current order count to filter dynamic offers using your offers engine
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const allOffers = getAllOffers(currentCount);

  useEffect(() => {
    // Pop-up appears automatically 400ms after load on every reload/refresh
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400); 

    return () => clearTimeout(timer);
  }, []);

  // Active ticking countdown interval logic
  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(23, 59, 59, 999); // Countdown expires at midnight today

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Auto-slide carousel effect every 4 seconds if modal is open and multiple offers exist
  useEffect(() => {
    if (!isOpen || allOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allOffers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, allOffers.length]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allOffers.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allOffers.length);
  };

  if (!isOpen) return null;

  const currentOffer = allOffers[currentIndex] || allOffers[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '16px',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: theme.bg,
        borderRadius: theme.radius,
        border: theme.border,
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Modal Header - Streamlined padding */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: theme.border,
          backgroundColor: '#FFFBF2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color={theme.brand} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: theme.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Special Live Offers
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Single-Coupon Notice Banner - Sleek compact spacing */}
        <div style={{
          background: '#FEF3C7',
          padding: '6px 14px',
          fontSize: '11px',
          color: '#92400E',
          textAlign: 'center',
          fontWeight: '600',
          borderBottom: '1px solid #FDE68A'
        }}>
          💡 Note: Multiple offers cannot be clubbed.
        </div>

        {/* Carousel Container - Reduced outer padding */}
        <div style={{ padding: '14px 16px', position: 'relative' }}>
          {/* Active Carousel Card - Sleek compact height and tight internal padding */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${currentOffer.themeColor}, #2C2416)`,
              borderRadius: '12px',
              padding: '14px 16px',
              color: '#FFFFFF',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              height: '185px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              animation: 'staggerFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.1 }}>
              <Sparkles size={90} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '3px 8px', 
                  borderRadius: '10px', 
                  fontSize: '9.5px', 
                  fontWeight: '600', 
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {currentOffer.tag}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {currentOffer.id === 'early_aug' && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(239, 68, 68, 0.3)',
                      border: '1px solid rgba(239, 68, 68, 0.6)',
                      padding: '2px 6px',
                      borderRadius: '5px',
                      fontSize: '9px',
                      fontWeight: '700',
                      color: '#FEE2E2',
                      letterSpacing: '0.3px'
                    }}>
                      <span>⏳</span>
                      <span>
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  <span style={{ fontSize: '12.5px', fontWeight: '700', background: 'rgba(0,0,0,0.25)', padding: '2px 7px', borderRadius: '5px' }}>
                    {currentOffer.discount}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '2px 0 1px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentOffer.title}
              </h3>
              <p style={{ fontSize: '11px', opacity: 0.9, margin: '0 0 3px 0', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {currentOffer.description}
              </p>

              {/* Condition Badge */}
              <div style={{ fontSize: '9.5px', opacity: '0.85', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Tag size={9} /> {currentOffer.condition}
              </div>
            </div>

            {/* Coupon Code & Copy Action - Compact and streamlined */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(4px)',
              padding: '4px 12px', 
              borderRadius: '8px',
              border: '1px dashed rgba(255,255,255,0.4)',
              marginTop: 'auto'
            }}>
              <div>
                <div style={{ fontSize: '8.5px', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.5px' }}>Promo Code</div>
                <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.8px', lineHeight: '1.1' }}>{currentOffer.code}</div>
              </div>
              <button 
                onClick={() => handleCopy(currentOffer.code)}
                style={{
                  background: '#FFFFFF',
                  color: currentOffer.themeColor,
                  border: 'none',
                  padding: '5px 10px', 
                  borderRadius: '6px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap'
                }}
              >
                {copiedCode === currentOffer.code ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy Code</>}
              </button>
            </div>
          </div>

          {/* Carousel Controls & Indicators - Compact top margin */}
          {allOffers.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <button 
                onClick={handlePrev}
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: theme.border,
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: theme.text
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Dots Indicator */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {allOffers.map((_, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: currentIndex === idx ? '16px' : '5px',
                      height: '5px',
                      borderRadius: '2.5px',
                      backgroundColor: currentIndex === idx ? theme.brand : '#D1D5DB',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: theme.border,
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: theme.text
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Close Control - Sleek padding */}
        <div style={{
          padding: '10px 16px',
          borderTop: theme.border,
          backgroundColor: '#FFFBF2',
          textAlign: 'center'
        }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.buttonBg,
              color: theme.bg,
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            Claim your Offer!
          </button>
        </div>

      </div>
    </div>
  );
}