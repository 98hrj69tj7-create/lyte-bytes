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
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: 'pointer'
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
            <Gift size={18} color="#C5A059" style={{ flexShrink: 0 }} />
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
              Festive Bundles & Hampers
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
            <div style={{ marginBottom: '10px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 2px 0', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 4vw, 18px)', color: '#1A1816', fontWeight: '600' }}>
                ✦ Curated Collections ✦
              </h3>
              <p style={{ margin: 0, fontSize: 'clamp(11.5px, 3.2vw, 13px)', color: '#78716C', fontWeight: '500', lineHeight: '1.35' }}>
                Fill out details below or submit to initiate a WhatsApp discussion with us:
              </p>
            </div>

            <form onSubmit={submitHamperWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
              <input 
                type="text"
                placeholder="Your Name"
                required
                value={hamperData.name}
                onChange={(e) => setHamperData({...hamperData, name: e.target.value})}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                }}
              />

              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                <select 
                  value={hamperData.hamperType}
                  onChange={(e) => setHamperData({...hamperData, hamperType: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 32px 12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', 
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
                    transform: 'translateY(-50%)', pointerEvents: 'none', flexShrink: 0
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
                    width: '100%', padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                <input 
                  type="text"
                  placeholder="Number of Boxes"
                  required
                  value={hamperData.quantity}
                  onChange={(e) => setHamperData({...hamperData, quantity: e.target.value})}
                  style={{
                    flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816'
                  }}
                />
                <input 
                  type="date"
                  required
                  value={hamperData.date}
                  onChange={(e) => setHamperData({...hamperData, date: e.target.value})}
                  style={{
                    flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                    fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', marginTop: '2px' }}>
                <label style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', fontWeight: '700', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Preferred Add-ons / Inclusions:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
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
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: 'clamp(11px, 3vw, 12px)',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 2px 4px rgba(197, 160, 89, 0.3)' : 'none',
                          flexShrink: 0
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea 
                placeholder="Custom items, budget or packaging preferences..."
                rows="2"
                value={hamperData.notes}
                onChange={(e) => setHamperData({...hamperData, notes: e.target.value})}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px',
                  border: '1px solid rgba(197, 160, 89, 0.5)', backgroundColor: '#FFF',
                  fontSize: 'clamp(12px, 3.5vw, 14px)', boxSizing: 'border-box', outline: 'none', color: '#1A1816', resize: 'none', marginTop: '2px'
                }}
              />

              <button 
                type="submit"
                style={{
                  background: '#25D366',
                  color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 16px',
                  fontSize: 'clamp(13px, 3.8vw, 14.5px)', fontWeight: '700', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)', marginTop: '4px', width: '100%', boxSizing: 'border-box'
                }}
              >
                <MessageSquare size={14} style={{ flexShrink: 0 }} /> Send Inquiry via WhatsApp
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}