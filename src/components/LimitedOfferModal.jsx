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
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2',
    radius: theme?.radius || '16px',
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999, // Ensure it's explicitly above all app layouts
        padding: '20px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: activeTheme.bg,
          borderRadius: activeTheme.radius,
          border: activeTheme.border,
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
          padding: '16px 20px',
          borderBottom: '1px dashed #E5D6B5',
          backgroundColor: '#FFFBF2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color={activeTheme.brand} />
            <span style={{ fontSize: '15px', fontWeight: '700', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Special Live Offers
            </span>
          </div>
        </div>

        {/* Dynamic Notice Banner */}
        <div style={{
          background: '#FFF8E7',
          borderBottom: '1px solid #E5D6B5',
          padding: '10px 16px',
          fontSize: '12px',
          color: '#776E62',
          textAlign: 'center',
          fontWeight: '600',
          boxSizing: 'border-box'
        }}>
          💡 Available to apply directly in your bag at checkout!
        </div>

        {/* Carousel Container */}
        <div style={{ padding: '16px 20px', position: 'relative', boxSizing: 'border-box' }}>
          {/* Active Carousel Card */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${currentOffer.themeColor || activeTheme.brand}, #2C2416)`,
              borderRadius: '12px',
              padding: '18px 16px',
              color: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '185px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.12, pointerEvents: 'none' }}>
              <Sparkles size={120} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '10px', 
                  fontWeight: '600', 
                  letterSpacing: '1px',
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
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
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

                  <span style={{ fontSize: '13px', fontWeight: '700', background: 'rgba(0,0,0,0.25)', padding: '3px 9px', borderRadius: '6px' }}>
                    {currentOffer.discount}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '6px 0 4px 0', position: 'relative', zIndex: 1 }}>
                {currentOffer.title}
              </h3>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 10px 0', lineHeight: '1.45', position: 'relative', zIndex: 1 }}>
                {currentOffer.description}
              </p>

              {/* Condition Badge */}
              <div style={{ fontSize: '11.5px', opacity: '0.85', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative', zIndex: 1, marginBottom: '14px' }}>
                <Tag size={12} /> {currentOffer.condition}
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
              WebkitBackdropFilter: 'blur(4px)',
              padding: '10px 12px', 
              borderRadius: '10px',
              border: '1px dashed rgba(255,255,255,0.4)',
              marginTop: 'auto',
              fontSize: '12px',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1
            }}>
              <ShoppingBag size={14} />
              <span>Available in Bag at Checkout</span>
            </div>
          </div>

          {/* Carousel Controls & Indicators */}
          {allOffers.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <button 
                onClick={handlePrev}
                style={{
                  background: '#FFFFFF',
                  border: activeTheme.border,
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
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
                      backgroundColor: currentIndex === idx ? activeTheme.brand : '#E5D6B5',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                style={{
                  background: '#FFFFFF',
                  border: activeTheme.border,
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: activeTheme.text,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA Control */}
        <div style={{
          padding: '14px 20px 20px 20px',
          borderTop: '1px dashed #E5D6B5',
          backgroundColor: '#FFFBF2',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <button
            onClick={handleClaim}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: activeTheme.brand,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 89, 88, 0.3)',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
          >
            Explore Menu
          </button>
        </div>

      </div>
    </div>
  );
}