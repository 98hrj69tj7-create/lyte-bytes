import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ArrowRight, Stars, Club } from 'lucide-react';

export default function SubscriptionPassView({ theme, customer, setView, setCart }) {
  const [mealType, setMealType] = useState('lunch'); 
  const [preference, setPreference] = useState('veg'); 
  const [duration, setDuration] = useState('weekly'); 
  const [hubLocation, setHubLocation] = useState('');

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
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert("Please update your Name and Mobile Number in your profile first.");
      setView('delivery');
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
    setView('delivery'); // Routes through delivery to capture data for orders_engine!
  };

  return (
    <div style={{ padding: '16px 4px 40px 4px', maxWidth: '480px', margin: '0 auto', width: '100%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Uniform Header with Back Button & Centered Title */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0', gap: '8px' }}>
        <button 
          onClick={() => setView('subcat')} 
          style={{ 
            background: 'none', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#1A1816', 
            fontSize: '12px', 
            fontWeight: '600', 
            padding: '6px 10px', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            zIndex: 1,
            flexShrink: 0
          }}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '20px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          pointerEvents: 'none'
        }}>
          Subscription
        </h2>
      </div>

      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1A1816 0%, #2D2721 100%)', 
        borderRadius: '24px', 
        padding: '16px',
        textAlign:'left',
        color: '#FFF', 
        marginBottom: '20px',
        border: '1px solid rgba(197, 160, 89, 0.4)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0px' }}>
          <Club size={16} color="#C5A059" />
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#C5A059', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
            • Executive Club •
          </span>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0', color: '#FFFBF2' }}>
          Lyte Bytes Executive Meal Pass
        </h2>
        <p style={{ fontSize: '11px', color: '#D4D4D8', margin: 0, lineHeight: '1.5', fontWeight: '400', margin: '0 0 6px 0'}}>
          Wholesome, home-style daily meals for you or your family. <br />
          <span style={{ color: '#C5A059', fontWeight: '600' }}>(Note: Save on delivery fees when 2 or more subscriptions share the same delivery location!)</span>
        </p>
      </div>

      {/* 1. Select Meal Type */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#78716C', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          1. Choose Meal Schedule
        </label>
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
                padding: '12px 8px',
                borderRadius: '14px',
                border: mealType === m.id ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                background: mealType === m.id ? 'rgba(255, 89, 88, 0.08)' : '#FFFFFF',
                color: mealType === m.id ? '#FF5958' : '#1A1816',
                fontWeight: '700',
                fontSize: '12px',
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
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#78716C', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          2. Food Preference
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { id: 'veg', label: 'Executive Veg', price: '₹150 / meal' },
            { id: 'non-veg', label: 'Executive Non-Veg', price: '₹170 / meal' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPreference(p.id)}
              style={{
                padding: '12px',
                borderRadius: '14px',
                border: preference === p.id ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                background: preference === p.id ? 'rgba(255, 89, 88, 0.08)' : '#FFFFFF',
                color: '#1A1816',
                cursor: 'pointer',
                textAlign: 'left',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '13px', color: preference === p.id ? '#FF5958' : '#1A1816' }}>{p.label}</div>
              <div style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>{p.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Select Duration */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#78716C', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          3. Pass Duration & Savings
        </label>
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
                padding: '12px 16px',
                borderRadius: '14px',
                border: duration === d.id ? '1.5px solid #FF5958' : '1px solid rgba(197, 160, 89, 0.4)',
                background: duration === d.id ? 'rgba(255, 89, 88, 0.08)' : '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontWeight: '700', fontSize: '13px', color: '#1A1816' }}>{d.label}</span>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '800', 
                backgroundColor: d.id === 'weekly' ? 'rgba(197, 160, 89, 0.2)' : '#FF5958', 
                color: d.id === 'weekly' ? '#8A6D2B' : '#FFF', 
                padding: '4px 8px', 
                borderRadius: '8px' 
              }}>
                {d.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Box & Checkout Button */}
      <div style={{ 
        background: '#FAF4EB', 
        borderRadius: '20px', 
        padding: '18px', 
        border: '1px solid rgba(197, 160, 89, 0.5)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#57534E' }}>
          <span>Total Meals:</span>
          <span style={{ fontWeight: '700' }}>{totalMeals * (mealType === 'both' ? 2 : 1)} servings</span>
        </div>
        {totalDiscountPercent > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#15803D', fontWeight: '600' }}>
            <span>Total Discount Applied:</span>
            <span>{totalDiscountPercent}% OFF</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(197, 160, 89, 0.3)', fontSize: '16px', fontWeight: '800', color: '#1A1816' }}>
          <span>Upfront Total:</span>
          <span style={{ color: '#FF5958' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button
        onClick={handleProceedToDelivery}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '14px',
          fontWeight: '700',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)'
        }}
      >
        <span>Proceed to Delivery Details</span>
        <ArrowRight size={18} />
      </button>

    </div>
  );
}