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
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px'
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
      width: '100%'
    }}>

      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={handleBack} 
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
            zIndex: 1,
            ...backButtonStyle
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
          backgroundColor: '#FFFBF2', 
          border: activeTheme.border, 
          borderRadius: activeTheme.radius, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            backgroundColor: '#FFF8E7', 
            border: '1px solid #E5D6B5',
            width: '44px', 
            height: '44px', 
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
            <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '15.5px', fontWeight: '700' }}>
              {name}
            </h3>
            <p style={{ margin: 0, color: '#776E62', fontSize: '13px', fontWeight: '500' }}>
              {phone}
            </p>
          </div>
        </div>

        {/* --- LOYALTY TIER CARD --- */}
        <div style={{ 
          padding: '18px 20px', 
          backgroundColor: '#FFFBF2', 
          border: activeTheme.border, 
          borderRadius: activeTheme.radius, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#B45309', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                CURRENT STATUS
              </span>
              <h3 style={{ margin: '4px 0 0 0', color: '#854D0E', fontSize: '19px', fontWeight: '800' }}>
                Gold Member
              </h3>
            </div>
            
            <div style={{ 
              backgroundColor: '#FEF3C7', 
              border: '1px solid #FDE68A',
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Award size={20} color="#D97706" />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#854D0E', marginBottom: '6px' }}>
              <span>1250 Pts</span>
              <span>2000 Pts</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#FEF3C7', borderRadius: '4px', overflow: 'hidden', border: '1px solid #FDE68A' }}>
              <div style={{ width: '62.5%', height: '100%', backgroundColor: '#D97706', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        {/* --- RECENT ORDERS --- */}
        <div style={{ marginTop: '6px' }}>
          <h3 style={{ margin: '0 0 10px 4px', color: activeTheme.text, fontSize: '15px', fontWeight: '700', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                  backgroundColor: '#FFFBF2', 
                  border: activeTheme.border, 
                  borderRadius: activeTheme.radius, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ 
                  backgroundColor: '#FFF8E7', 
                  border: '1px solid #E5D6B5',
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '10px', 
                  marginRight: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  <Package size={18} color="#776E62" />
                </div>

                <div style={{ textAlign: 'left', flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '14.5px', fontWeight: '700' }}>
                    {order.id || `ORD-${idx + 1}`}
                  </h4>
                  <p style={{ margin: 0, color: '#776E62', fontSize: '12px', fontWeight: '500' }}>
                    {order.date || 'Recent'} • {order.itemsCount || 1} {order.itemsCount === 1 ? 'Item' : 'Items'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: activeTheme.text, marginBottom: '4px' }}>
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