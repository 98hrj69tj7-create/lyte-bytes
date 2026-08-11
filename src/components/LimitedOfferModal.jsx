import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, ChevronLeft, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function LimitedOfferModal({ theme = {}, setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Live Countdown Timer state for urgent flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Fallback Theme values
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2',
    radius: theme?.radius || '20px',
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
        backgroundColor: 'rgba(44, 34, 30, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        padding: '16px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={() => e.stopPropagation(null)}
        style={{
          background: activeTheme.bg,
          borderRadius: activeTheme.radius,
          border: activeTheme.border,
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(44, 34, 30, 0.22)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'default',
          pointerEvents: 'auto',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 20px 4px 20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              padding: '2px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} color={activeTheme.brand} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: '800', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Live Offers
            </span>
          </div>
        </div>

        {/* Carousel Container Wrapper */}
        <div style={{ padding: '14px 20px 16px 20px', position: 'relative', boxSizing: 'border-box' }}>
          
          {/* Active Carousel Card with optimized internal padding and flow */}
          <div 
            style={{
              background: 'linear-gradient(145deg, #2C221E 0%, #3D3028 100%)',
              borderRadius: '16px',
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(44, 34, 30, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              border: '1px solid rgba(216, 199, 165, 0.2)'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08, pointerEvents: 'none' }}>
              <Sparkles size={120} color="#FFFFFF" />
            </div>

            <div>
              {/* Header row inside card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.12)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: '9.5px', 
                  fontWeight: '600', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#FFFBF2'
                }}>
                  {currentOffer.tag}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {currentOffer.id === 'early_aug' && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(239, 68, 68, 0.25)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      padding: '3px 12px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '500',
                      color: '#FEE2E2',
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
                    boxShadow: '0 2px 8px rgba(255, 89, 88, 0.4)'
                  }}>
                    {currentOffer.discount}
                  </span>
                </div>
              </div>

              {/* Title & Description with balanced vertical margins */}
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '6px 0 6px 0', position: 'relative', zIndex: 1, letterSpacing: '0.3px', color: '#FFFBF2' }}>
                {currentOffer.title}
              </h3>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '0 0 12px 0', lineHeight: '1.45', position: 'relative', zIndex: 1, color: '#E8E1D5' }}>
                {currentOffer.description}
              </p>

              {/* Condition Badge */}
              <div style={{ fontSize: '10.5px', opacity: '0.8', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', zIndex: 1, marginBottom: '12px', color: '#D4C8B8' }}>
                <Tag size={11} color={activeTheme.brand} /> {currentOffer.condition}
              </div>
            </div>

            {/* In-Cart Availability Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)', 
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '9px 12px', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginTop: '4px',
              fontSize: '12px',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1,
              color: '#FFFBF2'
            }}>
              <ShoppingBag size={20} color={activeTheme.brand} />
              <span>Available in Bag at Checkout</span>
            </div>
          </div>

          {/* Carousel Controls & Indicators */}
          {allOffers.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <button 
                onClick={handlePrev}
                style={{
                  border: activeTheme.border,
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text,
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(44, 34, 30, 0.06)',
                  transition: 'transform 0.2s'
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
                      backgroundColor: currentIndex === idx ? activeTheme.brand : '#D4C8B8',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                style={{
                  border: activeTheme.border,
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text,
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(44, 34, 30, 0.06)',
                  transition: 'transform 0.2s'
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
          backgroundColor: '#FFFBF2',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <button
            onClick={handleClaim}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: activeTheme.brand,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 89, 88, 0.35)',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              letterSpacing: '0.4px'
            }}
          >
            Explore Menu
          </button>
        </div>

      </div>
    </div>
  );
}