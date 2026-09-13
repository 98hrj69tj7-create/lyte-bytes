import React, { useState, useRef } from 'react';
import { Tag, X, Clock, ShieldCheck } from 'lucide-react';
import { getAllOffers } from '../utils/offersEngine';

export default function FloatingOffersBalloon() {
  const [isOpen, setIsOpen] = useState(false);

  // Position and interaction state
  const [position, setPosition] = useState({ x: window.innerWidth - 140, y: window.innerHeight - 190 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const currentCount = parseInt(localStorage.getItem('store_order_count') || '1', 10);
  const offers = getAllOffers(currentCount);

  // Dragging handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    hasMovedRef.current = false;
    dragOffsetRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    hasMovedRef.current = true;
    const touch = e.touches[0];
    
    let newX = touch.clientX - dragOffsetRef.current.x;
    let newY = touch.clientY - dragOffsetRef.current.y;

    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 120;
    newX = Math.max(10, Math.min(newX, maxX));
    newY = Math.max(70, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    snapToEdge();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const handleMouseMove = (moveEvent) => {
      hasMovedRef.current = true;
      let newX = moveEvent.clientX - dragOffsetRef.current.x;
      let newY = moveEvent.clientY - dragOffsetRef.current.y;

      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 120;
      newX = Math.max(10, Math.min(newX, maxX));
      newY = Math.max(70, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      snapToEdge();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const snapToEdge = () => {
    const screenWidth = window.innerWidth;
    const threshold = 70;

    if (position.x < threshold) {
      setPosition(prev => ({ ...prev, x: 10 }));
    } else if (position.x > screenWidth - threshold - 110) {
      setPosition(prev => ({ ...prev, x: screenWidth - 65 }));
    }
  };

  const isDockedAtEdge = position.x < 30 || position.x > window.innerWidth - 85;

  return (
    <>
      <style>{`
        @keyframes breathingGlow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(0,0,0,0.35), 0 0 10px rgba(255, 89, 88, 0.3), inset 0 0 6px rgba(197, 160, 89, 0.2);
            border-color: rgba(197, 160, 89, 0.5);
          }
          50% {
            box-shadow: 0 12px 32px rgba(0,0,0,0.45), 0 0 22px rgba(255, 89, 88, 0.7), inset 0 0 12px rgba(197, 160, 89, 0.5);
            border-color: rgba(255, 89, 88, 0.85);
          }
        }
        @keyframes emojiPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(255,89,88,0.5)); }
          50% { transform: scale(1.18); filter: drop-shadow(0 0 8px rgba(255,89,88,0.9)); }
        }
        @keyframes slideUpBalloon {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Draggable Floating Balloon with Breathing Effect & 🔥 Emoji */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onClick={() => {
          if (!hasMovedRef.current) setIsOpen(true);
        }}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'linear-gradient(135deg, #1A1816 0%, #2D2721 100%)',
          color: '#FFF',
          border: '1.5px solid #C5A059',
          borderRadius: isDockedAtEdge ? '25px' : '30px',
          padding: isDockedAtEdge ? '10px 12px' : '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: isDockedAtEdge ? '0px' : '8px',
          zIndex: 985,
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxSizing: 'border-box',
          animation: 'breathingGlow 3s infinite ease-in-out',
          transition: isDragging ? 'none' : 'left 0.3s ease, top 0.3s ease'
        }}
      >
        <div style={{
          width: '25px', height: '25px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: '18px',
          animation: 'emojiPulse 2s infinite ease-in-out'
        }}>
          🔥
        </div>

        {!isDockedAtEdge && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
            <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#C5A059', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Active
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#FFFBF2', whiteSpace: 'nowrap' }}>
              Offers
            </span>
          </div>
        )}
      </div>

      {/* Slide-Up Offers Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(20, 15, 12, 0.8)', 
            backdropFilter: 'blur(8px)', 
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 99999, padding: '20px', boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
              borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px',
              padding: '20px', maxWidth: '520px', width: '100%',
              maxHeight: '75vh', boxSizing: 'border-box', position: 'relative',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
              border: '1px solid rgba(197, 160, 89, 0.5)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              animation: 'slideUpBalloon 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(197, 160, 89, 0.3)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#C5A059" />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: '#1A1816', margin: 0, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Available Offers
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(197, 160, 89, 0.15)', border: '1px solid rgba(197, 160, 89, 0.3)',
                  borderRadius: '50%', width: '28px', height: '28px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1A1816'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Offers List */}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
              {offers.map((offer) => (
                <div 
                  key={offer.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px dashed #C5A059',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)',
                      padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700',
                      letterSpacing: '0.8px', textTransform: 'uppercase', color: '#8A6D2B'
                    }}>
                      CODE: {offer.tag}
                    </span>
                    <span style={{ 
                      fontSize: '11px', fontWeight: '800', background: '#FF5958', color: '#FFFFFF',
                      padding: '2px 8px', borderRadius: '6px'
                    }}>
                      {offer.discount}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: '700', margin: 0, color: '#1A1816' }}>
                    {offer.title}
                  </h4>
                  
                  <p style={{ fontSize: '12.5px', color: '#78716C', margin: 0, lineHeight: '1.4' }}>
                    {offer.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid rgba(197, 160, 89, 0.2)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#8A6D2B' }}>
                      {offer.condition}
                    </span>
                    
                    {/* Validity Info Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#059669',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(5, 150, 105, 0.2)'
                    }}>
                      <Clock size={12} />
                      <span>Valid: One-Time Use</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: '#78716C', fontWeight: '500' }}>
              ✨ Discounts are available to apply during checkout.
            </div>
          </div>
        </div>
      )}
    </>
  );
}