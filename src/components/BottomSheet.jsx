import React from 'react';
import { X } from 'lucide-react';

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '480px' 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(20, 15, 12, 0.78)', 
      backdropFilter: 'blur(8px)', 
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 99999, display: 'flex', 
      alignItems: 'flex-end', // 💡 Always anchors to bottom
      justifyContent: 'center', 
      boxSizing: 'border-box',
      animation: 'fadeInOverlay 0.2s ease forwards'
    }} onClick={onClose}>
      
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          width: '100%', maxWidth: maxWidth, maxHeight: '88vh',
          borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
          border: '1.5px solid rgba(197, 160, 89, 0.4)', 
          padding: '20px 20px 36px 20px',
          display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
          boxShadow: '0 -15px 40px rgba(0,0,0,0.3)',
          animation: 'slideUpSheet 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Drag Handle Indicator */}
        <div style={{ 
          width: '40px', height: '4px', background: 'rgba(197, 160, 89, 0.5)', 
          borderRadius: '2px', alignSelf: 'center', marginBottom: '14px', flexShrink: 0 
        }} />

        {title && (
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(197, 160, 89, 0.2)' 
          }}>
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', 
              fontWeight: '700', color: '#FF5958', margin: 0, textTransform: 'uppercase' 
            }}>
              {title}
            </h3>
            {onClose && (
              <button onClick={onClose} style={{ 
                background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(197, 160, 89, 0.3)', 
                borderRadius: '50%', width: '34px', height: '34px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}>
                <X size={18} color="#1A1816" />
              </button>
            )}
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '2px', WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}