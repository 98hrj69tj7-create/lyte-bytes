import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, X, MessageSquare, ChevronDown } from 'lucide-react';

export default function BulkOrdersModal({ isOpen, onClose }) {
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [bulkData, setBulkData] = useState({ 
    phone: '',
    guests: '', 
    date: '', // Starts blank so the placeholder shows
    mealTime: 'Lunch', 
    eventType: '', 
    customEventType: '', 
    selectedItems: [], 
    notes: '' 
  });
  
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const menuOptions = [
    'Meals', 'Biryani', 'Sandwich', 'Cutlets', 
    'Samosa', 'Rolls', 'Birthday Cake', 'Cookies'
  ];

  const mealTimeOptions = ['Breakfast', 'Lunch', 'Dinner'];

  const eventTypeOptions = [
    'Birthday Party',
    'Corporate Event',
    'Get-together',
    'Pre/Post Wedding',
    'Prayer Meeting',
    'Other (Type below)'
  ];

  const activeTheme = {
    brand: '#FF5958',
    text: '#1A1816',
    radius: 'clamp(20px, 5vw, 24px)'
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
      setErrors([]);
      setShowWarningModal(false);
      setIsDateFocused(false);
      setBulkData({
        phone: '',
        guests: '', 
        date: '', 
        mealTime: 'Lunch', 
        eventType: '', 
        customEventType: '', 
        selectedItems: [], 
        notes: ''
      });
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showWarningModal) {
          setShowWarningModal(false);
        } else {
          onClose();
        }
      }
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
  }, [isOpen, onClose, showWarningModal]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setBulkData(prev => ({ ...prev, [field]: value }));
    if (errors.includes(field)) {
      setErrors(prev => prev.filter(e => e !== field));
    }
  };

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
    
    const newErrors = [];
    if (!bulkData.phone.trim()) newErrors.push('phone');
    if (!bulkData.eventType.trim()) newErrors.push('eventType');
    if (!bulkData.guests.trim()) newErrors.push('guests');
    if (!bulkData.date.trim()) newErrors.push('date');
    if (bulkData.eventType === 'Other (Type below)' && !bulkData.customEventType.trim()) newErrors.push('customEventType');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowWarningModal(true);
      return;
    }

    setErrors([]);
    setShowWarningModal(false);
    const finalEvent = bulkData.eventType === 'Other (Type below)' ? bulkData.customEventType : bulkData.eventType;
    const itemsList = bulkData.selectedItems.length > 0 ? bulkData.selectedItems.join(', ') : 'None selected';
    
    const msg = `*Bespoke Catering & Bulk Inquiry*%0A- Phone: ${bulkData.phone}%0A- Event: ${finalEvent}%0A- Meal Slot: ${bulkData.mealTime}%0A- Guest Count: ${bulkData.guests}%0A- Event Date: ${bulkData.date}%0A- Interested Items: ${itemsList}%0A- Notes: ${bulkData.notes}`;
    window.open(`https://wa.me/9108286886?text=${msg}`, '_blank');
  };

  // Uniform styling helper ensuring identical padding, height, box-sizing, and borders across all fields
  const getInputStyle = (fieldName, extraStyles = {}) => ({
    width: '100%', 
    height: '46px', // Explicit uniform height for absolute symmetry
    padding: '0 14px', 
    borderRadius: '10px',
    border: errors.includes(fieldName) ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.5)', 
    backgroundColor: errors.includes(fieldName) ? 'rgba(255, 89, 88, 0.03)' : '#FFF',
    fontSize: 'var(--font-body)', 
    boxSizing: 'border-box', 
    outline: 'none', 
    color: '#1A1816',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    ...extraStyles
  });

  const modalContent = (
    <div 
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.78)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, 
        padding: 'clamp(12px, 3vw, 24px)', cursor: 'pointer', boxSizing: 'border-box'
      }}
    >
      <style>{`
        @keyframes modalScaleIn {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          position: absolute;
          right: 14px;
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
          borderRadius: activeTheme.radius, border: '1px solid rgba(197, 160, 89, 0.4)',
          width: '100%', maxWidth: '420px', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.35)', 
          overflowY: 'auto', position: 'relative', animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <button 
          type="button" onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px', background: 'rgba(197, 160, 89, 0.12)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A6D2B', zIndex: 10, flexShrink: 0
          }}
        >
          <X size={16} />
        </button>

        {/* Premium Unjammed Title Container */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px 46px 6px 20px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
            <Users size={16} color="#C5A059" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: '700', color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
              Bulk Orders & Pricing
            </span>
          </div>
        </div>

        <div style={{ padding: 'clamp(12px, 3vw, 16px)', position: 'relative', boxSizing: 'border-box' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
              borderRadius: 'clamp(14px, 4vw, 16px)', padding: 'clamp(14px, 4vw, 20px) clamp(12px, 3vw, 16px)',
              color: activeTheme.text, boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)', position: 'relative',
              display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px dashed #C5A059'
            }}
          >
            <div style={{ marginBottom: '14px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 4px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 4vw, 18px)', color: '#1A1816', fontWeight: '700' }}>
                ✦ Bespoke Catering ✦
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', lineHeight: '1.4' }}>
                Share your details to connect and discuss instantly.
              </p>
            </div>

            <form onSubmit={submitBulkWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Phone Field */}
              <input 
                type="tel"
                placeholder="Phone Number *"
                value={bulkData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                style={getInputStyle('phone')}
              />

              {/* Event Type Dropdown */}
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                <select 
                  value={bulkData.eventType}
                  onChange={(e) => handleChange('eventType', e.target.value)}
                  style={getInputStyle('eventType', { 
                    cursor: 'pointer', 
                    appearance: 'none', 
                    WebkitAppearance: 'none', 
                    paddingRight: '32px',
                    color: bulkData.eventType ? '#1A1816' : '#9CA3AF' 
                  })}
                >
                  <option value="" disabled style={{ color: '#9CA3AF' }}>Select Event Type *</option>
                  {eventTypeOptions.map((opt, idx) => (
                    <option key={idx} value={opt} style={{ color: '#1A1816' }}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={16} color="#8A6D2B" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>

              {bulkData.eventType === 'Other (Type below)' && (
                <input 
                  type="text"
                  placeholder="Specify event type... *"
                  value={bulkData.customEventType}
                  onChange={(e) => handleChange('customEventType', e.target.value)}
                  style={getInputStyle('customEventType')}
                />
              )}

              {/* Premium Meal Timing Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                <label style={{ fontSize: '10px', fontWeight: '700', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Meal Slot:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {mealTimeOptions.map((slot) => {
                    const isSelected = bulkData.mealTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleChange('mealTime', slot)}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#524B47',
                          border: '1px solid rgba(197, 160, 89, 0.5)',
                          borderRadius: '8px', height: '38px',
                          fontSize: '11.5px', fontWeight: '700', cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 2px 6px rgba(197, 160, 89, 0.3)' : 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guests and Date Row with Perfectly Aligned Uniform Dimensions */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                <input 
                  type="number"
                  placeholder="Approx. Guests *"
                  value={bulkData.guests}
                  onChange={(e) => handleChange('guests', e.target.value)}
                  style={getInputStyle('guests', { flex: 1, minWidth: 0 })}
                />
                
                <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                  <input 
                    type={isDateFocused || bulkData.date ? 'date' : 'text'}
                    min={getTomorrowDateString()}
                    value={bulkData.date}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={() => { if (!bulkData.date) setIsDateFocused(false); }}
                    onChange={(e) => handleChange('date', e.target.value)}
                    style={getInputStyle('date', { 
                      width: '100%',
                      cursor: 'pointer',
                      color: bulkData.date ? '#1A1816' : 'transparent'
                    })}
                  />
                  {!bulkData.date && (
                    <div 
                      onClick={(e) => {
                        const input = e.currentTarget.nextElementSibling;
                        if (input && typeof input.showPicker === 'function') {
                          input.showPicker();
                        }
                      }}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9CA3AF',
                        fontSize: 'var(--font-body)',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Date *
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Categories Selection Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', marginTop: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: '700', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Interested Menu Items / Categories:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {menuOptions.map((item, idx) => {
                    const isSelected = bulkData.selectedItems.includes(item);
                    return (
                      <button
                        key={idx} type="button" onClick={() => toggleMenuItem(item)}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#524B47',
                          border: '1px solid rgba(197, 160, 89, 0.5)', borderRadius: '8px',
                          padding: '6px clamp(10px, 3vw, 14px)', fontSize: 'clamp(10.5px, 2.5vw, 12px)',
                          fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease',
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
                onChange={(e) => handleChange('notes', e.target.value)}
                style={{
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', 
                  backgroundColor: '#FFF',
                  fontSize: 'var(--font-body)', 
                  boxSizing: 'border-box', 
                  outline: 'none', 
                  color: '#1A1816',
                  resize: 'none', 
                  marginTop: '4px',
                  transition: 'all 0.2s ease'
                }}
              />

              {/* WhatsApp Submit Action */}
              <button 
                type="submit"
                style={{
                  background: '#25D366', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: 'clamp(12px, 3.5vw, 14px)',
                  fontSize: 'var(--font-body)', fontWeight: '700', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 6px 14px rgba(37, 211, 102, 0.35)', marginTop: '4px'
                }}
              >
                <MessageSquare size={16} /> Send Inquiry via WhatsApp
              </button>
            </form>
          </div>
        </div>

        {/* Premium Warning Popup Modal */}
        {showWarningModal && (
          <div 
            onClick={() => setShowWarningModal(false)}
            style={{
              position: 'absolute', inset: 0, backgroundColor: 'rgba(20, 15, 12, 0.65)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(0px)',
              zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
              borderRadius: activeTheme.radius
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
                border: '1.5px solid #FF5958', borderRadius: '16px', padding: '20px',
                maxWidth: '320px', width: '100%', boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px',
                animation: 'modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 89, 88, 0.12)', color: '#FF5958', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '18px', fontWeight: 'bold' }}>
                !
              </div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '700', color: '#1A1816', margin: 0 }}>
                Incomplete Details
              </h4>
              <p style={{ fontSize: '12px', color: '#57534E', margin: 0, lineHeight: '1.5' }}>
                Please fill in all the mandatory fields
              </p>
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
                  color: '#FFF', border: 'none', borderRadius: '10px', padding: '10px',
                  fontSize: '13px', fontWeight: '750', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 89, 88, 0.3)'
                }}
              >
                Got It
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}