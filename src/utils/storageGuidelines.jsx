import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ShieldCheck, Clock } from 'lucide-react';

export default function StorageGuidelineModal({ 
  isOpen = false, 
  onClose = () => {}, 
  guideline = null, 
  theme = {} 
}) {
  // Lock background body scroll when active
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

  if (!isOpen || !guideline) return null;

  const brandColor = theme?.brand || '#FF5958';
  const textTheme = theme?.text || '#1A1816';

  const modalContent = (
    /* 1. Full-Viewport Edge-to-Edge Backdrop anchored to bottom */
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
        alignItems: 'flex-end', // Anchors bottom sheet to the bottom edge
        justifyContent: 'center',
        zIndex: 99999, 
        padding: 'clamp(16px, 4vw, 22px)',     // 💡 FLUID PADDING
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <style>{`
        @keyframes slideUpSheet {
          0% { opacity: 0; transform: translateY(100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 2. Bottom Sheet Container with your precise fluid settings */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          borderTopLeftRadius: 'clamp(20px, 5vw, 28px)', 
          borderTopRightRadius: 'clamp(20px, 5vw, 28px)',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          padding: 'clamp(16px, 4vw, 22px)', 
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
        {/* Drag Handle Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(197, 160, 89, 0.4)', borderRadius: '4px' }} />
        </div>

        {/* Header with Title & Polished Close Button */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: '14px',
          marginBottom: '10px',
          borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
          flexShrink: 0,
          gap: '12px',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{ background: 'rgba(255, 89, 88, 0.1)', padding: '6px', borderRadius: '10px', flexShrink: 0 }}>
              <ShieldCheck size={18} color={brandColor} />
            </div>
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 'clamp(18px, 4.5vw, 22px)', 
              fontWeight: '700', 
              color: brandColor, 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}>
              {guideline.title}
            </h3>
          </div>

          <button 
            type="button"
            onClick={onClose}
            style={{ 
              background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(197, 160, 89, 0.3)', 
              borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <X size={16} color={textTheme} />
          </button>
        </div>

        {/* Scrollable Content Body with Dashed Cards */}
        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: 'clamp(12px, 3.5vw, 14px)', 
          color: '#2a2827',
          lineHeight: '1.4',
          paddingRight: '4px',
          paddingBottom: '12px',
          minWidth: 0
        }}>
          {/* Shelf Life Highlight Banner */}
          {guideline.shelfLife && (
            <div style={{
              background: 'rgba(197, 160, 89, 0.12)',
              border: '1px dashed rgba(197, 160, 89, 0.5)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxSizing: 'border-box'
            }}>
              <Clock size={16} color={brandColor} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 'var(--font-caption)', color: textTheme, fontWeight: '600', minWidth: 0 }}>
                Recommended Shelf Life: <span style={{ color: brandColor, fontWeight: '800' }}>{guideline.shelfLife}</span>
              </div>
            </div>
          )}

          {/* Instructions List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {guideline.steps.map((instruction, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: '#FFFFFF',
                border: '1.5px dashed rgba(197, 160, 89, 0.45)',
                padding: '10px 12px',
                borderRadius: '12px',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  background: 'rgba(255, 89, 88, 0.1)',
                  color: brandColor,
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  flexShrink: '0',
                  marginTop: '1px'
                }}>
                  {index + 1}
                </div>
                <div style={{
                  color: '#57534E',
                  lineHeight: '1.5',
                  fontWeight: '500',
                  fontSize: 'var(--font-body)',
                  flex: 1,
                  minWidth: 0
                }}>
                  {instruction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Footer */}
        <div style={{ padding: '12px 0 4px 0', background: 'transparent', borderTop: '1px solid rgba(197, 160, 89, 0.25)', flexShrink: 0 }}>
          <button 
            type="button"
            onClick={onClose}
            style={{
              width: '100%', padding: '13px', background: `linear-gradient(135deg, ${brandColor} 0%, #E11D48 100%)`, 
              color: '#FFFFFF', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: 'var(--font-body)', 
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
            }}
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}