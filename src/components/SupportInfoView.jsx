import React from 'react';
import { ArrowLeft, MessageSquare, CheckCircle, Mail, Info, ChevronUp, ChevronDown } from 'lucide-react';

export default function SupportInfoView({
  theme = {},
  setView,
  showTC,
  setShowTC,
  showPrivacy,
  setShowPrivacy,
  backButtonStyle,
  accordionHeaderStyle
}) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '14px', 
            fontWeight: '700', 
            padding: '4px 8px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(0,0,0,0.04)', 
            zIndex: 1 
          }}
        >
          <ArrowLeft size={16}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontSize: '16px', 
          color: activeTheme.brand, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Support & Info
        </h2>
      </div>

      <div style={{ textAlign: 'left', marginBottom: '16px', padding: '0 4px' }}>
        <p style={{ color: '#776E62', fontSize: '14px', fontWeight: '400', margin: 0, lineHeight: '1.4' }}>
          We're here to help. Reach out to us or share your feedback
        </p>
      </div>

      {/* Aligned Contact Cards Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        
        {/* WhatsApp Support */}
        <a href="https://wa.me/9108286886" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', backgroundColor: '#FFFFFF', border: activeTheme.border, borderRadius: activeTheme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#E8F5E9', width: '40px', height: '30px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquare size={22} color="#2D8A56" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '15px', fontWeight: '700' }}>WhatsApp Support</h3>
              <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>Quickest way to get assistance</p>
            </div>
          </div>
        </a>

        {/* Give Feedback */}
        <a href="https://g.page/r/CRodKxCU6unDEBM/review" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', backgroundColor: '#FFFFFF', border: activeTheme.border, borderRadius: activeTheme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#FFFBF2', width: '40px', height: '30px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={22} color="#F5B041" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '15px', fontWeight: '700' }}>Give Feedback</h3>
              <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>Rate your experience with us</p>
            </div>
          </div>
        </a>

        {/* Email Us */}
        <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', backgroundColor: '#FFFFFF', border: activeTheme.border, borderRadius: activeTheme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#FFF0F0', width: '40px', height: '30px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={22} color={activeTheme.brand} />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '15px', fontWeight: '700' }}>Email Us</h3>
              <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>For detailed queries and requests</p>
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}