import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

/**
 * PolicyModal Component
 * Elite luxury modal rendered via Portal with fluid typography scaling.
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

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
  };

  const modalContent = (
    /* 1. Full-Viewport Edge-to-Edge Backdrop */
    <div 
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed', 
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'flex-end', // 💡 Always anchors to bottom
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '20px', 
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <style>{`
        @keyframes slideUpSheet {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 2. Luxury Modal Card Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderTopLeftRadius: 'clamp(20px, 5vw, 28px)', // 💡 FLUID RADIUS
          borderTopRightRadius: 'clamp(20px, 5vw, 28px)',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          padding: 'clamp(16px, 4vw, 22px)',     // 💡 FLUID PADDING
          maxWidth: '520px', 
          width: '100%', 
          maxHeight: '82vh',
          boxSizing: 'border-box',
          position: 'relative', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          border: '1px solid rgba(197, 160, 89, 0.5)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          animation: 'slideUpSheet 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default'
        }}
      >
        {/* Header with Title & Polished Close Button */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '16px',
          marginBottom: '2px',
          flexShrink: 0,
          gap: '8px',
          minWidth: 0
        }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: 'clamp(18px, 4.5vw, 22px)', // 💡 FLUID TYPOGRAPHY
            fontWeight: '700', 
            color: activeTheme.brand, 
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0
          }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1A1816',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Clean Editorial Content Body with Fluid Typography */}
        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: 'clamp(12px, 3.5vw, 14px)', // 💡 FLUID TYPOGRAPHY
          color: '#57534E',
          lineHeight: '1.5',
          paddingRight: '6px',
          minWidth: 0
        }}>
          {children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}