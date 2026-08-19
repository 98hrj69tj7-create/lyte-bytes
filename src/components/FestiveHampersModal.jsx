import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Gift, X, MessageSquare, ChevronDown } from 'lucide-react';

export default function FestiveHampersModal({ isOpen, onClose }) {
  const [hamperData, setHamperData] = useState({ 
    name: '', 
    quantity: '', 
    date: '', 
    hamperType: 'Signature Festive Hamper', 
    customHamperType: '', 
    selectedAddons: [], 
    notes: '' 
  });

  const addonOptions = [
    'Artisan Cookies', 'Achar Jar', 'Non-Alcoholic Wine', 
    'Celebration Cake', 'Savoury Snacks', 'Custom Packaging'
  ];

  const activeTheme = {
    brand: '#FF5958',
    text: '#1A1816',
    radius: '24px'
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

  const toggleAddon = (item) => {
    setHamperData(prev => {
      const exists = prev.selectedAddons.includes(item);
      return {
        ...prev,
        selectedAddons: exists 
          ? prev.selectedAddons.filter(i => i !== item)
          : [...prev.selectedAddons, item]
      };
    });
  };

  const submitHamperWhatsApp = (e) => {
    e.preventDefault();
    const finalHamper = hamperData.hamperType === 'Other' ? hamperData.customHamperType : hamperData.hamperType;
    const addonsList = hamperData.selectedAddons.length > 0 ? hamperData.selectedAddons.join(', ') : 'None selected';
    
    const msg = `*Festive Bundles & Hampers Inquiry*%0A- Name: ${hamperData.name}%0A- Hamper Selection: ${finalHamper}%0A- Number of Boxes: ${hamperData.quantity}%0A- Required Date: ${hamperData.date}%0A- Selected Add-ons: ${addonsList}%0A- Notes: ${hamperData.notes}`;
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
        backgroundColor: 'rgba(20, 15, 12, 0.75)', 
        backdropFilter: 'blur(6px)', 
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 99999, 
        padding: '16px', 
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: 'pointer'
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
          borderRadius: '24px', 
          padding: '20px 20px 18px 20px',
          maxWidth: '380px', 
          width: '100%', 
          boxSizing: 'border-box',
          position: 'relative', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(197, 160, 89, 0.4)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          cursor: 'default',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            background: 'rgba(197, 160, 89, 0.12)',
            border: 'none', 
            borderRadius: '50%', 
            width: '30px', 
            height: '30px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            color: '#8A6D2B', 
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* Header Title Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: '28px',
          paddingLeft: '4px',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '100%', overflow: 'hidden' }}>
            <Gift size={16} color="#C5A059" style={{ flexShrink: 0 }} />
            <span style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: '18px', 
              fontWeight: '700', 
              color: activeTheme.text, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px', 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Festive Bundles & Hampers
            </span>
          </div>
        </div>

        {/* Inner Dashed Form Container */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderRadius: '16px',
            padding: '12px 14px',
            color: activeTheme.text,
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            border: '1px dashed #C5A059'
          }}
        >
          <div style={{ marginBottom: '8px', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 2px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#1A1816', fontWeight: '600' }}>
              ✦ Curated Collections ✦
            </h3>
            <p style={{ margin: 0, fontSize: '10.5px', color: '#78716C', fontWeight: '500', lineHeight: '1.35' }}>
              Fill out details below or submit to initiate a WhatsApp discussion with us:
            </p>
          </div>

          <form onSubmit={submitHamperWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Name Field */}
            <input 
              type="text"
              placeholder="Your Name"
              required
              value={hamperData.name}
              onChange={(e) => setHamperData({...hamperData, name: e.target.value})}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: '10px',
                border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                fontSize: '11.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
              }}
            />

            {/* Hamper Type Dropdown with Custom Arrow */}
            <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
              <select 
                value={hamperData.hamperType}
                onChange={(e) => setHamperData({...hamperData, hamperType: e.target.value})}
                style={{
                  width: '100%', padding: '9px 32px 9px 12px', borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: '11.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816', 
                  cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none'
                }}
              >
                <option value="Signature Festive Hamper">Signature Festive Hamper</option>
                <option value="Royal Sweets & Savouries Box">Royal Sweets & Savouries Box</option>
                <option value="Artisan Cookie Collection">Artisan Cookie Collection</option>
                <option value="Ammi's Achar & Condiments Gift Set">Ammi's Achar & Condiments Gift Set</option>
                <option value="Other">Other (Type below)</option>
              </select>
              <ChevronDown 
                size={14} 
                color="#8A6D2B" 
                style={{ 
                  position: 'absolute', right: '12px', top: '50%', 
                  transform: 'translateY(-50%)', pointerEvents: 'none' 
                }} 
              />
            </div>

            {hamperData.hamperType === 'Other' && (
              <input 
                type="text"
                placeholder="Specify custom hamper type..."
                required
                value={hamperData.customHamperType}
                onChange={(e) => setHamperData({...hamperData, customHamperType: e.target.value})}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: '11.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                }}
              />
            )}

            {/* Quantity and Date Row */}
            <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
              <input 
                type="text"
                placeholder="Number of Boxes"
                required
                value={hamperData.quantity}
                onChange={(e) => setHamperData({...hamperData, quantity: e.target.value})}
                style={{
                  flex: 1, minWidth: 0, padding: '9px 12px', borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: '11.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                }}
              />
              <input 
                type="date"
                required
                value={hamperData.date}
                onChange={(e) => setHamperData({...hamperData, date: e.target.value})}
                style={{
                  flex: 1, minWidth: 0, padding: '9px 12px', borderRadius: '10px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: '11.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816', cursor: 'pointer'
                }}
              />
            </div>

            {/* Add-ons Selection Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left', marginTop: '1px' }}>
              <label style={{ fontSize: '9.5px', fontWeight: '700', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Preferred Add-ons / Inclusions:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {addonOptions.map((item, idx) => {
                  const isSelected = hamperData.selectedAddons.includes(item);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAddon(item)}
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#524B47',
                        border: '1px solid rgba(197, 160, 89, 0.5)',
                        borderRadius: '6px',
                        padding: '3px 7px',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 2px 4px rgba(197, 160, 89, 0.3)' : 'none'
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
              placeholder="Custom items, budget or packaging preferences..."
              rows="2"
              value={hamperData.notes}
              onChange={(e) => setHamperData({...hamperData, notes: e.target.value})}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: '10px',
                border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                fontSize: '11.5px', boxSizing: 'border-box', outline: 'none', color: '#1A1816', resize: 'none', marginTop: '1px'
              }}
            />

            {/* WhatsApp Submit Action */}
            <button 
              type="submit"
              style={{
                background: '#25D366',
                color: '#FFF', border: 'none', borderRadius: '11px', padding: '10px',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)', marginTop: '2px'
              }}
            >
              <MessageSquare size={14} /> Send Inquiry via WhatsApp
            </button>
          </form>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}