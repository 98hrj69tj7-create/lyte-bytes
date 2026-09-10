import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ArrowRight, Stars, Club } from 'lucide-react';
import MemberAuthModal from './MemberAuthModal';
import PolicyModal from './PolicyModal';
import { SubscriptionPolicyModalContent } from './PolicyContents';

export default function SubscriptionPassView({ theme = {}, customer = {}, setCustomer = () => {}, setView = () => {}, setCart = () => {} }) {
  const [mealType, setMealType] = useState('lunch'); 
  const [preference, setPreference] = useState('veg'); 
  const [duration, setDuration] = useState('weekly'); 
  const [hubLocation, setHubLocation] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: 'clamp(16px, 4vw, 20px)'
  };

  const basePricePerMeal = preference === 'veg' ? 150 : 170;
  const totalMeals = duration === 'weekly' ? 6 : duration === 'fortnightly' ? 12 : 24;

  let durationDiscountPercent = 0;
  if (duration === 'fortnightly') durationDiscountPercent = 5;
  if (duration === 'monthly') durationDiscountPercent = 10;

  const bothMealsDiscountPercent = mealType === 'both' ? 5 : 0;
  const totalDiscountPercent = durationDiscountPercent + bothMealsDiscountPercent;

  const rawTotal = basePricePerMeal * totalMeals * (mealType === 'both' ? 2 : 1);
  const discountAmount = (rawTotal * totalDiscountPercent) / 100;
  const finalTotal = Math.round(rawTotal - discountAmount);

  const generatePassId = (phone, days) => {
    const last5 = phone && phone.length >= 5 ? phone.slice(-5) : '00000';
    const now = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthStr = months[now.getMonth()];
    
    let existingPasses = [];
    try {
      existingPasses = JSON.parse(localStorage.getItem('lyte_active_passes')) || [];
    } catch (e) {
      existingPasses = [];
    }
    const sameMonth = existingPasses.filter(p => p.passId && p.passId.includes(`_${monthStr}_`));
    const serial = String(sameMonth.length + 1).padStart(2, '0');

    return `LBEP_${last5}_${days}_${monthStr}_${serial}`;
  };

  const handleProceedToDelivery = () => {
    if (!customer || !customer.phone || customer.phone.length !== 10) {
      setIsAuthModalOpen(true);
      return;
    }

    const passId = generatePassId(customer.phone, totalMeals);

    const subscriptionItem = {
      name: `LBEMP (${duration.toUpperCase()} - ${mealType.toUpperCase()} - ${preference.toUpperCase()})`,
      passId: passId,
      mealType: mealType,
      preference: preference,
      duration: duration,
      totalMeals: totalMeals,
      remainingMeals: totalMeals,
      hubLocation: hubLocation,
      price: finalTotal,
      qty: 1,
      unit: 'Pass',
      isSubscription: true
    };

    setCart([subscriptionItem]);
    setView('delivery'); 
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
      fontFamily: "'Plus Jakarta Sans', sans-serif" 
    }}>
      
      {/* Uniform Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('subcat')} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', 
            fontWeight: '600', 
            padding: '6px 10px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={15}/> Back
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'var(--font-h2)', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Subscription
        </h2>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: '1px solid rgba(197, 160, 89, 0.4)', 
        borderRadius: activeTheme.radius, 
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
        padding: 'clamp(14px, 4vw, 18px)', 
        boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box',
        width: '100%'
      }}>

        {/* Header Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1A1816 0%, #2D2721 100%)', 
          borderRadius: '20px', 
          padding: '14px',
          textAlign: 'left',
          color: '#FFF', 
          border: '1px solid rgba(197, 160, 89, 0.4)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Club size={14} color="#C5A059" fill="#C5A059" />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#C5A059', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              • Executive Club •
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 4.5vw, 22px)', fontWeight: '700', margin: '0 0 6px 0', color: '#FFFBF2' }}>
            Lyte Bytes Executive Meal Pass
          </h2>
          <p style={{ fontSize: 'var(--font-caption)', color: '#D4D4D8', margin: 0, lineHeight: '1.6', fontWeight: '400' }}>
            Wholesome, home-style daily meals for you or your family. <br />
            <span style={{ fontSize: '9.5px', color: '#C5A059', fontWeight: '600' }}>(Note: Save on delivery fees when 2 or more subscribers share the same delivery location!)</span>
          </p>
        </div>

        {/* 1. Select Meal Type with Policy Link on the Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              1. Choose Meal Schedule
            </div>
            <span 
              onClick={() => setIsPolicyModalOpen(true)}
              style={{ fontSize: 'clamp(9.5px, 2.5vw, 10.5px)', color: activeTheme.brand, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Subscription Policies
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { id: 'lunch', label: 'Lunch Only' },
              { id: 'dinner', label: 'Dinner Only' },
              { id: 'both', label: 'Both (+5% Off)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMealType(m.id)}
                style={{
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: mealType === m.id ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                  background: mealType === m.id ? 'rgba(255, 89, 88, 0.08)' : '#FFFFFF',
                  color: mealType === m.id ? '#FF5958' : '#1A1816',
                  fontWeight: '700',
                  fontSize: 'var(--font-caption)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Select Preference */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            2. Food Preference
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'veg', label: 'Executive Veg', price: '₹170 / meal' },
              { id: 'non-veg', label: 'Executive Non-Veg', price: '₹190 / meal' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPreference(p.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: preference === p.id ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                  background: preference === p.id ? 'rgba(255, 89, 88, 0.08)' : '#FFFFFF',
                  color: '#1A1816',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: preference === p.id ? '#FF5958' : '#1A1816' }}>{p.label}</div>
                <div style={{ fontSize: 'clamp(9px, 2.5vw, 10.5px)', color: '#78716C', marginTop: '2px' }}>{p.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Select Duration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <div style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            3. Pass Duration & Savings
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'weekly', label: 'Weekly Pass (6 Days)', badge: 'Standard' },
              { id: 'fortnightly', label: 'Fortnightly Pass (12 Days)', badge: '5% OFF' },
              { id: 'monthly', label: 'Monthly Rolling Pass (24 Meals)', badge: '10% OFF' }
            ].map(d => (
              <div
                key={d.id}
                onClick={() => setDuration(d.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: duration === d.id ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                  background: duration === d.id ? 'rgba(255, 89, 88, 0.08)' : '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: 'var(--font-body)', color: '#1A1816' }}>{d.label}</span>
                <span style={{ 
                  fontSize: '9.5px', 
                  fontWeight: '800', 
                  backgroundColor: d.id === 'weekly' ? 'rgba(197, 160, 89, 0.2)' : '#FF5958', 
                  color: d.id === 'weekly' ? '#8A6D2B' : '#FFF', 
                  padding: '3px 7px', 
                  borderRadius: '6px' 
                }}>
                  {d.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Box */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '14px', 
          padding: '14px', 
          border: '1px solid rgba(197, 160, 89, 0.4)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 'var(--font-caption)', color: '#57534E' }}>
            <span>Total Meals:</span>
            <span style={{ fontWeight: '700' }}>{totalMeals * (mealType === 'both' ? 2 : 1)} servings</span>
          </div>
          {totalDiscountPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 'var(--font-caption)', color: '#15803D', fontWeight: '600' }}>
              <span>Total Discount Applied:</span>
              <span>{totalDiscountPercent}% OFF</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(197, 160, 89, 0.3)', fontSize: 'clamp(15px, 4vw, 17px)', fontWeight: '800', color: '#1A1816' }}>
            <span>Upfront Total:</span>
            <span style={{ color: '#FF5958' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
          <button
            type="button"
            onClick={handleProceedToDelivery}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3.5vw, 15px)',
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              fontWeight: '600',
              fontSize: 'var(--font-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
            }}
          >
            <span>Proceed to Delivery Details</span>
            <ArrowRight size={18} />
          </button>

          <button 
            type="button"
            onClick={() => setView('subcat')}
            style={{ 
              backgroundColor: 'rgba(197, 160, 89, 0.1)', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              color: activeTheme.text,
              padding: 'clamp(10px, 3vw, 12px)', 
              fontSize: 'var(--font-body)', 
              fontWeight: '600',
              borderRadius: '14px', 
              width: '100%',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            Back to Categories
          </button>
        </div>

      </div>

      {/* Member Auth Modal Integration */}
      <MemberAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialPhone={customer?.phone || ''}
        webAppUrl="https://script.google.com/macros/s/AKfycbwjR5KBDf8iB9e5Dh4ye5TxmIsbcirJsevDjMWma6B_Ine3HCYwC1ImeXgmr0XdVI9FZg/exec"
        onLoginSuccess={(userData) => {
          setIsAuthModalOpen(false);
          if (setCustomer) {
            setCustomer(prev => ({ ...prev, phone: userData.phone }));
          }
        }}
      />

      {/* Subscription Policy Modal */}
      <PolicyModal 
        isOpen={isPolicyModalOpen} 
        onClose={() => setIsPolicyModalOpen(false)} 
        title="Pass Policies & Rules" 
        theme={activeTheme}
      >
        <SubscriptionPolicyModalContent brandColor={activeTheme.brand} />
      </PolicyModal>

    </div>
  );
}