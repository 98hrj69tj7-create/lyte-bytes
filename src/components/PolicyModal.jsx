import React from 'react';

/**
 * PolicyModal Component
 * 
 * Customisation Guide:
 * - Backdrop: Clicking anywhere outside the modal box triggers `onClose` to dismiss it.
 * - Card Container: Uses `stopPropagation()` to ensure interacting inside the modal doesn't accidentally close it.
 * - Header: Clean artisanal title header.
 * - Footer: The agreement section has been completely removed.
 */
export default function PolicyModal({ 
  isOpen = false, 
  onClose = () => {}, 
  title = 'Terms & Conditions',
  theme = {},
  children 
}) {
  // Return null if the modal is not active
  if (!isOpen) return null;

  // Active theme configuration fallback values matching the luxury boutique system
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    bg: '#FFFDF9',
    cardBg: '#FFFFFF',
    border: '1px solid rgba(197, 160, 89, 0.4)',
  };

  return (
    /* 1. Backdrop Overlay: Click anywhere outside the modal content box to close */
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.82)', 
        zIndex: 1200, 
        display: 'flex',
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        boxSizing: 'border-box'
      }}
    >
      {/* 2. Inner Modal Card: e.stopPropagation() prevents clicks inside from triggering backdrop close */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          width: '100%', 
          maxWidth: '460px', 
          maxHeight: '85vh',
          borderRadius: '24px', 
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          display: 'flex',
          flexDirection: 'column', 
          overflow: 'hidden', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', 
          background: 'transparent', 
          borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '700', 
            fontSize: '20px', 
            color: activeTheme.brand, 
            textTransform: 'uppercase', 
            letterSpacing: '0.8px' 
          }}>
            {title}
          </div>
        </div>

        {/* Content Body with Elite Tight Spacing */}
        <div style={{ 
          padding: '16px 20px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: '12px',
          color: '#78716C',
          lineHeight: '1.5'
        }}>
          {/* Automatically styles any <p> tags passed from parent into clean micro-cards */}
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.type === 'p') {
              return (
                <div 
                  key={index}
                  style={{
                    background: activeTheme.cardBg,
                    border: '1px dashed #C5A059',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  {child}
                </div>
              );
            }
            return child;
          })}
        </div>
      </div>
    </div>
  );
}