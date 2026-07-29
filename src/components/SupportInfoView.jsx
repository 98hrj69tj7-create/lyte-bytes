import React from 'react';
import { ArrowLeft, MessageSquare, CheckCircle, Mail, Info, ChevronUp, ChevronDown } from 'lucide-react';

export default function SupportInfoView({
  theme,
  setView,
  showTC,
  setShowTC,
  showPrivacy,
  setShowPrivacy,
  backButtonStyle,
  accordionHeaderStyle
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '120px', 
      paddingTop: '5px',
      boxSizing: 'border-box' 
    }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => setView('home')} style={{ ...backButtonStyle, marginBottom: 0, justifySelf: 'start' }}>
          <ArrowLeft size={18}/> Menu
        </button>
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '17px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Support & Info</h2>
        <div style={{ width: '75px' }}></div>
      </div>

      <div style={{ textAlign: 'left', marginBottom: '20px', padding: '0 4px' }}>
        <p style={{ color: '#776E62', fontSize: '13.5px', margin: 0, lineHeight: '1.4' }}>We're here to help. Reach out to us or review our policies below.</p>
      </div>

      {/* Aligned Contact Cards Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        
        {/* WhatsApp Support */}
        <a href="https://wa.me/9108286886" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', backgroundColor: '#FFFFFF', border: theme.border, borderRadius: theme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#E8F5E9', width: '40px', height: '30px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquare size={22} color="#2D8A56" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '15px', fontWeight: '700' }}>WhatsApp Support</h3>
              <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>Quickest way to get assistance</p>
            </div>
          </div>
        </a>

        {/* Give Feedback */}
        <a href="https://g.page/r/CRodKxCU6unDEBM/review" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', backgroundColor: '#FFFFFF', border: theme.border, borderRadius: theme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#FFFBF2', width: '40px', height: '30px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={22} color="#F5B041" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '15px', fontWeight: '700' }}>Give Feedback</h3>
              <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>Rate your experience with us</p>
            </div>
          </div>
        </a>

        {/* Email Us */}
        <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', backgroundColor: '#FFFFFF', border: theme.border, borderRadius: theme.radius, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#FFF0F0', width: '40px', height: '30px', borderRadius: '50%', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={22} color={theme.brand} />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '15px', fontWeight: '700' }}>Email Us</h3>
              <p style={{ margin: 0, color: '#776E62', fontSize: '12.5px' }}>For detailed queries and requests</p>
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}