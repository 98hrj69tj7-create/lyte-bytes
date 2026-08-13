import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Award, 
  Package, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Crown,
  Sparkles
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
          Account & Rewards
        </h2>
      </div>

      {/* ACCOUNT CONTENT CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* --- USER PROFILE CARD WITH GAMIFIED STREAK BADGE --- */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '18px 20px', 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
          border: '1px solid rgba(197, 160, 89, 0.45)', 
          borderRadius: activeTheme.radius, 
          boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              backgroundColor: 'rgba(217, 119, 6, 0.12)', 
              border: '1px solid rgba(217, 119, 6, 0.3)',
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}>
              <User size={24} color="#D97706" />
            </div>

            <div style={{ textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>
                {name}
              </h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: '12.5px', fontWeight: '500' }}>
                {phone}
              </p>
            </div>
          </div>

          {/* Streak Flame Pill */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '6px 10px',
            borderRadius: '12px',
            gap: '2px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#DC2626', fontSize: '12px', fontWeight: '800' }}>
              <Flame size={14} fill="#DC2626" />
              <span>3 STREAK</span>
            </div>
            <span style={{ fontSize: '9.5px', color: '#78716C', fontWeight: '700', textTransform: 'uppercase' }}>Active</span>
          </div>
        </div>

        {/* --- GAMIFIED LOYALTY TIER CARD --- */}
        <div style={{ 
          padding: '20px 22px', 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)', 
          border: '1.5px solid rgba(217, 119, 6, 0.4)', 
          borderRadius: activeTheme.radius, 
          boxShadow: '0 10px 28px rgba(217, 119, 6, 0.12)',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background watermark icon */}
          <div style={{ position: 'absolute', right: '-10px', bottom: '-15px', opacity: 0.04, pointerEvents: 'none' }}>
            <Crown size={120} color="#D97706" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} color="#D97706" />
                <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '0.9px', textTransform: 'uppercase' }}>
                  ELITE REWARD TIER
                </span>
              </div>
              <h3 style={{ margin: '4px 0 0 0', color: '#854D0E', fontSize: '22px', fontWeight: '800', fontFamily: "'Cormorant Garamond', serif" }}>
                Gold VIP Member
              </h3>
            </div>
            
            <div style={{ 
              backgroundColor: '#D97706', 
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
              width: '44px', 
              height: '44px', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Crown size={22} color="#FFFFFF" />
            </div>
          </div>

          {/* Gamified Progress Track */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: '#854D0E', marginBottom: '6px' }}>
              <span>1,250 Pts</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Zap size={12} color="#D97706" fill="#D97706" />
                <span>Next: Platinum (2,000 Pts)</span>
              </span>
            </div>

            <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(197, 160, 89, 0.2)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.35)', padding: '1px' }}>
              <div style={{ width: '62.5%', height: '100%', background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)', borderRadius: '4px', boxShadow: '0 0 8px rgba(217, 119, 6, 0.5)' }} />
            </div>

            <p style={{ margin: '8px 0 0 0', fontSize: '11.5px', color: '#78716C', fontWeight: '600', textAlign: 'left' }}>
              🎯 Earn <strong style={{ color: '#854D0E' }}>750 more points</strong> on your next orders to unlock Platinum perks & secret menu items!
            </p>
          </div>
        </div>

        {/* --- RECENT ORDERS --- */}
        <div style={{ marginTop: '4px' }}>
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