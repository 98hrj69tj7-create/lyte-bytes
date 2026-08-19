import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = ShoppingBag, 
  title = "Your cart is empty", 
  subtitle = "Explore our handcrafted menu and treat yourself to something special.", 
  actionText = "Explore Menu", 
  onAction = () => {} 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
      border: '1px solid rgba(197, 160, 89, 0.4)',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(44, 34, 30, 0.04)',
      margin: '20px 0',
      boxSizing: 'border-box',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(197, 160, 89, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        border: '1px solid rgba(197, 160, 89, 0.3)'
      }}>
        <Icon size={30} color="#C5A059" strokeWidth={1.8} />
      </div>

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '22px',
        fontWeight: '700',
        color: '#1A1816',
        margin: '0 0 8px 0',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '13px',
        color: '#78716C',
        lineHeight: '1.5',
        maxWidth: '280px',
        margin: '0 0 24px 0',
        fontWeight: '500'
      }}>
        {subtitle}
      </p>

      <button
        onClick={onAction}
        style={{
          background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '14px',
          padding: '12px 24px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(225, 29, 72, 0.25)',
          transition: 'all 0.25s ease',
          outline: 'none'
        }}
      >
        {actionText} <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}