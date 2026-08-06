import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle, Mail, Star, ChevronRight } from 'lucide-react';
import PolicyModal from './PolicyModal';

export default function SupportInfoView({
  theme = {},
  setView = () => {},
  showTC = false,
  setShowTC = () => {},
  showPrivacy = false,
  setShowPrivacy = () => {}
}) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '20px'
  };

  // Testimonials list with source type ('google' or 'whatsapp')
  const testimonials = [
    {
      id: 1,
      source: 'google',
      text: 'The best pickles and homemade treats! Authentic taste and amazing packaging.',
      author: 'Priya S.'
    },
    {
      id: 2,
      source: 'whatsapp',
      text: 'Received the order safely today. The tomato pickle reminds me of home!',
      author: 'Rohan M.'
    },
    {
      id: 3,
      source: 'google',
      text: 'Super quick delivery and top-notch quality. Highly recommend Lyte Bytes!',
      author: 'Ananya K.'
    }
  ];

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Lyte Bytes',
      'ORG:Lyte Bytes - Gourmet Delights',
      'TEL;TYPE=WORK,VOICE:+919108286886',
      'NOTE:Handcrafted Goodness & Gourmet Delights Since 1995',
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Lyte_Bytes_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const message = "Hi, I would like to get assistance from Lyte Bytes Support.";
    const waUrl = `https://wa.me/9108286886?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '8px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <style>{`
        @keyframes scrollTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonial-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: scrollTicker 30s linear infinite;
        }
        .testimonial-track:hover {
          animation-play-state: paused;
        }
        .support-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(44, 34, 30, 0.06) !important;
        }
      `}</style>

      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '4px 0' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'rgba(44, 34, 30, 0.04)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', 
            gap: '6px', color: activeTheme.text, fontSize: '13.5px', fontWeight: '700', padding: '6px 12px', 
            borderRadius: '10px', zIndex: 1, transition: 'background 0.2s' 
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
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none'
        }}>
          Support & Feedback
        </h2>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: activeTheme.border, borderRadius: activeTheme.radius, bordercolor: '#FF5958(216, 199, 165, 0.6)',
        background: '#FFFBF2', padding: '20px', boxShadow: '0 8px 30px rgba(44, 34, 30, 0.04)',
        display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box', width: '100%'
      }}>

        {/* 1. Give Feedback Container (First Option) */}
        <a href="https://g.page/r/CRodKxCU6unDEBM/review" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', backgroundColor: '#FFFFFF', border: activeTheme.border, borderRadius: '14px', boxShadow: '0 2px 8px rgba(44, 34, 30, 0.02)' }}>
            <div style={{width: '42px', height: '42px', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
              <CheckCircle size={30} color="#F5B041" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700' }}>Give Feedback</h3>
              <p style={{ margin: 0, color: '#8C8275', fontSize: '12px', fontWeight: '500' }}>Rate your experience with us</p>
            </div>
            <ChevronRight size={16} color="#B5ACA1" />
          </div>
        </a>

        {/* 2. Customer Stories / Testimonials Section */}
        <div style={{ borderTop: `1px dashed ${activeTheme.brand}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#776E62', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>
              Customer Stories
            </span>
            <span style={{ fontSize: '10.5px', color: '#8C8275', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <Star size={15} fill="#F5B041" color="#F5B041" /> Verified Reviews
            </span>
          </div>

          <div style={{ width: '100%', overflow: 'hidden', position: 'relative', padding: '4px 0' }}>
            <div className="testimonial-track">
              {[...testimonials, ...testimonials].map((item, index) => (
                <div 
                  key={index} 
                  style={{
                    minWidth: '250px', maxWidth: '250px', backgroundColor: '#FFFFFF',
                    border: activeTheme.border, borderRadius: '14px', padding: '20px',
                    boxShadow: '0 3px 10px rgba(44, 34, 30, 0.03)', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', flexShrink: 0, textAlign: 'left'
                  }}
                >
                  <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: activeTheme.text, lineHeight: '1.5', fontStyle: 'italic' }}>
                    "{item.text}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ fontWeight: '700', color: activeTheme.brand }}>— {item.author}</span>
                    
                    {/* Source Logo Badge */}
                    <div style={{ padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {item.source === 'google' ? (
                        <svg width="13" height="13" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.32 7.23 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.5-.38-2.25s.13-1.53.38-2.25V6.6H1.19A11.93 11.93 0 000 12c0 1.92.45 3.73 1.19 5.35l4.09-3.1z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
                        </svg>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. WhatsApp Support & Email Support Options */}
        <div style={{ borderTop: `1px dashed ${activeTheme.brand}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* WhatsApp Support */}
          <a href="https://wa.me/9108286886" onClick={handleWhatsAppClick} style={{ textDecoration: 'none' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', backgroundColor: '#FFFFFF', border: activeTheme.border, borderRadius: '14px', boxShadow: '0 2px 8px rgba(44, 34, 30, 0.02)' }}>
              <div style={{width: '42px', height: '42px', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <MessageCircle size={30} color="#2D8A56" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700' }}>WhatsApp Support</h3>
                <p style={{ margin: 0, color: '#8C8275', fontSize: '12px', fontWeight: '500' }}>Quick assistance</p>
              </div>
              <ChevronRight size={16} color="#B5ACA1" />
            </div>
          </a>

          {/* Email Us */}
          <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', backgroundColor: '#FFFFFF', border: activeTheme.border, borderRadius: '14px', boxShadow: '0 2px 8px rgba(44, 34, 30, 0.02)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <Mail size={30} color={activeTheme.brand} />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700' }}>Email Us</h3>
                <p style={{ margin: 0, color: '#8C8275', fontSize: '12px', fontWeight: '500' }}>Email us for detailed queries</p>
              </div>
              <ChevronRight size={16} color="#B5ACA1" />
            </div>
          </a>

        </div>

        {/* Policies & Information Section */}
        <div style={{ borderTop: `1px dashed rgba(216, 199, 165, 0.6)`, paddingTop: '1px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#776E62', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>
            Policies & Information
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                if (typeof setShowTC === 'function') setShowTC(true);
                setIsTermsOpen(true);
              }}
              style={{
                flex: 1, padding: '12px', background: '#FFFFFF', border: activeTheme.border,
                borderRadius: '12px', fontSize: '12.5px', fontWeight: '700', color: activeTheme.text, cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(44, 34, 30, 0.02)', transition: 'background 0.2s'
              }}
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof setShowPrivacy === 'function') setShowPrivacy(true);
                setIsPrivacyOpen(true);
              }}
              style={{
                flex: 1, padding: '12px', background: '#FFFFFF', border: activeTheme.border,
                borderRadius: '12px', fontSize: '12.5px', fontWeight: '700', color: activeTheme.text, cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(44, 34, 30, 0.02)', transition: 'background 0.2s'
              }}
            >
              Privacy Policy
            </button>
          </div>
        </div>

      </div>

      {/* Terms & Conditions Modal */}
      <PolicyModal 
        isOpen={showTC || isTermsOpen} 
        onClose={() => {
          if (typeof setShowTC === 'function') setShowTC(false);
          setIsTermsOpen(false);
        }} 
        title="Terms & Conditions" 
        theme={activeTheme}
      >
        <p><strong>General:</strong> All orders placed with Lyte Bytes are subject to availability and confirmation of order acceptance.</p>
        <p><strong>Pricing & Payments:</strong> Prices are listed in INR and are inclusive of applicable local taxes where specified. Payment must be completed via our secure payment gateway prior to dispatch.</p>
        <p><strong>Cancellations & Refunds:</strong> Due to the perishable and artisanal nature of our food products, cancellations are only permitted within 1 hour of order placement. Refunds for valid quality concerns are handled on a case-by-case basis.</p>
      </PolicyModal>

      {/* Privacy Policy Modal */}
      <PolicyModal 
        isOpen={showPrivacy || isPrivacyOpen} 
        onClose={() => {
          if (typeof setShowPrivacy === 'function') setShowPrivacy(false);
          setIsPrivacyOpen(false);
        }} 
        title="Privacy Policy" 
        theme={activeTheme}
      >
        <p><strong>Information Security:</strong> We respect your privacy and protect your personal information with strict confidentiality measures.</p>
        <p><strong>Usage:</strong> Data collected during checkout is used exclusively for order processing, delivery logistics, and direct customer support.</p>
        <p><strong>No Third-Party Sharing:</strong> We never rent, sell, or trade your contact details with external marketing entities.</p>
      </PolicyModal>
    </div>
  );
}