import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

/**
 * PolicyModal Component
 * Elite luxury modal rendered via Portal for edge-to-edge screen immersion.
 */
export default function PolicyModal({ 
  isOpen = false, 
  onClose = () => {}, 
  title = 'Terms & Conditions',
  theme = {},
  children 
}) {
  // Lock background body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
  };

  const modalContent = (
    /* 1. Full-Viewport Edge-to-Edge Backdrop */
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', 
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '20px', 
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* 2. Luxury Modal Card Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderRadius: '28px', 
          padding: '20px',
          maxWidth: '520px', 
          width: '100%', 
          maxHeight: '82vh',
          boxSizing: 'border-box',
          position: 'relative', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          border: '1px solid rgba(197, 160, 89, 0.5)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}
      >
        {/* Header with Title & Polished Close Button */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '16px',
          marginBottom: '2px',
          flexShrink: 0
        }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '20px', 
            fontWeight: '700', 
            color: activeTheme.brand, 
            margin: 5,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '50%',
              width: '25px',
              height: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1A1816',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Clean Editorial Content Body */}
        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: '13px',
          color: '#57534E',
          lineHeight: '1',
          paddingRight: '6px'
        }}>
          {children}
        </div>
      </div>
    </div>
  );

  // Portal renders modal directly into document.body, escaping app container clipping
  return ReactDOM.createPortal(modalContent, document.body);
}