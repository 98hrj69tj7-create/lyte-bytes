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
  theme = { 
    brand: '#FF5958', 
    text: '#2B2B2B', 
    border: '1px solid #D8C7A5', 
    radius: '12px' 
  },
  onBack,
  setView,
  customer = {},
  orders = null,
  backButtonStyle = {}
}) {
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
      paddingBottom: '120px', 
      paddingTop: '5px',
      boxSizing: 'border-box' 
    }}>

      {/* 1. HEADER BAR */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <button 
          onClick={handleBack} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'transparent', 
            border: 'none', 
            outline: 'none', 
            boxShadow: 'none', 
            padding: '4px 0', 
            cursor: 'pointer', 
            fontSize: '16px', 
            color: theme.text || '#2B2B2B', 
            WebkitTapHighlightColor: 'transparent', 
            userSelect: 'none',
            justifySelf: 'start',
            ...backButtonStyle,
            marginBottom: 0
          }}
        >
          <ArrowLeft size={18} color={theme.text || '#2B2B2B'} /> 
          <span>Menu</span>
        </button>

        <h2 style={{ 
          color: theme.brand || '#FF5958', 
          margin: 0, 
          fontSize: '17px', 
          textAlign: 'center', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px', 
          fontWeight: '600' 
        }}>
          ACCOUNT
        </h2>

        <div style={{ width: '75px' }} />
      </div>

      {/* 2. ACCOUNT CONTENT CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* --- USER PROFILE CARD --- */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '10px 12px', 
          backgroundColor: '#FDF6E3', 
          border: theme.border, 
          borderRadius: theme.radius, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
        }}>
          <div style={{ 
            backgroundColor: '#FEF0D5', 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%', 
            marginRight: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            <User size={26} color={theme.brand || '#FF5958'} />
          </div>

          <div style={{ textAlign: 'left', flex: 1 }}>
            <h3 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '16px', fontWeight: '600' }}>
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
          backgroundColor: '#FFFDF9', 
          border: '1px solid #E6C875', 
          borderRadius: theme.radius, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                CURRENT STATUS
              </span>
              <h3 style={{ margin: '4px 0 0 0', color: '#854D0E', fontSize: '20px', fontWeight: '800' }}>
                Gold Member
              </h3>
            </div>
            
            <div style={{ 
              backgroundColor: '#FEF3C7', 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Award size={24} color="#D97706" />
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#854D0E', marginBottom: '6px' }}>
              <span>1250 Pts</span>
              <span>2000 Pts</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#FEF3C7', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '62.5%', height: '100%', backgroundColor: '#D97706', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* --- RECENT ORDERS --- */}
        <div style={{ marginTop: '4px' }}>
          <h3 style={{ margin: '0 0 12px 4px', color: theme.text, fontSize: '15px', fontWeight: '700', textAlign: 'left' }}>
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
                  backgroundColor: '#FFFFFF', 
                  border: theme.border, 
                  borderRadius: theme.radius, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)' 
                }}
              >
                <div style={{ 
                  backgroundColor: '#F8F6F0', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  marginRight: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  <Package size={20} color="#776E62" />
                </div>

                <div style={{ textAlign: 'left', flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px 0', color: theme.text, fontSize: '14.5px', fontWeight: '700' }}>
                    {order.id || `ORD-${idx + 1}`}
                  </h4>
                  <p style={{ margin: 0, color: '#776E62', fontSize: '12px' }}>
                    {order.date || 'Recent'} • {order.itemsCount || 1} {order.itemsCount === 1 ? 'Item' : 'Items'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: theme.text, marginBottom: '2px' }}>
                    ₹{order.total}
                  </div>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: order.color || '#059669',
                    backgroundColor: order.bg || '#ECFDF5',
                    padding: '2px 8px',
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