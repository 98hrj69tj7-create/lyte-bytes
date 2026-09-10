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
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(20, 15, 12, 0.8)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '20px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <Users size={18} color="#C5A059" style={{ flexShrink: 0 }} />
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 'clamp(18px, 4.5vw, 22px)', 
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
              Bulk Orders & Pricing
            </h3>
          </div>
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

        <div style={{ 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          boxSizing: 'border-box',
          textAlign: 'left',
          fontSize: 'clamp(12px, 3.5vw, 14px)',
          color: '#57534E',
          lineHeight: '1.5',
          paddingRight: '6px',
          minWidth: 0
        }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: '16px',
              padding: 'clamp(14px, 4vw, 18px) clamp(16px, 4.5vw, 20px)',
              color: activeTheme.text,
              boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
              position: 'relative',
              overflow: 'hidden',
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
              <p style={{ margin: 0, fontSize: 'clamp(11.5px, 3.2vw, 13px)', color: '#78716C', fontWeight: '500', lineHeight: '1.4' }}>
                Share your event specs to submit or discuss instantly via WhatsApp.
              </p>
            </div>

            <form onSubmit={submitBulkWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text"
                placeholder="Your Name"
                required
                value={bulkData.name}
                onChange={(e) => setBulkData({...bulkData, name: e.target.value})}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                }}
              />

              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                <select 
                  value={bulkData.eventType}
                  onChange={(e) => setBulkData({...bulkData, eventType: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 32px 12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', 
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
                    width: '100%', padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                <input 
                  type="text"
                  placeholder="Approx. Guests"
                  required
                  value={bulkData.guests}
                  onChange={(e) => setBulkData({...bulkData, guests: e.target.value})}
                  style={{
                    flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                  }}
                />
                <input 
                  type="date"
                  required
                  value={bulkData.date}
                  onChange={(e) => setBulkData({...bulkData, date: e.target.value})}
                  style={{
                    flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', marginTop: '6px' }}>
                <label style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', fontWeight: '700', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                          padding: '6px 12px',
                          fontSize: 'clamp(11px, 3vw, 12px)',
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

              <textarea 
                placeholder="Any special menu items, dietary preferences or notes..."
                rows="2"
                value={bulkData.notes}
                onChange={(e) => setBulkData({...bulkData, notes: e.target.value})}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', resize: 'none', marginTop: '6px'
                }}
              />

              <button 
                type="submit"
                style={{
                  background: '#25D366',
                  color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 16px',
                  fontSize: 'clamp(13px, 3.8vw, 14.5px)', fontWeight: '700', cursor: 'pointer', display: 'flex',
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