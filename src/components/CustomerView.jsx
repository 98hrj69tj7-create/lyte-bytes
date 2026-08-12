import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Award, 
  Package, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export default function CustomerView({
  theme = {},
  onBack,
  setView,
  customer = {},
  orders = null,
  backButtonStyle = {}
}) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '20px'
  };

  // Navigation Handler
  const handleBack = onBack || (() => setView && setView('home'));

  // User Profile Data
  const name = customer.name?.trim() || 'Aarav Sharma';
  const phone = customer.phone?.trim() || '+91 98765 43210';

  // Fallback Sample Orders (Used if no dynamic orders prop is passed)
  const defaultOrders = [
    { 
      id: 'ORD-0381', 
      date: 'Aug 01, 2026', 
      itemsCount: 3, 
      total: 4145, 
      status: 'Delivered', 
      color: '#059669', 
      bg: '#ECFDF5' 
    },
    { 
      id: 'ORD-0382', 
      date: 'Aug 02, 2026', 
      itemsCount: 1, 
      total: 850, 
      status: 'Processing', 
      color: '#D97706', 
      bg: '#FFFBEB' 
    }
  ];

  const displayOrders = orders && orders.length > 0 ? orders : defaultOrders;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={handleBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '13px', 
            fontWeight: '600', 
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease',
            ...backButtonStyle
          }}
        >
          <ArrowLeft size={15}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '21px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Account
        </h2>
      </div>

      {/* ACCOUNT CONTENT CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* --- USER PROFILE CARD --- */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '16px 18px', 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          borderRadius: activeTheme.radius, 
          boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(197, 160, 89, 0.12)', 
            border: '1px solid rgba(197, 160, 89, 0.3)',
            width: '46px', 
            height: '46px', 
            borderRadius: '50%', 
            marginRight: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            <User size={22} color={activeTheme.brand} />
          </div>

          <div style={{ textAlign: 'left', flex: 1 }}>
            <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '17px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>
              {name}
            </h3>
            <p style={{ margin: 0, color: '#78716C', fontSize: '12.5px', fontWeight: '500' }}>
              {phone}
            </p>
          </div>
        </div>

        {/* --- LOYALTY TIER CARD --- */}
        <div style={{ 
          padding: '18px 20px', 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          border: '1px solid rgba(197, 160, 89, 0.4)', 
          borderRadius: activeTheme.radius, 
          boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                CURRENT STATUS
              </span>
              <h3 style={{ margin: '4px 0 0 0', color: '#854D0E', fontSize: '20px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>
                Gold Member
              </h3>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(197, 160, 89, 0.15)', 
              border: '1px solid rgba(197, 160, 89, 0.35)',
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Award size={20} color="#D97706" />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: '#854D0E', marginBottom: '6px' }}>
              <span>1250 Pts</span>
              <span>2000 Pts</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(197, 160, 89, 0.15)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
              <div style={{ width: '62.5%', height: '100%', backgroundColor: '#D97706', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        {/* --- RECENT ORDERS --- */}
        <div style={{ marginTop: '6px' }}>
          <h3 style={{ margin: '0 0 10px 4px', color: activeTheme.text, fontSize: '16px', fontWeight: '700', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Cormorant Garamond', serif" }}>
            Recent Orders
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayOrders.map((order, idx) => (
              <div 
                key={order.id || idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '14px 16px', 
                  background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
                  border: '1px solid rgba(197, 160, 89, 0.4)', 
                  borderRadius: activeTheme.radius, 
                  boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ 
                  backgroundColor: 'rgba(197, 160, 89, 0.12)', 
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  marginRight: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  <Package size={18} color="#78716C" />
                </div>

                <div style={{ textAlign: 'left', flex: 1 }}>
                  {/* Changed font to standard sans-serif for clear, legible order numbers */}
                  <h4 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '15px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {order.id || `ORD-${idx + 1}`}
                  </h4>
                  <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>
                    {order.date || 'Recent'} • {order.itemsCount || 1} {order.itemsCount === 1 ? 'Item' : 'Items'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: activeTheme.text, marginBottom: '4px' }}>
                    ₹{order.total}
                  </div>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '11px', 
                    fontWeight: '700', 
                    color: order.color || '#059669',
                    backgroundColor: order.bg || '#ECFDF5',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {order.status === 'Delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {order.status || 'Processing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}