import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function LimitedOfferModal({ theme = {}, setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Live Countdown Timer state for urgent flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Fallback Theme values
  const activeTheme = {
    brand: theme?.brand || '#E53935',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid #E0D3C1',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '12px',
  };

  // Get current order count to filter dynamic offers using your offers engine
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const allOffers = getAllOffers(currentCount);

  useEffect(() => {
    // Pop-up appears automatically 400ms after load
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

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allOffers.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allOffers.length);
  };

  const handleClaim = () => {
    setIsOpen(false);
    if (setView) setView('home');
  };

  if (!isOpen) return null;

  const currentOffer = allOffers[currentIndex] || allOffers[0];

  return (
    <div 
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999, // Ensure it's explicitly above all app layouts
        padding: '16px',
        backdropFilter: 'blur(5px)',
        cursor: 'pointer',
        pointerEvents: 'auto'
      }}
    >
      <div 
        onClick={() => e.stopPropagation()}
        style={{
          background: activeTheme.bg,
          borderRadius: activeTheme.radius,
          border: activeTheme.border,
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'default',
          pointerEvents: 'auto'
        }}
      >
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: activeTheme.border,
          backgroundColor: '#FFFBF2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color={activeTheme.brand} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Special Live Offers
            </span>
          </div>
        </div>

        {/* Dynamic Notice Banner */}
        <div style={{
          background: '#FEF3C7',
          padding: '6px 14px',
          fontSize: '11px',
          color: '#92400E',
          textAlign: 'center',
          fontWeight: '600',
          borderBottom: '1px solid #FDE68A'
        }}>
          💡 Available to apply directly in your bag at checkout!
        </div>

        {/* Carousel Container */}
        <div style={{ padding: '14px 16px', position: 'relative' }}>
          {/* Active Carousel Card */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${currentOffer.themeColor || activeTheme.brand}, #2C2416)`,
              borderRadius: '12px',
              padding: '16px',
              color: '#FFFFFF',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              height: '175px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.1 }}>
              <Sparkles size={90} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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

              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentOffer.title}
              </h3>
              <p style={{ fontSize: '11.5px', opacity: 0.9, margin: '0 0 6px 0', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {currentOffer.description}
              </p>

              {/* Condition Badge */}
              <div style={{ fontSize: '10px', opacity: '0.9', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={10} /> {currentOffer.condition}
              </div>
            </div>

            {/* In-Cart Availability Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.18)', 
              backdropFilter: 'blur(4px)',
              padding: '6px 12px', 
              borderRadius: '8px',
              border: '1px dashed rgba(255,255,255,0.4)',
              marginTop: 'auto',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              <ShoppingBag size={13} />
              <span>Select in your bag at checkout</span>
            </div>
          </div>

          {/* Carousel Controls & Indicators */}
          {allOffers.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <button 
                onClick={handlePrev}
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: activeTheme.border,
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text
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
                      backgroundColor: currentIndex === idx ? activeTheme.brand : '#D1D5DB',
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
                  border: activeTheme.border,
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA Control */}
        <div style={{
          padding: '10px 16px',
          borderTop: activeTheme.border,
          backgroundColor: '#FFFBF2',
          textAlign: 'center'
        }}>
          <button
            onClick={handleClaim}
            style={{
              width: '100%',
              padding: '11px',
              backgroundColor: activeTheme.brand,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            Explore Menu
          </button>
        </div>

      </div>
    </div>
  );
}