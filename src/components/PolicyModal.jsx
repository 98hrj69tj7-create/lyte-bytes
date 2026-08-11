import React from 'react';

/**
 * PolicyModal Component
 * 
 * Customisation Guide:
 * - Backdrop: Clicking anywhere outside the modal box triggers `onClose` to dismiss it.
 * - Card Container: Uses `stopPropagation()` to ensure interacting inside the modal doesn't accidentally close it.
 * - Header: The "X" button has been completely removed.
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

  // Active theme configuration fallback values
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    bg: '#FFFBF2',
    cardBg: '#FFFFFF',
    border: '#EFECE6',
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
        background: 'rgba(46, 40, 40, 0.77)', 
        zIndex: 1200, 
        display: 'flex',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(20px)',
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '12px', 
        boxSizing: 'border-box'
      }}
    >
      {/* 2. Inner Modal Card: e.stopPropagation() prevents clicks inside from triggering the backdrop close */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: activeTheme.bg, 
          width: '100%', 
          maxWidth: '460px', 
          maxHeight: '85vh',
          borderRadius: '16px', 
          border: `2px solid ${activeTheme.brand}`, 
          display: 'flex',
          flexDirection: 'column', 
          overflow: 'hidden', 
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          boxSizing: 'border-box'
        }}
      >
        {/* Header (X button successfully removed) */}
        <div style={{
          padding: '10px 20px', 
          background: activeTheme.bg, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            fontWeight: '800', 
            fontSize: '15px', 
            color: activeTheme.brand, 
            textTransform: 'uppercase', 
            letterSpacing: '0.8px' 
          }}>
            {title}
          </div>
        </div>

        {/* Content Body with Elite Tight Spacing */}
        <div style={{ 
          padding: '12px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: '12px',
          color: '#665C52',
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
                    border: `1px solid ${activeTheme.border}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
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