import React from 'react';
import { X } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, title, children, theme = {} }) {
  if (!isOpen) return null;

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFBF2',
    radius: theme?.radius || '20px'
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(44, 34, 30, 0.55)',
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
          background: activeTheme.bg,
          color: activeTheme.text,
          borderRadius: activeTheme.radius,
          padding: '24px 20px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(44, 34, 30, 0.25)',
          border: activeTheme.border,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '10px', 
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(216, 199, 165, 0.3)',
          position: 'relative'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '15px', 
            color: activeTheme.brand, 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            textAlign: 'center'
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 0,
              background: 'rgba(216, 199, 165, 0.18)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: activeTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ 
          fontSize: '13px', 
          lineHeight: '1.6', 
          color: '#776E62', 
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