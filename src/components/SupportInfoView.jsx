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
        <h2 style={{ color: theme.brand, margin: 0, fontSize: '18px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Support & Info</h2>
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

      {/* Legal & Policies Header */}
      <h3 style={{ color: theme.text, fontSize: '15px', fontWeight: '700', marginBottom: '10px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Legal & Policies</h3>
      
      {/* Accordions Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* T&C Accordion */}
        <div>
          <div onClick={() => setShowTC(!showTC)} style={{ ...accordionHeaderStyle, backgroundColor: '#FFFFFF', padding: '16px 20px', marginBottom: 0, justifyContent: 'space-between', color: theme.text, boxShadow: '0 1px 4px rgba(0,0,0,0.02)', zIndex: 2, position: 'relative', borderRadius: theme.radius, border: theme.border }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} color={theme.buttonBg} /> 
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Terms & Conditions</span>
            </div>
            {showTC ? <ChevronUp size={18} color={theme.brand}/> : <ChevronDown size={18} color={theme.brand}/>}
          </div>
          {showTC && (
            <div style={{ padding: '20px', fontSize: '13px', lineHeight: '1.6', color: '#4A4A4A', border: theme.border, borderTop: 'none', borderRadius: `0 0 ${theme.radius} ${theme.radius}`, background: '#FAFAFA', marginTop: '-6px' }}>
              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <li><strong>Order Acceptance:</strong> All orders are subject to availability. We reserve the right to refuse or cancel orders.</li>
                <li><strong>Order Modification:</strong> Orders can be modified before dispatch, subject to availability.</li>
                <li><strong>Order Cut-off Time:</strong> Orders must be placed in advance to ensure freshness.</li>
                <li><strong>Offer Coupons:</strong> Offer coupons are valid for a limited time and cannot be combined with other promotions.</li>
                <li><strong>FSSAI Registration:</strong> Lyte Bytes holds a valid FSSAI Registration for manufacturing, storage, and distribution.</li>
                <li><strong>Allergen Warning:</strong> Prepared in a home kitchen that may handle common allergens (nuts, gluten, dairy).</li>
                <li><strong>Hygiene Standards:</strong> Prepared in a clean, hygienic home kitchen adhering to strict health standards.</li>
                <li><strong>Refunds & Cancellations:</strong> Due to perishable food nature, returns, cancellations, and refunds are not accepted once placed.</li>
                <li><strong>Payments:</strong> Payments must be made in full at the time of order placement.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Privacy Policy Accordion */}
        <div>
          <div onClick={() => setShowPrivacy(!showPrivacy)} style={{ ...accordionHeaderStyle, backgroundColor: '#FFFFFF', padding: '16px 20px', marginBottom: 0, justifyContent: 'space-between', color: theme.text, boxShadow: '0 1px 4px rgba(0,0,0,0.02)', zIndex: 2, position: 'relative', borderRadius: theme.radius, border: theme.border }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} color={theme.buttonBg} /> 
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Privacy Policy</span>
            </div>
            {showPrivacy ? <ChevronUp size={18} color={theme.brand}/> : <ChevronDown size={18} color={theme.brand}/>}
          </div>
          {showPrivacy && (
            <div style={{ padding: '20px', fontSize: '13px', lineHeight: '1.6', color: '#4A4A4A', border: theme.border, borderTop: 'none', borderRadius: `0 0 ${theme.radius} ${theme.radius}`, background: '#FAFAFA', marginTop: '-6px' }}>
              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <li><strong>Data Collection:</strong> We collect your name, phone number, and address strictly to fulfill your orders and deliveries.</li>
                <li><strong>Third Parties:</strong> We do not sell your personal data; delivery info is shared only with logistics partners.</li>
                <li><strong>Security:</strong> We take all reasonable precautions to secure your data and retain it only as long as necessary.</li>
                <li><strong>Cookies:</strong> We do not use tracking cookies on our application.</li>
                <li><strong>Your Rights:</strong> Request deletion of your data anytime via WhatsApp or email.</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}