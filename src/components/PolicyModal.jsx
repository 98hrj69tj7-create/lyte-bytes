import React from 'react';
import { X } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, title, children, theme = {} }) {
  if (!isOpen) return null;

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px'
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
        onClick={() => e.stopPropagation(null)}
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: 'auto',
          background: '#FFFBF2',
          color: activeTheme.text,
          borderRadius: activeTheme.radius,
          padding: '24px 20px',
          maxHeight: '75vh',
          overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
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
          marginBottom: '16px', 
          paddingBottom: '12px',
          position: 'relative'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            color: activeTheme.brand, 
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
          fontSize: '13.5px', 
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