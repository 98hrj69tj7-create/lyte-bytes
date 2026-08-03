import React from 'react';
import { ArrowLeft, MessageSquare, Clock } from 'lucide-react';

export default function TrackView({
  setView,
  currentStage,
  theme = {},
  backButtonStyle,
  actionButtonStyle,
  secondaryButtonStyle,
  setCart,
  cart,
  orderPlaced
}) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#2C221E',
    border: theme?.border || '1px solid rgba(216, 199, 165, 0.4)',
    bg: theme?.bg || '#FFFFFF',
    radius: theme?.radius || '16px'
  };

  const hasActiveOrder = orderPlaced && cart && cart.length > 0;

  if (!hasActiveOrder) {
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
            <ArrowLeft size={16}/> Home
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
            Live Order Track
          </h2>
        </div>

        {/* Empty State Card */}
        <div style={{ 
          border: `1px solid ${activeTheme.brand}`, 
          borderRadius: activeTheme.radius, 
          background: '#FFFBF2', 
          padding: '24px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box',
          width: '100%',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: activeTheme.bg,
            border: activeTheme.border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTheme.brand,
            boxShadow: '0 4px 12px rgba(255, 89, 88, 0.1)',
          }}>
            <Clock size={28} color={activeTheme.brand} />
          </div>

          <div>
            <h3 style={{ color: activeTheme.brand, margin: '0 0 6px 0', fontSize: '17px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              No Active Orders 
            </h3>
            <p style={{ color: activeTheme.text, fontSize: '14px', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
              Your tracking details will be available once the order is placed after a payment.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
            <button 
              type="button"
              onClick={() => setView('home')} 
              style={{ 
                background: '#EFECE6',
                color: activeTheme.text,
                border: '1.5px solid #D8C7A5',
                marginBottom: 0, 
                padding: '16px', 
                fontSize: '16px', 
                fontWeight: '700',
                borderRadius: activeTheme.radius, 
                width: '100%', 
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeStage = currentStage || 1;

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
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Sleek Keyframe Glow Injection for Premium Effect */}
      <style>{`
        @keyframes premiumGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 89, 88, 0.4), 0 0 12px rgba(255, 89, 88, 0.2);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 89, 88, 0), 0 0 20px rgba(255, 89, 88, 0.35);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 89, 88, 0), 0 0 12px rgba(255, 89, 88, 0.2);
          }
        }
      `}</style>

      {/* Stage-Specific Randomized Falling Elements Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '350px',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 10,
        maskImage: `linear-gradient(to bottom, ${activeTheme.brand} 60%, rgba(0,0,0,0) 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, ${activeTheme.brand} 60%, rgba(0,0,0,0) 100%)`
      }}>
        {activeStage === 1 && [
          { icon: '📝', left: '8%', delay: '0s', duration: '2.4s', size: '24px' },
          { icon: '🧾', left: '22%', delay: '0.8s', duration: '2.9s', size: '22px' },
          { icon: '📄', left: '38%', delay: '0.3s', duration: '2.1s', size: '26px' },
          { icon: '📋', left: '55%', delay: '1.2s', duration: '3.2s', size: '23px' },
          { icon: '📝', left: '70%', delay: '0.5s', duration: '2.6s', size: '25px' },
          { icon: '🧾', left: '85%', delay: '1.0s', duration: '2.3s', size: '24px' }
        ].map((item, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: item.left,
            top: '-40px',
            fontSize: item.size,
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            animation: `fallRandom ${item.duration} infinite ease-in-out`,
            animationDelay: item.delay
          }}>{item.icon}</span>
        ))}

        {activeStage === 2 && [
          { icon: '👨‍🍳', left: '6%', delay: '0.2s', duration: '2.6s', size: '26px' },
          { icon: '🥄', left: '24%', delay: '0.9s', duration: '2.2s', size: '22px' },
          { icon: '🥖', left: '40%', delay: '0.4s', duration: '3.0s', size: '24px' },
          { icon: '🥣', left: '58%', delay: '1.1s', duration: '2.5s', size: '25px' },
          { icon: '👨‍🍳', left: '75%', delay: '0.7s', duration: '2.8s', size: '23px' },
          { icon: '🥄', left: '88%', delay: '0.1s', duration: '2.1s', size: '24px' }
        ].map((item, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: item.left,
            top: '-40px',
            fontSize: item.size,
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            animation: `fallRandom ${item.duration} infinite ease-in-out`,
            animationDelay: item.delay
          }}>{item.icon}</span>
        ))}

        {activeStage === 3 && [
          { icon: '📦', left: '10%', delay: '0.5s', duration: '2.7s', size: '26px' },
          { icon: '📦', left: '28%', delay: '0.1s', duration: '2.2s', size: '24px' },
          { icon: '📦', left: '45%', delay: '0.9s', duration: '3.1s', size: '28px' },
          { icon: '📦', left: '62%', delay: '0.3s', duration: '2.4s', size: '25px' },
          { icon: '📦', left: '80%', delay: '1.2s', duration: '2.9s', size: '27px' }
        ].map((item, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: item.left,
            top: '-40px',
            fontSize: item.size,
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            animation: `fallRandom ${item.duration} infinite ease-in-out`,
            animationDelay: item.delay
          }}>{item.icon}</span>
        ))}

        {activeStage === 4 && [
          { icon: '🛵', left: '8%', delay: '0.2s', duration: '2.0s', size: '26px' },
          { icon: '📍', left: '25%', delay: '0.8s', duration: '2.5s', size: '22px' },
          { icon: '🪖', left: '42%', delay: '0.4s', duration: '2.2s', size: '25px' },
          { icon: '🧤', left: '60%', delay: '1.0s', duration: '2.8s', size: '23px' },
          { icon: '🛵', left: '78%', delay: '0.1s', duration: '2.1s', size: '27px' },
          { icon: '📍', left: '90%', delay: '0.6s', duration: '2.4s', size: '24px' }
        ].map((item, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: item.left,
            top: '-40px',
            fontSize: item.size,
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            animation: `fallRandom ${item.duration} infinite linear`,
            animationDelay: item.delay
          }}>{item.icon}</span>
        ))}

        {activeStage === 5 && [
          { icon: '👏', left: '8%', delay: '0.3s', duration: '2.3s', size: '26px' },
          { icon: '😊', left: '24%', delay: '0.9s', duration: '2.7s', size: '24px' },
          { icon: '🥳', left: '40%', delay: '0.1s', duration: '2.1s', size: '28px' },
          { icon: '💖', left: '58%', delay: '0.6s', duration: '2.5s', size: '25px' },
          { icon: '🎆', left: '74%', delay: '1.1s', duration: '3.0s', size: '27px' },
          { icon: '👏', left: '88%', delay: '0.4s', duration: '2.2s', size: '25px' }
        ].map((item, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: item.left,
            top: '-40px',
            fontSize: item.size,
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            animation: `fallRandom ${item.duration} infinite ease-in`,
            animationDelay: item.delay
          }}>{item.icon}</span>
        ))}
      </div>

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
          <ArrowLeft size={16}/> Home
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
          Live Order Track
        </h2>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: `1px solid ${activeTheme.brand}`, 
        borderRadius: activeTheme.radius, 
        background: '#FFFBF2', 
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxSizing: 'border-box',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Animated Pulsing Status Icon Header */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4px 0 0 0' }}>
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: activeTheme.brand,
            opacity: 0.18,
            animation: 'pulse 2.2s infinite ease-in-out'
          }} />
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: activeTheme.bg,
            border: activeTheme.border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTheme.brand,
            zIndex: 1,
            fontSize: '28px', 
            boxShadow: '0 4px 12px rgba(255, 89, 88, 0.2)',
            animation: 'bounce 1s infinite alternate'
          }}>
            {activeStage === 1 ? '📝' : activeStage === 2 ? '👨‍🍳' : activeStage === 3 ? '📦' : activeStage === 4 ? '🛵' : '🎉'}
          </div>
        </div>

        <div>
          <h3 style={{ color: activeTheme.brand, margin: '0 0 6px 0', fontSize: '17px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            {activeStage === 5 ? 'Order Delivered!' : 'Order Placed Successfully!'}
          </h3>
          <div style={{ color: activeTheme.text, fontSize: '14px', margin: 0, lineHeight: '1.45', fontWeight: '400' }}>
            <p style={{ margin: '0 0 4px 0' }}>
              Your order is in, and we're crafting it with <span style={{ color: activeTheme.brand, fontWeight: '700' }}>LOVE</span>.
            </p>
            <p style={{ margin: 0 }}>
              Thank you for choosing to <strong>SHOP LOCAL</strong> and support our small-batch kitchen.
            </p>
          </div>
        </div>

        {/* 5-Stage Emoticon & Animated Visual Timeline */}
        <div style={{ width: '100%', borderTop: `1px dashed #E5D6B5`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#776E62', textTransform: 'uppercase', alignSelf: 'flex-start', letterSpacing: '0.6px' }}>
            Live Status Progression
          </span>

          {[
            { step: 1, icon: '📝', title: 'Order Received', desc: 'Your order is received and being processed' },
            { step: 2, icon: '👨‍🍳', title: 'Preparing', desc: 'Your order is being prepared with love' },
            { step: 3, icon: '📦', title: 'Packing', desc: 'We are carefully packing your order' },
            { step: 4, icon: '🛵', title: 'Out for Delivery', desc: 'Your order is on its way to you' },
            { step: 5, icon: '🎉', title: 'Completed', desc: 'Thank you for your order!' }
          ].map((item, index) => {
            const isCompleted = item.step < activeStage;
            const isCurrent = item.step === activeStage;

            return (
              <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isCompleted || isCurrent ? activeTheme.bg : '#FFFBF2',
                    border: activeTheme.border,
                    fontSize: '28px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? undefined : '0 2px 6px rgba(0,0,0,0.04)',
                    animation: isCurrent 
                      ? 'premiumGlow 2s infinite ease-in-out' 
                      : 'none'
                  }}>
                    {item.icon}
                  </div>
                  {index < 4 && (
                    <div style={{
                      width: '2px',
                      height: '30px',
                      background: item.step < activeStage ? activeTheme.brand : '#E5D6B5',
                      margin: '2px 0',
                      transition: 'background 0.3s ease'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingTop: '3px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: isCurrent ? activeTheme.brand : activeTheme.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.title} 
                    {isCurrent && (
                      <span style={{ fontSize: '10px', background: '#FFF1EE', color: activeTheme.brand, padding: '1px 6px', borderRadius: '4px', fontWeight: '800', letterSpacing: '0.4px', border: '1px solid rgba(255, 89, 88, 0.2)' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#776E62', marginTop: '3px', fontWeight: '500' }}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%', marginTop: '4px' }}>
          <button 
            type="button"
            onClick={() => window.open('https://wa.me/9108286886?text=Hi,%20I%20want%20an%20update%20on%20my%20recent%20order!', '_blank')} 
            style={{ 
              border: 'none', 
              background: activeTheme.brand,
              color: '#FFFFFF',
              marginBottom: 0, 
              padding: '16px', 
              fontSize: '16px', 
              fontWeight: '700',
              borderRadius: activeTheme.radius, 
              width: '100%', 
              boxSizing: 'border-box', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.25)',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} /> Get WhatsApp Live Update
          </button>
          
          <button 
            type="button"
            onClick={() => { setCart([]); setView('home'); }} 
            style={{ 
              background: '#EFECE6',
              color: activeTheme.text,
              border: '1.5px solid #D8C7A5',
              marginBottom: 0, 
              padding: '16px', 
              fontSize: '16px', 
              fontWeight: '700',
              borderRadius: activeTheme.radius, 
              width: '100%', 
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}