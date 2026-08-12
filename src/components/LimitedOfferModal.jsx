import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, ChevronLeft, ChevronRight, ShoppingBag, Clock, X } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function LimitedOfferModal({ theme = {}, setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Live Countdown Timer state for urgent flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Fallback Theme values
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '24px',
  };

  // Get current order count to filter dynamic offers using offers engine
  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const allOffers = getAllOffers(currentCount);

  // 1. Trigger Logic: 10-Hour Cooldown via localStorage & Delayed Load (3.5 seconds)
  useEffect(() => {
    const lastShownTime = localStorage.getItem('lyte_offer_last_shown_time');
    const now = new Date().getTime();
    const tenHoursInMs = 10 * 60 * 60 * 1000;

    const hasExpired = !lastShownTime || (now - parseInt(lastShownTime, 10)) > tenHoursInMs;

    if (hasExpired && allOffers.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('lyte_offer_last_shown_time', now.toString());
        // Reset the closed flag so PWA install prompt waits until this new instance is closed
        localStorage.removeItem('lyte_offer_closed');
      }, 3500); // 3.5 second delay gives user time to settle into Home view

      return () => clearTimeout(timer);
    } else {
      // If it hasn't expired yet, ensure the install prompt knows the offer is already bypassed
      localStorage.setItem('lyte_offer_closed', 'true');
    }
  }, [allOffers.length]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('lyte_offer_closed', 'true');
  };

  // 2. Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Active ticking countdown interval logic
  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(23, 59, 59, 999); // Expires at midnight today

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

  // Auto-slide carousel effect every 4.5 seconds if modal is open and multiple offers exist
  useEffect(() => {
    if (!isOpen || allOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allOffers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, allOffers.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allOffers.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allOffers.length);
  };

  const handleClaim = () => {
    handleClose();
    if (setView) setView('home');
  };

  if (!isOpen) return null;

  const currentOffer = allOffers[currentIndex] || allOffers[0];

  return (
    <div 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.82)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        padding: '16px',
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
        onClick={() => e.stopPropagation(null)}
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
            <div style={{ 
              padding: '2px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color={activeTheme.brand} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Exclusive Offers
            </span>
          </div>
        </div>

        {/* Carousel Container Wrapper */}
        <div style={{ padding: '14px 20px 16px 20px', position: 'relative', boxSizing: 'border-box' }}>
          
          {/* Active Carousel Card with Golden Ticket Border */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: '16px',
              padding: '18px 20px',
              color: activeTheme.text,
              boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '190px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              border: '1px dashed #C5A059'
            }}
          >
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.05, pointerEvents: 'none' }}>
              <Sparkles size={110} color="#C5A059" />
            </div>

            <div>
              {/* Header row inside card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <span style={{ 
                  background: 'rgba(197, 160, 89, 0.12)', 
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#8A6D2B'
                }}>
                  {currentOffer.tag}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {currentOffer.id === 'early_aug' && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#DC2626',
                      letterSpacing: '0.4px'
                    }}>
                      <Clock size={10} />
                      <span>
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    background: activeTheme.brand, 
                    color: '#FFFFFF',
                    padding: '3px 10px', 
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(255, 89, 88, 0.3)'
                  }}>
                    {currentOffer.discount}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '700', margin: '4px 0 6px 0', position: 'relative', zIndex: 1, letterSpacing: '0.3px', color: activeTheme.text }}>
                {currentOffer.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#78716C', margin: '0 0 10px 0', lineHeight: '1.45', position: 'relative', zIndex: 1, fontWeight: '500' }}>
                {currentOffer.description}
              </p>

              {/* Condition Badge */}
              <div style={{ fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', zIndex: 1, marginBottom: '10px', color: '#8A6D2B' }}>
                <Tag size={11} color={activeTheme.brand} /> {currentOffer.condition}
              </div>
            </div>

            {/* In-Cart Availability Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(197, 160, 89, 0.08)', 
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '9px 12px', 
              borderRadius: '10px',
              border: '1px solid rgba(197, 160, 89, 0.25)',
              marginTop: '4px',
              fontSize: '12px',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1,
              color: activeTheme.text
            }}>
              <ShoppingBag size={16} color={activeTheme.brand} />
              <span>Auto-applied in Bag at Checkout</span>
            </div>
          </div>

          {/* Carousel Controls & Indicators */}
          {allOffers.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <button 
                onClick={handlePrev}
                style={{
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text,
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 8px rgba(44, 34, 30, 0.06)'
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Dots Indicator */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {allOffers.map((_, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: currentIndex === idx ? '18px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: currentIndex === idx ? activeTheme.brand : '#C5A059',
                      opacity: currentIndex === idx ? 1 : 0.4,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                style={{
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text,
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 8px rgba(44, 34, 30, 0.06)'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA Control */}
        <div style={{
          padding: '8px 20px 20px 20px',
          backgroundColor: 'transparent',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
        </div>

      </div>
    </div>
  );
}