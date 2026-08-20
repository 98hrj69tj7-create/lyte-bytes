import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, X, MessageSquare, ChevronDown } from 'lucide-react';

export default function BulkOrdersModal({ isOpen, onClose }) {
  const [bulkData, setBulkData] = useState({ 
    name: '', 
    guests: '', 
    date: '', 
    eventType: 'Pre/Post wedding', 
    customEventType: '', 
    selectedItems: [], 
    notes: '' 
  });

  const menuOptions = [
    'Meals', 'Biryani', 'Sandwich', 'Cutlets', 
    'Samosa', 'Rolls', 'Birthday Cake', 'Cookies'
  ];

  const activeTheme = {
    brand: '#FF5958',
    text: '#1A1816',
    radius: 'clamp(20px, 5vw, 24px)' // 💡 FLUID RADIUS
  };

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

  const toggleMenuItem = (item) => {
    setBulkData(prev => {
      const exists = prev.selectedItems.includes(item);
      return {
        ...prev,
        selectedItems: exists 
          ? prev.selectedItems.filter(i => i !== item)
          : [...prev.selectedItems, item]
      };
    });
  };

  const submitBulkWhatsApp = (e) => {
    e.preventDefault();
    const finalEvent = bulkData.eventType === 'Other' ? bulkData.customEventType : bulkData.eventType;
    const itemsList = bulkData.selectedItems.length > 0 ? bulkData.selectedItems.join(', ') : 'None selected';
    
    const msg = `*Bespoke Catering & Bulk Inquiry*%0A- Name: ${bulkData.name}%0A- Event: ${finalEvent}%0A- Guest Count: ${bulkData.guests}%0A- Event Date: ${bulkData.date}%0A- Interested Items: ${itemsList}%0A- Notes: ${bulkData.notes}`;
    window.open(`https://wa.me/9108286886?text=${msg}`, '_blank');
  };

  const modalContent = (
    <div 
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.78)', 
        backdropFilter: 'blur(6px)', 
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999, 
        padding: 'clamp(12px, 3vw, 24px)', // 💡 FLUID PADDING
        cursor: 'pointer',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        @keyframes modalScaleIn {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          borderRadius: activeTheme.radius,
          border: '1px solid rgba(197, 160, 89, 0.4)',
          width: '100%',
          maxWidth: '420px', // Slightly expanded for better scaling
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)', 
          overflowY: 'auto',
          position: 'relative',
          animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default',
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px', background: 'rgba(197, 160, 89, 0.12)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A6D2B', zIndex: 10,
            flexShrink: 0
          }}
        >
          <X size={16} />
        </button>

        {/* Header Title Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(16px, 4vw, 20px) 46px 2px clamp(16px, 4vw, 20px)', // 💡 FLUID PADDING
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* 💡 BULLETPROOF FLEX: minWidth: 0 prevents long text from breaking flex boundaries */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '100%', minWidth: 0 }}>
            <Users size={16} color="#C5A059" style={{ flexShrink: 0 }} />
            <span style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
              fontWeight: '700', 
              color: activeTheme.text, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px', 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Bulk Orders & Pricing
            </span>
          </div>
        </div>

        {/* Form Body Container */}
        <div style={{ padding: 'clamp(12px, 3vw, 16px)', position: 'relative', boxSizing: 'border-box' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: 'clamp(14px, 4vw, 16px)',
              padding: 'clamp(14px, 4vw, 20px) clamp(12px, 3vw, 16px)', // 💡 FLUID INNER PADDING
              color: activeTheme.text,
              boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              border: '1px dashed #C5A059'
            }}
          >
            <div style={{ marginBottom: '14px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 4px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 4vw, 18px)', color: '#1A1816', fontWeight: '700' }}>
                ✦ Bespoke Catering ✦
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', lineHeight: '1.4' }}>
                Share your event specs to submit or discuss instantly via WhatsApp.
              </p>
            </div>

            <form onSubmit={submitBulkWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Name Field */}
              <input 
                type="text"
                placeholder="Your Name"
                required
                value={bulkData.name}
                onChange={(e) => setBulkData({...bulkData, name: e.target.value})}
                style={{
                  width: '100%', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: 'var(--font-body)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                }}
              />

              {/* Event Type Dropdown with Custom Arrow */}
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                <select 
                  value={bulkData.eventType}
                  onChange={(e) => setBulkData({...bulkData, eventType: e.target.value})}
                  style={{
                    width: '100%', padding: 'clamp(10px, 3vw, 12px) 32px clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'var(--font-body)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', 
                    cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none'
                  }}
                >
                  <option value="Pre/Post wedding">Pre/Post Wedding</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Prayer">Prayer Meeting</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Get together">Get-together</option>
                  <option value="Other">Other (Type below)</option>
                </select>
                <ChevronDown 
                  size={16} 
                  color="#8A6D2B" 
                  style={{ 
                    position: 'absolute', right: '12px', top: '50%', 
                    transform: 'translateY(-50%)', pointerEvents: 'none' 
                  }} 
                />
              </div>

              {bulkData.eventType === 'Other' && (
                <input 
                  type="text"
                  placeholder="Specify event type..."
                  required
                  value={bulkData.customEventType}
                  onChange={(e) => setBulkData({...bulkData, customEventType: e.target.value})}
                  style={{
                    width: '100%', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'var(--font-body)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                  }}
                />
              )}

              {/* 💡 BULLETPROOF FLEX: Guests and Date Row with minWidth: 0 to prevent overflow */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                <input 
                  type="text"
                  placeholder="Approx. Guests"
                  required
                  value={bulkData.guests}
                  onChange={(e) => setBulkData({...bulkData, guests: e.target.value})}
                  style={{
                    flex: 1, minWidth: 0, padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'var(--font-body)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                  }}
                />
                <input 
                  type="date"
                  required
                  value={bulkData.date}
                  onChange={(e) => setBulkData({...bulkData, date: e.target.value})}
                  style={{
                    flex: 1, minWidth: 0, padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', borderRadius: '10px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'var(--font-body)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', cursor: 'pointer'
                  }}
                />
              </div>

              {/* Menu Categories Selection Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', marginTop: '6px' }}>
                <label style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '700', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Interested Menu Items / Categories:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {menuOptions.map((item, idx) => {
                    const isSelected = bulkData.selectedItems.includes(item);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleMenuItem(item)}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#524B47',
                          border: '1px solid rgba(197, 160, 89, 0.5)',
                          borderRadius: '8px',
                          padding: '6px clamp(10px, 3vw, 14px)', // 💡 FLUID BUTTON PADDING
                          fontSize: 'clamp(10.5px, 2.5vw, 12px)', // 💡 FLUID PILL TEXT
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 2px 6px rgba(197, 160, 89, 0.3)' : 'none'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes / Special Requests */}
              <textarea 
                placeholder="Any special menu items, dietary preferences or notes..."
                rows="2"
                value={bulkData.notes}
                onChange={(e) => setBulkData({...bulkData, notes: e.target.value})}
                style={{
                  width: '100%', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: 'var(--font-body)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', resize: 'none', marginTop: '6px'
                }}
              />

              {/* WhatsApp Submit Action */}
              <button 
                type="submit"
                style={{
                  background: '#25D366',
                  color: '#FFF', border: 'none', borderRadius: '12px', padding: 'clamp(12px, 3.5vw, 14px)', // 💡 FLUID PADDING
                  fontSize: 'var(--font-body)', fontWeight: '700', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 6px 14px rgba(37, 211, 102, 0.35)', marginTop: '8px'
                }}
              >
                <MessageSquare size={16} /> Send Inquiry via WhatsApp
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}