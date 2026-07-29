import React from 'react';

export default function PolicyModal({ isOpen, onClose, title, children, theme }) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: 'auto',
          background: 'rgba(42, 38, 33, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#E8E4D9',
          borderRadius: '16px',
          padding: '24px 20px',
          maxHeight: '75vh',
          overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
          border: `1px solid rgba(255, 255, 255, 0.12)`,
          boxSizing: 'border-box'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '16px', 
          borderBottom: `1px solid ${theme?.brand || '#ff5958'}`, 
          paddingBottom: '12px' 
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '15px', 
            color: theme?.brand || '#ff5958', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            textAlign: 'center'
          }}>
            {title}
          </h3>
        </div>

        {/* Modal Body Content */}
        <div style={{ 
          fontSize: '13px', 
          lineHeight: '1.6', 
          color: '#D1CBC1', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          textAlign: 'left'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}